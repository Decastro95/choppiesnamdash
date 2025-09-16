// src/pages/Dashboard/ManagerDashboard.tsx
import { useEffect } from "react";
import { useLowStockAlerts } from "../../hooks/useLowStockAlerts";

const ManagerDashboard = () => {
  const { alerts, loading } = useLowStockAlerts();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Low Stock Alerts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : alerts.length === 0 ? (
          <p className="text-green-600">All products are sufficiently stocked.</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map(alert => (
              <li
                key={alert.id}
                className="p-2 border rounded bg-red-50 flex justify-between items-center"
              >
                <span>
                  Product: <strong>{alert.product_id}</strong> - Qty: {alert.current_quantity}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(alert.alert_date).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Additional manager sections like sales, inventory, etc. */}
    </div>
  );
};

export default ManagerDashboard;
