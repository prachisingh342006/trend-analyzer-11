import React, { useState, useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }
    setFileName(file.name);
    onFileUpload(file);
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="file-upload-container">
      <div className="upload-info">
        <h2>📂 Upload Your Dataset</h2>
        <p>Supported format: CSV files</p>
        <div className="format-info">
          <h3>Required columns (auto-detected):</h3>
          <ul>
            <li><strong>Post_ID / post_id:</strong> Unique identifier for each post</li>
            <li><strong>Post_Date / date:</strong> When the post was created</li>
            <li><strong>Platform:</strong> Social media platform (Twitter, Instagram, TikTok, YouTube, etc.)</li>
            <li><strong>Hashtag:</strong> Associated hashtag or topic</li>
            <li><strong>Content_Type:</strong> Type of content (Video, Post, Tweet, Shorts, etc.)</li>
            <li><strong>Region:</strong> Geographic region</li>
            <li><strong>Views:</strong> Number of views</li>
            <li><strong>Likes:</strong> Number of likes or reactions</li>
            <li><strong>Shares:</strong> Number of shares or retweets</li>
            <li><strong>Comments:</strong> Number of comments</li>
            <li><strong>Engagement_Level:</strong> High, Medium, or Low</li>
          </ul>
          <p className="note">
            💡 The app will automatically detect variations of these column names.
          </p>
        </div>
      </div>

      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          <div className="upload-icon">📊</div>
          <h3>Drag and drop your CSV file here</h3>
          <p>or</p>
          <button className="browse-btn" onClick={onButtonClick}>
            Browse Files
          </button>
          {fileName && (
            <div className="file-name">
              <span>✅ {fileName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="example-datasets">
        <h3>📋 Example: Cleaned_Viral_Social_Media_Trends.csv</h3>
        <p>Your dataset should have columns similar to:</p>
        <div className="example-table">
          <code>
            Post_ID,Post_Date,Platform,Hashtag,Content_Type,Region,Views,Likes,Shares,Comments,Engagement_Level<br/>
            Post_1,2022-01-13,TikTok,#Challenge,Video,UK,4163464,339431,53135,19346,High<br/>
            Post_2,2022-05-13,Instagram,#Education,Shorts,India,4155940,215240,65860,27239,Medium
          </code>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
