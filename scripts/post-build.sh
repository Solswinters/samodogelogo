#!/bin/bash

# Post-build script

set -e

echo "Running post-build tasks..."

# Generate build info
node scripts/build-info.js

# Optimize images (if needed)
# npm run optimize:images

# Generate sitemap
# npm run generate:sitemap

# Bundle analysis
if [ "$ANALYZE" = "true" ]; then
  npm run analyze
fi

echo "✅ Post-build tasks completed"

