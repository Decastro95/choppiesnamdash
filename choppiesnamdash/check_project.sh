#!/bin/bash

echo "==== Checking Project Setup for choppiesnamdash ===="

# 1. Check Node version
echo -n "Node version: "
node -v

# 2. Check npm version
echo -n "npm version: "
npm -v

# 3. Check if package.json exists
if [ -f package.json ]; then
  echo "package.json found ✅"
else
  echo "package.json not found ❌"
fi

# 4. Check if Vite is installed
if npm list vite &>/dev/null; then
  echo "Vite installed ✅"
else
  echo "Vite not installed ❌"
fi

# 5. Check if Supabase client exists
if [ -f src/supabaseClient.ts ]; then
  echo "Supabase client found ✅"
else
  echo "Supabase client not found ❌"
fi

# 6. Check if types folder exists
if [ -d src/types ]; then
  echo "Types folder exists ✅"
else
  echo "Types folder missing ❌"
fi

# 7. Check pages folder
if [ -d src/pages ]; then
  echo "Pages folder exists ✅"
else
  echo "Pages folder missing ❌"
fi

# 8. Check components folder
if [ -d src/components ]; then
  echo "Components folder exists ✅"
else
  echo "Components folder missing ❌"
fi

# 9. Check Supabase environment variables
if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
  echo "Supabase environment variables not set ❌"
  echo "Set SUPABASE_URL and SUPABASE_ANON_KEY in your Codespace environment"
else
  echo "Supabase environment variables set ✅"

  # 10. Check Supabase connection and tables
  echo "Checking Supabase connection..."
  npx supabase db remote list &>/dev/null
  if [ $? -eq 0 ]; then
    echo "Supabase CLI connected ✅"
  else
    echo "Supabase CLI not connected ❌"
  fi

  # Optional: check if key tables exist
  echo "Checking essential tables..."
  TABLES=("users" "shops" "roles" "products" "sales" "returns")
  for table in "${TABLES[@]}"; do
    RESULT=$(npx supabase query "SELECT to_regclass('public.$table');" 2>/dev/null)
    if [[ $RESULT == *"$table"* ]]; then
      echo "Table '$table' exists ✅"
    else
      echo "Table '$table' missing ❌"
    fi
  done
fi

# 11. Reminder to run dev server
echo "Try running 'npm run dev' to verify Vite dev server works."

echo "==== Project Check Complete ===="
