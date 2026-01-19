import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TrendCharts.css';

const TrendCharts = ({ data }) => {
  // Group data by date
  const timelineData = data.reduce((acc, item) => {
    const date = item.postDate;
    if (!acc[date]) {
      acc[date] = { 
        date, 
        posts: 0, 
        totalViews: 0, 
        totalLikes: 0, 
        totalShares: 0,
        totalComments: 0
      };
    }
    acc[date].posts++;
    acc[date].totalViews += item.views || 0;
    acc[date].totalLikes += item.likes || 0;
    acc[date].totalShares += item.shares || 0;
    acc[date].totalComments += item.comments || 0;
    return acc;
  }, {});

  const chartData = Object.values(timelineData)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-30); // Show last 30 days

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="trend-charts-container">
      <div className="chart-card">
        <h3>📈 Engagement Trends Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tickFormatter={formatNumber} />
            <Tooltip formatter={(value) => formatNumber(value)} />
            <Legend />
            <Line type="monotone" dataKey="totalViews" stroke="#9b59b6" strokeWidth={2} name="Views" />
            <Line type="monotone" dataKey="totalLikes" stroke="#e91e63" strokeWidth={2} name="Likes" />
            <Line type="monotone" dataKey="totalShares" stroke="#00bcd4" strokeWidth={2} name="Shares" />
            <Line type="monotone" dataKey="totalComments" stroke="#ff9800" strokeWidth={2} name="Comments" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>📊 Post Volume Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="posts" stroke="#667eea" strokeWidth={3} name="Total Posts" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendCharts;
