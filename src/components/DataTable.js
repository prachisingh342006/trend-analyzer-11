import React, { useState } from 'react';
import './DataTable.css';
import researchPapers from '../data/researchPapers';
import { getResearchPaperForPost } from '../utils/analytics';

const DataTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const getEngagementClass = (level) => {
    return `engagement-badge ${level.toLowerCase()}`;
  };

  const getEngagementEmoji = (level) => {
    switch(level) {
      case 'High': return '🔥';
      case 'Medium': return '⚡';
      case 'Low': return '📊';
      default: return '❓';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="data-table-container">
      <h2>📋 Detailed Post Data</h2>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Post ID</th>
              <th>Date</th>
              <th>Platform</th>
              <th>Hashtag</th>
              <th>Content Type</th>
              <th>Region</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Shares</th>
              <th>Comments</th>
              <th>Engagement</th>
              <th>Research Paper</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              const paper = getResearchPaperForPost(item, researchPapers);

              return (
                <tr key={index}>
                  <td className="post-id-cell">{item.postId}</td>
                  <td>{item.postDate}</td>
                  <td className="platform-cell">{item.platform}</td>
                  <td className="hashtag-cell">{item.hashtag}</td>
                  <td>{item.contentType}</td>
                  <td>{item.region}</td>
                  <td className="number-cell">{formatNumber(item.views)}</td>
                  <td className="number-cell">❤️ {formatNumber(item.likes)}</td>
                  <td className="number-cell">🔄 {formatNumber(item.shares)}</td>
                  <td className="number-cell">💬 {formatNumber(item.comments)}</td>
                  <td>
                    <span className={getEngagementClass(item.engagementLevel)}>
                      {getEngagementEmoji(item.engagementLevel)} {item.engagementLevel}
                    </span>
                  </td>
                  <td className="research-paper-cell">
                    {paper ? (
                      <>
                        <a href={paper.sourceUrl} target="_blank" rel="noreferrer">
                          {paper.title}
                        </a>
                        <span>{paper.source}</span>
                      </>
                    ) : (
                      <span>No paper mapped</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
