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

      if (prodError) console.error("fetchProducts error:", prodError);
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
      const price = Number((item as any).price) || 0;
      const name = (item.name || "").toString().toLowerCase();

      subtotal += price;
      if (!ZERO_RATED.includes(name)) vat += price * 0.15;
      if (name.includes("plastic bag")) bagLevy += 1;
    });

    const total = subtotal + vat + bagLevy;
    return { subtotal, vat, bagLevy, total };
  };

  const { subtotal, vat, bagLevy, total } = calculateTotals();

  const checkout = async () => {
    if (cart.length === 0) {
      // eslint-disable-next-line no-alert
      alert("Cart is empty.");
      return;
    }

    // build payloads and insert in one batch
    const payloads: SaleInsert[] = cart.map((item) => {
      const name = (item.name || "").toString().toLowerCase();
      const price = Number((item as any).price) || 0;
      return {
        product_id: Number(item.id),
        quantity: 1,
        total_price: price,
        vat_amount: !["maize meal", "bread", "mahango", "fresh milk"].includes(name)
          ? Number((price * 0.15).toFixed(2))
          : 0,
        plastic_bag_fee: name.includes("plastic bag") ? 1 : 0,
        created_at: new Date().toISOString(),
      } as SaleInsert;
    });

    const { error } = await supabase
      .from<Database["public"]["Tables"]["sales"]["Insert"]>("sales")
      .insert(payloads);

    if (error) {
      console.error("checkout insert error:", error);
      // eslint-disable-next-line no-alert
      alert("Checkout failed — see console for error.");
      return;
    }

    // eslint-disable-next-line no-alert
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
                <div className="font-medium">{p.name}</div>
                <div className="text-gray-600">N${(Number((p as any).price) || 0).toFixed(2)}</div>
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
                <div>{c.name} - N${(Number((c as any).price) || 0).toFixed(2)}</div>
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
