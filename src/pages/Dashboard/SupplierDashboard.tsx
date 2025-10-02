// src/pages/Dashboard/SupplierDashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Database } from "../../types/supabase";

type Order = Database["public"]["Tables"]["orders"]["Row"];

export default function SupplierDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*");

      if (error) console.error(error);
      if (data) setOrders(data);

      setLoading(false);
    };

    fetchOrders();
  }, []);

  const markAsFulfilled = async (orderId: number) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "fulfilled" })
      .eq("id", orderId);

    if (error) console.error(error);
    else setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "fulfilled" } : o))
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supplier Dashboard</h1>
      {loading && <p>Loading...</p>}

      {!loading && (
        <>
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <ul>
            {orders.map((o) => (
              <li key={o.id} className="mb-2">
                Order ID: {o.id} - Status: {o.status}{" "}
                {o.status !== "fulfilled" && (
                  <button
                    className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
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
