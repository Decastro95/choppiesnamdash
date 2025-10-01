import { supabase } from "../supabaseClient";

// Fetch all users with roles and shop info
export async function fetchUsers() {
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      email,
      role_id,
      role:roles(name),
      shop:shops(name)
    `);

  if (error) throw error;
  return data;
}

// Fetch products with stock info
export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      product_id,
      name,
      category:categories(name),
      expiration_days,
      damage_status
    `);

  if (error) throw error;
  return data;
}

// Fetch low stock products (example: products with less than 10 items)
export async function fetchLowStock() {
  // You need a `quantity` column in `products` or `inventory` table
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .lt("quantity", 10);

  if (error) throw error;
  return data;
}

// Fetch expiring goods (expiration_days < 7)
export async function fetchExpiringGoods() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .lt("expiration_days", 7);

  if (error) throw error;
  return data;
}

// Fetch damaged goods
export async function fetchDamagedGoods() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .not("damage_status", "is", null);

  if (error) throw error;
  return data;
}
