# 📊 Social Media Trend Predictor# Social Sentiment Analysis Dashboard



A React-based web application that predicts social media post performance based on historical viral trend data. Analyze your planned content before posting to maximize engagement!A React-based web application for analyzing social media sentiment data from CSV files.



![React](https://img.shields.io/badge/React-19.2-blue)## 🎯 Features

![License](https://img.shields.io/badge/License-MIT-green)

![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)- **File Upload**: Drag-and-drop or browse to upload CSV datasets

- **Auto-Detection**: Automatically detects column names from your CSV

## 🚀 Features- **Interactive Dashboard**: Real-time statistics and metrics

- **Sentiment Filtering**: Filter by positive, neutral, or negative sentiments

### Core Functionality- **Visual Analytics**:

- **Trend Prediction**: Predict views, likes, shares, and comments for your planned posts  - Pie chart for sentiment distribution

- **Engagement Analysis**: Get probability distributions for High/Medium/Low engagement  - Bar chart for platform-wise analysis

- **Follower-Based Scaling**: Predictions adjust based on your actual follower count  - Line chart for timeline trends

- **Historical Comparison**: Compare against 5,000+ historical viral posts- **Data Table**: Paginated view of all posts with search and filter



### Profile Analysis (Optional)## 📁 Using Your Own Dataset (e.g., Cleaned_Viral_Social_Media_Trends.csv)

- **Performance Benchmarks**: Compare your metrics against platform averages

- **Engagement Trends**: Visual charts showing your 12-month engagement pattern### Supported Format

- **Best Posting Times**: Platform-specific optimal posting schedules

- **Content Type Recommendations**: Which content formats perform bestYour CSV file should contain columns with information about social media posts. The app will automatically detect common column names.



### Growth Recommendations### Example CSV Structure:

- **Personalized Strategies**: Tips based on your follower tier (<10K, 10-50K, 50K+)

- **Platform-Specific Tips**: Tailored advice for TikTok, Instagram, YouTube, Twitter```csv

- **Content Quality Guidance**: Production and editing best practicesid,text,sentiment,timestamp,platform,likes,shares

- **Trending Insights**: Real-time trending hashtags and content types1,"Great product! Highly recommended!",positive,2024-01-15,Twitter,150,45

2,"Not satisfied with the quality",negative,2024-01-15,Facebook,23,5

## 📱 Supported Platforms3,"It's okay, nothing special",neutral,2024-01-16,Instagram,67,12

- TikTok```

- Instagram

- YouTube### Column Auto-Detection

- Twitter

The app automatically detects these columns (case-insensitive):

## 🛠️ Tech Stack

- **Frontend**: React 19| Required Data | Detected Column Names |

- **Charts**: Recharts|--------------|----------------------|

- **Data Parsing**: PapaParse| **ID** | id, post_id, tweet_id, message_id, index |

- **Styling**: CSS3 with Gradients & Animations| **Text Content** | text, content, message, post, tweet, comment, description |

- **Deployment**: Vercel-ready| **Sentiment** | sentiment, emotion, feeling, polarity, sentiment_score |

| **Date/Time** | timestamp, date, created_at, post_date, time, datetime |

## 🚀 Quick Start| **Platform** | platform, source, social_media, network, channel |

| **Likes** | likes, reactions, favorites, hearts, upvotes, like_count |

### Prerequisites| **Shares** | shares, retweets, reposts, share_count, retweet_count |

- Node.js 18+ 

- npm or yarn### Sentiment Values



### InstallationThe sentiment column should contain one of these values (case-insensitive):

- `positive` - for positive sentiments

```bash- `negative` - for negative sentiments

# Clone the repository- `neutral` - for neutral sentiments

git clone https://github.com/yourusername/social-media-trend-predictor.git

## 🚀 Getting Started

# Navigate to project directory

cd social-media-trend-predictor## 🚀 Getting Started



# Install dependencies### Installation

npm install

```bash

# Start development servernpm install

npm start```

```

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view the app.

Runs the app in the development mode.\

## 📦 Build for ProductionOpen [http://localhost:3000](http://localhost:3000) to view it in your browser.



```bashThe page will reload when you make changes.\

npm run buildYou may also see any lint errors in the console.

```

## 📊 How to Use the Application

This creates an optimized production build in the `build` folder.

1. **Upload Your Dataset**

## 🌐 Deploy to Vercel   - When you first open the app, you'll see an upload screen

   - Click "Browse Files" or drag-and-drop your CSV file (e.g., Cleaned_Viral_Social_Media_Trends.csv)

### Option 1: One-Click Deploy   - The app will automatically process and analyze your data

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/social-media-trend-predictor)

2. **View Analytics Dashboard**

### Option 2: Manual Deploy   - Dashboard displays total posts, sentiment breakdown, and engagement metrics

   - Interactive charts show sentiment distribution, platform analysis, and timeline trends

1. Install Vercel CLI:

```bash3. **Filter Data by Sentiment**

npm i -g vercel   - Use filter buttons (All, Positive, Neutral, Negative) to view specific sentiments

```   - Real-time counts are displayed for each category



2. Deploy:4. **Analyze the Data Table**

```bash   - Scroll down to see detailed post information

vercel   - Paginated view with 10 posts per page

```

5. **Upload New Dataset**

3. For production:   - Click "Upload New Dataset" button in the header to analyze a different file

```bash

vercel --prod## 🛠 Technologies Used

```

- **React** - Frontend framework

### Option 3: Git Integration- **PapaParse** - CSV parsing library  

- **Recharts** - Data visualization library

1. Push your code to GitHub/GitLab/Bitbucket- **CSS3** - Styling and animations

2. Import project at [vercel.com/new](https://vercel.com/new)

3. Vercel auto-detects React and deploys!## 📝 Data Privacy



## 📂 Project StructureAll data processing happens in your browser. No data is sent to any server.



```## 🤝 Troubleshooting

social-sentiment-analysis/

├── public/If your CSV file doesn't load:

│   ├── index.html1. Verify it's a valid CSV format

│   └── favicon.ico2. Ensure sentiment values are: positive, negative, or neutral (case-insensitive)

├── src/3. Open browser console (F12) to see detailed error messages

│   ├── components/4. Check that column names match the supported variations listed above

│   │   ├── UserInputForm.js       # Input collection form5. Remove any empty rows at the end of your CSV file

│   │   ├── UserInputForm.css

│   │   ├── PredictionResult.js    # Results display## 📦 Additional Scripts

│   │   ├── PredictionResult.css

│   │   ├── HistoricalAnalysis.js  # Dataset overview### `npm test`

│   │   └── HistoricalAnalysis.css

│   ├── data/Launches the test runner in the interactive watch mode.\

│   │   └── Cleaned_Viral_Social_Media_Trends.csvSee the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

│   ├── App.js                     # Main app logic

│   ├── App.css### `npm run build`

│   └── index.js

├── vercel.json                    # Vercel configurationBuilds the app for production to the `build` folder.\

├── package.jsonIt correctly bundles React in production mode and optimizes the build for the best performance.

└── README.md

```The build is minified and the filenames include the hashes.\

Your app is ready to be deployed!

## 🎯 How It Works

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

1. **Input Collection**: User provides:

   - Target platform (TikTok, Instagram, YouTube, Twitter)### `npm run eject`

   - Planned hashtag

   - Content type (Video, Image, Shorts, etc.)**Note: this is a one-way operation. Once you `eject`, you can't go back!**

   - Geographic region

   - Current follower countIf you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

   - Profile link (optional)

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

2. **Data Analysis**:

   - Filters 5,000+ historical posts matching criteriaYou don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

   - Calculates engagement statistics with variability

   - Applies follower-based multipliers## Learn More

   - Generates probabilistic predictions

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

3. **Results Display**:

   - Predicted metrics (views, likes, shares, comments)To learn React, check out the [React documentation](https://reactjs.org/).

   - Engagement probability distribution

   - Top 5 similar historical posts### Code Splitting

   - Personalized growth recommendations

   - Profile analysis (if link provided)This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)



## 📊 Dataset### Analyzing the Bundle Size



The app uses `Cleaned_Viral_Social_Media_Trends.csv` containing 5,001 viral posts with:This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

- Post ID & Date

- Platform### Making a Progressive Web App

- Hashtag

- Content TypeThis section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

- Region

- Views, Likes, Shares, Comments### Advanced Configuration

- Engagement Level (High/Medium/Low)

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

## 🔧 Configuration

### Deployment

### Environment Variables

No environment variables required for basic functionality.This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)



### Vercel Configuration (`vercel.json`)### `npm run build` fails to minify

```json

{This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ]
}
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run development server |
| `npm run build` | Create production build |
| `npm test` | Run tests |
| `npm run eject` | Eject from CRA |

## 🎨 Features in Detail

### Prediction Variability
Each analysis produces slightly different results due to:
- Random sampling of historical data
- Variance multipliers on metrics
- Time-based seed generation

This simulates real-world unpredictability while maintaining statistical accuracy.

### Profile Analysis
When a profile link is provided:
- Extracts username from URL
- Generates simulated profile metrics based on follower count
- Compares against platform benchmarks
- Provides personalized improvement suggestions

### Growth Recommendations
Tailored advice based on:
- Follower tier (small/medium/large creator)
- Selected platform's best practices
- Predicted engagement level
- Trending content in your niche

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Dataset: Social Media Viral Trends Dataset
- Charts: [Recharts](https://recharts.org/)
- CSV Parsing: [PapaParse](https://www.papaparse.com/)
- Icons: Emoji-based design

---

Made with ❤️ using React
