import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Database } from "../types/supabase";

type SaleSummary = Database["public"]["Views"]["sales_summary"]["Row"];

export default function CeoDashboard() {
  const [summary, setSummary] = useState<SaleSummary[]>([]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const { data } = await supabase.from("sales_summary").select("*");
    setSummary(data || []); // Type-safe fallback
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CEO Dashboard</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Total Sales</th>
            <th className="border px-2 py-1">Total VAT</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((s) => (
            <tr key={s.date}>
              <td className="border px-2 py-1">{s.date}</td>
              <td className="border px-2 py-1">N${s.total_sales}</td>
              <td className="border px-2 py-1">N${s.total_vat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
