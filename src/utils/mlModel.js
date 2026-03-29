const FEATURE_WEIGHTS = {
  platform: 0.34,
  hashtag: 0.26,
  contentType: 0.24,
  region: 0.16
};

const FEATURE_IMPORTANCE = [
  { label: 'Platform context', value: '34%' },
  { label: 'Hashtag context', value: '26%' },
  { label: 'Content type', value: '24%' },
  { label: 'Region', value: '16%' },
  { label: 'Follower calibrator', value: 'Post-model' }
];

const ENGAGEMENT_LABELS = ['High', 'Medium', 'Low'];
const REGRESSION_TARGETS = ['views', 'likes', 'shares', 'comments'];
const K_CANDIDATES = [12, 18, 24, 30];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const quantile = (values, q) => {
  if (!values.length) return 0;

  const sorted = [...values].sort((left, right) => left - right);
  const position = (sorted.length - 1) * q;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);

  if (lower === upper) return sorted[lower];

  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
};

const getFeatureRecord = (item) => ({
  platform: item.platform,
  hashtag: item.hashtag,
  contentType: item.contentType,
  region: item.region
});

const getDistanceBreakdown = (trainFeatures, queryFeatures) => {
  let mismatchWeight = 0;
  let activeWeight = 0;
  let matchedFeatures = 0;

  Object.entries(FEATURE_WEIGHTS).forEach(([feature, weight]) => {
    const queryValue = queryFeatures[feature];

    if (!queryValue || queryValue === 'Any') {
      return;
    }

    activeWeight += weight;

    if (trainFeatures[feature] === queryValue) {
      matchedFeatures += 1;
    } else {
      mismatchWeight += weight;
    }
  });

  return {
    distance: activeWeight ? mismatchWeight / activeWeight : 0,
    matchedFeatures,
    activeWeight
  };
};

const getNeighborWeight = (distance) => 1 / (distance + 0.08) ** 2;

const buildTrainingRows = (data) =>
  data.map((post, index) => ({
    id: post.postId || index + 1,
    index,
    post,
    features: getFeatureRecord(post),
    engagementLevel: post.engagementLevel,
    targets: REGRESSION_TARGETS.reduce((collection, metric) => {
      collection[metric] = Number(post[metric] || 0);
      return collection;
    }, {})
  }));

const buildNeighbors = (rows, queryFeatures, excludeIndex = -1) =>
  rows
    .filter((row) => row.index !== excludeIndex)
    .map((row) => {
      const breakdown = getDistanceBreakdown(row.features, queryFeatures);

      return {
        ...row,
        ...breakdown,
        similarity: 1 - breakdown.distance,
        weight: getNeighborWeight(breakdown.distance)
      };
    })
    .sort((left, right) => {
      if (left.distance !== right.distance) {
        return left.distance - right.distance;
      }

      if (right.matchedFeatures !== left.matchedFeatures) {
        return right.matchedFeatures - left.matchedFeatures;
      }

      return right.targets.views - left.targets.views;
    });

const aggregateMetricPrediction = (neighbors, metric, multiplier) => {
  const totalWeight = neighbors.reduce((sum, neighbor) => sum + neighbor.weight, 0) || 1;
  const weightedLogMean =
    neighbors.reduce(
      (sum, neighbor) => sum + Math.log1p(neighbor.targets[metric]) * neighbor.weight,
      0
    ) / totalWeight;

  const rawValues = neighbors.map((neighbor) => neighbor.targets[metric]);
  const predicted = Math.round(Math.expm1(weightedLogMean) * multiplier);
  const min = Math.round(quantile(rawValues, 0.2) * multiplier);
  const max = Math.round(quantile(rawValues, 0.8) * multiplier);

  return {
    min: Math.max(0, Math.min(min, predicted)),
    avg: Math.max(0, predicted),
    max: Math.max(predicted, max)
  };
};

const normalizeProbabilities = (distribution) => {
  const total = Object.values(distribution).reduce((sum, value) => sum + value, 0) || 1;

  return Object.fromEntries(
    Object.entries(distribution).map(([label, value]) => [
      label,
      Number(((value / total) * 100).toFixed(1))
    ])
  );
};

