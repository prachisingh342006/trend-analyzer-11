import React from 'react';
import './HistoricalAnalysis.css';
import Dashboard from './Dashboard';
import TrendCharts from './TrendCharts';
import PlatformAnalysis from './PlatformAnalysis';
import EngagementAnalysis from './EngagementAnalysis';
import AIModelInsights from './AIModelInsights';
import ResearchPaperLibrary from './ResearchPaperLibrary';
import DataTable from './DataTable';
import researchPapers from '../data/researchPapers';
import { buildDatasetAnalysis, formatCompactNumber } from '../utils/analytics';

const HistoricalAnalysis = ({ data, model }) => {
  const analysis = buildDatasetAnalysis(data, researchPapers, model);
  const { totals, platformPerformance, regionPerformance, contentTypePerformance, monthlyTrend } = analysis;

  const highlightCards = [
    {
      label: 'Top Platform',
      value: platformPerformance[0]?.label || 'Pending',
      detail: platformPerformance[0]
        ? `${formatCompactNumber(platformPerformance[0].avgViews)} avg views per post`
        : 'Platform ranking appears after data loads.'
    },
    {
      label: 'Best Content Type',
      value: contentTypePerformance[0]?.label || 'Pending',
      detail: contentTypePerformance[0]
        ? `${contentTypePerformance[0].aiScore}/100 AI score`
        : 'Content-type scoring appears after data loads.'
    },
    {
      label: 'Top Region',
      value: regionPerformance[0]?.label || 'Pending',
      detail: regionPerformance[0]
        ? `${regionPerformance[0].engagementRate}% engagement rate`
        : 'Regional analysis appears after data loads.'
    },
    {
      label: 'Latest Trend Window',
      value: monthlyTrend[monthlyTrend.length - 1]?.label || 'Pending',
      detail: monthlyTrend[monthlyTrend.length - 1]
        ? `${formatCompactNumber(monthlyTrend[monthlyTrend.length - 1].views)} views in the latest month`
        : 'Time-series analysis appears after data loads.'
    }
  ];

  return (
    <section className="historical-analysis">
      <div className="analysis-hero">
        <div>
          <span className="analysis-kicker">Dataset Intelligence</span>
          <h2>AI Model and Dataset Analysis Dashboard</h2>
          <p className="subtitle">
            A research-backed dashboard for the full social media dataset, combining
            descriptive analytics, AI scoring, and downloadable paper references.
          </p>
        </div>

        <div className="hero-metrics">
          <div className="hero-metric-card">
            <span>Total Dataset Views</span>
            <strong>{formatCompactNumber(totals.totalViews)}</strong>
          </div>
          <div className="hero-metric-card">
            <span>Average Engagement Rate</span>
            <strong>{totals.avgEngagementRate}%</strong>
          </div>
          <div className="hero-metric-card">
            <span>AI Confidence</span>
            <strong>{analysis.aiModel.confidenceScore}/100</strong>
          </div>
        </div>
      </div>

      <Dashboard data={data} />

      <div className="analysis-meta-grid">
        <article className="meta-card">
          <span>Posts</span>
          <strong>{totals.totalPosts.toLocaleString()}</strong>
          <p>Historical posts loaded from the cleaned trend dataset.</p>
        </article>
        <article className="meta-card">
          <span>Coverage</span>
          <strong>
            {totals.platformCount} platforms / {totals.regionCount} regions
          </strong>
          <p>Cross-platform and cross-region coverage for comparative analysis.</p>
        </article>
        <article className="meta-card">
          <span>Interactions</span>
          <strong>{formatCompactNumber(totals.totalInteractions)}</strong>
          <p>Likes, shares, and comments pooled into one engagement lens.</p>
        </article>
        <article className="meta-card">
          <span>Hashtags</span>
          <strong>{totals.hashtagCount}</strong>
          <p>Distinct hashtag themes available for trend and content analysis.</p>
        </article>
      </div>

      <div className="highlight-grid">
        {highlightCards.map((card) => (
          <article key={card.label} className="highlight-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </div>

      <div className="analysis-stack">
        <TrendCharts data={data} />

        <div className="dual-chart-grid">
          <PlatformAnalysis data={data} />
          <EngagementAnalysis data={data} />
        </div>
      </div>

      <AIModelInsights analysis={analysis} />
      <ResearchPaperLibrary papers={researchPapers} evidenceRows={analysis.evidenceRows} />
      <DataTable data={data} />
    </section>
  );
};

export default HistoricalAnalysis;
