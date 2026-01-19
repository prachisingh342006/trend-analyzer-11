import React from 'react';
import './Dashboard.css';

const Dashboard = ({ data }) => {
  const totalPosts = data.length;
  const totalViews = data.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalLikes = data.reduce((sum, item) => sum + (item.likes || 0), 0);
  const totalShares = data.reduce((sum, item) => sum + (item.shares || 0), 0);
  const totalComments = data.reduce((sum, item) => sum + (item.comments || 0), 0);

  const highEngagement = data.filter(item => item.engagementLevel === 'High').length;
  const mediumEngagement = data.filter(item => item.engagementLevel === 'Medium').length;
  const lowEngagement = data.filter(item => item.engagementLevel === 'Low').length;

  const avgEngagementRate = totalPosts ? 
    (((totalLikes + totalShares + totalComments) / totalViews) * 100).toFixed(2) : 0;

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const stats = [
    {
      title: 'Total Posts',
      value: formatNumber(totalPosts),
      icon: '📝',
      color: '#3498db'
    },
    {
      title: 'Total Views',
      value: formatNumber(totalViews),
      icon: '👁️',
      color: '#9b59b6'
    },
    {
      title: 'Total Likes',
      value: formatNumber(totalLikes),
      icon: '❤️',
      color: '#e91e63'
    },
    {
      title: 'Total Shares',
      value: formatNumber(totalShares),
      icon: '🔄',
      color: '#00bcd4'
    },
    {
      title: 'Total Comments',
      value: formatNumber(totalComments),
      icon: '�',
      color: '#ff9800'
    },
    {
      title: 'Avg Engagement',
      value: `${avgEngagementRate}%`,
      icon: '📈',
      color: '#4caf50'
    },
    {
      title: 'High Engagement',
      value: highEngagement,
      icon: '�',
      color: '#f44336'
    },
    {
      title: 'Medium Engagement',
      value: mediumEngagement,
      icon: '⚡',
      color: '#ff9800'
    },
    {
      title: 'Low Engagement',
      value: lowEngagement,
      icon: '�',
      color: '#607d8b'
    }
  ];

  return (
    <div className="dashboard">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card" style={{ borderColor: stat.color }}>
          <div className="stat-icon" style={{ background: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <h3>{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