const getFollowerCalibration = (neighbors, followerCount) => {
  const baselineFollowers =
    neighbors.reduce((sum, neighbor) => sum + Math.max(1000, neighbor.targets.views / 3), 0) /
      (neighbors.length || 1) || 1000;

  const multiplier = clamp(
    Math.log1p(Math.max(followerCount, 1)) / Math.log1p(Math.max(baselineFollowers, 1)),
    0.65,
    1.65
  );

  return {
    baselineFollowers: Math.round(baselineFollowers),
    multiplier: Number(multiplier.toFixed(2))
  };
};

const getClassificationFromNeighbors = (neighbors, followerMultiplier = 1) => {
  const weightedCounts = ENGAGEMENT_LABELS.reduce((collection, label) => {
    collection[label] = 0;
    return collection;
  }, {});

  neighbors.forEach((neighbor) => {
    weightedCounts[neighbor.engagementLevel] += neighbor.weight;
  });

  if (followerMultiplier > 1.05) {
    weightedCounts.High *= 1 + (followerMultiplier - 1) * 0.4;
    weightedCounts.Low *= 1 - Math.min(0.3, (followerMultiplier - 1) * 0.25);
  } else if (followerMultiplier < 0.95) {
    weightedCounts.Low *= 1 + (1 - followerMultiplier) * 0.45;
    weightedCounts.High *= 1 - Math.min(0.3, (1 - followerMultiplier) * 0.25);
  }

  const probabilities = normalizeProbabilities(weightedCounts);
  const label = ENGAGEMENT_LABELS.reduce((best, current) =>
    probabilities[current] > probabilities[best] ? current : best
  );

  return {
    label,
    probabilities: {
      high: probabilities.High,
      medium: probabilities.Medium,
      low: probabilities.Low
    }
  };
};

const getModelConfidence = (neighbors, supportCount) => {
  const averageSimilarity =
    neighbors.reduce((sum, neighbor) => sum + neighbor.similarity, 0) / (neighbors.length || 1);
  const supportBoost = Math.min(10, supportCount / 12);

  return clamp(Math.round(58 + averageSimilarity * 28 + supportBoost), 50, 97);
};

const getSampleIndices = (length, sampleSize) => {
  if (sampleSize >= length) {
    return Array.from({ length }, (_, index) => index);
  }

  const step = length / sampleSize;
  const indices = [];

  for (let cursor = 0; indices.length < sampleSize; cursor += step) {
    indices.push(Math.min(length - 1, Math.floor(cursor)));
  }

  return [...new Set(indices)];
};

const getHoldoutPrediction = (neighbors, k) => {
  const activeNeighbors = neighbors.slice(0, k);
  const classification = getClassificationFromNeighbors(activeNeighbors, 1);
  const metrics = REGRESSION_TARGETS.reduce((collection, metric) => {
    collection[metric] = aggregateMetricPrediction(activeNeighbors, metric, 1).avg;
    return collection;
  }, {});

  return {
    label: classification.label,
    metrics
  };
};

const getSafePercentageError = (predicted, actual) =>
  Math.min(3, Math.abs(predicted - actual) / Math.max(actual, 1));

const evaluateCandidates = (rows) => {
  const sampleSize = Math.min(120, Math.max(45, Math.floor(rows.length * 0.02)));
  const sampleIndices = getSampleIndices(rows.length, sampleSize);
  const candidateScores = K_CANDIDATES.reduce((collection, candidate) => {
    collection[candidate] = {
      correct: 0,
      viewError: 0
    };
    return collection;
  }, {});

  sampleIndices.forEach((index) => {
    const testRow = rows[index];
    const neighbors = buildNeighbors(rows, testRow.features, testRow.index);

    K_CANDIDATES.forEach((candidate) => {
      const prediction = getHoldoutPrediction(neighbors, candidate);
      candidateScores[candidate].correct += Number(prediction.label === testRow.engagementLevel);
      candidateScores[candidate].viewError += getSafePercentageError(
        prediction.metrics.views,
        testRow.targets.views
      );
    });
  });

  const bestCandidate = K_CANDIDATES.reduce((best, candidate) => {
    const bestAccuracy = candidateScores[best].correct / sampleIndices.length;
    const candidateAccuracy = candidateScores[candidate].correct / sampleIndices.length;

    if (candidateAccuracy > bestAccuracy) return candidate;

    if (candidateAccuracy === bestAccuracy) {
      const bestError = candidateScores[best].viewError / sampleIndices.length;
      const candidateError = candidateScores[candidate].viewError / sampleIndices.length;
      return candidateError < bestError ? candidate : best;
    }

    return best;
  }, K_CANDIDATES[0]);

  return {
    k: bestCandidate,
    sampleIndices
  };
};

