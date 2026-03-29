const safeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const safeDivide = (value, total) => (total ? value / total : 0);

const toPercent = (value, total, digits = 2) =>
  Number((safeDivide(value, total) * 100).toFixed(digits));

const median = (values) => {
  if (!values.length) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return sorted[middle];
};

const formatMonth = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
};

const pearsonCorrelation = (left, right) => {
  if (!left.length || left.length !== right.length) return 0;

  const leftMean = left.reduce((sum, value) => sum + value, 0) / left.length;
  const rightMean = right.reduce((sum, value) => sum + value, 0) / right.length;

  const numerator = left.reduce(
    (sum, value, index) => sum + (value - leftMean) * (right[index] - rightMean),
    0
  );
  const leftDenominator = Math.sqrt(
    left.reduce((sum, value) => sum + (value - leftMean) ** 2, 0)
  );
  const rightDenominator = Math.sqrt(
    right.reduce((sum, value) => sum + (value - rightMean) ** 2, 0)
  );

  const denominator = leftDenominator * rightDenominator;
  return denominator ? Number((numerator / denominator).toFixed(4)) : 0;
};

const aggregateCollection = (data, getKey, getLabel = getKey) => {
  const groups = data.reduce((collection, item) => {
    const key = getKey(item);
    if (!collection[key]) {
      collection[key] = {
        key,
        label: getLabel(item),
        posts: 0,
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0
      };
    }

    collection[key].posts += 1;
    collection[key].views += safeNumber(item.views);
    collection[key].likes += safeNumber(item.likes);
    collection[key].shares += safeNumber(item.shares);
    collection[key].comments += safeNumber(item.comments);
    return collection;
  }, {});

  return Object.values(groups).map((entry) => {
    const interactions = entry.likes + entry.shares + entry.comments;
    return {
      ...entry,
      interactions,
      avgViews: Math.round(safeDivide(entry.views, entry.posts)),
      avgLikes: Math.round(safeDivide(entry.likes, entry.posts)),
      avgShares: Math.round(safeDivide(entry.shares, entry.posts)),
      avgComments: Math.round(safeDivide(entry.comments, entry.posts)),
      engagementRate: Number((safeDivide(interactions, entry.views) * 100).toFixed(2))
    };
  });
};

const addAIScore = (rows) => {
  if (!rows.length) return [];

  const maxima = rows.reduce(
    (accumulator, row) => ({
      avgViews: Math.max(accumulator.avgViews, row.avgViews),
      avgLikes: Math.max(accumulator.avgLikes, row.avgLikes),
      avgShares: Math.max(accumulator.avgShares, row.avgShares),
      avgComments: Math.max(accumulator.avgComments, row.avgComments),
      engagementRate: Math.max(accumulator.engagementRate, row.engagementRate),
      posts: Math.max(accumulator.posts, row.posts)
    }),
    {
      avgViews: 0,
      avgLikes: 0,
      avgShares: 0,
      avgComments: 0,
      engagementRate: 0,
      posts: 0
    }
  );

  return rows
    .map((row) => {
      const weightedScore =
        safeDivide(row.avgViews, maxima.avgViews) * 0.18 +
        safeDivide(row.avgLikes, maxima.avgLikes) * 0.24 +
        safeDivide(row.avgShares, maxima.avgShares) * 0.2 +
        safeDivide(row.avgComments, maxima.avgComments) * 0.14 +
        safeDivide(row.engagementRate, maxima.engagementRate) * 0.18 +
        safeDivide(row.posts, maxima.posts) * 0.06;

      return {
        ...row,
        aiScore: Math.round(weightedScore * 100)
      };
    })
    .sort((left, right) => right.aiScore - left.aiScore);
};

const buildOpportunitySegments = (data) => {
  const segments = aggregateCollection(
    data,
    (item) => [item.platform, item.contentType, item.region].join('|'),
    (item) => `${item.platform} / ${item.contentType} / ${item.region}`
  ).filter((row) => row.posts >= 40);

  return addAIScore(segments).slice(0, 6).map((row) => ({
    ...row,
    confidence:
      row.posts >= 70 ? 'High confidence' : row.posts >= 50 ? 'Medium confidence' : 'Emerging'
  }));
};

export const formatCompactNumber = (number) => {
  if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;
  return String(number);
};

