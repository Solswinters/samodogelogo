#!/bin/bash

# Bundle analysis script

echo "📦 Analyzing bundle size..."

# Build with bundle analyzer
ANALYZE=true npm run build

echo "✅ Bundle analysis complete"
echo "📊 Check your browser for the bundle visualization"

