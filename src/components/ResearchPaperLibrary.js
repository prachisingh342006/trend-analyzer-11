import React from 'react';
import './ResearchPaperLibrary.css';

const ResearchPaperLibrary = ({ papers, evidenceRows }) => {
  return (
    <section className="research-library">
      <div className="research-library-header">
        <div>
          <h3>Research Paper Library</h3>
          <p>
            Five downloadable papers are linked below, along with their source pages
            and a research-to-dashboard mapping table.
          </p>
        </div>
        <a
          className="research-html-link"
          href="/research-paper-analysis.html"
          target="_blank"
          rel="noreferrer"
        >
          Open Research HTML
        </a>
      </div>

      <div className="research-table-wrapper">
        <table className="research-table">
          <thead>
            <tr>
              <th>Research Paper</th>
              <th>Focus Area</th>
              <th>Why It Matters Here</th>
              <th>Source</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {papers.map((paper) => (
              <tr key={paper.id}>
                <td>
                  <strong>{paper.title}</strong>
                  <span>{paper.authors}</span>
                </td>
                <td>{paper.focus}</td>
                <td>{paper.relevance}</td>
                <td>
                  <a href={paper.sourceUrl} target="_blank" rel="noreferrer">
                    {paper.source} {paper.year}
                  </a>
                </td>
                <td>
                  <a href={paper.pdfUrl} target="_blank" rel="noreferrer">
                    View PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="evidence-matrix">
        <h4>Applied Research Matrix</h4>
        <div className="research-table-wrapper">
          <table className="research-table evidence-table">
            <thead>
              <tr>
                <th>Insight</th>
                <th>Metric</th>
                <th>Research Paper</th>
              </tr>
            </thead>
            <tbody>
              {evidenceRows.map((row) => (
                <tr key={row.insight}>
                  <td>{row.insight}</td>
                  <td>{row.metric}</td>
                  <td>
                    {row.paper ? (
                      <a href={row.paper.sourceUrl} target="_blank" rel="noreferrer">
                        {row.paper.title}
                      </a>
                    ) : (
                      'Source pending'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="paper-card-grid">
        {papers.map((paper) => (
          <article key={paper.id} className="paper-card">
            <div className="paper-card-top">
              <span>{paper.source}</span>
              <strong>{paper.year}</strong>
            </div>
            <h4>{paper.title}</h4>
            <p>{paper.summary}</p>
            <div className="paper-actions">
              <a href={paper.sourceUrl} target="_blank" rel="noreferrer">
                Source
              </a>
              <a href={paper.pdfUrl} target="_blank" rel="noreferrer">
                PDF
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ResearchPaperLibrary;
