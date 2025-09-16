import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Database } from "../types/supabase";

type Order = Database["public"]["Tables"]["orders"]["Row"];

export default function SupplierDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*");
    setOrders(data || []); // Type-safe fallback
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supplier Dashboard</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Order #{order.id} - Supplier: {order.supplier_name} - Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
