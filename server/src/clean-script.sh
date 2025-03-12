#!/bin/bash
# clean.sh - Script to clean TypeScript build caches

echo "🧹 Cleaning project caches..."

# Remove TypeScript cache
if [ -d "./.cache" ]; then
  echo "Removing .cache directory..."
  rm -rf ./.cache
fi

# Remove node_modules/.cache
if [ -d "./node_modules/.cache" ]; then
  echo "Removing node_modules/.cache directory..."
  rm -rf ./node_modules/.cache
fi

# Remove dist or build directories if they exist
if [ -d "./dist" ]; then
  echo "Removing dist directory..."
  rm -rf ./dist
fi

if [ -d "./build" ]; then
  echo "Removing build directory..."
  rm -rf ./build
fi

# Remove any TypeScript build info files
find . -name "*.tsbuildinfo" -type f -delete
echo "Removed all .tsbuildinfo files"

echo "✅ Clean completed successfully!"
echo "Run 'npm install' to ensure dependencies are up to date."
