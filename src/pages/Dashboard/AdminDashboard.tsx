import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Sale = Database["public"]["Tables"]["sales"]["Row"];

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const ZERO_RATED = ["maize meal", "bread", "mahango", "fresh milk"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: prodData, error: prodError } = await supabase
        .from<Product>("products")
        .select("*");
      if (prodError) console.error("Admin fetch products error:", prodError);
      if (prodData) setProducts(prodData);

      const { data: salesData, error: salesError } = await supabase
        .from<Sale>("sales")
        .select("*");
      if (salesError) console.error("Admin fetch sales error:", salesError);
      if (salesData) setSales(salesData);

      setLoading(false);
    };

    fetchData();
  }, []);

  const calculateTotals = () => {
    let subtotal = 0;
    let vat = 0;
    let bagLevy = 0;

    sales.forEach((sale) => {
      const product = products.find((p) => Number(p.id) === Number(sale.product_id));
      if (!product) return;
      const price = Number((product as any).price) || 0;
      const quantity = Number(sale.quantity) || 1;
      const lineItemTotal = price * quantity;
      subtotal += lineItemTotal;
      if (!ZERO_RATED.includes((product.name || "").toLowerCase())) {
        vat += lineItemTotal * 0.15;
      }
      if ((product.name || "").toLowerCase().includes("plastic bag")) {
        bagLevy += 1 * quantity;
      }
    });

    return { subtotal, vat, bagLevy, total: subtotal + vat + bagLevy };
  };

  const { subtotal, vat, bagLevy, total } = calculateTotals();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {loading && <p>Loading data...</p>}

      {!loading && (
        <>
          <h2 className="text-xl font-semibold mb-2">Sales Summary</h2>
          <ul>
            {sales.map((s) => {
              const product = products.find((p) => Number(p.id) === Number(s.product_id));
              const price = product ? Number((product as any).price) || 0 : 0;
              return (
                <li key={s.id}>
                  {(product?.name) || "Unknown"} - N${price.toFixed(2)}
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
