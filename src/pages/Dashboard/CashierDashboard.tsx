// src/pages/Dashboard/CashierDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";
import { exportToCSV, exportToPDF } from "../../utils/exportHelpers";
import { logActivity } from "../../utils/logActivity";

type Product = Database["public"]["Tables"]["products"]["Row"];
type SaleInsert = Database["public"]["Tables"]["sales"]["Insert"];

export default function CashierDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const ZERO_RATED = ["maize meal", "bread", "mahango", "fresh milk"];

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.error(error);
      if (data) setProducts(data as Product[]);
      setLoading(false);
    })();
  }, []);

  const addToCart = (p: Product) => setCart((c) => [...c, p]);
  const removeFromCart = (id: number) => setCart((c) => c.filter((x) => x.id !== id));

  const calc = () => {
    let subtotal = 0;
    let vat = 0;
    let bag = 0;
    cart.forEach((i) => {
      const price = Number(i.price ?? 0);
      subtotal += price;
      if (!ZERO_RATED.includes((i.name || "").toLowerCase())) vat += price * 0.15;
      if ((i.name || "").toLowerCase().includes("plastic bag")) bag += 1;
    });
    const total = subtotal + vat + bag;
    return { subtotal, vat, bag, total };
  };
  const { subtotal, vat, bag, total } = calc();

  async function checkout(paymentMethod: "cash" | "credit_card" | "loyalty_card", loyaltyCardNumber?: string | null) {
    if (cart.length === 0) {
      alert("Cart empty");
      return;
    }
    // create sales entries (one per item) - or batch
    for (const item of cart) {
      const payload: SaleInsert = {
        product_id: item.id,
        quantity: 1,
        price: Number(item.price ?? 0),
        total_price: Number(item.price ?? 0),
        payment_method: paymentMethod,
        loyalty_card_number: loyaltyCardNumber ?? null,
        created_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("sales").insert([payload]);
      if (error) console.error("sale insert error:", error);
    }
    // log activity (auth user uuid if available)
    const { data: user } = await supabase.auth.getUser();
    await logActivity({
      user_id: user?.user?.id ?? null,
      action: "checkout",
      details: `Cashier completed sale ${cart.length} items, total ${total}`,
    });

    alert(`Sale complete: N$${total.toFixed(2)}`);
    setCart([]);
  }

  const downloadReceipt = () => {
    const rows = cart.map((c) => ({ name: c.name, price: c.price }));
    exportToPDF(rows, ["name", "price"], "receipt.pdf", `Receipt - ${new Date().toLocaleString()}`);
  };

  return (
    <div className="p-4">
      <div className="app-header mb-4 card">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Choppies POS - Cashier</h1>
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 card">
            <h2 className="font-semibold mb-2">Products</h2>
            <ul className="grid grid-cols-2 gap-2">
              {products.map((p) => (
                <li key={p.id} className="border p-2 rounded bg-white">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">N${Number(p.price ?? 0).toFixed(2)}</div>
                  <div className="mt-2 flex gap-2">
                    <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={() => addToCart(p)}>
                      Add
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-2">Cart</h2>
            <ul>
              {cart.map((c) => (
                <li key={c.id} className="flex justify-between">
                  <span>{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span>N${Number(c.price ?? 0).toFixed(2)}</span>
                    <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeFromCart(c.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <p>Subtotal: N${subtotal.toFixed(2)}</p>
              <p>VAT: N${vat.toFixed(2)}</p>
              <p>Plastic bag fee: N${bag.toFixed(2)}</p>
              <p className="font-bold">Total: N${total.toFixed(2)}</p>

              <div className="mt-3 space-y-2">
                <button className="w-full py-2 rounded bg-blue-600 text-white" onClick={() => checkout("cash")}>
                  Pay with Cash
                </button>
                <button className="w-full py-2 rounded bg-gray-800 text-white" onClick={() => checkout("credit_card")}>
                  Pay with Card
                </button>
                <button
                  className="w-full py-2 rounded bg-emerald-600 text-white"
                  onClick={() => {
                    const id = prompt("Enter loyalty card number (or customer ID):");
                    if (id) checkout("loyalty_card", id);
                  }}
                >
                  Pay with Loyalty Card
                </button>

                <div className="flex gap-2 mt-2">
                  <button className="flex-1 py-2 border rounded" onClick={downloadReceipt}>
                    Download Receipt (PDF)
                  </button>
                  <button
                    className="flex-1 py-2 border rounded"
                    onClick={() => {
                      // export sales summary of cart as CSV
                      exportToCSV(cart.map((c) => ({ name: c.name, price: c.price })), "cart.csv");
                    }}
                  >
                    Export Cart CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
