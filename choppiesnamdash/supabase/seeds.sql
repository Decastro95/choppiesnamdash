-- Reset schema
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- ======================
-- TABLES
-- ======================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE shops (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    phone TEXT,
    email TEXT
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    shop_id INT REFERENCES shops(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    expiration_days INT,
    damage_status TEXT
);

-- ======================
-- SEED ROLES
-- ======================
INSERT INTO roles (name) VALUES 
('Admin'), ('Manager'), ('Cashier')
ON CONFLICT (name) DO NOTHING;

-- ======================
-- SEED SHOPS
-- ======================
INSERT INTO shops (name, location, phone, email) VALUES
('Choppies Omuthiya','Shop No:5, Omuthiya Shopping Centre, Erf 77, Main Street, Omuthiya','264814000000','omuthiya@choppies.co.na'),
('Choppies Rosh Pinah','Shop 1, Rosh Pinah Shopping Centre, 174 Lood street, Rosh Pinah','264815000000','roshpinah@choppies.co.na')
ON CONFLICT (name) DO NOTHING;

-- ======================
-- SEED USERS
-- ======================
INSERT INTO users (shop_id, role_id, email, password)
SELECT s.id, r.id, u.email, 'password123'
FROM (
  VALUES
    ('Choppies Omuthiya','manager.omuthiya@choppies.co.na','Manager'),
    ('Choppies Omuthiya','admin.omuthiya@choppies.co.na','Admin'),
    ('Choppies Omuthiya','cashier.omuthiya@choppies.co.na','Cashier'),
    ('Choppies Rosh Pinah','manager.pinah@choppies.co.na','Manager'),
    ('Choppies Rosh Pinah','admin.pinah@choppies.co.na','Admin'),
    ('Choppies Rosh Pinah','cashier.pinah@choppies.co.na','Cashier')
) AS u(shop_name,email,role_name)
JOIN shops s ON s.name = u.shop_name
JOIN roles r ON r.name = u.role_name
ON CONFLICT DO NOTHING;

-- ======================
-- SEED CATEGORIES & PRODUCTS (example)
-- ======================
INSERT INTO categories (name) VALUES
('Bread and Cereals'),
('Meat')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (product_id, name, category_id, expiration_days, damage_status) VALUES
('P0001', 'White Bread', (SELECT id FROM categories WHERE name='Bread and Cereals'), 7, NULL),
('P0017', 'Beef', (SELECT id FROM categories WHERE name='Meat'), 3, 'Fresh')
ON CONFLICT (product_id) DO NOTHING;
