// src/types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role_id: string;
        };
        Insert: {
          id?: string;
          email: string;
          role_id: string;
        };
        Update: {
          id?: string;
          email?: string;
          role_id?: string;
        };
      };
      // 👆 Add other tables as needed (sales, products, inventory, etc.)
    };
  };
}
