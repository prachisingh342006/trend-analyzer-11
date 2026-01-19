#!/bin/bash

# Social Media Trend Predictor - Quick Deploy Script
# This script helps you deploy to GitHub and Vercel

echo "🚀 Social Media Trend Predictor - Deployment Helper"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the project root."
    exit 1
fi

echo "📦 Current project status:"
echo "Repository: https://github.com/prachisingh342006/trend-analyzer-11.git"
echo ""

# Check git status
echo "📊 Checking git status..."
git status --short
echo ""

# Offer to push to GitHub
echo "Would you like to push to GitHub? (You'll need to authenticate first)"
echo "Choose authentication method:"
echo "1) GitHub CLI (gh auth login)"
echo "2) Personal Access Token"
echo "3) SSH Key"
echo "4) Skip GitHub push"
read -p "Enter choice (1-4): " auth_choice

case $auth_choice in
    1)
        echo "🔐 Authenticating with GitHub CLI..."
        if ! command -v gh &> /dev/null; then
            echo "Installing GitHub CLI..."
            brew install gh
        fi
        gh auth login
        echo "📤 Pushing to GitHub..."
        git push -u origin main
        ;;
    2)
        echo "🔑 Enter your Personal Access Token:"
        read -s token
        echo "📤 Pushing to GitHub..."
        git push https://${token}@github.com/prachisingh342006/trend-analyzer-11.git main
        ;;
    3)
        echo "🔐 Using SSH..."
        git remote set-url origin git@github.com:prachisingh342006/trend-analyzer-11.git
        echo "📤 Pushing to GitHub..."
        git push -u origin main
        ;;
    4)
        echo "⏭️  Skipping GitHub push..."
        ;;
esac

echo ""
echo "✅ GitHub setup complete!"
echo ""

# Offer to deploy to Vercel
read -p "Would you like to deploy to Vercel now? (y/n): " deploy_vercel

if [ "$deploy_vercel" = "y" ] || [ "$deploy_vercel" = "Y" ]; then
    echo "🚀 Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI..."
        npm i -g vercel
    fi
    
    echo "🔐 You may need to login to Vercel..."
    vercel login
    
    echo "🚀 Deploying..."
    vercel --prod
    
    echo ""
    echo "✅ Deployment complete!"
    echo "🌐 Your app should be live at: https://trend-analyzer-11.vercel.app"
else
    echo "⏭️  Skipping Vercel deployment."
    echo "💡 You can deploy later with: vercel --prod"
fi

echo ""
echo "=================================================="
echo "✨ All done! Your Social Media Trend Predictor is ready!"
echo ""
echo "📚 Useful commands:"
echo "  npm start          - Run locally"
echo "  npm run build      - Build for production"
echo "  vercel --prod      - Deploy to Vercel"
echo "  git push           - Push updates to GitHub"
echo ""
echo "🔗 Repository: https://github.com/prachisingh342006/trend-analyzer-11"
echo "=================================================="
