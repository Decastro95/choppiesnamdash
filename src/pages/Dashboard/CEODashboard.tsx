import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type Sale = Database["public"]["Tables"]["sales"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

export default function CEODashboard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: salesData, error: salesError } = await supabase
        .from<Sale>("sales")
        .select("*");
      if (salesError) console.error("CEO fetch sales error:", salesError);
      if (salesData) setSales(salesData);

      const { data: productsData, error: prodError } = await supabase
        .from<Product>("products")
        .select("*");
      if (prodError) console.error("CEO fetch products error:", prodError);
      if (productsData) setProducts(productsData);

      setLoading(false);
    };

    fetchData();
  }, []);

  const calculateVAT = (amount: number) => amount * 0.15;
  const calculatePlasticBagLevy = (items: Product[]) => {
    const bagCount = items.filter((p) => (p.name || "").toLowerCase().includes("plastic bag")).length;
    return bagCount * 1;
  };

  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_price || 0), 0);
  const vatTotal = calculateVAT(totalRevenue);
  const bagLevy = calculatePlasticBagLevy(products);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CEO Dashboard</h1>
      {loading && <p>Loading...</p>}

      {!loading && (
        <>
          <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
          <p>N${totalRevenue.toFixed(2)}</p>

          <h2 className="text-xl font-semibold mb-2">VAT Collected (15%)</h2>
          <p>N${vatTotal.toFixed(2)}</p>

          <h2 className="text-xl font-semibold mb-2">Plastic Bag Levy</h2>
          <p>N${bagLevy.toFixed(2)}</p>

          <h2 className="text-xl font-semibold mb-2">Sales Details</h2>
          <ul>
            {sales.map((s) => (
              <li key={s.id}>
                Sale ID: {s.id} - Total: N${(Number(s.total_price || 0)).toFixed(2)}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
