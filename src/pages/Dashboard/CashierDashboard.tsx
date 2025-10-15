// src/pages/Dashboard/CashierDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type SaleInsert = Database["public"]["Tables"]["sales"]["Insert"];
type LoyaltyCard = Database["public"]["Tables"]["loyalty_cards"]["Row"];
type LoyaltyInsert = Database["public"]["Tables"]["loyalty_transactions"]["Insert"];

export default function CashierDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "loyalty">("cash");
  const [plasticBag, setPlasticBag] = useState(false);
  const [loyaltyIdNumber, setLoyaltyIdNumber] = useState("");
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);
  const [bankChangeOptIn, setBankChangeOptIn] = useState(false);

  const ZERO_RATED = ["maize meal", "bread", "mahango", "fresh milk"];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data: prodData, error: prodError } = await supabase
        .from("products")
        .select("*");

      if (prodError) console.error(prodError);
      if (prodData) setProducts(prodData as Product[]);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Lookup loyalty card by id_number
  const findLoyaltyCard = async (idNumber: string) => {
    if (!idNumber) {
      setLoyaltyCard(null);
      return;
    }
    const { data, error } = await supabase
      .from("loyalty_cards")
      .select("*")
      .eq("id_number", idNumber)
      .limit(1)
      .single();
    if (error) {
      console.error("Loyalty lookup error:", error);
      setLoyaltyCard(null);
    } else {
      setLoyaltyCard(data as LoyaltyCard);
    }
  };

  useEffect(() => {
    // call lookup when loyaltyIdNumber changes and has length (quick debounce could be added)
    const t = setTimeout(() => {
      if (loyaltyIdNumber.trim()) findLoyaltyCard(loyaltyIdNumber.trim());
      else setLoyaltyCard(null);
    }, 300);
    return () => clearTimeout(t);
  }, [loyaltyIdNumber]);

  const addToCart = (product: Product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (productId: number | string) => {
    const pid = Number(productId);
    setCart((prev) => prev.filter((p) => Number(p.id) !== pid));
  };

  // totals
  const totals = useMemo(() => {
    let subtotal = 0;
    let vat = 0;
    let bagLevy = 0;

    cart.forEach((item) => {
      const price = Number((item as any).price) || 0;
      subtotal += price;
      if (!ZERO_RATED.includes((item.name || "").toLowerCase())) vat += price * 0.15;
      if ((item.name || "").toLowerCase().includes("plastic bag") || plasticBag) bagLevy += 1;
    });

    const total = subtotal + vat + bagLevy;
    return { subtotal, vat, bagLevy, total };
  }, [cart, plasticBag]);

  // helper to record activity
  const logActivity = async (action: string, details?: string) => {
    try {
      // If your auth is using auth.users (uuid) you'll want to use that user's id here (fetch from supabase.auth.getUser)
      const userRes = await supabase.auth.getUser();
      const userId = userRes?.data?.user?.id ?? null;

      await supabase.from("activity_log").insert([
        {
          user_id: userId ?? null,
          username: userRes?.data?.user?.email ?? null,
          role: null,
          action,
          details,
        },
      ]);
    } catch (e) {
      console.warn("Could not write activity log:", e);
    }
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    // Calculate totals again
    const { subtotal, vat, bagLevy, total } = totals;

    // Create sale rows (simple approach: create one sale per product line)
    // You may want to aggregate same product -> quantity in a real POS
    try {
      const salesPayload: SaleInsert[] = cart.map((item) => ({
        product_id: item.id ?? null,
        shop_id: null,
        quantity: 1,
        price: Number((item as any).price) || 0,
        total_price: Number((item as any).price) || 0,
        created_at: new Date().toISOString(),
      }));

      // insert sales
      const { data: salesInserted, error: salesError } = await supabase.from("sales").insert(salesPayload).select("*");
      if (salesError) {
        console.error("Sales insert error:", salesError);
        alert("Failed to record sale.");
        return;
      }

      // If loyalty payment - deduct loyalty balance
      if (paymentMethod === "loyalty") {
        if (!loyaltyCard) {
          alert("Loyalty card required for loyalty payment.");
          return;
        }
        const totalAmount = total;
        // Check balance (balance stored as numeric string)
        const balanceNum = Number(loyaltyCard.balance || 0);
        if (balanceNum < totalAmount) {
          alert("Insufficient loyalty balance.");
          return;
        }
        // Deduct
        const newBalance = (balanceNum - totalAmount).toFixed(2);
        await supabase.from("loyalty_cards").update({ balance: newBalance }).eq("id", loyaltyCard.id);
        // Log transaction
        const payload: LoyaltyInsert = {
          loyalty_id: loyaltyCard.id,
          sale_id: Array.isArray(salesInserted) && salesInserted[0] ? (salesInserted as any)[0].id : null,
          type: "redeem",
          amount: totalAmount,
          details: `Redeemed for sale`,
          created_at: new Date().toISOString(),
        };
        await supabase.from("loyalty_transactions").insert([payload]);
      }

      // If cash payment and bankChangeOptIn => bank change
      if (paymentMethod === "cash" && bankChangeOptIn && loyaltyCard) {
        // implement simple rounding bank-your-change (round up to nearest integer)
        const totalAmount = total;
        const rounded = Math.ceil(totalAmount);
        const changeToBank = +(rounded - totalAmount).toFixed(2);
        if (changeToBank > 0) {
          // credit loyalty balance and record transaction
          const newBalanceNum = Number(loyaltyCard.balance || 0) + changeToBank;
          await supabase.from("loyalty_cards").update({ balance: newBalanceNum }).eq("id", loyaltyCard.id);
          await supabase.from("loyalty_transactions").insert([
            {
              loyalty_id: loyaltyCard.id,
              sale_id: Array.isArray(salesInserted) && salesInserted[0] ? (salesInserted as any)[0].id : null,
              type: "bank_change",
              amount: changeToBank,
              details: `Banked change (rounded ${rounded} - total ${totalAmount})`,
              created_at: new Date().toISOString(),
            },
          ]);
        }
      }

      // For every item purchased, award cashback (1%) and promo bonus points if applicable
      // fetch active promotions for products in cart
      const productIds = Array.from(new Set(cart.map((c) => c.id).filter(Boolean))) as number[];
      if (productIds.length) {
        const { data: promos } = await supabase
          .from("promotions")
          .select("*")
          .in("product_id", productIds);

        // award 1% cashback by default (store in loyalty balance), and award bonus_points where promo exists
        if (loyaltyCard) {
          let cashbackTotal = 0;
          let pointsTotal = 0;
          cart.forEach((item) => {
            const price = Number((item as any).price) || 0;
            cashbackTotal += price * 0.01; // 1% cashback
            const promoForItem = promos?.find((p: any) => p.product_id === item.id);
            if (promoForItem) pointsTotal += Number(promoForItem.bonus_points || 0);
          });

          if (cashbackTotal > 0) {
            const newBal = Number(loyaltyCard.balance || 0) + +cashbackTotal;
            await supabase.from("loyalty_cards").update({ balance: newBal }).eq("id", loyaltyCard.id);
            await supabase.from("loyalty_transactions").insert([
              {
                loyalty_id: loyaltyCard.id,
                sale_id: Array.isArray(salesInserted) && salesInserted[0] ? (salesInserted as any)[0].id : null,
                type: "earn",
                amount: +cashbackTotal.toFixed(2),
                details: "Auto 1% cashback",
                created_at: new Date().toISOString(),
              },
            ]);
          }

          if (pointsTotal > 0) {
            await supabase
              .from("loyalty_cards")
              .update({ points: (loyaltyCard.points || 0) + pointsTotal })
              .eq("id", loyaltyCard.id);
            // optionally record points as transaction or details
          }
        }
      }

      // Activity log
      await logActivity("checkout", `method=${paymentMethod}; amount=${totals.total}; items=${cart.length}`);

      // Reset cart
      setCart([]);
      setBankChangeOptIn(false);
      setPlasticBag(false);

      alert(`Sale completed. Total: N$${totals.total.toFixed(2)}`);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed - see console.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-700">Cashier Dashboard</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {products.map((p) => (
              <li key={p.id} className="border p-2 rounded bg-white shadow-sm">
                <div className="font-medium">{p.name}</div>
                <div className="text-gray-600">N${Number((p as any).price ?? 0).toFixed(2)}</div>
                <button
                  className="mt-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => addToCart(p)}
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4 mb-2">Cart</h2>
          <ul>
            {cart.map((c, i) => (
              <li key={`${c.id}-${i}`} className="flex justify-between items-center border-b py-1">
                <div>{c.name} - N${Number((c as any).price ?? 0).toFixed(2)}</div>
                <div className="flex items-center">
                  <button
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => removeFromCart(c.id)}
                  >
                    Return
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 bg-gray-50 p-3 rounded shadow">
            <p>Subtotal: N${totals.subtotal.toFixed(2)}</p>
            <p>VAT (15%): N${totals.vat.toFixed(2)}</p>
            <p>Plastic Bag Levy: N${totals.bagLevy.toFixed(2)}</p>
            <p className="font-bold text-lg text-red-700">Total: N${totals.total.toFixed(2)}</p>

            <div className="mt-3 space-y-2">
              <label className="block">
                Payment method:
                <select
                  className="ml-2 p-1 border rounded"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit Card</option>
                  <option value="loyalty">Loyalty Card</option>
                </select>
              </label>

              <label className="block">
                <input
                  type="checkbox"
                  checked={plasticBag}
                  onChange={(e) => setPlasticBag(e.target.checked)}
                />{" "}
                Include plastic bag?
              </label>

              {paymentMethod === "loyalty" || bankChangeOptIn || loyaltyCard ? (
                <div className="mt-2">
                  <label className="block">Loyalty ID number (Namibian ID):</label>
                  <input
                    className="border p-1 rounded w-full md:w-1/3"
                    value={loyaltyIdNumber}
                    onChange={(e) => setLoyaltyIdNumber(e.target.value)}
                    placeholder="88041200521"
                  />
                  {loyaltyCard && (
                    <div className="mt-1 text-sm">
                      Card: {loyaltyCard.customer_name} • Balance: N${Number(loyaltyCard.balance).toFixed(2)} • Points: {loyaltyCard.points}
                    </div>
                  )}
                </div>
              ) : null}

              {paymentMethod === "cash" && (
                <label className="block mt-2">
                  <input
                    type="checkbox"
                    checked={bankChangeOptIn}
                    onChange={(e) => setBankChangeOptIn(e.target.checked)}
                    disabled={!loyaltyCard}
                  />{" "}
                  Ask to bank change to loyalty card (must have loyalty card set)
                </label>
              )}

              <div className="mt-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={checkout}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
// src/pages/Dashboard/CashierDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type SaleInsert = Database["public"]["Tables"]["sales"]["Insert"];
type LoyaltyCard = Database["public"]["Tables"]["loyalty_cards"]["Row"];
type LoyaltyInsert = Database["public"]["Tables"]["loyalty_transactions"]["Insert"];

export default function CashierDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "loyalty">("cash");
  const [plasticBag, setPlasticBag] = useState(false);
  const [loyaltyIdNumber, setLoyaltyIdNumber] = useState("");
  const [loyaltyCard, setLoyaltyCard] = useState<LoyaltyCard | null>(null);
  const [bankChangeOptIn, setBankChangeOptIn] = useState(false);

  const ZERO_RATED = ["maize meal", "bread", "mahango", "fresh milk"];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data: prodData, error: prodError } = await supabase
        .from("products")
        .select("*");

      if (prodError) console.error(prodError);
      if (prodData) setProducts(prodData as Product[]);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Lookup loyalty card by id_number
  const findLoyaltyCard = async (idNumber: string) => {
    if (!idNumber) {
      setLoyaltyCard(null);
      return;
    }
    const { data, error } = await supabase
      .from("loyalty_cards")
      .select("*")
      .eq("id_number", idNumber)
      .limit(1)
      .single();
    if (error) {
      console.error("Loyalty lookup error:", error);
      setLoyaltyCard(null);
    } else {
      setLoyaltyCard(data as LoyaltyCard);
    }
  };

  useEffect(() => {
    // call lookup when loyaltyIdNumber changes and has length (quick debounce could be added)
    const t = setTimeout(() => {
      if (loyaltyIdNumber.trim()) findLoyaltyCard(loyaltyIdNumber.trim());
      else setLoyaltyCard(null);
    }, 300);
    return () => clearTimeout(t);
  }, [loyaltyIdNumber]);

  const addToCart = (product: Product) => setCart((prev) => [...prev, product]);
  const removeFromCart = (productId: number | string) => {
    const pid = Number(productId);
    setCart((prev) => prev.filter((p) => Number(p.id) !== pid));
  };

  // totals
  const totals = useMemo(() => {
    let subtotal = 0;
    let vat = 0;
    let bagLevy = 0;

    cart.forEach((item) => {
      const price = Number((item as any).price) || 0;
      subtotal += price;
      if (!ZERO_RATED.includes((item.name || "").toLowerCase())) vat += price * 0.15;
      if ((item.name || "").toLowerCase().includes("plastic bag") || plasticBag) bagLevy += 1;
    });

    const total = subtotal + vat + bagLevy;
    return { subtotal, vat, bagLevy, total };
  }, [cart, plasticBag]);

  // helper to record activity
  const logActivity = async (action: string, details?: string) => {
    try {
      // If your auth is using auth.users (uuid) you'll want to use that user's id here (fetch from supabase.auth.getUser)
      const userRes = await supabase.auth.getUser();
      const userId = userRes?.data?.user?.id ?? null;

      await supabase.from("activity_log").insert([
        {
          user_id: userId ?? null,
          username: userRes?.data?.user?.email ?? null,
          role: null,
          action,
          details,
        },
      ]);
    } catch (e) {
      console.warn("Could not write activity log:", e);
    }
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    // Calculate totals again
    const { subtotal, vat, bagLevy, total } = totals;

    // Create sale rows (simple approach: create one sale per product line)
    // You may want to aggregate same product -> quantity in a real POS
    try {
      const salesPayload: SaleInsert[] = cart.map((item) => ({
        product_id: item.id ?? null,
        shop_id: null,
        quantity: 1,
        price: Number((item as any).price) || 0,
        total_price: Number((item as any).price) || 0,
        created_at: new Date().toISOString(),
      }));

      // insert sales
      const { data: salesInserted, error: salesError } = await supabase.from("sales").insert(salesPayload).select("*");
      if (salesError) {
        console.error("Sales insert error:", salesError);
        alert("Failed to record sale.");
        return;
      }

      // If loyalty payment - deduct loyalty balance
      if (paymentMethod === "loyalty") {
        if (!loyaltyCard) {
          alert("Loyalty card required for loyalty payment.");
          return;
        }
        const totalAmount = total;
        // Check balance (balance stored as numeric string)
        const balanceNum = Number(loyaltyCard.balance || 0);
        if (balanceNum < totalAmount) {
          alert("Insufficient loyalty balance.");
          return;
        }
        // Deduct
        const newBalance = (balanceNum - totalAmount).toFixed(2);
        await supabase.from("loyalty_cards").update({ balance: newBalance }).eq("id", loyaltyCard.id);
        // Log transaction
        const payload: LoyaltyInsert = {
          loyalty_id: loyaltyCard.id,
          sale_id: Array.isArray(salesInserted) && salesInserted[0] ? (salesInserted as any)[0].id : null,
          type: "redeem",
          amount: totalAmount,
          details: `Redeemed for sale`,
          created_at: new Date().toISOString(),
        };
        await supabase.from("loyalty_transactions").insert([payload]);
      }

      // If cash payment and bankChangeOptIn => bank change
      if (paymentMethod === "cash" && bankChangeOptIn && loyaltyCard) {
        // implement simple rounding bank-your-change (round up to nearest integer)
        const totalAmount = total;
        const rounded = Math.ceil(totalAmount);
        const changeToBank = +(rounded - totalAmount).toFixed(2);
        if (changeToBank > 0) {
          // credit loyalty balance and record transaction
          const newBalanceNum = Number(loyaltyCard.balance || 0) + changeToBank;
          await supabase.from("loyalty_cards").update({ balance: newBalanceNum }).eq("id", loyaltyCard.id);
          await supabase.from("loyalty_transactions").insert([
            {
              loyalty_id: loyaltyCard.id,
              sale_id: Array.isArray(salesInserted) && salesInserted[0] ? (salesInserted as any)[0].id : null,
              type: "bank_change",
              amount: changeToBank,
              details: `Banked change (rounded ${rounded} - total ${totalAmount})`,
              created_at: new Date().toISOString(),
            },
          ]);
        }
      }

      // For every item purchased, award cashback (1%) and promo bonus points if applicable
      // fetch active promotions for products in cart
      const productIds = Array.from(new Set(cart.map((c) => c.id).filter(Boolean))) as number[];
      if (productIds.length) {
        const { data: promos } = await supabase
          .from("promotions")
          .select("*")
          .in("product_id", productIds);

        // award 1% cashback by default (store in loyalty balance), and award bonus_points where promo exists
        if (loyaltyCard) {
          let cashbackTotal = 0;
          let pointsTotal = 0;
          cart.forEach((item) => {
            const price = Number((item as any).price) || 0;
            cashbackTotal += price * 0.01; // 1% cashback
            const promoForItem = promos?.find((p: any) => p.product_id === item.id);
            if (promoForItem) pointsTotal += Number(promoForItem.bonus_points || 0);
          });

          if (cashbackTotal > 0) {
            const newBal = Number(loyaltyCard.balance || 0) + +cashbackTotal;
            await supabase.from("loyalty_cards").update({ balance: newBal }).eq("id", loyaltyCard.id);
            await supabase.from("loyalty_transactions").insert([
              {
                loyalty_id: loyaltyCard.id,
                sale_id: Array.isArray(salesInserted) && salesInserted[0] ? (salesInserted as any)[0].id : null,
                type: "earn",
                amount: +cashbackTotal.toFixed(2),
                details: "Auto 1% cashback",
                created_at: new Date().toISOString(),
              },
            ]);
          }

          if (pointsTotal > 0) {
            await supabase
              .from("loyalty_cards")
              .update({ points: (loyaltyCard.points || 0) + pointsTotal })
              .eq("id", loyaltyCard.id);
            // optionally record points as transaction or details
          }
        }
      }

      // Activity log
      await logActivity("checkout", `method=${paymentMethod}; amount=${totals.total}; items=${cart.length}`);

      // Reset cart
      setCart([]);
      setBankChangeOptIn(false);
      setPlasticBag(false);

      alert(`Sale completed. Total: N$${totals.total.toFixed(2)}`);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed - see console.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-700">Cashier Dashboard</h1>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {products.map((p) => (
              <li key={p.id} className="border p-2 rounded bg-white shadow-sm">
                <div className="font-medium">{p.name}</div>
                <div className="text-gray-600">N${Number((p as any).price ?? 0).toFixed(2)}</div>
                <button
                  className="mt-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => addToCart(p)}
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4 mb-2">Cart</h2>
          <ul>
            {cart.map((c, i) => (
              <li key={`${c.id}-${i}`} className="flex justify-between items-center border-b py-1">
                <div>{c.name} - N${Number((c as any).price ?? 0).toFixed(2)}</div>
                <div className="flex items-center">
                  <button
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => removeFromCart(c.id)}
                  >
                    Return
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 bg-gray-50 p-3 rounded shadow">
            <p>Subtotal: N${totals.subtotal.toFixed(2)}</p>
            <p>VAT (15%): N${totals.vat.toFixed(2)}</p>
            <p>Plastic Bag Levy: N${totals.bagLevy.toFixed(2)}</p>
            <p className="font-bold text-lg text-red-700">Total: N${totals.total.toFixed(2)}</p>

            <div className="mt-3 space-y-2">
              <label className="block">
                Payment method:
                <select
                  className="ml-2 p-1 border rounded"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit Card</option>
                  <option value="loyalty">Loyalty Card</option>
                </select>
              </label>

              <label className="block">
                <input
                  type="checkbox"
                  checked={plasticBag}
                  onChange={(e) => setPlasticBag(e.target.checked)}
                />{" "}
                Include plastic bag?
              </label>

              {paymentMethod === "loyalty" || bankChangeOptIn || loyaltyCard ? (
                <div className="mt-2">
                  <label className="block">Loyalty ID number (Namibian ID):</label>
                  <input
                    className="border p-1 rounded w-full md:w-1/3"
                    value={loyaltyIdNumber}
                    onChange={(e) => setLoyaltyIdNumber(e.target.value)}
                    placeholder="88041200521"
                  />
                  {loyaltyCard && (
                    <div className="mt-1 text-sm">
                      Card: {loyaltyCard.customer_name} • Balance: N${Number(loyaltyCard.balance).toFixed(2)} • Points: {loyaltyCard.points}
                    </div>
                  )}
                </div>
              ) : null}

              {paymentMethod === "cash" && (
                <label className="block mt-2">
                  <input
                    type="checkbox"
                    checked={bankChangeOptIn}
                    onChange={(e) => setBankChangeOptIn(e.target.checked)}
                    disabled={!loyaltyCard}
                  />{" "}
                  Ask to bank change to loyalty card (must have loyalty card set)
                </label>
              )}

              <div className="mt-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={checkout}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
