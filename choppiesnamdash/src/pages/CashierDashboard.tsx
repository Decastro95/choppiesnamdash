import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import type { Database } from "../types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Sale = Database["public"]["Tables"]["sales"]["Row"];

const VAT_RATE = 0.15; // 15% VAT
const PLASTIC_BAG_LEVY = 1.0; // N$1 per bag

export default function CashierDashboard() {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.product.id === product.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const calculateTotal = () => {
    let subtotal = 0;
    let vatTotal = 0;

    cart.forEach(({ product, quantity }) => {
      let price = Number(product.price || 0);
      const isZeroRated = ["maize meal", "mahango", "bread"].some((z) =>
        product.name.toLowerCase().includes(z)
      );

      if (!isZeroRated) vatTotal += price * quantity * VAT_RATE;
      subtotal += price * quantity;
    });

    const bagLevy = cart.length ? PLASTIC_BAG_LEVY : 0;
    setTotal(subtotal + vatTotal + bagLevy);
  };

  useEffect(() => calculateTotal(), [cart]);

  const returnItem = async (saleId: number) => {
    // Add record to `returns` table
    await supabase.from("returns").insert([{ sale_id: saleId }]);
    // Triggers will increase stock automatically
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cashier POS</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border p-2 rounded shadow">
            <h2 className="font-semibold">{p.name}</h2>
            <button
              onClick={() => addToCart(p)}
              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold">Cart</h2>
        {cart.map(({ product, quantity }) => (
          <div key={product.id}>
            {product.name} x {quantity}
          </div>
        ))}
        <div className="mt-2 font-bold">Total: N${total.toFixed(2)}</div>
        {cart.length > 0 && (
          <button
            onClick={() => alert("Checkout implemented")}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
}
