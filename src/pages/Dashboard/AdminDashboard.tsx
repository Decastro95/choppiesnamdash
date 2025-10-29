// src/pages/Dashboard/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import ExportSection from "@/components/ExportSection";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import ChoppiesHeader from "@/components/ChoppiesHeader";
import { Package } from "lucide-react";


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
    <div className="min-h-screen bg-gray-50 p-6">
      <ChoppiesHeader
        title="Admin Dashboard"
        subtitle="System Administration & Product Management"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader variant="red">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-6 h-6" />
                Products Catalog
              </CardTitle>
              <span className="bg-white text-choppies-red px-4 py-2 rounded-full text-sm font-bold">
                {products.length} total products
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 border-b-2 border-choppies-red">
                    {columns.map((c) => (
                      <th key={c} className="p-3 text-left font-semibold">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50 border-b transition-colors">
                      <td className="p-3 font-medium text-gray-900">{p.name}</td>
                      <td className="p-3 text-gray-600">{p.category}</td>
                      <td className="p-3 font-semibold text-choppies-green">N${p.price}</td>
                      <td className="p-3 text-gray-600">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Export Section */}
        <ExportSection role={role} data={products} columns={columns} rows={rows} title="Products" />
      </div>
    </div>
  );
}
