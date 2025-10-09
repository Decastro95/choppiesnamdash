// src/pages/Dashboard/ManagerDashboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Sale = Database["public"]["Tables"]["sales"]["Row"];

export default function ManagerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const ZERO_RATED = ["maize meal", "bread", "mahango", "fresh milk"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: prodData, error: prodError } = await supabase.from("products").select("*");
      if (prodError) console.error(prodError);
      if (prodData) setProducts(prodData as Product[]);

      const { data: salesData, error: salesError } = await supabase.from("sales").select("*");
      if (salesError) console.error(salesError);
      if (salesData) setSales(salesData as Sale[]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const calculateTotals = () => {
    let subtotal = 0;
    let vat = 0;
    let bagLevy = 0;

    sales.forEach((sale) => {
      const product = products.find((p) => p.id === sale.product_id);
      if (!product) return;
      const price = Number(product.price) || 0;
      subtotal += price;
      if (!ZERO_RATED.includes(product.name.toLowerCase())) {
        vat += price * 0.15;
      }
      if (product.name.toLowerCase().includes("plastic bag")) bagLevy += 1;
    });

    return { subtotal, vat, bagLevy, total: subtotal + vat + bagLevy };
  };

  const { subtotal, vat, bagLevy, total } = calculateTotals();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      {loading && <p>Loading data...</p>}

      {!loading && (
        <>
          <h2 className="text-xl font-semibold mb-2">Sales Overview</h2>
          <ul>
            {sales.map((s) => {
              const product = products.find((p) => p.id === s.product_id);
              return (
                <li key={s.id}>
                  {product?.name || "Unknown"} - N${product?.price?.toFixed?.(2) ?? "0.00"}
                </li>
              );
            })}
          </ul>

          <div className="mt-4">
            <p>Subtotal: N${subtotal.toFixed(2)}</p>
            <p>VAT (15%): N${vat.toFixed(2)}</p>
            <p>Plastic Bag Levy: N${bagLevy.toFixed(2)}</p>
            <p className="font-bold">Total Sales: N${total.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
}
