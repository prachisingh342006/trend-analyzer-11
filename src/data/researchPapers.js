const researchPapers = [
  {
    id: 'tweet-engagement-gnn',
    title: 'Predicting Tweet Engagement with Graph Neural Networks',
    authors: 'Marco Arazzi, Marco Cotogni, Antonino Nocera, Luca Virgili',
    year: 2023,
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/2305.10103',
    pdfUrl: '/research-papers/predicting-tweet-engagement-gnn.pdf',
    focus: 'Graph-based engagement forecasting',
    summary:
      'Proposes TweetGage, a graph neural network that models relationships among posts to improve engagement prediction on Twitter.',
    relevance:
      'Supports the app’s AI scoring layer for predicting which post patterns are most likely to generate strong engagement.'
  },
  {
    id: 'twitter-trend-classification',
    title: 'Real-Time Classification of Twitter Trends',
    authors: 'Arkaitz Zubiaga, Damiano Spina, Raquel Martinez, Victor Fresno',
    year: 2014,
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/1403.1451',
    pdfUrl: '/research-papers/real-time-classification-twitter-trends.pdf',
    focus: 'Early trend detection',
    summary:
      'Introduces a typology for trends and shows how early social signals can classify news, events, memes, and commemoratives in real time.',
    relevance:
      'Matches the dashboard’s trend analysis layer, especially the monthly activity view and early-warning style monitoring.'
  },
  {
    id: 'dfw-pp',
    title: 'DFW-PP: Dynamic Feature Weighting based Popularity Prediction for Social Media Content',
    authors:
      'Viswanatha Reddy G, Chaitanya B S N V, Prathyush P, Sumanth M, Mrinalini C, Dileep Kumar P, Snehasis Mukherjee',
    year: 2021,
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/2110.08510',
    pdfUrl: '/research-papers/dfw-pp-popularity-prediction.pdf',
    focus: 'Feature weighting for popularity prediction',
    summary:
      'Studies how different engagement features matter at different moments and uses dynamic weighting plus normalization to predict content popularity.',
    relevance:
      'Informs the feature-weighted leaderboard and the content-type opportunity scoring shown in the dashboard.'
  },
  {
    id: 'twssenti',
    title: 'TWSSenti: A Novel Hybrid Framework for Topic-Wise Sentiment Analysis on Social Media Using Transformer Models',
    authors: 'Aish Albladi, Md Kaosar Uddin, Minarul Islam, Cheryl Seals',
    year: 2025,
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/2504.09896',
    pdfUrl: '/research-papers/twssenti-topic-wise-sentiment-analysis.pdf',
    focus: 'Transformer-based sentiment analysis',
    summary:
      'Combines transformer models including BERT, GPT-2, RoBERTa, XLNet, and DistilBERT to improve robustness on noisy social media text.',
    relevance:
      'Provides the research bridge for adding a more explicit AI-model section and for future sentiment-aware monitoring extensions.'
  },
  {
    id: 'smtpd',
    title: 'SMTPD: A New Benchmark for Temporal Prediction of Social Media Popularity',
    authors: 'Yijie Xu, Bolun Zheng, Wei Zhu, Hangjia Pan, Yuchen Yao, Ning Xu, Anan Liu, Quan Zhang, Chenggang Yan',
    year: 2025,
    source: 'arXiv',
    sourceUrl: 'https://arxiv.org/abs/2503.04446',
    pdfUrl: '/research-papers/smtpd-social-media-popularity-benchmark.pdf',
    focus: 'Temporal popularity benchmarking',
    summary:
      'Builds a benchmark for temporal popularity prediction and highlights the importance of early popularity and time alignment.',
    relevance:
      'Directly supports the dashboard’s month-by-month trend analysis and long-horizon forecasting perspective.'
  }
];

export const researchPaperLookup = researchPapers.reduce((lookup, paper) => {
  lookup[paper.id] = paper;
  return lookup;
}, {});

export default researchPapers;
