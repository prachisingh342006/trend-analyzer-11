import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TimelineChart.css';

const TimelineChart = ({ data }) => {
  const timelineData = data.reduce((acc, item) => {
    const date = item.timestamp;
    if (!acc[date]) {
      acc[date] = { date, positive: 0, neutral: 0, negative: 0, total: 0 };
    }
    acc[date][item.sentiment]++;
    acc[date].total++;
    return acc;
  }, {});

  const chartData = Object.values(timelineData).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="timeline-card">
      <h3>📈 Sentiment Timeline</h3>
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
          <Line type="monotone" dataKey="positive" stroke="#4caf50" strokeWidth={2} name="Positive" />
          <Line type="monotone" dataKey="neutral" stroke="#ff9800" strokeWidth={2} name="Neutral" />
          <Line type="monotone" dataKey="negative" stroke="#f44336" strokeWidth={2} name="Negative" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
