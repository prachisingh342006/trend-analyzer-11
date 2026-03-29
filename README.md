# Social Media Trend Predictor

A React-based social media analytics and prediction project that uses a locally trained machine-learning model to estimate post performance from historical trend data.

## Overview

This project helps a user estimate how a planned social media post may perform before publishing it. The app combines:

- a trained local ML model for prediction
- a dataset analysis dashboard
- research-paper-backed documentation
- profile benchmarking and strategy recommendations

The interface is fully client-side. The dataset is loaded in the browser, parsed with PapaParse, analyzed locally, and visualized with Recharts.

## Main Capabilities

- Predicts `views`, `likes`, `shares`, and `comments`
- Predicts engagement level as `High`, `Medium`, or `Low`
- Uses a real local ML model instead of only heuristic rules
- Calibrates predictions using follower count
- Shows top similar posts from the training dataset
- Provides dashboard analysis across platforms, regions, content types, and time
- Includes 5 downloadable research papers with source links
- Provides a research analysis HTML page and a full project-details HTML page

## ML Model

The project now uses a locally trained weighted k-nearest-neighbors model defined in [src/utils/mlModel.js](src/utils/mlModel.js).

### Model behavior

- Trains on the historical dataset after load
- Tunes `k` on a holdout sample
- Uses weighted categorical similarity across:
  - platform
  - hashtag
  - content type
  - region
- Predicts:
  - views
  - likes
  - shares
  - comments
  - engagement class
- Applies a follower-count calibrator after the base prediction because follower count is not part of the original dataset

### Why this matters

This makes the prediction flow an actual ML-backed system rather than only a random or rule-based estimator.

## Dataset

Source file: [src/data/Cleaned_Viral_Social_Media_Trends.csv](src/data/Cleaned_Viral_Social_Media_Trends.csv)

- Rows: `5000`
- Platforms: `Instagram`, `TikTok`, `Twitter`, `YouTube`
- Regions: `Australia`, `Brazil`, `Canada`, `Germany`, `India`, `Japan`, `UK`, `USA`
- Content types: `Live Stream`, `Post`, `Reel`, `Shorts`, `Tweet`, `Video`
- Unique hashtags: `10`

### Columns

- `Post_ID`
- `Post_Date`
- `Platform`
- `Hashtag`
- `Content_Type`
- `Region`
- `Views`
- `Likes`
- `Shares`
- `Comments`
- `Engagement_Level`

## Project Modules

### Core app

- [src/App.js](src/App.js): dataset loading, model training, prediction flow
- [src/utils/mlModel.js](src/utils/mlModel.js): local ML model training and inference
- [src/utils/analytics.js](src/utils/analytics.js): dashboard metrics and research mapping

### UI components

- [src/components/UserInputForm.js](src/components/UserInputForm.js): input form for planned post details
- [src/components/PredictionResult.js](src/components/PredictionResult.js): prediction output and profile insights
- [src/components/HistoricalAnalysis.js](src/components/HistoricalAnalysis.js): full analysis dashboard
- [src/components/AIModelInsights.js](src/components/AIModelInsights.js): ML model explanation and validation summary
- [src/components/ResearchPaperLibrary.js](src/components/ResearchPaperLibrary.js): research-paper table, source links, and downloads
- [src/components/DataTable.js](src/components/DataTable.js): paginated dataset table with research-paper mapping

### Public documentation pages

- [public/research-paper-analysis.html](public/research-paper-analysis.html): research-paper analysis page
- [public/project-details.html](public/project-details.html): full project details page

## Research Integration

The project includes five locally stored research papers and source attribution in [src/data/researchPapers.js](src/data/researchPapers.js).

Topics covered:

- graph-based engagement prediction
- real-time trend classification
- dynamic feature weighting
- transformer-based sentiment analysis
- temporal popularity forecasting

The research layer is connected to the dashboard so the app can show which paper supports each insight.

## Tech Stack

- React 19
- Recharts 3
- PapaParse 5
- Create React App 5
- Jest + React Testing Library
- CSS3

## Run Locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Build and Test

```bash
npm test -- --watch=false
npm run build
```

## Project Structure

```text
social-sentiment-analysis/
├── public/
│   ├── research-paper-analysis.html
│   ├── project-details.html
│   └── research-papers/
├── src/
│   ├── components/
│   ├── data/
│   ├── utils/
│   ├── App.js
│   └── index.js
├── documentation/
├── package.json
└── README.md
```

## Current Output

The app currently provides:

- ML-based post prediction
- ML-based profile benchmarking
- dataset exploration dashboard
- AI model validation summary
- research-backed evidence tables

## Limitations

- The app runs fully in the browser, so there is no backend model serving
- Follower count is calibrated after prediction because the dataset does not include creator follower counts
- Best posting times are still platform guidance, not learned from the dataset, because posting-time fields are not present

## Future Scope

- Add a backend model API for larger datasets
- Add time-of-day prediction if timestamp granularity becomes available
- Add retraining from user-uploaded or updated datasets
- Add model export/import for persistent trained artifacts
- Add more formal evaluation metrics and confusion-matrix reporting