const evaluateModel = (rows, k, sampleIndices) => {
  const totals = {
    correct: 0,
    similarity: 0,
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0
  };

  sampleIndices.forEach((index) => {
    const testRow = rows[index];
    const neighbors = buildNeighbors(rows, testRow.features, testRow.index);
    const activeNeighbors = neighbors.slice(0, k);
    const prediction = getHoldoutPrediction(neighbors, k);

    totals.correct += Number(prediction.label === testRow.engagementLevel);
    totals.similarity +=
      activeNeighbors.reduce((sum, neighbor) => sum + neighbor.similarity, 0) /
      (activeNeighbors.length || 1);

    REGRESSION_TARGETS.forEach((metric) => {
      totals[metric] += getSafePercentageError(prediction.metrics[metric], testRow.targets[metric]);
    });
  });

  const sampleCount = sampleIndices.length || 1;
  const engagementAccuracy = Number(((totals.correct / sampleCount) * 100).toFixed(1));
  const validationMape = {
    views: Number(((totals.views / sampleCount) * 100).toFixed(1)),
    likes: Number(((totals.likes / sampleCount) * 100).toFixed(1)),
    shares: Number(((totals.shares / sampleCount) * 100).toFixed(1)),
    comments: Number(((totals.comments / sampleCount) * 100).toFixed(1))
  };
  const averageSimilarity = Number((totals.similarity / sampleCount).toFixed(3));
  const overallConfidence = clamp(
    Math.round(
      55 +
        (engagementAccuracy / 100) * 23 +
        (1 - Math.min(1, validationMape.views / 100)) * 10 +
        averageSimilarity * 10
    ),
    55,
    96
  );

  return {
    sampleSize: sampleCount,
    engagementAccuracy,
    validationMape,
    averageSimilarity,
    overallConfidence
  };
};

export const trainTrendModel = (data) => {
  const rows = buildTrainingRows(data);
  const tunedModel = evaluateCandidates(rows);
  const validation = evaluateModel(rows, tunedModel.k, tunedModel.sampleIndices);

  return {
    name: 'TrendSense KNN',
    family: 'Locally trained weighted k-nearest-neighbors regressor/classifier',
    trainingRows: rows.length,
    k: tunedModel.k,
    featureImportance: FEATURE_IMPORTANCE,
    validation,
    rows
  };
};

export const predictTrendPerformance = (model, userInput, followerCount = 1000) => {
  if (!model || !model.rows?.length) {
    return null;
  }

  const queryFeatures = getFeatureRecord(userInput);
  const neighbors = buildNeighbors(model.rows, queryFeatures);
  const activeNeighbors = neighbors.slice(0, model.k);
  const supportCount =
    queryFeatures.platform === 'Any' &&
    queryFeatures.hashtag === 'Any' &&
    queryFeatures.contentType === 'Any' &&
    queryFeatures.region === 'Any'
      ? model.rows.length
      : neighbors.filter((neighbor) => neighbor.distance <= 0.55).length || activeNeighbors.length;

  const followerCalibration = getFollowerCalibration(activeNeighbors, followerCount);
  const metrics = REGRESSION_TARGETS.reduce((collection, metric) => {
    collection[metric] = aggregateMetricPrediction(
      neighbors.slice(0, Math.max(model.k * 2, 24)),
      metric,
      followerCalibration.multiplier
    );
    return collection;
  }, {});

  const engagement = getClassificationFromNeighbors(activeNeighbors, followerCalibration.multiplier);
  const engagementRate = Number(
    (
      ((metrics.likes.avg + metrics.shares.avg + metrics.comments.avg) /
        Math.max(metrics.views.avg, 1)) *
      100
    ).toFixed(2)
  );

  return {
    supportCount,
    topPosts: activeNeighbors.slice(0, 5).map((neighbor) => neighbor.post),
    supportPosts: neighbors.slice(0, Math.max(model.k * 2, 30)).map((neighbor) => neighbor.post),
    metrics,
    engagement,
    engagementRate,
    followerCalibration,
    confidenceScore: getModelConfidence(activeNeighbors, supportCount),
    modelDetails: {
      name: model.name,
      family: model.family,
      trainedOn: model.trainingRows,
      k: model.k,
      validation: model.validation
    }
  };
};
