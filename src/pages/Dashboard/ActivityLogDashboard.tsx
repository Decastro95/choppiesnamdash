import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type ActivityLog = Database["public"]["Tables"]["activity_log"]["Row"];

export default function ActivityLogDashboard() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error loading activity logs:", error);
        setError("Failed to load activity logs");
      } else {
        setLogs(data as ActivityLog[]);
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-red-700">Activity Log Dashboard</h1>

      {loading && <p>Loading logs...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-4 border-b">User</th>
                <th className="text-left py-2 px-4 border-b">Role</th>
                <th className="text-left py-2 px-4 border-b">Action</th>
                <th className="text-left py-2 px-4 border-b">Details</th>
                <th className="text-left py-2 px-4 border-b">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No activity recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 px-4 border-b">{log.username}</td>
                    <td className="py-2 px-4 border-b">{log.role}</td>
                    <td className="py-2 px-4 border-b text-blue-700">{log.action}</td>
                    <td className="py-2 px-4 border-b text-gray-700">{log.details}</td>
                    <td className="py-2 px-4 border-b text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
