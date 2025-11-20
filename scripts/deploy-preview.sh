#!/bin/bash
# Deploy preview build

set -e

echo "Building preview..."
npm run build

echo "Deploying to preview environment..."
# Add your preview deployment commands here
# e.g., vercel --prod=false

echo "✅ Preview deployed"

