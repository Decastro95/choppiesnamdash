#!/bin/bash
echo "==== Checking Dashboard Imports ===="

# Dashboard path
DASHBOARD_DIR="src/pages/Dashboard"

# Ensure the directory exists
if [ ! -d "$DASHBOARD_DIR" ]; then
  echo "❌ ERROR: $DASHBOARD_DIR not found!"
  exit 1
fi

# Expected dashboards
dashboards=("AdminDashboard" "ManagerDashboard" "CashierDashboard" "CEODashboard" "SupplierDashboard")

# 1. Check that all files exist
echo "---- Verifying Dashboard Files ----"
for db in "${dashboards[@]}"; do
  if [ ! -f "$DASHBOARD_DIR/$db.tsx" ]; then
    echo "❌ Missing file: $DASHBOARD_DIR/$db.tsx"
  else
    echo "✅ Found: $DASHBOARD_DIR/$db.tsx"
  fi
done

# 2. Scan imports across the project
echo "---- Scanning Imports ----"
for db in "${dashboards[@]}"; do
  grep -rnw "src" -e "$db" --include=\*.{ts,tsx} | while read -r line ; do
    echo "🔎 Found import for $db → $line"
    # Verify the file exists
    if [ ! -f "$DASHBOARD_DIR/$db.tsx" ]; then
      echo "   ❌ ERROR: File missing for $db.tsx"
    fi
  done
done

echo "==== Import Check Complete ===="
