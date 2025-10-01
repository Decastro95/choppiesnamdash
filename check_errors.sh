#!/bin/bash

echo "==== Checking for Common Project Errors in choppiesnamdash ===="

# 1. Run npm install check
echo "Checking npm install..."
npm install &>/dev/null
if [ $? -eq 0 ]; then
  echo "npm install successful ✅"
else
  echo "npm install failed ❌"
fi

# 2. Check for TypeScript errors
if [ -f tsconfig.json ]; then
  echo "Checking TypeScript compilation..."
  npx tsc --noEmit &> ts_errors.log
  if [ $? -eq 0 ]; then
    echo "No TypeScript errors ✅"
  else
    echo "TypeScript errors found ❌ (see ts_errors.log)"
  fi
else
  echo "No tsconfig.json found (skipping TS check)"
fi

# 3. Check for Vite build errors
echo "Checking Vite build..."
npx vite build &> vite_build.log
if [ $? -eq 0 ]; then
  echo "Vite build successful ✅"
else
  echo "Vite build failed ❌ (see vite_build.log)"
fi

# 4. Check environment variables
if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
  echo "Supabase environment variables not set ❌"
else
  echo "Supabase environment variables set ✅"
fi

echo "==== Error Check Complete ===="
