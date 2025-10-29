import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface ChoppiesHeaderProps {
  title: string;
  subtitle?: string;
}

export default function ChoppiesHeader({ title, subtitle }: ChoppiesHeaderProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return (
    <div className="bg-gradient-to-r from-choppies-red to-red-700 text-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-lg p-2">
            <img
              src="/brand/choppies-logo.png"
              alt="Choppies"
              className="h-12 w-12 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-red-100 mt-1 italic font-medium">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-red-100">Logged in as</div>
            <div className="font-semibold">{user?.email || "Guest"}</div>
          </div>
          <img
            src="/brand/namibian-flag.svg"
            alt="Namibia"
            className="h-8 w-12 object-cover rounded shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
