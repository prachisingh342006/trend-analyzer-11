import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import './PredictionResult.css';

const PredictionResult = ({ prediction, onReset }) => {
  if (!prediction.success) {
    return (
      <div className="prediction-result">
        <div className="no-results">
          <div className="no-results-icon">❌</div>
          <h2>{prediction.message}</h2>
          <button onClick={onReset} className="back-btn">← Try Different Combination</button>
        </div>
      </div>
    );
  }

  const { userInput, totalSimilarPosts, predictions, predictedEngagement, engagementProbability, engagementRate, topPosts, followerRatio, followerImpact, growthRecommendations, profileAnalysis } = prediction;

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const getEngagementColor = (level) => {
    switch(level) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#607d8b';
      default: return '#999';
    }
  };

  const getEngagementIcon = (level) => {
    switch(level) {
      case 'High': return '🔥';
      case 'Medium': return '⚡';
      case 'Low': return '📊';
      default: return '❓';
    }
  };

  const predictionChartData = [
    { metric: 'Views', min: predictions.views.min, avg: predictions.views.avg, max: predictions.views.max },
    { metric: 'Likes', min: predictions.likes.min, avg: predictions.likes.avg, max: predictions.likes.max },
    { metric: 'Shares', min: predictions.shares.min, avg: predictions.shares.avg, max: predictions.shares.max },
    { metric: 'Comments', min: predictions.comments.min, avg: predictions.comments.avg, max: predictions.comments.max }
  ];

  const engagementPieData = [
    { name: 'High', value: parseFloat(engagementProbability.high), color: '#f44336' },
    { name: 'Medium', value: parseFloat(engagementProbability.medium), color: '#ff9800' },
    { name: 'Low', value: parseFloat(engagementProbability.low), color: '#607d8b' }
  ];

  return (
    <div className="prediction-result">
      <button onClick={onReset} className="back-btn">← Analyze Another Trend</button>

      <div className="result-header">
        <h1>🎯 Prediction Results</h1>
        <div className="user-selection">
          <span><strong>Platform:</strong> {userInput.platform}</span>
          <span><strong>Hashtag:</strong> {userInput.hashtag}</span>
          <span><strong>Content Type:</strong> {userInput.contentType}</span>
          <span><strong>Region:</strong> {userInput.region}</span>
          <span><strong>Followers:</strong> {parseInt(userInput.followers).toLocaleString()}</span>
        </div>
      </div>

      <div className="data-source-info">
        <p>📊 Analysis based on <strong>{totalSimilarPosts.toLocaleString()}</strong> similar posts from historical data</p>
        {followerRatio && (
          <p className={`follower-impact ${followerImpact}`}>
            👥 Follower Impact: <strong>{followerRatio}x</strong> multiplier 
            {followerImpact === 'positive' && ' - Your larger audience will boost engagement! 🚀'}
            {followerImpact === 'negative' && ' - Building your audience will improve results 📈'}
            {followerImpact === 'neutral' && ' - Your follower count is in the average range ✅'}
          </p>
        )}
      </div>

      <div className="prediction-summary">
        <div className="summary-card main-prediction">
          <div className="card-icon" style={{ background: getEngagementColor(predictedEngagement) }}>
            {getEngagementIcon(predictedEngagement)}
          </div>
          <h3>Predicted Engagement Level</h3>
          <div className="big-value" style={{ color: getEngagementColor(predictedEngagement) }}>
            {predictedEngagement}
          </div>
          <p>Based on historical trends</p>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ background: '#4caf50' }}>📈</div>
          <h3>Expected Engagement Rate</h3>
          <div className="big-value">{engagementRate}%</div>
          <p>Average interaction rate</p>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ background: '#2196f3' }}>👁️</div>
          <h3>Expected Views</h3>
          <div className="big-value">{formatNumber(predictions.views.avg)}</div>
          <p>Range: {formatNumber(predictions.views.min)} - {formatNumber(predictions.views.max)}</p>
        </div>

        <div className="summary-card">
          <div className="card-icon" style={{ background: '#e91e63' }}>❤️</div>
          <h3>Expected Likes</h3>
          <div className="big-value">{formatNumber(predictions.likes.avg)}</div>
          <p>Range: {formatNumber(predictions.likes.min)} - {formatNumber(predictions.likes.max)}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>📊 Predicted Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={predictionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Legend />
              <Bar dataKey="min" fill="#90caf9" name="Minimum" />
              <Bar dataKey="avg" fill="#2196f3" name="Average (Expected)" />
              <Bar dataKey="max" fill="#0d47a1" name="Maximum" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>🎲 Engagement Probability</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engagementPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {engagementPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="top-posts-section">
        <h3>🏆 Top 5 Similar Posts from Historical Data</h3>
        <div className="top-posts-grid">
          {topPosts.map((post, index) => (
            <div key={index} className="top-post-card">
              <div className="post-rank">#{index + 1}</div>
              <div className="post-details">
                <p><strong>{post.platform}</strong> • {post.hashtag} • {post.contentType}</p>
                <p className="post-region">📍 {post.region} • 📅 {post.postDate}</p>
                <div className="post-stats">
                  <span>👁️ {formatNumber(post.views)}</span>
                  <span>❤️ {formatNumber(post.likes)}</span>
                  <span>🔄 {formatNumber(post.shares)}</span>
                  <span>💬 {formatNumber(post.comments)}</span>
                </div>
                <span className={`engagement-badge ${post.engagementLevel.toLowerCase()}`}>
                  {getEngagementIcon(post.engagementLevel)} {post.engagementLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recommendation-section">
        <h3>💡 Recommendations</h3>
        <div className="recommendation-cards">
          {predictedEngagement === 'High' && (
            <div className="recommendation-card success">
              <div className="rec-icon">🎉</div>
              <h4>Great Choice!</h4>
              <p>This combination historically performs well. Go for it!</p>
            </div>
          )}
          {predictedEngagement === 'Medium' && (
            <div className="recommendation-card warning">
              <div className="rec-icon">⚡</div>
              <h4>Moderate Performance Expected</h4>
              <p>Consider optimizing your content quality and posting time for better results.</p>
            </div>
          )}
          {predictedEngagement === 'Low' && (
            <div className="recommendation-card danger">
              <div className="rec-icon">⚠️</div>
              <h4>Low Engagement Expected</h4>
              <p>Consider trying a different trend, platform, or content type for better results.</p>
            </div>
          )}
          
          {followerImpact === 'positive' && (
            <div className="recommendation-card success">
              <div className="rec-icon">👥</div>
              <h4>Follower Advantage!</h4>
              <p>Your larger follower base ({parseInt(userInput.followers).toLocaleString()}) gives you a significant advantage. Your content will reach more people!</p>
            </div>
          )}
          
          {followerImpact === 'negative' && (
            <div className="recommendation-card info">
              <div className="rec-icon">📈</div>
              <h4>Grow Your Audience</h4>
              <p>With {parseInt(userInput.followers).toLocaleString()} followers, focus on audience building strategies to improve reach and engagement.</p>
            </div>
          )}
          
          <div className="recommendation-card info">
            <div className="rec-icon">📌</div>
            <h4>Pro Tip</h4>
            <p>Post timing, content quality, and audience engagement also significantly impact performance!</p>
          </div>
        </div>
      </div>

      {/* Growth Recommendations Section */}
      {growthRecommendations && (
        <div className="growth-recommendations-section">
          <h3>🚀 Personalized Growth Strategies</h3>
          <p className="section-subtitle">Actionable tips to increase your followers, views, and engagement</p>
          <div className="growth-grid">
            {growthRecommendations.map((rec, index) => (
              <div key={index} className="growth-card">
                <div className="growth-header">
                  <span className="growth-icon">{rec.icon}</span>
                  <h4>{rec.category}</h4>
                </div>
                <ul className="growth-tips">
                  {rec.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Analysis Section - Enhanced */}
      {profileAnalysis && profileAnalysis.hasAnalysis && (
        <div className="profile-analysis-section">
          <h3>📊 Your Profile Analysis</h3>
          <p className="section-subtitle">
            Detailed analysis for <strong>@{profileAnalysis.username}</strong> on {profileAnalysis.platform}
          </p>

          {/* User Profile Stats */}
          <div className="user-profile-overview">
            <div className="profile-header-card">
              <div className="profile-avatar">
                {profileAnalysis.username.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h4>@{profileAnalysis.username}</h4>
                <p>{profileAnalysis.platform} Creator • {profileAnalysis.accountAge} months active</p>
                <div className="performance-badge" data-level={profileAnalysis.comparison.performanceLevel.toLowerCase().replace(' ', '-')}>
                  {profileAnalysis.comparison.performanceEmoji} {profileAnalysis.comparison.performanceLevel}
                </div>
              </div>
            </div>

            <div className="user-stats-grid">
              <div className="user-stat-card">
                <span className="stat-icon">👥</span>
                <span className="stat-value">{formatNumber(profileAnalysis.userStats.followers)}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="user-stat-card">
                <span className="stat-icon">📝</span>
                <span className="stat-value">{profileAnalysis.userStats.totalPosts}</span>
                <span className="stat-label">Total Posts</span>
              </div>
              <div className="user-stat-card">
                <span className="stat-icon">👁️</span>
                <span className="stat-value">{formatNumber(profileAnalysis.userStats.avgViews)}</span>
                <span className="stat-label">Avg Views</span>
              </div>
              <div className="user-stat-card">
                <span className="stat-icon">❤️</span>
                <span className="stat-value">{formatNumber(profileAnalysis.userStats.avgLikes)}</span>
                <span className="stat-label">Avg Likes</span>
              </div>
              <div className="user-stat-card highlight">
                <span className="stat-icon">📊</span>
                <span className="stat-value">{profileAnalysis.userStats.engagementRate}%</span>
                <span className="stat-label">Engagement Rate</span>
              </div>
              <div className="user-stat-card">
                <span className="stat-icon">📅</span>
                <span className="stat-value">{profileAnalysis.userStats.avgPostsPerWeek}</span>
                <span className="stat-label">Posts/Week</span>
              </div>
            </div>
          </div>

          {/* Comparison with Platform Average */}
          <div className="comparison-section">
            <h4>📈 Your Performance vs Platform Average</h4>
            <div className="comparison-bars">
              <div className="comparison-item">
                <div className="comparison-label">Views</div>
                <div className="comparison-bar-container">
                  <div 
                    className="comparison-bar" 
                    style={{ width: `${Math.min(100, profileAnalysis.comparison.views)}%` }}
                    data-above={parseInt(profileAnalysis.comparison.views) >= 100}
                  ></div>
                  <span className="comparison-value">{profileAnalysis.comparison.views}%</span>
                </div>
              </div>
              <div className="comparison-item">
                <div className="comparison-label">Likes</div>
                <div className="comparison-bar-container">
                  <div 
                    className="comparison-bar" 
                    style={{ width: `${Math.min(100, profileAnalysis.comparison.likes)}%` }}
                    data-above={parseInt(profileAnalysis.comparison.likes) >= 100}
                  ></div>
                  <span className="comparison-value">{profileAnalysis.comparison.likes}%</span>
                </div>
              </div>
              <div className="comparison-item">
                <div className="comparison-label">Engagement</div>
                <div className="comparison-bar-container">
                  <div 
                    className="comparison-bar" 
                    style={{ width: `${Math.min(100, profileAnalysis.comparison.engagement)}%` }}
                    data-above={parseInt(profileAnalysis.comparison.engagement) >= 100}
                  ></div>
                  <span className="comparison-value">{profileAnalysis.comparison.engagement}%</span>
                </div>
              </div>
            </div>
            <p className="comparison-note">* 100% = Platform Average</p>
          </div>

          {/* Profile Recommendations */}
          {profileAnalysis.profileRecommendations && profileAnalysis.profileRecommendations.length > 0 && (
            <div className="profile-recommendations">
              <h4>💡 Personalized Insights</h4>
              <div className="profile-rec-grid">
                {profileAnalysis.profileRecommendations.map((rec, index) => (
                  <div key={index} className={`profile-rec-card ${rec.type}`}>
                    <span className="rec-emoji">{rec.icon}</span>
                    <div className="rec-content">
                      <h5>{rec.title}</h5>
                      <p>{rec.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Trend Chart */}
          {profileAnalysis.postingPattern && (
            <div className="engagement-trend-section">
              <h4>📈 Engagement Trend (Last 12 Months)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={profileAnalysis.postingPattern}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatNumber} />
                  <Tooltip formatter={(value) => formatNumber(value)} />
                  <Area type="monotone" dataKey="engagement" stroke="#667eea" fillOpacity={1} fill="url(#colorEngagement)" name="Engagement" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Best Posting Times */}
          {profileAnalysis.bestPostingTimes && (
            <div className="best-times-section">
              <h4>⏰ Best Times to Post on {profileAnalysis.platform}</h4>
              <div className="times-grid">
                {profileAnalysis.bestPostingTimes.map((time, index) => (
                  <div key={index} className="time-badge">
                    <span className="time-icon">🕐</span>
                    <span className="time-value">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Platform Benchmarks */}
          <div className="profile-benchmarks">
            <h4>🎯 Platform Benchmarks ({profileAnalysis.platform})</h4>
            <div className="benchmark-grid">
              <div className="benchmark-card">
                <div className="benchmark-icon">👁️</div>
                <div className="benchmark-value">{formatNumber(profileAnalysis.platformBenchmarks.avgViews)}</div>
                <div className="benchmark-label">Avg Views</div>
              </div>
              <div className="benchmark-card">
                <div className="benchmark-icon">❤️</div>
                <div className="benchmark-value">{formatNumber(profileAnalysis.platformBenchmarks.avgLikes)}</div>
                <div className="benchmark-label">Avg Likes</div>
              </div>
              <div className="benchmark-card">
                <div className="benchmark-icon">📈</div>
                <div className="benchmark-value">{profileAnalysis.platformBenchmarks.avgEngagementRate}%</div>
                <div className="benchmark-label">Avg Engagement Rate</div>
              </div>
              <div className="benchmark-card">
                <div className="benchmark-icon">📝</div>
                <div className="benchmark-value">{profileAnalysis.totalPlatformPosts.toLocaleString()}</div>
                <div className="benchmark-label">Posts Analyzed</div>
              </div>
            </div>
          </div>

          <div className="profile-insights-grid">
            <div className="profile-insight-card">
              <h4>🔥 Trending Hashtags on {profileAnalysis.platform}</h4>
              <div className="hashtag-list">
                {profileAnalysis.trendingHashtags.map((item, index) => (
                  <div key={index} className="hashtag-item">
                    <span className="hashtag-rank">#{index + 1}</span>
                    <span className="hashtag-name">{item.hashtag}</span>
                    <span className="hashtag-stats">
                      {formatNumber(item.avgViews)} avg views • {item.engagementRate}% eng
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="profile-insight-card">
              <h4>🎬 Best Performing Content Types</h4>
              <div className="content-type-list">
                {profileAnalysis.bestContentTypes.map((item, index) => (
                  <div key={index} className="content-type-item">
                    <span className="content-rank">#{index + 1}</span>
                    <span className="content-name">{item.type}</span>
                    <span className="content-stats">
                      {formatNumber(item.avgViews)} avg views
                    </span>
                  </div>
                ))}
              </div>
              <p className="insight-tip">
                💡 Focus on these content types to maximize your reach on {profileAnalysis.platform}
              </p>
            </div>
          </div>
        </div>
      )}

      {profileAnalysis && !profileAnalysis.hasAnalysis && (
        <div className="profile-analysis-section">
          <div className="recommendation-card warning">
            <div className="rec-icon">ℹ️</div>
            <h4>Profile Analysis Unavailable</h4>
            <p>{profileAnalysis.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
