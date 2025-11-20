#!/bin/bash
# Update version across all package files

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./update-version.sh <version>"
  exit 1
fi

echo "Updating version to $VERSION..."

# Update package.json
npm version "$VERSION" --no-git-tag-version

echo "✅ Version updated to $VERSION"