export const inferResearchPaperIdForPost = (post) => {
  const platform = String(post.platform || '').toLowerCase();
  const contentType = String(post.contentType || '').toLowerCase();
  const hashtag = String(post.hashtag || '').toLowerCase();
  const engagementLevel = String(post.engagementLevel || '').toLowerCase();
  const views = safeNumber(post.views);
  const shares = safeNumber(post.shares);
  const comments = safeNumber(post.comments);
  const postDate = String(post.postDate || '');

  if (platform === 'twitter' && contentType === 'tweet') {
    return 'twitter-trend-classification';
  }

  if (platform === 'twitter') {
    return views >= 1000000 || shares >= comments
      ? 'tweet-engagement-gnn'
      : 'twitter-trend-classification';
  }

  if (contentType === 'live stream' || postDate >= '2023-01-01') {
    return 'smtpd';
  }

  if (hashtag.includes('education') || hashtag.includes('tech') || comments >= 30000) {
    return 'twssenti';
  }

  if (engagementLevel === 'high' || shares >= 50000) {
    return 'dfw-pp';
  }

  return 'tweet-engagement-gnn';
};

export const getResearchPaperForPost = (post, researchPapers = []) =>
  researchPapers.find((paper) => paper.id === inferResearchPaperIdForPost(post)) || null;

