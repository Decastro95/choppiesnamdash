-- Drop if exists for clean resets
DROP TABLE IF EXISTS sales CASCADE;

CREATE TABLE sales (
  id BIGSERIAL PRIMARY KEY,
  product_id TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  total_price NUMERIC(12,2) NOT NULL,
  vat_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  plastic_bag_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example seed data
INSERT INTO sales (product_id, quantity, total_price, vat_amount, plastic_bag_fee)
VALUES
  ('P0001', 2, 28.00, 3.65, 0.00), -- bread, taxed
  ('P0005', 5, 150.00, 19.56, 0.00), -- rice
  ('P0008', 1, 10.00, 1.30, 0.50); -- includes plastic bag fee
