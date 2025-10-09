import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type SaleInsert = Database["public"]["Tables"]["sales"]["Insert"];

export default function CashierDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const ZERO_RATED = ["maize meal", "bread", "mahango", "fresh milk"];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data: prodData, error: prodError } = await supabase
        .from<Product>("products")
        .select("*");
      if (prodError) console.error(prodError);
      if (prodData) setProducts(prodData);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (productId: number | string) => {
    const pid = Number(productId);
    setCart((prev) => prev.filter((p) => Number(p.id) !== pid));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let vat = 0;
    let bagLevy = 0;

    cart.forEach((item) => {
      const price = Number(item.price) || 0;
      subtotal += price;
      if (!ZERO_RATED.includes(item.name.toLowerCase())) vat += price * 0.15;
      if (item.name.toLowerCase().includes("plastic bag")) bagLevy += 1;
    });

    const total = subtotal + vat + bagLevy;
    return { subtotal, vat, bagLevy, total };
  };

  const { subtotal, vat, bagLevy, total } = calculateTotals();

  const checkout = async () => {
    for (const item of cart) {
      const { error } = await supabase
        .from<SaleInsert>("sales")
        .insert({
          product_id: Number(item.id),
          total_price: Number(item.price),
          created_at: new Date().toISOString(),
        });
      if (error) console.error(error);
    }
    alert(`Sale completed. Total: N$${total.toFixed(2)}`);
    setCart([]);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-700">Cashier Dashboard</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {products.map((p) => (
              <li key={p.id} className="border p-2 rounded bg-white shadow-sm">
                <div>{p.name}</div>
                <div className="text-gray-600">N${Number(p.price).toFixed(2)}</div>
                <button
                  className="mt-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
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
              <li key={c.id} className="flex justify-between items-center border-b py-1">
                {c.name} - N${Number(c.price).toFixed(2)}
                <button
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => removeFromCart(c.id)}
                >
                  Return
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 bg-gray-50 p-3 rounded shadow">
            <p>Subtotal: N${subtotal.toFixed(2)}</p>
            <p>VAT (15%): N${vat.toFixed(2)}</p>
            <p>Plastic Bag Levy: N${bagLevy.toFixed(2)}</p>
            <p className="font-bold text-lg text-red-700">Total: N${total.toFixed(2)}</p>
            <button
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
