-- ============================================
-- SHOPS
-- ============================================
INSERT INTO shops (name, location, phone, email)
VALUES
('Choppies Omuthiya', 'Omuthiya', '0812345678', 'omuthiya@choppies.co.na'),
('Choppies Rosh Pinah', 'Rosh Pinah', '0812345679', 'pinah@choppies.co.na'),
('Choppies Delhi', 'Delhi', '0812345680', 'delhi@choppies.co.na')
ON CONFLICT(name) DO NOTHING;

-- ============================================
-- ROLES
-- ============================================
INSERT INTO roles (name)
VALUES
('Admin'),
('Manager'),
('Cashier'),
('CEO'),
('Supplier')
ON CONFLICT(name) DO NOTHING;

-- ============================================
-- USERS
-- ============================================
INSERT INTO users (shop_id, role_id, email, password)
SELECT s.id, r.id, u.email, 'password123'
FROM (
  VALUES
    ('Choppies Omuthiya','Manager','manager.omuthiya@choppies.co.na'),
    ('Choppies Omuthiya','Admin','admin.omuthiya@choppies.co.na'),
    ('Choppies Omuthiya','Cashier','cashier.omuthiya@choppies.co.na'),
    ('Choppies Rosh Pinah','Manager','manager.pinah@choppies.co.na'),
    ('Choppies Rosh Pinah','Admin','admin.pinah@choppies.co.na'),
    ('Choppies Rosh Pinah','Cashier','cashier.pinah@choppies.co.na'),
    ('Choppies Delhi','Manager','manager.delhi@choppies.co.na'),
    ('Choppies Delhi','Admin','admin.delhi@choppies.co.na'),
    ('Choppies Delhi','Cashier','cashier.delhi@choppies.co.na')
) AS u(shop_name, role_name, email)
JOIN shops s ON s.name = u.shop_name
JOIN roles r ON r.name = u.role_name
ON CONFLICT(email) DO NOTHING;

-- ============================================
-- PRODUCTS
-- ============================================
INSERT INTO products (product_name, category, price, vat_rate, zero_rated)
VALUES
('White Bread', 'Bread and Cereals', 15.0, 0.15, false),
('Wholegrain Bread', 'Bread and Cereals', 18.0, 0.15, false),
('Rye Bread', 'Bread and Cereals', 20.0, 0.15, false),
('Oats', 'Bread and Cereals', 25.0, 0.15, false),
('Rice', 'Bread and Cereals', 30.0, 0.15, false),
('Plastic Bag', 'Bag Levy', 1.0, 0.0, true)
ON CONFLICT(product_name) DO NOTHING;

-- ============================================
-- SALES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- RETURNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS returns (
  id SERIAL PRIMARY KEY,
  sale_id INT REFERENCES sales(id),
  reason TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- INVENTORY TRIGGERS
-- ============================================
-- Decrease stock after sale
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_decrease_stock') THEN
        CREATE OR REPLACE FUNCTION decrease_product_quantity()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE products
            SET quantity = quantity - NEW.quantity
            WHERE id = NEW.product_id;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER trg_decrease_stock
        AFTER INSERT ON sales
        FOR EACH ROW
        EXECUTE FUNCTION decrease_product_quantity();
    END IF;
END $$;

-- Increase stock after return
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_increase_stock') THEN
        CREATE OR REPLACE FUNCTION increase_product_quantity()
        RETURNS TRIGGER AS $$
        BEGIN
            UPDATE products
            SET quantity = quantity + (SELECT quantity FROM sales WHERE id = NEW.sale_id)
            WHERE id = (SELECT product_id FROM sales WHERE id = NEW.sale_id);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER trg_increase_stock
        AFTER INSERT ON returns
        FOR EACH ROW
        EXECUTE FUNCTION increase_product_quantity();
    END IF;
END $$;
