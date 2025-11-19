#!/bin/bash

# Clean build artifacts and dependencies

echo "🧹 Cleaning project..."

# Remove build artifacts
rm -rf .next
rm -rf out
rm -rf dist
rm -rf build

# Remove test coverage
rm -rf coverage

# Remove dependency directories
rm -rf node_modules

# Remove lock files
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml

# Remove cache
rm -rf .turbo
rm -rf .cache

echo "✅ Project cleaned successfully"

