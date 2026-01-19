import React, { useState, useEffect } from 'react';
import './UserInputForm.css';

const UserInputForm = ({ onAnalyze, historicalData }) => {
  const [formData, setFormData] = useState({
    platform: 'Any',
    hashtag: 'Any',
    contentType: 'Any',
    region: 'Any',
    followers: '',
    profileLink: ''
  });

  const [options, setOptions] = useState({
    platforms: [],
    hashtags: [],
    contentTypes: [],
    regions: []
  });

  useEffect(() => {
    if (historicalData.length > 0) {
      setOptions({
        platforms: ['Any', ...new Set(historicalData.map(d => d.platform))],
        hashtags: ['Any', ...new Set(historicalData.map(d => d.hashtag))],
        contentTypes: ['Any', ...new Set(historicalData.map(d => d.contentType))],
        regions: ['Any', ...new Set(historicalData.map(d => d.region))]
      });
    }
  }, [historicalData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  return (
    <div className="user-input-form">
      <div className="form-header">
        <h2>📝 Tell Us About Your Planned Post</h2>
        <p>Select the characteristics of the trend you want to try, and we'll predict its performance</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>📱 Platform</label>
            <select 
              name="platform" 
              value={formData.platform} 
              onChange={handleChange}
              required
            >
              {options.platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
            <p className="helper-text">Which platform will you post on?</p>
          </div>

          <div className="form-group">
            <label>#️⃣ Hashtag / Trend</label>
            <select 
              name="hashtag" 
              value={formData.hashtag} 
              onChange={handleChange}
              required
            >
              {options.hashtags.map(hashtag => (
                <option key={hashtag} value={hashtag}>{hashtag}</option>
              ))}
            </select>
            <p className="helper-text">Which trend or hashtag will you use?</p>
          </div>

          <div className="form-group">
            <label>📹 Content Type</label>
            <select 
              name="contentType" 
              value={formData.contentType} 
              onChange={handleChange}
              required
            >
              {options.contentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <p className="helper-text">What type of content will you create?</p>
          </div>

          <div className="form-group">
            <label>🌍 Target Region</label>
            <select 
              name="region" 
              value={formData.region} 
              onChange={handleChange}
              required
            >
              {options.regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <p className="helper-text">Which region are you targeting?</p>
          </div>

          <div className="form-group followers-input">
            <label>👥 Your Follower Count</label>
            <input 
              type="number" 
              name="followers" 
              value={formData.followers} 
              onChange={handleChange}
              placeholder="e.g., 10000"
              min="0"
              required
            />
            <p className="helper-text">How many followers do you currently have?</p>
          </div>

          <div className="form-group profile-link-input">
            <label>🔗 Your Profile Link (Optional)</label>
            <input 
              type="url" 
              name="profileLink" 
              value={formData.profileLink} 
              onChange={handleChange}
              placeholder="e.g., https://tiktok.com/@username"
            />
            <p className="helper-text">For personalized profile analysis & recommendations</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="analyze-btn">
            🔮 Predict Performance
          </button>
        </div>

        <div className="form-note">
          <p>💡 <strong>Tip:</strong> Select "Any" for broader predictions or be specific for more accurate results</p>
        </div>
      </form>
    </div>
  );
};

export default UserInputForm;
