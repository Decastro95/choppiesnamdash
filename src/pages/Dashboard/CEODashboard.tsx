// src/pages/Dashboard/CEODashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";
import { MetricCard, Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import ChoppiesHeader from "../../components/ChoppiesHeader";
import { TrendingUp, ShoppingBag, DollarSign, Store } from "lucide-react";

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
  const totalShops = 23;
  const totalCustomers = 2502500;
  const productCategories = 10;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ChoppiesHeader
        title="CEO Dashboard"
        subtitle="Great value for your money!"
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-choppies-green text-lg font-semibold">Loading analytics...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Revenue Projection"
              value={`N$${revenue.toFixed(2)}`}
              growth="+28.4%"
              trend="up"
              subtitle="Across all regions"
              icon={<DollarSign className="w-6 h-6" />}
            />

            <MetricCard
              title="Active Shops"
              value={totalShops}
              growth="+3 new"
              trend="up"
              subtitle="Active locations"
              icon={<Store className="w-6 h-6" />}
            />

            <MetricCard
              title="Product Categories"
              value={productCategories}
              subtitle="All categories"
              icon={<ShoppingBag className="w-6 h-6" />}
            />

            <MetricCard
              title="Total Customers"
              value={totalCustomers.toLocaleString()}
              growth="+28.4%"
              trend="up"
              subtitle="Customer base"
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </div>

          {/* Regional Performance Overview */}
          <Card>
            <CardHeader variant="default">
              <CardTitle>Regional Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                  <div className="text-3xl font-bold text-gray-900">N${(revenue * 0.59).toFixed(1)}M</div>
                  <div className="text-sm text-gray-500 mt-1">Across all regions</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Shops</div>
                  <div className="text-3xl font-bold text-gray-900">{totalShops}</div>
                  <div className="text-sm text-gray-500 mt-1">Active locations</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Market Coverage</div>
                  <div className="text-3xl font-bold text-gray-900">2.3M</div>
                  <div className="text-sm text-gray-500 mt-1">Potential customers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VAT & Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader variant="red">
                <CardTitle className="text-white">VAT Projection (15%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-choppies-red mb-2">
                  N${vat.toFixed(2)}
                </div>
                <p className="text-gray-600">Estimated VAT collection from total sales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader variant="red">
                <CardTitle className="text-white">Product Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-choppies-green mb-2">
                  {products.length}
                </div>
                <p className="text-gray-600">Total products in catalog across {productCategories} categories</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
