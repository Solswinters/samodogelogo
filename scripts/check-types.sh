#!/bin/bash

# Type checking script

echo "🔍 Checking TypeScript types..."

# Run TypeScript compiler in check mode
npx tsc --noEmit

if [ $? -eq 0 ]; then
  echo "✅ Type checking passed"
  exit 0
else
  echo "❌ Type checking failed"
  exit 1
fi

