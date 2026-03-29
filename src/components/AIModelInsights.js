import React from 'react';
import './AIModelInsights.css';
import { formatCompactNumber } from '../utils/analytics';

const AIModelInsights = ({ analysis }) => {
  const { aiModel, opportunitySegments, correlations } = analysis;

  return (
    <section className="ai-model-panel">
      <div className="section-heading">
        <div>
          <h3>AI Model Analysis</h3>
          <p>
            The app now uses a real locally trained machine-learning model for prediction,
            while the dashboard also highlights the strongest dataset segments.
          </p>
        </div>
        <div className="model-confidence">
          <span>Confidence</span>
          <strong>{aiModel.confidenceScore}/100</strong>
        </div>
      </div>

      <div className="ai-model-grid">
        <article className="ai-model-card">
          <span className="eyebrow">Model</span>
          <h4>{aiModel.name}</h4>
          <p>{aiModel.family}</p>

          <div className="feature-weights">
            {aiModel.featureWeights.map((feature) => (
              <div key={feature.label} className="weight-pill">
                <span>{feature.label}</span>
                <strong>{feature.value}</strong>
              </div>
            ))}
          </div>
        </article>

        {aiModel.validation && (
          <article className="ai-model-card">
            <span className="eyebrow">Validation</span>
            <h4>Holdout Performance</h4>
            <div className="correlation-list">
              <div>
                <span>Training rows</span>
                <strong>{aiModel.validation.trainingRows}</strong>
              </div>
              <div>
                <span>Selected k</span>
                <strong>{aiModel.validation.k}</strong>
              </div>
              <div>
                <span>Engagement accuracy</span>
                <strong>{aiModel.validation.engagementAccuracy}%</strong>
              </div>
              <div>
                <span>Views MAPE</span>
                <strong>{aiModel.validation.viewsMape}%</strong>
              </div>
            </div>
          </article>
        )}

        <article className="ai-model-card">
          <span className="eyebrow">Top Segment</span>
          <h4>{aiModel.topSegment ? aiModel.topSegment.label : 'No dominant segment yet'}</h4>
          {aiModel.topSegment && (
            <div className="top-segment-stats">
              <div>
                <span>AI score</span>
                <strong>{aiModel.topSegment.aiScore}/100</strong>
              </div>
              <div>
                <span>Avg views</span>
                <strong>{formatCompactNumber(aiModel.topSegment.avgViews)}</strong>
              </div>
              <div>
                <span>Engagement rate</span>
                <strong>{aiModel.topSegment.engagementRate}%</strong>
              </div>
            </div>
          )}
        </article>

        <article className="ai-model-card">
          <span className="eyebrow">Signal Quality</span>
          <h4>Correlation Readout</h4>
          <div className="correlation-list">
            <div>
              <span>Views vs Likes</span>
              <strong>{correlations.viewsLikes}</strong>
            </div>
            <div>
              <span>Views vs Shares</span>
              <strong>{correlations.viewsShares}</strong>
            </div>
            <div>
              <span>Views vs Comments</span>
              <strong>{correlations.viewsComments}</strong>
            </div>
          </div>
        </article>
      </div>

      <div className="opportunity-table-wrapper">
        <table className="opportunity-table">
          <thead>
            <tr>
              <th>Segment</th>
              <th>AI Score</th>
              <th>Avg Views</th>
              <th>Engagement Rate</th>
              <th>Posts</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {opportunitySegments.map((segment) => (
              <tr key={segment.key}>
                <td>{segment.label}</td>
                <td>{segment.aiScore}/100</td>
                <td>{formatCompactNumber(segment.avgViews)}</td>
                <td>{segment.engagementRate}%</td>
                <td>{segment.posts}</td>
                <td>{segment.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ai-notes">
        {aiModel.notes.map((note) => (
          <div key={note} className="ai-note">
            {note}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AIModelInsights;
