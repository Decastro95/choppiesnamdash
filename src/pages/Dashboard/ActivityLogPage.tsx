import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";

type Activity = Database["public"]["Tables"]["activity_log"]["Row"];

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) console.error(error);
      if (data) setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">User Activity Log</h1>
      {loading ? (
        <p>Loading activity logs...</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {logs.map((log) => (
            <li key={log.id} className="py-2">
              <strong>{log.user_email || "Unknown User"}</strong> — {log.action} <br />
              <span className="text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
