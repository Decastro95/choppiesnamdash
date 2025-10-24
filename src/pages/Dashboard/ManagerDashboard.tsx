// src/pages/Dashboard/ManagerDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";
import { exportToCSV } from "../../utils/exportHelpers";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Sale = Database["public"]["Tables"]["sales"]["Row"];

export default function ManagerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: p } = await supabase.from("products").select("*");
      const { data: s } = await supabase.from("sales").select("*");
      if (p) setProducts(p as Product[]);
      if (s) setSales(s as Sale[]);
      setLoading(false);
    })();
  }, []);

  async function promoteProduct(productId: number) {
    // manager permission assumed on backend; here we open a quick prompt to set discount flag in promotions table
    const percent = prompt("Set discount % for promotion (e.g. 10 for 10%)");
    const p = Number(percent);
    if (!isFinite(p)) return;
    await supabase.from("promotions").insert([{ product_id: productId, discount_percentage: p }]);
    alert("Promotion created (if manager has permission)");
  }

  return (
    <div className="p-4">
      <div className="app-header card mb-4">
        <h1 className="text-lg font-bold">Manager Dashboard</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h2 className="font-semibold">Products</h2>
              <ul>
                {products.map((p) => (
                  <li key={p.id} className="py-1 flex justify-between">
                    <span>{p.name} — N${Number(p.price ?? 0).toFixed(2)}</span>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 border rounded" onClick={() => promoteProduct(p.id)}>Promote</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2 className="font-semibold">Sales (Export)</h2>
              <button className="py-2 w-full rounded" onClick={() => exportToCSV(sales, "shop-sales.csv")}>Export sales CSV</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
