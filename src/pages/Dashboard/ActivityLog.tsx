// src/pages/Dashboard/ActivityLog.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

type LogRow = {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  timestamp: string;
};

export default function ActivityLog() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("activity_log")
          .select("*")
          .order("timestamp", { ascending: false })
          .limit(200);

        if (error) throw error;
        setLogs((data ?? []) as LogRow[]);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Activity Log</h1>

      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500">No activity recorded yet.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{l.user_email ?? l.user_id ?? "Unknown"}</td>
                  <td className="px-4 py-2">{l.action}</td>
                  <td className="px-4 py-2">{new Date(l.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
