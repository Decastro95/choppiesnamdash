// src/types/supabase.ts
// ✅ Clean Supabase typings for all your app tables

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string; // UUID from auth.users
          email: string | null;
          role: "admin" | "manager" | "cashier" | "supplier" | "ceo" | null;
          full_name: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email?: string | null;
          role?: "admin" | "manager" | "cashier" | "supplier" | "ceo" | null;
          full_name?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };

      products: {
        Row: {
          id: number;
          name: string;
          category?: string | null;
          price: number;
          quantity: number;
          supplier_id?: string | null;
          created_at?: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          category?: string | null;
          price: number;
          quantity: number;
          supplier_id?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };

      sales: {
        Row: {
          id: number;
          product_id: number;
          quantity: number;
          total_price: number;
          vat_amount?: number | null;
          plastic_bag_fee?: number | null;
          payment_method: "cash" | "credit_card" | "loyalty_card";
          customer_name?: string | null;
          customer_id_number?: string | null;
          user_id?: string | null;
          created_at?: string | null;
        };
        Insert: {
          id?: number;
          product_id: number;
          quantity: number;
          total_price: number;
          vat_amount?: number | null;
          plastic_bag_fee?: number | null;
          payment_method: "cash" | "credit_card" | "loyalty_card";
          customer_name?: string | null;
          customer_id_number?: string | null;
          user_id?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sales"]["Insert"]>;
      };

      activity_log: {
        Row: {
          id: string;
          user_uuid?: string | null; // references auth.users.id
          user_email?: string | null;
          action: string;
          timestamp: string | null;
        };
        Insert: {
          id?: string;
          user_uuid?: string | null;
          user_email?: string | null;
          action: string;
          timestamp?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["activity_log"]["Insert"]>;
      };
    };
  };
}
