// src/pages/Dashboard/SupplierDashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export default function SupplierDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("orders").select("*");
      if (error) console.error(error);
      if (data) setOrders(data as Order[]);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const markAsFulfilled = async (orderId: number | string) => {
    const id = Number(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: "fulfilled" } as Partial<OrderUpdate>)
      .eq("id", id);

    if (error) console.error(error);
    else
      setOrders((prev) =>
        prev.map((o) => (Number(o.id) === id ? { ...o, status: "fulfilled" } : o))
      );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-700">Supplier Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <ul className="divide-y divide-gray-200">
            {orders.map((o) => (
              <li key={o.id} className="py-2 flex justify-between items-center">
                <span>
                  Order #{o.id} –{" "}
                  <span
                    className={`font-semibold ${
                      o.status === "fulfilled" ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {o.status}
                  </span>
                </span>
                {o.status !== "fulfilled" && (
                  <button
                    className="ml-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => markAsFulfilled(o.id)}
                  >
                    Mark Fulfilled
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