export const buildDatasetAnalysis = (data, researchPapers = [], trainedModel = null) => {
  const views = data.map((item) => safeNumber(item.views));
  const likes = data.map((item) => safeNumber(item.likes));
  const shares = data.map((item) => safeNumber(item.shares));
  const comments = data.map((item) => safeNumber(item.comments));

  const totalViews = views.reduce((sum, value) => sum + value, 0);
  const totalLikes = likes.reduce((sum, value) => sum + value, 0);
  const totalShares = shares.reduce((sum, value) => sum + value, 0);
  const totalComments = comments.reduce((sum, value) => sum + value, 0);
  const totalInteractions = totalLikes + totalShares + totalComments;

  const platformPerformance = addAIScore(
    aggregateCollection(data, (item) => item.platform, (item) => item.platform)
  );
  const regionPerformance = addAIScore(
    aggregateCollection(data, (item) => item.region, (item) => item.region)
  );
  const contentTypePerformance = addAIScore(
    aggregateCollection(data, (item) => item.contentType, (item) => item.contentType)
  );
  const hashtagPerformance = addAIScore(
    aggregateCollection(data, (item) => item.hashtag, (item) => item.hashtag)
  );

  const monthlyCollection = aggregateCollection(
    data,
    (item) => item.postDate.slice(0, 7),
    (item) => formatMonth(item.postDate.slice(0, 7))
  )
    .map((item) => ({
      ...item,
      monthKey: item.key
    }))
    .sort((left, right) => left.monthKey.localeCompare(right.monthKey));

  const engagementDistribution = ['High', 'Medium', 'Low'].map((level) => {
    const count = data.filter((item) => item.engagementLevel === level).length;
    return {
      label: level,
      count,
      percentage: toPercent(count, data.length, 1)
    };
  });

  const opportunitySegments = buildOpportunitySegments(data);
  const latestWindow = monthlyCollection.slice(-6);
  const previousWindow = monthlyCollection.slice(-12, -6);
  const recentAverage = latestWindow.reduce((sum, item) => sum + item.avgViews, 0) / (latestWindow.length || 1);
  const previousAverage =
    previousWindow.reduce((sum, item) => sum + item.avgViews, 0) / (previousWindow.length || 1);
  const momentumChange = previousAverage
    ? Number((((recentAverage - previousAverage) / previousAverage) * 100).toFixed(1))
    : 0;

  const fallbackConfidenceScore = Math.min(
    97,
    Math.round(
      72 +
        platformPerformance.length * 2 +
        contentTypePerformance.length +
        Math.min(data.length / 500, 10)
    )
  );

  const evidenceRows = [
    {
      insight: 'AI engagement scoring',
      metric:
        opportunitySegments[0]
          ? `${opportunitySegments[0].label} scored ${opportunitySegments[0].aiScore}/100`
          : 'No segment passed the minimum support threshold',
      paperId: 'tweet-engagement-gnn'
    },
    {
      insight: 'Fast-moving trend monitoring',
      metric:
        monthlyCollection.length
          ? `${monthlyCollection[monthlyCollection.length - 1].label} logged ${formatCompactNumber(
              monthlyCollection[monthlyCollection.length - 1].views
            )} views`
          : 'Insufficient time series data',
      paperId: 'twitter-trend-classification'
    },
    {
      insight: 'Feature weighting',
      metric:
        contentTypePerformance[0]
          ? `${contentTypePerformance[0].label} leads with ${contentTypePerformance[0].aiScore}/100`
          : 'No content-type signal available',
      paperId: 'dfw-pp'
    },
    {
      insight: 'Sentiment-aware extension',
      metric: `${engagementDistribution
        .map((item) => `${item.label} ${item.percentage}%`)
        .join(' • ')}`,
      paperId: 'twssenti'
    },
    {
      insight: 'Temporal popularity forecasting',
      metric: `${momentumChange >= 0 ? '+' : ''}${momentumChange}% change in average views between the last two 6-month windows`,
      paperId: 'smtpd'
    }
  ].map((row) => ({
    ...row,
    paper: researchPapers.find((paper) => paper.id === row.paperId)
  }));

  const balancedDistribution = engagementDistribution.every((entry) => entry.percentage >= 30);
  const weakCorrelations =
    Math.abs(pearsonCorrelation(views, likes)) < 0.05 &&
    Math.abs(pearsonCorrelation(views, shares)) < 0.05 &&
    Math.abs(pearsonCorrelation(views, comments)) < 0.05;

  return {
    totals: {
      totalPosts: data.length,
      totalViews,
      totalLikes,
      totalShares,
      totalComments,
      totalInteractions,
      avgViews: Math.round(safeDivide(totalViews, data.length)),
      avgLikes: Math.round(safeDivide(totalLikes, data.length)),
      avgShares: Math.round(safeDivide(totalShares, data.length)),
      avgComments: Math.round(safeDivide(totalComments, data.length)),
      medianViews: median(views),
      avgEngagementRate: Number((safeDivide(totalInteractions, totalViews) * 100).toFixed(2)),
      platformCount: new Set(data.map((item) => item.platform)).size,
      regionCount: new Set(data.map((item) => item.region)).size,
      hashtagCount: new Set(data.map((item) => item.hashtag)).size
    },
    engagementDistribution,
    platformPerformance,
    regionPerformance,
    contentTypePerformance,
    hashtagPerformance,
    monthlyTrend: monthlyCollection,
    opportunitySegments,
    evidenceRows,
    aiModel: {
      name: trainedModel?.name || 'TrendSense Local AI',
      family:
        trainedModel?.family || 'Similarity retrieval + weighted signal scoring',
      confidenceScore: trainedModel?.validation?.overallConfidence || fallbackConfidenceScore,
      featureWeights: trainedModel?.featureImportance || [
        { label: 'Likes', value: '24%' },
        { label: 'Shares', value: '20%' },
        { label: 'Engagement rate', value: '18%' },
        { label: 'Views', value: '18%' },
        { label: 'Comments', value: '14%' },
        { label: 'Sample support', value: '6%' }
      ],
      validation: trainedModel
        ? {
            trainingRows: trainedModel.trainingRows,
            k: trainedModel.k,
            engagementAccuracy: trainedModel.validation.engagementAccuracy,
            viewsMape: trainedModel.validation.validationMape.views,
            averageSimilarity: trainedModel.validation.averageSimilarity
          }
        : null,
      topSegment: opportunitySegments[0] || null,
      notes: [
        trainedModel
          ? `${trainedModel.name} was trained locally on ${trainedModel.trainingRows.toLocaleString()} posts with k=${trainedModel.k}.`
          : platformPerformance[0]
            ? `${platformPerformance[0].label} is the strongest platform signal by AI score.`
            : 'Platform ranking becomes available after the dataset loads.',
        trainedModel
          ? `${trainedModel.validation.engagementAccuracy}% holdout accuracy on engagement-level prediction with ${trainedModel.validation.validationMape.views}% view MAPE.`
          : contentTypePerformance[0]
            ? `${contentTypePerformance[0].label} is the best-performing content format in the current sample.`
            : 'Content-type ranking becomes available after the dataset loads.',
        balancedDistribution && weakCorrelations
          ? 'The dataset behaves like a balanced benchmark, which is useful for comparing strategies without one class dominating the sample.'
          : 'The dataset shows distinct engagement imbalances that the model can exploit for stronger recommendations.'
      ]
    },
    correlations: {
      viewsLikes: pearsonCorrelation(views, likes),
      viewsShares: pearsonCorrelation(views, shares),
      viewsComments: pearsonCorrelation(views, comments)
    },
    momentumChange
  };
};
