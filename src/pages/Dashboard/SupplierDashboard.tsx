// src/pages/Dashboard/SupplierDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import ChoppiesHeader from "../../components/ChoppiesHeader";
import { Package, CheckCircle, Clock } from "lucide-react";

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

  const pendingOrders = orders.filter(o => o.status !== "fulfilled");
  const fulfilledOrders = orders.filter(o => o.status === "fulfilled");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ChoppiesHeader
        title="Supplier Dashboard"
        subtitle="Purchase Order Management"
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-choppies-green text-lg font-semibold">Loading orders...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-choppies-red to-red-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 mb-1">Total Orders</div>
                  <div className="text-4xl font-bold">{orders.length}</div>
                </div>
                <Package className="w-12 h-12 opacity-80" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 mb-1">Pending Orders</div>
                  <div className="text-4xl font-bold">{pendingOrders.length}</div>
                </div>
                <Clock className="w-12 h-12 opacity-80" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-choppies-green to-green-700 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 mb-1">Fulfilled Orders</div>
                  <div className="text-4xl font-bold">{fulfilledOrders.length}</div>
                </div>
                <CheckCircle className="w-12 h-12 opacity-80" />
              </div>
            </Card>
          </div>

          {/* Purchase Orders List */}
          <Card>
            <CardHeader variant="red">
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-6 h-6" />
                Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>No purchase orders available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <Package className="w-6 h-6 text-choppies-red" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">Order #{o.id}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {o.status === "fulfilled" ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-choppies-green" />
                                <span className="text-sm font-medium text-choppies-green">Fulfilled</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span className="text-sm font-medium text-orange-500">Pending</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {o.status !== "fulfilled" && (
                        <button
                          className="px-6 py-2 bg-choppies-green text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
                          onClick={() => markFulfilled(o.id)}
                        >
                          <CheckCircle className="w-5 h-5" />
                          Mark Fulfilled
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
