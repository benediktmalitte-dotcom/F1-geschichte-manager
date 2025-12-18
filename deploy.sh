#!/bin/bash

# F1 Manager - Google Cloud Deployment Script
# This script helps you deploy the application to Google Cloud

set -e

echo "🏎️  F1 Manager - Google Cloud Deployment"
echo "========================================"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed."
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo "✅ gcloud CLI found"

# Check if user is logged in
ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null)
if [ -z "$ACTIVE_ACCOUNT" ]; then
    echo "⚠️  You need to login to Google Cloud"
    gcloud auth login
fi

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo "⚠️  No project selected. Please select or create a project:"
    gcloud projects list
    read -p "Enter your project ID: " PROJECT_ID
    gcloud config set project $PROJECT_ID
fi

echo "📦 Project: $PROJECT_ID"
echo ""

# Ask for deployment method
echo "Choose deployment method:"
echo "1) Google Cloud Run (Recommended - Serverless, automatic scaling)"
echo "2) Google App Engine (Simple, managed platform)"
echo ""
read -p "Enter your choice (1 or 2): " DEPLOY_METHOD

if [ "$DEPLOY_METHOD" == "1" ]; then
    echo ""
    echo "🚀 Deploying to Cloud Run..."
    echo ""
    
    # Enable required APIs
    echo "Enabling required APIs..."
    gcloud services enable run.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    
    # Build and deploy
    echo "Building and deploying..."
    gcloud builds submit --config=cloudbuild.yaml
    
    echo ""
    echo "✅ Deployment complete!"
    echo "Your app should be available at:"
    gcloud run services describe f1-manager --region=europe-west1 --format='value(status.url)'
    
elif [ "$DEPLOY_METHOD" == "2" ]; then
    echo ""
    echo "🚀 Deploying to App Engine..."
    echo ""
    
    # Build the application first
    echo "Building application..."
    npm install
    npm run build
    
    # Deploy to App Engine
    echo "Deploying to App Engine..."
    gcloud app deploy app.yaml --quiet
    
    echo ""
    echo "✅ Deployment complete!"
    echo "Your app should be available at:"
    echo "https://$PROJECT_ID.appspot.com"
    
else
    echo "❌ Invalid choice. Please run the script again."
    exit 1
fi

echo ""
echo "🎉 Deployment finished successfully!"
