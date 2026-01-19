import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ 
  filters, 
  setFilters, 
  platforms, 
  hashtags, 
  contentTypes, 
  regions, 
  engagementLevels,
  totalFiltered,
  totalData
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      platform: 'all',
      hashtag: 'all',
      contentType: 'all',
      region: 'all',
      engagementLevel: 'all',
      dateRange: 'all'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <div className="filter-title">
          <h3>🔍 Filters</h3>
          <span className="filter-results">
            Showing {totalFiltered} of {totalData} posts
          </span>
        </div>
        <div className="filter-actions">
          {activeFiltersCount > 0 && (
            <button className="reset-btn" onClick={resetFilters}>
              Reset All ({activeFiltersCount})
            </button>
          )}
          <button 
            className="toggle-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▲ Hide Filters' : '▼ Show Filters'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="filter-grid">
          <div className="filter-group">
            <label>📱 Platform</label>
            <select 
              value={filters.platform} 
              onChange={(e) => handleFilterChange('platform', e.target.value)}
            >
              {platforms.map(p => (
                <option key={p} value={p}>
                  {p === 'all' ? 'All Platforms' : p}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>#️⃣ Hashtag</label>
            <select 
              value={filters.hashtag} 
              onChange={(e) => handleFilterChange('hashtag', e.target.value)}
            >
              {hashtags.slice(0, 20).map(h => (
                <option key={h} value={h}>
                  {h === 'all' ? 'All Hashtags' : h}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>📹 Content Type</label>
            <select 
              value={filters.contentType} 
              onChange={(e) => handleFilterChange('contentType', e.target.value)}
            >
              {contentTypes.map(c => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Types' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>🌍 Region</label>
            <select 
              value={filters.region} 
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              {regions.map(r => (
                <option key={r} value={r}>
                  {r === 'all' ? 'All Regions' : r}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>🔥 Engagement Level</label>
            <select 
              value={filters.engagementLevel} 
              onChange={(e) => handleFilterChange('engagementLevel', e.target.value)}
            >
              {engagementLevels.map(e => (
                <option key={e} value={e}>
                  {e === 'all' ? 'All Levels' : e}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
