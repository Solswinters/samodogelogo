#!/bin/bash

# Pre-commit checks

set -e

echo "Running pre-commit checks..."

# Type check
echo "📝 Type checking..."
npm run type-check

# Lint
echo "🔍 Linting..."
npm run lint

# Format check
echo "💅 Format checking..."
npm run format:check

# Unit tests
echo "🧪 Running tests..."
npm test -- --bail --findRelatedTests

echo "✅ All pre-commit checks passed"

