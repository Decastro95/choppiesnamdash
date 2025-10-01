cat <<'EOF' > check_project.sh
#!/bin/bash

echo "==== Checking Project Setup for choppiesnamdash ===="

# 1. Node version
echo -n "Node version: "
node -v

# 2. npm version
echo -n "npm version: "
npm -v

# 3. package.json
[ -f package.json ] && echo "package.json found ✅" || echo "package.json not found ❌"

# 4. Vite
if npm list vite &>/dev/null; then echo "Vite installed ✅"; else echo "Vite not installed ❌"; fi

# 5. Supabase client
[ -f src/supabaseClient.ts ] && echo "Supabase client found ✅" || echo "Supabase client not found ❌"

# 6. Types
[ -d src/types ] && echo "Types folder exists ✅" || echo "Types folder missing ❌"

# 7. Pages
[ -d src/pages ] && echo "Pages folder exists ✅" || echo "Pages folder missing ❌"

# 8. Components
[ -d src/components ] && echo "Components folder exists ✅" || echo "Components folder missing ❌"

# 9. Env variables
if [[ -z "$SUPABASE_URL" || -z "$SUPABASE_ANON_KEY" ]]; then
  echo "Supabase env vars not set ❌"
else
  echo "Supabase env vars set ✅"

  if command -v supabase &>/dev/null; then
    echo "Supabase CLI installed ✅"
  else
    echo "Supabase CLI not installed ❌"
  fi

  # Tables to check
  echo "Checking essential tables..."
  TABLES=("users" "shops" "roles" "products" "sales" "returns" "damaged_goods")
  for table in "${TABLES[@]}"; do
    RESULT=$(npx supabase query "SELECT to_regclass('public.$table');" 2>/dev/null)
    if [[ $RESULT == *"$table"* ]]; then
      echo "Table '$table' exists ✅"
    else
      echo "Table '$table' missing ❌ — creating..."
      case $table in
        users)
          npx supabase query "CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            shop_id UUID,
            role_id UUID,
            email TEXT UNIQUE,
            password TEXT,
            created_at TIMESTAMP DEFAULT now()
          );";;
        shops)
          npx supabase query "CREATE TABLE IF NOT EXISTS shops (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT,
            location TEXT,
            created_at TIMESTAMP DEFAULT now()
          );";;
        roles)
          npx supabase query "CREATE TABLE IF NOT EXISTS roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT now()
          );";;
        products)
          npx supabase query "CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            product_code TEXT UNIQUE,
            product_name TEXT,
            category TEXT,
            price NUMERIC(10,2),
            stock INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT now()
          );";;
        sales)
          npx supabase query "CREATE TABLE IF NOT EXISTS sales (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            product_id UUID REFERENCES products(id),
            quantity INT,
            total NUMERIC(10,2),
            sale_date TIMESTAMP DEFAULT now()
          );";;
        returns)
          npx supabase query "CREATE TABLE IF NOT EXISTS returns (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            sale_id UUID REFERENCES sales(id),
            reason TEXT,
            return_date TIMESTAMP DEFAULT now()
          );";;
        damaged_goods)
          npx supabase query "CREATE TABLE IF NOT EXISTS damaged_goods (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            product_id UUID REFERENCES products(id),
            quantity INT,
            reason TEXT,
            report_date TIMESTAMP DEFAULT now()
          );";;
      esac
    fi
  done

  # Seeding
  echo "Seeding initial data..."

  # Roles
  ROLE_COUNT=$(npx supabase query "SELECT COUNT(*) FROM roles;" | grep -o '[0-9]\+')
  if [ "$ROLE_COUNT" == "0" ]; then
    npx supabase query "INSERT INTO roles (name) VALUES
      ('Admin'), ('Manager'), ('Cashier'), ('Supplier'), ('Viewer');"
    echo "Seeded roles ✅"
  fi

  # Shops
  SHOP_COUNT=$(npx supabase query "SELECT COUNT(*) FROM shops;" | grep -o '[0-9]\+')
  if [ "$SHOP_COUNT" == "0" ]; then
    npx supabase query "INSERT INTO shops (name, location) VALUES
      ('Choppies Omuthiya','Omuthiya Main Branch');"
    echo "Seeded shop ✅"
  fi

  # Users
  USER_COUNT=$(npx supabase query "SELECT COUNT(*) FROM users;" | grep -o '[0-9]\+')
  if [ "$USER_COUNT" == "0" ]; then
    npx supabase query "INSERT INTO users (shop_id, role_id, email, password)
      SELECT s.id, r.id, 'admin@choppies.co.na', 'password123'
      FROM shops s, roles r
      WHERE s.name='Choppies Omuthiya' AND r.name='Admin'
      LIMIT 1;"
    echo "Seeded admin user ✅"
  fi

  # Products
  PRODUCT_COUNT=$(npx supabase query "SELECT COUNT(*) FROM products;" | grep -o '[0-9]\+')
  if [ "$PRODUCT_COUNT" == "0" ]; then
    npx supabase query "INSERT INTO products (product_code, product_name, category, price, stock) VALUES
      ('P0001','White Bread','Bread and Cereals',10.50,100),
      ('P0002','Wholegrain Bread','Bread and Cereals',12.00,80),
      ('P0003','Rye Bread','Bread and Cereals',11.75,60),
      ('P0004','Oats 1kg','Bread and Cereals',25.00,50),
      ('P0005','Rice 5kg','Bread and Cereals',75.00,40);"
    echo "Seeded products ✅"
  fi

  # Sales
  SALE_COUNT=$(npx supabase query "SELECT COUNT(*) FROM sales;" | grep -o '[0-9]\+')
  if [ "$SALE_COUNT" == "0" ]; then
    npx supabase query "INSERT INTO sales (product_id, quantity, total)
      SELECT id, 2, 21.00 FROM products WHERE product_code='P0001' LIMIT 1;
      INSERT INTO sales (product_id, quantity, total)
      SELECT id, 1, 12.00 FROM products WHERE product_code='P0002' LIMIT 1;
      INSERT INTO sales (product_id, quantity, total)
      SELECT id, 3, 75.00 FROM products WHERE product_code='P0005' LIMIT 1;"
    echo "Seeded sales ✅"
  fi

  # Returns
  RETURN_COUNT=$(npx supabase query "SELECT COUNT(*) FROM returns;" | grep -o '[0-9]\+')
  if [ "$RETURN_COUNT" == "0" ]; then
    SALE_ID=$(npx supabase query "SELECT id FROM sales LIMIT 1;" | grep -Eo '[0-9a-f-]{36}' | head -1)
    if [ -n "$SALE_ID" ]; then
      npx supabase query "INSERT INTO returns (sale_id, reason) VALUES
        ('$SALE_ID', 'Expired product');"
      echo "Seeded returns ✅"
    fi
  fi

  # Damaged goods
  DMG_COUNT=$(npx supabase query "SELECT COUNT(*) FROM damaged_goods;" | grep -o '[0-9]\+')
  if [ "$DMG_COUNT" == "0" ]; then
    PROD_ID=$(npx supabase query "SELECT id FROM products WHERE product_code='P0003' LIMIT 1;" | grep -Eo '[0-9a-f-]{36}')
    if [ -n "$PROD_ID" ]; then
      npx supabase query "INSERT INTO damaged_goods (product_id, quantity, reason) VALUES
        ('$PROD_ID', 5, 'Damaged during transport');"
      echo "Seeded damaged goods ✅"
    fi
  fi
fi

echo "Try running 'npm run dev' to verify Vite dev server works."
echo "==== Project Check Complete ===="
EOF
