#!/bin/bash
mkdir -p diagnostics
REPORT="diagnostics/dashboard_diagnostics_report.txt"

echo "==== Starting Dashboard Error Diagnosis ====" | tee "$REPORT"

# Use local binaries instead of system-wide
TSC="npx tsc"
ESLINT="npx eslint"

# Ensure TypeScript + ESLint exist
$TSC --version >/dev/null 2>&1 || { echo "❌ TypeScript not installed. Run: npm install typescript --save-dev"; exit 1; }
$ESLINT -v >/dev/null 2>&1 || { echo "❌ ESLint not installed. Run: npm install eslint --save-dev"; exit 1; }

# Only check Dashboard files
for file in $(find src/pages/Dashboard -type f -name "*.tsx"); do
  echo "---- Checking $file ----" | tee -a "$REPORT"
  
  echo "Running TypeScript check..." | tee -a "$REPORT"
  $TSC --noEmit --pretty "$file" >> "$REPORT" 2>&1
  
  echo "Running ESLint check..." | tee -a "$REPORT"
  $ESLINT --format=unix "$file" >> "$REPORT" 2>&1
  
  echo "Done ✅" | tee -a "$REPORT"
  echo "" | tee -a "$REPORT"
done

echo "==== Dashboard Error Diagnosis Complete ====" | tee -a "$REPORT"
