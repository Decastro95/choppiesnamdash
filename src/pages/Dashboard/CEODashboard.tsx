// src/pages/Dashboard/CEODashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type Sale = Database["public"]["Tables"]["sales"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

export default function CEODashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: s } = await supabase.from("sales").select("*");
      const { data: p } = await supabase.from("products").select("*");
      if (s) setSales(s as Sale[]);
      if (p) setProducts(p as Product[]);
      setLoading(false);
    })();
  }, []);

  const revenue = sales.reduce((acc, x) => acc + Number(x.total_price ?? x.price ?? 0), 0);
  const vat = revenue * 0.15;

  return (
    <div className="p-4">
      <div className="app-header card mb-4">
        <h1 className="text-lg font-bold">CEO Dashboard</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card">
              <h3 className="font-semibold">Total Revenue</h3>
              <div className="text-2xl font-bold">N${revenue.toFixed(2)}</div>
            </div>
            <div className="card">
              <h3 className="font-semibold">VAT Projection</h3>
              <div className="text-2xl font-bold">N${vat.toFixed(2)}</div>
            </div>
            <div className="card">
              <h3 className="font-semibold">Products</h3>
              <div>{products.length} total</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
