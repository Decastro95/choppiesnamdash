// src/pages/Dashboard/ManagerDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";
import { exportToCSV } from "../../utils/exportHelpers";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import ChoppiesHeader from "../../components/ChoppiesHeader";
import { Tag, Download } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 p-6">
      <ChoppiesHeader
        title="Manager Dashboard"
        subtitle="Product & Promotions Management"
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-choppies-green text-lg font-semibold">Loading inventory...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products Management */}
          <Card>
            <CardHeader variant="red">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Products Catalog
                </CardTitle>
                <span className="bg-white text-choppies-red px-3 py-1 rounded-full text-sm font-bold">
                  {products.length} items
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-sm text-choppies-green font-semibold">N${Number(p.price ?? 0).toFixed(2)}</div>
                    </div>
                    <button
                      className="px-4 py-2 bg-choppies-green text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      onClick={() => promoteProduct(p.id)}
                    >
                      Promote
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Export */}
          <Card>
            <CardHeader variant="red">
              <CardTitle className="text-white flex items-center gap-2">
                <Download className="w-5 h-5" />
                Sales Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-choppies-red mb-2">{sales.length}</div>
                <div className="text-gray-600">Total Sales Transactions</div>
              </div>

              <button
                className="w-full py-3 bg-choppies-green text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                onClick={() => exportToCSV(sales, "shop-sales.csv")}
              >
                <Download className="w-5 h-5" />
                Export Sales to CSV
              </button>

              <div className="text-sm text-gray-500 text-center">
                Download complete sales history for analysis and reporting
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
