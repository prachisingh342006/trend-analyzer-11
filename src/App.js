import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './App.css';
import UserInputForm from './components/UserInputForm';
import PredictionResult from './components/PredictionResult';
import HistoricalAnalysis from './components/HistoricalAnalysis';
import csvData from './data/Cleaned_Viral_Social_Media_Trends.csv';
import { predictTrendPerformance, trainTrendModel } from './utils/mlModel';

function App() {
  const [historicalData, setHistoricalData] = useState([]);
  const [trainedModel, setTrainedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetch(csvData)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
            try {
              const processedData = result.data.map((row, index) => ({
                postId: row.Post_ID || row.post_id || index + 1,
                postDate: row.Post_Date || row.post_date || row.date || '',
                platform: row.Platform || row.platform || 'Unknown',
                hashtag: row.Hashtag || row.hashtag || row.tag || '',
                contentType: row.Content_Type || row.content_type || row.type || 'Post',
                region: row.Region || row.region || row.location || 'Unknown',
                views: parseInt(row.Views || row.views || 0, 10),
                likes: parseInt(row.Likes || row.likes || 0, 10),
                shares: parseInt(row.Shares || row.shares || 0, 10),
                comments: parseInt(row.Comments || row.comments || 0, 10),
                engagementLevel:
                  row.Engagement_Level || row.engagement_level || row.engagement || 'Medium'
              }));

              setHistoricalData(processedData);
              setTrainedModel(trainTrendModel(processedData));
            } catch (error) {
              console.error('Error preparing local AI model:', error);
            } finally {
              setLoading(false);
            }
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      })
      .catch((error) => {
        console.error('Error loading CSV:', error);
        setLoading(false);
      });
  }, []);

  const analyzeTrend = (userInput) => {
    if (!trainedModel) {
      setPrediction({
        success: false,
        message: 'The local AI model is still loading. Please try again in a moment.',
        userInput
      });
      setShowResults(true);
      return;
    }

    const userFollowers = parseInt(userInput.followers, 10) || 1000;
    const modelPrediction = predictTrendPerformance(trainedModel, userInput, userFollowers);

    if (!modelPrediction || !modelPrediction.supportPosts.length) {
      setPrediction({
        success: false,
        message: 'No historical data found for this combination. Try broadening one or more filters.',
        userInput
      });
      setShowResults(true);
      return;
    }

    const followerRatio = modelPrediction.followerCalibration.multiplier;
    const predictedEngagement = modelPrediction.engagement.label;
    const similarPosts = modelPrediction.supportPosts;

    const growthRecommendations = generateGrowthRecommendations(
      userInput,
      userFollowers,
      followerRatio,
      similarPosts,
      predictedEngagement
    );

    const profileAnalysis = userInput.profileLink
      ? analyzeProfile(
          userInput.profileLink,
          userInput.platform,
          historicalData,
          userFollowers
        )
      : null;

    setPrediction({
      success: true,
      userInput,
      modelDetails: modelPrediction.modelDetails,
      modelConfidence: modelPrediction.confidenceScore,
      totalSimilarPosts: modelPrediction.supportCount,
      followerRatio: followerRatio.toFixed(2),
      followerImpact:
        followerRatio > 1.08 ? 'positive' : followerRatio < 0.92 ? 'negative' : 'neutral',
      predictions: {
        views: modelPrediction.metrics.views,
        likes: modelPrediction.metrics.likes,
        shares: modelPrediction.metrics.shares,
        comments: modelPrediction.metrics.comments
      },
      predictedEngagement,
      engagementProbability: modelPrediction.engagement.probabilities,
      engagementRate: modelPrediction.engagementRate,
      topPosts: modelPrediction.topPosts,
      similarPosts,
      growthRecommendations,
      profileAnalysis
    });

    setShowResults(true);
  };

  const generateGrowthRecommendations = (
    userInput,
    followers,
    followerRatio,
    similarPosts,
    predictedEngagement
  ) => {
    const recommendations = [];
    const platform = userInput.platform;

    if (followers < 10000) {
      recommendations.push({
        category: 'Follower Growth',
        icon: '👥',
        tips: [
          'Post consistently (3-5 times per week) to build momentum',
          'Use trending hashtags relevant to your niche',
          'Engage with your audience by responding to comments within 1 hour',
          'Collaborate with creators in your niche (cross-promotion)',
          'Create shareable content that provides value or entertainment'
        ]
      });
    } else if (followers < 50000) {
      recommendations.push({
        category: 'Scale Your Audience',
        icon: '📈',
        tips: [
          'Analyze your top-performing posts and replicate their style',
          'Create a content series to keep audience coming back',
          'Post during peak hours (check platform analytics)',
          'Use platform-specific features (Reels, Shorts, Stories)',
          'Build an email list or Discord community for loyal fans'
        ]
      });
    } else {
      recommendations.push({
        category: 'Maintain & Monetize',
        icon: '💎',
        tips: [
          'Focus on engagement rate over follower count',
          'Diversify content types to reach different audience segments',
          'Consider brand partnerships and sponsorships',
          'Create exclusive content for super fans',
          'Experiment with live streams and interactive content'
        ]
      });
    }

    const platformTips = {
      TikTok: {
        category: 'TikTok Strategy',
        icon: '🎵',
        tips: [
          'Hook viewers in the first 3 seconds',
          'Use trending sounds and audio',
          'Post when your audience is most active (check analytics)',
          'Create duets and stitch popular videos',
          'Add captions for accessibility and engagement'
        ]
      },
      Instagram: {
        category: 'Instagram Strategy',
        icon: '📸',
        tips: [
          'Post Reels for maximum reach (prioritized by algorithm)',
          'Use 20-30 relevant hashtags per post',
          'Post Stories daily to stay top-of-mind',
          'Create carousel posts for higher engagement',
          'Use Instagram Shopping if applicable'
        ]
      },
      YouTube: {
        category: 'YouTube Strategy',
        icon: '🎬',
        tips: [
          'Create eye-catching thumbnails with clear text',
          'Optimize titles with keywords (but keep them natural)',
          'Post YouTube Shorts to boost channel discovery',
          'Add timestamps and chapters to longer videos',
          'Create playlists to increase watch time'
        ]
      },
      Twitter: {
        category: 'Twitter Strategy',
        icon: '🐦',
        tips: [
          'Tweet 3-5 times daily for consistency',
          'Use threads for storytelling and in-depth content',
          'Reply to larger accounts to increase visibility',
          'Share opinions and hot takes (respectfully)',
          'Use polls and questions to boost engagement'
        ]
      }
    };

    if (platform !== 'Any' && platformTips[platform]) {
      recommendations.push(platformTips[platform]);
    }

    recommendations.push({
      category: 'Content Quality',
      icon: '✨',
      tips: [
        'Invest in good lighting and audio quality',
        'Edit tightly - cut out dead air and unnecessary parts',
        'Add subtitles/captions for accessibility',
        'Create value: educate, entertain, or inspire',
        'Be authentic - show your personality'
      ]
    });

    if (predictedEngagement === 'Low') {
      recommendations.push({
        category: 'Boost Engagement',
        icon: '🔥',
        tips: [
          'Add clear calls-to-action (like, comment, share)',
          'Ask questions to encourage comments',
          'Reply to every comment in the first hour',
          'Create content that sparks conversations',
          'Use storytelling to create emotional connections'
        ]
      });
    }

    const topHashtags = {};
    similarPosts.forEach((post) => {
      topHashtags[post.hashtag] = (topHashtags[post.hashtag] || 0) + post.views;
    });

    const bestHashtags = Object.entries(topHashtags)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 3)
      .map(([hashtag]) => hashtag);

    recommendations.push({
      category: 'Trending Now',
      icon: '🔥',
      tips: [
        `Top performing hashtag: ${bestHashtags[0] || 'N/A'}`,
        `${userInput.contentType} content is performing ${predictedEngagement.toLowerCase()} in ${userInput.region}`,
        `Best content types: ${[...new Set(similarPosts.slice(0, 10).map((post) => post.contentType))].join(', ')}`,
        `Consider posting during peak engagement times`,
        `Analyze competitor content for inspiration`
      ]
    });

    if (followerRatio > 1.15) {
      recommendations.push({
        category: 'Follower Advantage',
        icon: '🚀',
        tips: [
          'Your audience size is stronger than the model baseline for this pattern.',
          'Lean into stronger hooks because your account can support faster initial reach.',
          'Prioritize shareability to compound that early advantage.'
        ]
      });
    }

    return recommendations;
  };

  const analyzeProfile = (profileLink, platform, allHistoricalData, userFollowers) => {
    let username = profileLink.split('/').pop().replace('@', '').replace('?', '').split('?')[0];

    if (!username || username.length < 2) {
      username = 'creator_profile';
    }

    const platformPosts = allHistoricalData.filter(
      (post) => platform === 'Any' || post.platform === platform
    );

    if (platformPosts.length === 0) {
      return {
        hasAnalysis: false,
        message: 'No historical data available for this platform'
      };
    }

    const platformAvgViews = Math.round(
      platformPosts.reduce((sum, post) => sum + post.views, 0) / platformPosts.length
    );
    const platformAvgLikes = Math.round(
      platformPosts.reduce((sum, post) => sum + post.likes, 0) / platformPosts.length
    );
    const platformAvgComments = Math.round(
      platformPosts.reduce((sum, post) => sum + post.comments, 0) / platformPosts.length
    );
    const platformAvgShares = Math.round(
      platformPosts.reduce((sum, post) => sum + post.shares, 0) / platformPosts.length
    );
    const platformAvgEngagement = ((platformAvgLikes / platformAvgViews) * 100).toFixed(2);

    const followers = parseInt(userFollowers, 10) || 1000;
    const targetPlatform = platform === 'Any' ? 'Any' : platform;
    const availableContentTypes = [...new Set(platformPosts.map((post) => post.contentType))];
    const availableHashtags = [...new Set(platformPosts.map((post) => post.hashtag))];

    const contentTypePredictions = availableContentTypes
      .map((type) => {
        const prediction = predictTrendPerformance(
          trainedModel,
          {
            platform: targetPlatform,
            hashtag: 'Any',
            contentType: type,
            region: 'Any'
          },
          followers
        );

        return {
          type,
          avgViews: prediction?.metrics.views.avg || 0,
          avgLikes: prediction?.metrics.likes.avg || 0,
          avgComments: prediction?.metrics.comments.avg || 0,
          avgShares: prediction?.metrics.shares.avg || 0,
          engagementRate: prediction?.engagementRate || 0,
          count: platformPosts.filter((post) => post.contentType === type).length,
          confidence: prediction?.confidenceScore || 0
        };
      })
      .sort((left, right) => right.avgViews - left.avgViews);

    const trendingHashtags = availableHashtags
      .map((hashtag) => {
        const prediction = predictTrendPerformance(
          trainedModel,
          {
            platform: targetPlatform,
            hashtag,
            contentType: 'Any',
            region: 'Any'
          },
          followers
        );

        return {
          hashtag,
          avgViews: prediction?.metrics.views.avg || 0,
          posts: platformPosts.filter((post) => post.hashtag === hashtag).length,
          engagementRate: Number(prediction?.engagementRate || 0).toFixed(1),
          confidence: prediction?.confidenceScore || 0
        };
      })
      .sort((left, right) => right.avgViews - left.avgViews)
      .slice(0, 5);

    const bestContentTypes = contentTypePredictions.slice(0, 4);
    const baselinePrediction = predictTrendPerformance(
      trainedModel,
      {
        platform: targetPlatform,
        hashtag: trendingHashtags[0]?.hashtag || 'Any',
        contentType: bestContentTypes[0]?.type || 'Any',
        region: 'Any'
      },
      followers
    );

    const userAvgViews = baselinePrediction?.metrics.views.avg || platformAvgViews;
    const userAvgLikes = baselinePrediction?.metrics.likes.avg || platformAvgLikes;
    const userAvgComments = baselinePrediction?.metrics.comments.avg || platformAvgComments;
    const userAvgShares = baselinePrediction?.metrics.shares.avg || platformAvgShares;
    const userEngagementRate = Number(
      baselinePrediction?.engagementRate || platformAvgEngagement
    ).toFixed(2);
    const supportCount = baselinePrediction?.supportCount || platformPosts.length;
    const baselineFollowers =
      baselinePrediction?.followerCalibration.baselineFollowers || Math.round(platformAvgViews / 3);

    const viewsComparison = ((userAvgViews / platformAvgViews) * 100).toFixed(0);
    const likesComparison = ((userAvgLikes / platformAvgLikes) * 100).toFixed(0);
    const engagementComparison = (
      (parseFloat(userEngagementRate) / parseFloat(platformAvgEngagement)) *
      100
    ).toFixed(0);

    let performanceLevel = 'Average';
    let performanceEmoji = '📊';

    if (engagementComparison > 150) {
      performanceLevel = 'Excellent';
      performanceEmoji = '🔥';
    } else if (engagementComparison > 120) {
      performanceLevel = 'Above Average';
      performanceEmoji = '🌟';
    } else if (engagementComparison < 80) {
      performanceLevel = 'Below Average';
      performanceEmoji = '📉';
    }

    const postingPattern = Object.values(
      platformPosts.reduce((collection, post) => {
        const monthKey = post.postDate.slice(0, 7);

        if (!collection[monthKey]) {
          collection[monthKey] = {
            monthKey,
            month: new Date(`${monthKey}-01`).toLocaleDateString('en-US', {
              month: 'short'
            }),
            totalInteractions: 0,
            posts: 0
          };
        }

        collection[monthKey].posts += 1;
        collection[monthKey].totalInteractions += post.likes + post.comments + post.shares;
        return collection;
      }, {})
    )
      .sort((left, right) => left.monthKey.localeCompare(right.monthKey))
      .slice(-12)
      .map((item) => ({
        month: item.month,
        engagement: Math.round(
          (item.totalInteractions / Math.max(item.posts, 1)) *
            (baselinePrediction?.followerCalibration.multiplier || 1)
        ),
        posts: item.posts
      }));

    const bestPostingTimes = {
      TikTok: ['7:00 AM', '12:00 PM', '7:00 PM', '10:00 PM'],
      Instagram: ['11:00 AM', '2:00 PM', '7:00 PM', '9:00 PM'],
      YouTube: ['2:00 PM', '4:00 PM', '9:00 PM'],
      Twitter: ['8:00 AM', '12:00 PM', '5:00 PM', '9:00 PM']
    };

    const profileRecommendations = [];

    if (parseFloat(userEngagementRate) < parseFloat(platformAvgEngagement)) {
      profileRecommendations.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Engagement Below Platform Average',
        text: `Your engagement rate (${userEngagementRate}%) is below the platform average (${platformAvgEngagement}%). Focus on creating more interactive content.`
      });
    } else {
      profileRecommendations.push({
        type: 'success',
        icon: '✅',
        title: 'Strong Engagement Rate',
        text: `Your engagement rate (${userEngagementRate}%) is above the platform average (${platformAvgEngagement}%). Keep up the great work!`
      });
    }

    if (supportCount < 40) {
      profileRecommendations.push({
        type: 'info',
        icon: '🧪',
        title: 'Low-Support Pattern',
        text: `This profile estimate is based on ${supportCount} close training examples, so experiment broadly before locking in one format.`
      });
    }

    const topContentType = bestContentTypes[0];

    if (topContentType) {
      profileRecommendations.push({
        type: 'tip',
        icon: '💡',
        title: `Focus on ${topContentType.type} Content`,
        text: `${topContentType.type} content gets ${Math.round(
          topContentType.avgViews / 1000
        )}K model-estimated avg views on ${platform === 'Any' ? 'your selected mix' : platform}. Make it a priority!`
      });
    }

    if (trendingHashtags[0]) {
      profileRecommendations.push({
        type: 'tip',
        icon: '#️⃣',
        title: `Lean Into ${trendingHashtags[0].hashtag}`,
        text: `${trendingHashtags[0].hashtag} is the strongest hashtag opportunity for this profile estimate with ${Math.round(
          trendingHashtags[0].avgViews / 1000
        )}K expected avg views.`
      });
    }

    return {
      hasAnalysis: true,
      username,
      profileModeLabel: 'AI-estimated creator benchmark',
      platform: platform === 'Any' ? 'All Platforms' : platform,
      userStats: {
        followers,
        supportCount,
        baselineFollowers,
        avgViews: userAvgViews,
        avgLikes: userAvgLikes,
        avgComments: userAvgComments,
        avgShares: userAvgShares,
        engagementRate: userEngagementRate
      },
      platformBenchmarks: {
        avgViews: platformAvgViews,
        avgLikes: platformAvgLikes,
        avgEngagementRate: platformAvgEngagement
      },
      comparison: {
        views: viewsComparison,
        likes: likesComparison,
        engagement: engagementComparison,
        performanceLevel,
        performanceEmoji
      },
      trendingHashtags,
      bestContentTypes,
      bestPostingTimes: bestPostingTimes[platform] || bestPostingTimes.Instagram,
      postingPattern,
      profileRecommendations,
      totalPlatformPosts: platformPosts.length
    };
  };

  const resetAnalysis = () => {
    setShowResults(false);
    setPrediction(null);
  };

  if (loading) {
    return (
      <div className="App loading">
        <div className="loader"></div>
        <p>Loading historical trend data...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Social Media Trend Predictor</h1>
        <p>
          Predict post performance with {historicalData.length.toLocaleString()} historical records,
          a locally trained AI model, and research-backed dataset analysis.
        </p>
      </header>

      {!showResults ? (
        <>
          <UserInputForm onAnalyze={analyzeTrend} historicalData={historicalData} />
          <HistoricalAnalysis data={historicalData} model={trainedModel} />
        </>
      ) : (
        <PredictionResult prediction={prediction} onReset={resetAnalysis} />
      )}
    </div>
  );
}

export default App;
