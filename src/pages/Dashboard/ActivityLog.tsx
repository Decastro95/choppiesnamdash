// src/pages/Dashboard/ActivityLog.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import type { Database } from "../../types/supabase";
import { exportToCSV } from "../../utils/exportHelpers";

type Log = Database["public"]["Tables"]["activity_log"]["Row"];

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("activity_log").select("*").order("timestamp", { ascending: false }).limit(200);
      if (data) setLogs(data as Log[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-4">
      <div className="app-header card mb-4">
        <h1 className="text-lg font-bold">Activity Log</h1>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Recent activity</h2>
          <div className="flex gap-2">
            <button className="py-2 px-3 border rounded" onClick={() => exportToCSV(logs, "activity.csv")}>Export CSV</button>
          </div>
        </div>
        <ul>
          {logs.map((l) => (
            <li key={l.id} className="py-2 border-b">
              <div className="text-sm">{l.action}</div>
              <div className="text-xs text-gray-500">{l.username ?? l.user_id} — {new Date(l.timestamp).toLocaleString()}</div>
              {l.details && <div className="text-xs text-gray-700 mt-1">{l.details}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
