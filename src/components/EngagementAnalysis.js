import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './EngagementAnalysis.css';

const EngagementAnalysis = ({ data }) => {
  const engagementCounts = data.reduce((acc, item) => {
    acc[item.engagementLevel] = (acc[item.engagementLevel] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: 'High', value: engagementCounts.High || 0, emoji: '🔥' },
    { name: 'Medium', value: engagementCounts.Medium || 0, emoji: '⚡' },
    { name: 'Low', value: engagementCounts.Low || 0, emoji: '📊' }
  ];

  const COLORS = {
    High: '#f44336',
    Medium: '#ff9800',
    Low: '#607d8b'
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontWeight="bold"
        fontSize="14"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="chart-card">
      <h3>🔥 Engagement Level Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            formatter={(value, entry) => `${entry.payload.emoji} ${value}: ${entry.payload.value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementAnalysis;
