# Data Folder

## 📁 Using Cleaned_Viral_Social_Media_Trends.csv or Your Own Dataset

**Note:** You no longer need to place files in this folder! The app now has a **file upload feature**.

### How to Use Your Dataset

1. **Start the application** with `npm start`
2. **Upload your CSV file** using the drag-and-drop interface or browse button
3. The app will **automatically detect** your column names

### Supported CSV Formats

Your CSV file (like `Cleaned_Viral_Social_Media_Trends.csv`) should have columns for:

| Column Type | Common Names (Auto-Detected) |
|-------------|------------------------------|
| **ID/Index** | id, post_id, tweet_id, message_id, index |
| **Text Content** | text, content, message, post, tweet, comment, description |
| **Sentiment** | sentiment, emotion, feeling, polarity, sentiment_score |
| **Date/Time** | timestamp, date, created_at, post_date, time, datetime |
| **Platform** | platform, source, social_media, network, channel |
| **Engagement (Likes)** | likes, reactions, favorites, hearts, upvotes, like_count |
| **Engagement (Shares)** | shares, retweets, reposts, share_count, retweet_count |

### Example CSV Structure

```csv
id,text,sentiment,timestamp,platform,likes,shares
1,"I love this product! Best purchase ever!",positive,2024-01-15,Twitter,245,89
2,"Terrible experience. Would not recommend.",negative,2024-01-15,Facebook,12,3
3,"It's okay, nothing special really.",neutral,2024-01-16,Instagram,45,8
```

### Sentiment Values

Your sentiment column should contain one of these values (case-insensitive):
- **positive** - for positive sentiments
- **negative** - for negative sentiments
- **neutral** - for neutral sentiments

### Steps to Analyze Your Data

1. **Prepare your CSV** with the columns above
2. **Run the app**: `npm start`
3. **Upload the file** through the web interface
4. **View analytics** automatically generated from your data

### Alternative: Import Directly (For Developers)

If you want to load a default dataset on app start:
1. Check the browser console for error messages
2. Verify your CSV format matches the required structure
3. Ensure there are no extra blank rows at the end of your CSV
4. Make sure the file encoding is UTF-8
