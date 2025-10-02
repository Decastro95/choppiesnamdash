#!/bin/bash
mkdir -p diagnostics
REPORT="diagnostics/error_diagnostics_report.txt"

echo "==== Starting Full File-by-File Error Diagnosis ====" | tee "$REPORT"

# Ensure TypeScript + ESLint exist
if ! command -v tsc &> /dev/null; then
  echo "TypeScript (tsc) not found ❌. Run: npm install typescript --save-dev" | tee -a "$REPORT"
  exit 1
fi

if ! command -v eslint &> /dev/null; then
  echo "ESLint not found ❌. Run: npm install eslint --save-dev" | tee -a "$REPORT"
  exit 1
fi

# Loop through all .ts and .tsx files
for file in $(find src -type f \( -name "*.ts" -o -name "*.tsx" \)); do
  echo "---- Checking $file ----" | tee -a "$REPORT"
  
  echo "Running TypeScript check..." | tee -a "$REPORT"
  npx tsc --noEmit --pretty "$file" >> "$REPORT" 2>&1
  
  echo "Running ESLint check..." | tee -a "$REPORT"
  npx eslint "$file" >> "$REPORT" 2>&1 || echo "⚠️ ESLint found issues in $file" | tee -a "$REPORT"
  
  echo "Done ✅" | tee -a "$REPORT"
  echo "" | tee -a "$REPORT"
done

# Import resolution check
echo "=== Import Resolution Check ===" | tee -a "$REPORT"
node scripts/check_imports.js >> diagnostics/imports_report.txt 2>&1
if [ $? -eq 0 ]; then
  echo "Import check: OK ✅" | tee -a "$REPORT"
else
  echo "Import check: Issues found ❌ (see diagnostics/imports_report.txt)" | tee -a "$REPORT"
fi

# Vite build test
echo "=== Vite Build Test ===" | tee -a "$REPORT"
npm run build >> diagnostics/vite_build.log 2>&1
if [ $? -eq 0 ]; then
  echo "Vite build: OK ✅" | tee -a "$REPORT"
else
  echo "Vite build: FAILED ❌ (see diagnostics/vite_build.log)" | tee -a "$REPORT"
fi

echo "==== Error Diagnosis Complete ====" | tee -a "$REPORT"
