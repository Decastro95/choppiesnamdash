#!/bin/bash
echo "==== Starting Dashboard Diagnostics ===="

# Ensure TypeScript is installed
if ! [ -x "$(command -v tsc)" ]; then
  echo "TypeScript not found ❌. Installing..."
  npm install typescript --save-dev
fi

# Run type checking on all dashboard pages
npx tsc --noEmit --project tsconfig.json --skipLibCheck --pretty

# Custom import resolver check
echo "Checking imports for missing/invalid files..."
node scripts/check_imports.js src/pages/Dashboard

echo "==== Dashboard Diagnostics Complete ===="
