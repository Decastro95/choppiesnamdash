// src/pages/Dashboard/CashierDashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Database } from "../../types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Sale = Database["public"]["Tables"]["sales"]["Row"];

export default function CashierDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const ZERO_RATED = ["maize meal", "bread", "mahango", "fresh milk"];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data: prodData, error: prodError } = await supabase
        .from("products")
        .select("*");
      if (prodError) console.error(prodError);
      if (prodData) setProducts(prodData);

      const { data: salesData, error: salesError } = await supabase
        .from("sales")
        .select("*");
      if (salesError) console.error(salesError);
      if (salesData) setSales(salesData);

      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Add product to cart
  const addToCart = (product: Product) => setCart([...cart, product]);

  // Remove product from cart (return item)
  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  // Calculate total
  const calculateTotals = () => {
    let subtotal = 0;
    let vat = 0;
    let bagLevy = 0;

    cart.forEach((item) => {
      subtotal += item.price;
      if (!ZERO_RATED.includes(item.name.toLowerCase())) {
        vat += item.price * 0.15;
      }
      if (item.name.toLowerCase().includes("plastic bag")) bagLevy += 1;
    });

    const total = subtotal + vat + bagLevy;
    return { subtotal, vat, bagLevy, total };
  };

  const { subtotal, vat, bagLevy, total } = calculateTotals();

  // Checkout
  const checkout = async () => {
    for (const item of cart) {
      const { error } = await supabase.from("sales").insert({
        product_id: item.id,
        total_price: item.price,
        created_at: new Date(),
      });
      if (error) console.error(error);
    }
    alert(`Sale completed. Total: N$${total.toFixed(2)}`);
    setCart([]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cashier Dashboard</h1>
      {loading && <p>Loading products...</p>}

      {!loading && (
        <>
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {products.map((p) => (
              <li key={p.id} className="border p-2 rounded">
                <div>{p.name}</div>
                <div>N${p.price.toFixed(2)}</div>
                <button
                  className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => addToCart(p)}
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4 mb-2">Cart</h2>
          <ul>
            {cart.map((c) => (
              <li key={c.id} className="flex justify-between items-center">
                {c.name} - N${c.price.toFixed(2)}
                <button
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => removeFromCart(c.id)}
                >
                  Return
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <p>Subtotal: N${subtotal.toFixed(2)}</p>
            <p>VAT (15%): N${vat.toFixed(2)}</p>
            <p>Plastic Bag Levy: N${bagLevy.toFixed(2)}</p>
            <p className="font-bold">Total: N${total.toFixed(2)}</p>
            <button
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
              onClick={checkout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
