// src/pages/Dashboard/SupplierDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type Order = Database["public"]["Tables"]["orders"]["Row"];

export default function SupplierDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("purchase_orders").select("*");
      if (data) setOrders(data as any);
      setLoading(false);
    })();
  }, []);

  const markFulfilled = async (id: number) => {
    const { error } = await supabase.from("purchase_orders").update({ status: "fulfilled" }).eq("id", id);
    if (error) console.error(error);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "fulfilled" } : o)));
  };

  return (
    <div className="p-4">
      <div className="app-header card mb-4">
        <h1 className="text-lg font-bold">Supplier Dashboard</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <h2 className="font-semibold mb-2">Purchase Orders</h2>
          <ul>
            {orders.map((o) => (
              <li key={o.id} className="py-2 flex justify-between items-center">
                <div>
                  <div className="font-medium">{o.id}</div>
                  <div className="text-sm text-gray-500">{o.status}</div>
                </div>
                {o.status !== "fulfilled" && (
                  <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => markFulfilled(o.id)}>
                    Mark fulfilled
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
