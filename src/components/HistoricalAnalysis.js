import React from 'react';
import './HistoricalAnalysis.css';

const HistoricalAnalysis = ({ data }) => {
  const totalPosts = data.length;
  
  // Platform distribution
  const platformCounts = data.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {});

  // Engagement distribution
  const engagementCounts = data.reduce((acc, post) => {
    acc[post.engagementLevel] = (acc[post.engagementLevel] || 0) + 1;
    return acc;
  }, {});

  // Top hashtags
  const hashtagCounts = data.reduce((acc, post) => {
    acc[post.hashtag] = (acc[post.hashtag] || 0) + 1;
    return acc;
  }, {});

  const topHashtags = Object.entries(hashtagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="historical-analysis">
      <h2>📊 Historical Dataset Overview</h2>
      <p className="subtitle">Understanding past trends to predict future performance</p>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon">📝</div>
          <div className="stat-number">{totalPosts.toLocaleString()}</div>
          <div className="stat-label">Total Posts Analyzed</div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">📱</div>
          <div className="stat-number">{Object.keys(platformCounts).length}</div>
          <div className="stat-label">Platforms</div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">#️⃣</div>
          <div className="stat-number">{Object.keys(hashtagCounts).length}</div>
          <div className="stat-label">Unique Hashtags</div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">🌍</div>
          <div className="stat-number">{new Set(data.map(d => d.region)).size}</div>
          <div className="stat-label">Regions</div>
        </div>
      </div>

      <div className="info-sections">
        <div className="info-section">
          <h3>🔥 Engagement Levels in Dataset</h3>
          <div className="engagement-bars">
            <div className="bar-item">
              <span>High</span>
              <div className="bar-container">
                <div 
                  className="bar high" 
                  style={{ width: `${(engagementCounts.High / totalPosts) * 100}%` }}
                ></div>
              </div>
              <span>{engagementCounts.High} posts</span>
            </div>
            <div className="bar-item">
              <span>Medium</span>
              <div className="bar-container">
                <div 
                  className="bar medium" 
                  style={{ width: `${(engagementCounts.Medium / totalPosts) * 100}%` }}
                ></div>
              </div>
              <span>{engagementCounts.Medium} posts</span>
            </div>
            <div className="bar-item">
              <span>Low</span>
              <div className="bar-container">
                <div 
                  className="bar low" 
                  style={{ width: `${(engagementCounts.Low / totalPosts) * 100}%` }}
                ></div>
              </div>
              <span>{engagementCounts.Low} posts</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3>🏆 Top 5 Trending Hashtags</h3>
          <div className="hashtag-list">
            {topHashtags.map(([hashtag, count], index) => (
              <div key={index} className="hashtag-item">
                <span className="hashtag-rank">#{index + 1}</span>
                <span className="hashtag-name">{hashtag}</span>
                <span className="hashtag-count">{count.toLocaleString()} posts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalAnalysis;
