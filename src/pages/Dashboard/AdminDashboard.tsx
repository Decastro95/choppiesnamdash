// src/pages/Dashboard/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import ExportSection from "@/components/ExportSection";


export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const role = "admin";

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data) setProducts(data);
    }
    loadProducts();
  }, []);

  const columns = ["Name", "Category", "Price", "Stock"];
  const rows = products.map((p) => [p.name, p.category, p.price, p.stock]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {columns.map((c) => (
                <th key={c} className="p-2 border">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.category}</td>
                <td className="p-2 border">N${p.price}</td>
                <td className="p-2 border">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Export Section */}
      <ExportSection role={role} data={products} columns={columns} rows={rows} title="Products" />
    </div>
  );
}
