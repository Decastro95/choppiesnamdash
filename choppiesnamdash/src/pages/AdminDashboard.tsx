import { useEffect, useState } from "react"
import { supabase } from "../../supabaseClient"
import { Database } from "../../types/supabase"

type Sale = Database["public"]["Tables"]["sales"]["Row"]

export default function AdminDashboard() {
  const [sales, setSales] = useState<Sale[]>([])

  useEffect(() => {
    const fetchSales = async () => {
      const { data, error } = await supabase.from("sales").select("*")
      if (error) console.error("Error fetching sales:", error)
      else setSales(data || [])
    }
    fetchSales()
  }, [])

  const totalRevenue = sales.reduce((sum, s) => sum + s.total_price, 0)
  const totalVAT = sales.reduce((sum, s) => sum + (s.vat_amount || 0), 0)
  const totalBags = sales.reduce((sum, s) => sum + (s.plastic_bag_fee || 0), 0)

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold">Total Revenue</h2>
          <p>N$ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold">VAT Collected</h2>
          <p>N$ {totalVAT.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold">Plastic Bag Fees</h2>
          <p>N$ {totalBags.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-6">All Sales (Audit)</h2>
      <table className="w-full border mt-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Sale ID</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">VAT</th>
            <th className="border p-2">Bag Fee</th>
            <th className="border p-2">User ID</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id}>
              <td className="border p-2">{s.id}</td>
              <td className="border p-2">N$ {s.total_price.toFixed(2)}</td>
              <td className="border p-2">N$ {s.vat_amount.toFixed(2)}</td>
              <td className="border p-2">N$ {s.plastic_bag_fee.toFixed(2)}</td>
              <td className="border p-2">{s.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

