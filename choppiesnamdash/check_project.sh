```bash
#!/bin/bash

REPORT_FILE="project_check_report.txt"

# Redirect stdout and stderr to both terminal and log file
exec > >(tee -a "$REPORT_FILE") 2>&1

echo "==== Checking Project Setup for choppiesnamdash ===="
echo "Report generated: $(date)"
echo "---------------------------------------------------"

# 1. Check Node.js version
echo -n "Node version: "
if command -v node &>/dev/null; then
  node -v
else
  echo "Node not installed ❌"
fi

# 2. Check npm version
echo -n "npm version: "
if command -v npm &>/dev/null; then
  npm -v
else
  echo "npm not installed ❌"
fi

# 3. Check package.json
if [ -f package.json ]; then
  echo "package.json found ✅"
else
  echo "package.json missing ❌"
fi

# 4. Check if Vite is listed in package.json
if grep -q '"vite"' package.json 2>/dev/null; then
  echo "Vite dependency found ✅"
else
  echo "Vite dependency missing ❌"
fi

# 5. Check Supabase client
if [ -f src/supabaseClient.ts ]; then
  echo "Supabase client found ✅"
else
  echo "Supabase client missing ❌"
fi

# 6. Check types folder
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

# 9. Check .env file
if [ -f .env ]; then
  echo ".env file found ✅"
  grep -q "SUPABASE_URL" .env && echo "SUPABASE_URL set ✅" || echo "SUPABASE_URL missing ❌"
  grep -q "SUPABASE_ANON_KEY" .env && echo "SUPABASE_ANON_KEY set ✅" || echo "SUPABASE_ANON_KEY missing ❌"
else
  echo ".env file missing ❌"
fi

# 10. Supabase DB checks (requires psql + SUPABASE_DB_URL in .env)
if [ -n "$SUPABASE_DB_URL" ]; then
  echo "Checking Supabase database connection..."
  if command -v psql &>/dev/null; then
    if PGPASSWORD=$(echo $SUPABASE_DB_URL | sed -E 's/.*:([^@]*)@.*/\1/') \
       psql "$SUPABASE_DB_URL" -c '\q' &>/dev/null; then
      echo "Supabase DB connection ✅"

      # Check essential tables
      TABLES=("users" "shops" "roles" "products" "sales" "returns")
      for table in "${TABLES[@]}"; do
        RESULT=$(psql "$SUPABASE_DB_URL" -tAc "SELECT to_regclass('public.$table');")
        if [[ $RESULT == "public.$table" ]]; then
          echo "Table '$table' exists ✅"
        else
          echo "Table '$table' missing ❌"
        fi
      done

      # Check triggers
      TRIGGERS=("trg_increase_stock" "trg_decrease_stock")
      for trg in "${TRIGGERS[@]}"; do
        RESULT=$(psql "$SUPABASE_DB_URL" -tAc "SELECT tgname FROM pg_trigger WHERE tgname = '$trg';")
        if [[ $RESULT == "$trg" ]]; then
          echo "Trigger '$trg' exists ✅"
        else
          echo "Trigger '$trg' missing ❌"
        fi
      done

      # Check views
      VIEWS=("daily_sales_view" "expiring_goods_view" "damaged_goods_view" "low_stock_view" "sales_summary_view")
      for vw in "${VIEWS[@]}"; do
        RESULT=$(psql "$SUPABASE_DB_URL" -tAc "SELECT to_regclass('public.$vw');")
        if [[ $RESULT == "public.$vw" ]]; then
          echo "View '$vw' exists ✅"
        else
          echo "View '$vw' missing ❌"
        fi
      done

    else
      echo "Failed to connect to Supabase DB ❌"
    fi
  else
    echo "psql command not found ❌ (install PostgreSQL client)"
  fi
else
  echo "SUPABASE_DB_URL not set ❌ (add to .env)"
fi

# 11. Reminder
echo "Try running: npm run dev (Vite should start on port 5173)"
echo "==== Project Check Complete ===="
echo "Full report saved to $REPORT_FILE"
```
