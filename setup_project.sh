#!/bin/bash

LOG_FILE="project_setup.log"
echo "==== Starting Full Project Setup ====" | tee $LOG_FILE

# 1️⃣ Node version
echo -n "Node version: " | tee -a $LOG_FILE
node -v | tee -a $LOG_FILE

# 2️⃣ npm version
echo -n "npm version: " | tee -a $LOG_FILE
npm -v | tee -a $LOG_FILE

# 3️⃣ Check package.json
if [ -f package.json ]; then
  echo "package.json found ✅" | tee -a $LOG_FILE
else
  echo "package.json not found ❌" | tee -a $LOG_FILE
fi

# 4️⃣ Install dependencies
echo "Running npm install..." | tee -a $LOG_FILE
npm install | tee -a $LOG_FILE

# 5️⃣ Check Vite
if npm list vite &>/dev/null; then
  echo "Vite installed ✅" | tee -a $LOG_FILE
else
  echo "Vite not installed ❌" | tee -a $LOG_FILE
fi

# 6️⃣ Check Supabase client
if [ -f src/supabaseClient.ts ]; then
  echo "Supabase client found ✅" | tee -a $LOG_FILE
else
  echo "Supabase client not found ❌" | tee -a $LOG_FILE
fi

# 7️⃣ Check types folder
if [ -d src/types ]; then
  echo "Types folder exists ✅" | tee -a $LOG_FILE
else
  echo "Types folder missing ❌" | tee -a $LOG_FILE
fi

# 8️⃣ Check pages and components folders
for folder in "src/pages" "src/components"; do
  if [ -d "$folder" ]; then
    echo "$folder exists ✅" | tee -a $LOG_FILE
  else
    echo "$folder missing ❌" | tee -a $LOG_FILE
  fi
done

# 9️⃣ Load Supabase project ref from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [[ -z "$SUPABASE_URL" ]]; then
  echo "SUPABASE_URL not set ❌" | tee -a $LOG_FILE
else
  echo "SUPABASE_URL found ✅" | tee -a $LOG_FILE
fi

if [[ -z "$SUPABASE_ANON_KEY" ]]; then
  echo "SUPABASE_ANON_KEY not set ❌" | tee -a $LOG_FILE
else
  echo "SUPABASE_ANON_KEY found ✅" | tee -a $LOG_FILE
fi

# Extract project ref automatically from SUPABASE_URL
PROJECT_REF=$(echo $SUPABASE_URL | awk -F[/:.] '{print $(4)}')
if [[ -n "$PROJECT_REF" ]]; then
  echo "Detected Supabase project ref: $PROJECT_REF ✅" | tee -a $LOG_FILE
else
  echo "Could not detect project ref ❌" | tee -a $LOG_FILE
fi

# 🔟 Supabase types generation
if [[ -n "$PROJECT_REF" && -n "$SUPABASE_ANON_KEY" ]]; then
  echo "Generating Supabase types..." | tee -a $LOG_FILE
  npx supabase gen types typescript --project-id $PROJECT_REF > src/types/supabase.ts 2>> $LOG_FILE
fi

# 1️⃣1️⃣ Fix inventory triggers
echo "Checking inventory triggers..." | tee -a $LOG_FILE

TRIGGERS=("trg_increase_stock" "trg_decrease_stock")
TABLES=("sales" "returns")

for trigger in "${TRIGGERS[@]}"; do
  for table in "${TABLES[@]}"; do
    echo "Dropping trigger $trigger on $table if exists..." | tee -a $LOG_FILE
    npx supabase query "DROP TRIGGER IF EXISTS $trigger ON public.$table;" &>> $LOG_FILE || echo "Error dropping $trigger" | tee -a $LOG_FILE
  done
done

echo "Recreating inventory triggers..." | tee -a $LOG_FILE
npx supabase query "
CREATE TRIGGER trg_decrease_stock
AFTER INSERT ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.decrease_stock();
" &>> $LOG_FILE

npx supabase query "
CREATE TRIGGER trg_increase_stock
AFTER INSERT ON public.returns
FOR EACH ROW
EXECUTE FUNCTION public.increase_stock();
" &>> $LOG_FILE

echo "Inventory triggers fixed ✅" | tee -a $LOG_FILE

# 1️⃣2️⃣ Build project
echo "Building Vite project..." | tee -a $LOG_FILE
npm run build 2>&1 | tee -a $LOG_FILE

echo "==== Full Project Setup Complete ====" | tee -a $LOG_FILE
echo "Check $LOG_FILE for details."
