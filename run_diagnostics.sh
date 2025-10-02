#!/usr/bin/env bash
set -euo pipefail
mkdir -p diagnostics

echo "==== Diagnostics run at $(date) ====" | tee diagnostics/summary.txt

# load .env into environment (if present)
if [ -f .env ]; then
  echo "Loading .env into environment for this run"
  set -a
  . .env
  set +a
else
  echo ".env not found — continuing without loading" | tee -a diagnostics/summary.txt
fi

# 1) TypeScript check
echo "=== TypeScript (tsc --noEmit) ===" | tee diagnostics/tsc.txt
if npx -y tsc --noEmit 2>&1 | tee -a diagnostics/tsc.txt; then
  echo "TypeScript: OK" | tee -a diagnostics/summary.txt
else
  echo "TypeScript: ERRORS (see diagnostics/tsc.txt)" | tee -a diagnostics/summary.txt
fi

# 2) ESLint (if configured)
echo -e "\n=== ESLint ===" | tee diagnostics/eslint.txt
if npx -y eslint -v >/dev/null 2>&1; then
  npx -y eslint "src/**/*.{ts,tsx,js,jsx}" --format unix 2>&1 | tee diagnostics/eslint.txt || true
  echo "ESLint saved: diagnostics/eslint.txt" | tee -a diagnostics/summary.txt
else
  echo "ESLint not installed or not configured — skipped" | tee -a diagnostics/summary.txt
fi

# 3) Import resolution checker (custom)
echo -e "\n=== Import resolution checker (scripts/check_imports.js) ===" | tee diagnostics/imports.txt
node scripts/check_imports.js 2>&1 | tee diagnostics/imports.txt || true
if grep -q "Missing relative imports detected" diagnostics/imports.txt 2>/dev/null; then
  echo "Import checker: MISSING IMPORTS (see diagnostics/imports.txt)" | tee -a diagnostics/summary.txt
else
  echo "Import checker: OK" | tee -a diagnostics/summary.txt
fi

# 4) Vite build (optional) — only if VITE_SUPABASE_URL is set
echo -e "\n=== Vite build (optional) ===" | tee diagnostics/vite_build.txt
if [ -n "${VITE_SUPABASE_URL:-}" ] || [ -n "${SUPABASE_URL:-}" ]; then
  echo "Supabase URL set — attempting vite build (may fail if environment incomplete)" | tee -a diagnostics/vite_build.txt
  if npx -y vite build 2>&1 | tee -a diagnostics/vite_build.txt; then
    echo "Vite build: OK" | tee -a diagnostics/summary.txt
  else
    echo "Vite build: FAILED (see diagnostics/vite_build.txt)" | tee -a diagnostics/summary.txt
  fi
else
  echo "SUPABASE env not set — skipping vite build step" | tee -a diagnostics/summary.txt
fi

echo -e "\nDiagnostics complete. Summary:" | tee -a diagnostics/summary.txt
cat diagnostics/summary.txt

echo -e "\nAll logs are in the diagnostics/ folder."
