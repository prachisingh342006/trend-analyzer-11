import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './PlatformAnalysis.css';

const PlatformAnalysis = ({ data }) => {
  const platformData = data.reduce((acc, item) => {
    if (!acc[item.platform]) {
      acc[item.platform] = { 
        platform: item.platform, 
        posts: 0, 
        views: 0, 
        likes: 0, 
        shares: 0,
        comments: 0
      };
    }
    acc[item.platform].posts++;
    acc[item.platform].views += item.views || 0;
    acc[item.platform].likes += item.likes || 0;
    acc[item.platform].shares += item.shares || 0;
    acc[item.platform].comments += item.comments || 0;
    return acc;
  }, {});

  const chartData = Object.values(platformData);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="chart-card">
      <h3>📱 Platform Performance Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis tickFormatter={formatNumber} />
          <Tooltip formatter={(value) => formatNumber(value)} />
          <Legend />
          <Bar dataKey="posts" fill="#3498db" name="Posts" />
          <Bar dataKey="likes" fill="#e91e63" name="Likes" />
          <Bar dataKey="shares" fill="#00bcd4" name="Shares" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformAnalysis;
