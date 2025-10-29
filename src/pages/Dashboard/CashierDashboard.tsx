// src/pages/Dashboard/CashierDashboard.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";
import { exportToCSV, exportToPDF } from "../../utils/exportHelpers";
import { logActivity } from "../../utils/logActivity";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import ChoppiesHeader from "../../components/ChoppiesHeader";
import { ShoppingCart, CreditCard, Wallet, Receipt, Plus, Trash2 } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];
type SaleInsert = Database["public"]["Tables"]["sales"]["Insert"];

export default function CashierDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const ZERO_RATED = ["maize meal", "bread", "mahango", "fresh milk"];

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.error(error);
      if (data) setProducts(data as Product[]);
      setLoading(false);
    })();
  }, []);

  const addToCart = (p: Product) => setCart((c) => [...c, p]);
  const removeFromCart = (id: number) => setCart((c) => c.filter((x) => x.id !== id));

  const calc = () => {
    let subtotal = 0;
    let vat = 0;
    let bag = 0;
    cart.forEach((i) => {
      const price = Number(i.price ?? 0);
      subtotal += price;
      if (!ZERO_RATED.includes((i.name || "").toLowerCase())) vat += price * 0.15;
      if ((i.name || "").toLowerCase().includes("plastic bag")) bag += 1;
    });
    const total = subtotal + vat + bag;
    return { subtotal, vat, bag, total };
  };
  const { subtotal, vat, bag, total } = calc();

  async function checkout(paymentMethod: "cash" | "credit_card" | "loyalty_card", loyaltyCardNumber?: string | null) {
    if (cart.length === 0) {
      alert("Cart empty");
      return;
    }
    // create sales entries (one per item) - or batch
    for (const item of cart) {
      const payload: SaleInsert = {
        product_id: item.id,
        quantity: 1,
        price: Number(item.price ?? 0),
        total_price: Number(item.price ?? 0),
        payment_method: paymentMethod,
        loyalty_card_number: loyaltyCardNumber ?? null,
        created_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("sales").insert([payload]);
      if (error) console.error("sale insert error:", error);
    }
    // log activity (auth user uuid if available)
    const { data: user } = await supabase.auth.getUser();
    await logActivity({
      user_id: user?.user?.id ?? null,
      action: "checkout",
      details: `Cashier completed sale ${cart.length} items, total ${total}`,
    });

    alert(`Sale complete: N$${total.toFixed(2)}`);
    setCart([]);
  }

  const downloadReceipt = () => {
    const rows = cart.map((c) => ({ name: c.name, price: c.price }));
    exportToPDF(rows, ["name", "price"], "receipt.pdf", `Receipt - ${new Date().toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ChoppiesHeader
        title="Choppies POS System"
        subtitle="Point of Sale - Cashier Dashboard"
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-choppies-green text-lg font-semibold">Loading inventory...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Grid */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader variant="default">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-choppies-red" />
                    Available Products
                  </CardTitle>
                  <span className="bg-choppies-green text-white px-3 py-1 rounded-full text-sm font-bold">
                    {products.length} items
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto">
                  {products.map((p) => (
                    <div key={p.id} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                      <div className="font-semibold text-gray-900 mb-1">{p.name}</div>
                      <div className="text-lg font-bold text-choppies-green mb-3">N${Number(p.price ?? 0).toFixed(2)}</div>
                      <button
                        className="w-full py-2 bg-choppies-green text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                        onClick={() => addToCart(p)}
                      >
                        <Plus className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shopping Cart */}
          <div>
            <Card>
              <CardHeader variant="red">
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Shopping Cart
                  </span>
                  <span className="bg-white text-choppies-red px-3 py-1 rounded-full text-sm font-bold">
                    {cart.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">Cart is empty</div>
                  ) : (
                    cart.map((c, index) => (
                      <div key={`${c.id}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-sm">{c.name}</div>
                          <div className="text-choppies-green font-semibold text-sm">N${Number(c.price ?? 0).toFixed(2)}</div>
                        </div>
                        <button
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          onClick={() => removeFromCart(c.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">N${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (15%):</span>
                    <span className="font-semibold">N${vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bag Fee:</span>
                    <span className="font-semibold">N${bag.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-choppies-red">N${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="space-y-2">
                  <button
                    className="w-full py-3 bg-choppies-green text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    onClick={() => checkout("cash")}
                  >
                    <Wallet className="w-5 h-5" />
                    Pay with Cash
                  </button>
                  <button
                    className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold flex items-center justify-center gap-2"
                    onClick={() => checkout("credit_card")}
                  >
                    <CreditCard className="w-5 h-5" />
                    Pay with Card
                  </button>
                  <button
                    className="w-full py-3 bg-choppies-red text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    onClick={() => {
                      const id = prompt("Enter loyalty card number:");
                      if (id) checkout("loyalty_card", id);
                    }}
                  >
                    <CreditCard className="w-5 h-5" />
                    Loyalty Card
                  </button>
                </div>

                {/* Receipt Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-1"
                    onClick={downloadReceipt}
                  >
                    <Receipt className="w-4 h-4" />
                    <span className="text-xs">PDF</span>
                  </button>
                  <button
                    className="py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-1"
                    onClick={() => exportToCSV(cart.map((c) => ({ name: c.name, price: c.price })), "cart.csv")}
                  >
                    <Receipt className="w-4 h-4" />
                    <span className="text-xs">CSV</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
