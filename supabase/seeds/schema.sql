-- ==============================================
-- DASHBOARD DATABASE SCHEMA
-- ==============================================

-- 1️⃣ USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'ceo', 'manager', 'supplier', 'cashier')),
  password_hash TEXT, -- optional if handled externally by Supabase Auth
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2️⃣ ACTIVITY LOG
CREATE TABLE IF NOT EXISTS activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3️⃣ PRODUCTS (shared between supplier/manager/admin)
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  quantity INT DEFAULT 0 CHECK (quantity >= 0),
  price NUMERIC(10,2) DEFAULT 0.00,
  supplier_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4️⃣ SALES (cashier dashboard)
CREATE TABLE IF NOT EXISTS sales (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL CHECK (quantity > 0),
  total NUMERIC(10,2) GENERATED ALWAYS AS (quantity * (SELECT price FROM products WHERE products.id = sales.product_id)) STORED,
  cashier_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5️⃣ SUPPLIER DELIVERIES
CREATE TABLE IF NOT EXISTS deliveries (
  id BIGSERIAL PRIMARY KEY,
  supplier_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity_delivered INT CHECK (quantity_delivered > 0),
  delivery_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6️⃣ ROLE VIEW (for convenience)
CREATE VIEW user_roles AS
SELECT id AS user_id, role
FROM users;

-- ==============================================
-- SEED DATA (for testing dashboards)
-- ==============================================

INSERT INTO users (email, full_name, role)
VALUES
('admin@company.com', 'Admin User', 'admin'),
('ceo@company.com', 'CEO', 'ceo'),
('manager@company.com', 'Manager One', 'manager'),
('supplier@company.com', 'Supplier One', 'supplier'),
('cashier@company.com', 'Cashier One', 'cashier')
ON CONFLICT (email) DO NOTHING;

-- Example products
INSERT INTO products (name, category, quantity, price)
VALUES
('Rice 25kg', 'Groceries', 50, 20.00),
('Cooking Oil 5L', 'Groceries', 100, 10.50),
('Soap Bar', 'Household', 200, 1.75)
ON CONFLICT DO NOTHING;

-- Example activity log
INSERT INTO activity_log (user_id, action)
SELECT id, 'Initial system seed'
FROM users
LIMIT 5;
