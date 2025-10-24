// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [k: string]: Json | undefined }
  | Json[];

/**
 * Minimal Database type focused on tables used by the dashboards.
 * Extend as needed (matches your Supabase schema in conversation).
 */
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          product_id: string | null;
          name: string;
          price: number | null; // ensure price exists in DB or adapt
          category_id: number | null;
          quantity: number | null;
          vat_rate: number | null;
        };
        Insert: {
          product_id?: string | null;
          name: string;
          price?: number | null;
          category_id?: number | null;
          quantity?: number | null;
          vat_rate?: number | null;
        };
        Update: {
          product_id?: string | null;
          name?: string;
          price?: number | null;
          category_id?: number | null;
          quantity?: number | null;
          vat_rate?: number | null;
        };
      };
      sales: {
        Row: {
          id: number;
          product_id: number | null;
          shop_id: number | null;
          quantity: number;
          price: number;
          total_price: number | null;
          payment_method: "cash" | "credit_card" | "loyalty_card" | null;
          customer_name: string | null;
          loyalty_card_number: string | null;
          created_at: string;
        };
        Insert: {
          product_id: number | null;
          shop_id?: number | null;
          quantity?: number;
          price: number;
          total_price?: number | null;
          payment_method?: "cash" | "credit_card" | "loyalty_card" | null;
          customer_name?: string | null;
          loyalty_card_number?: string | null;
          created_at?: string;
        };
        Update: {
          product_id?: number | null;
          shop_id?: number | null;
          quantity?: number;
          price?: number;
          total_price?: number | null;
          payment_method?: "cash" | "credit_card" | "loyalty_card" | null;
          customer_name?: string | null;
          loyalty_card_number?: string | null;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: number;
          shop_id?: number | null;
          role_id?: number | null;
          email: string;
          password?: string | null;
          auth_user_id?: string | null; // uuid
        };
        Insert: {
          shop_id?: number | null;
          role_id?: number | null;
          email: string;
          password?: string | null;
          auth_user_id?: string | null;
        };
        Update: {
          shop_id?: number | null;
          role_id?: number | null;
          email?: string;
          password?: string | null;
          auth_user_id?: string | null;
        };
      };
      orders: {
        Row: {
          id: number;
          supplier_id?: number | null;
          status: string;
          created_at: string;
        };
        Insert: {
          supplier_id?: number | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          supplier_id?: number | null;
          status?: string;
          created_at?: string;
        };
      };
      activity_log: {
        Row: {
          id: number;
          user_id?: string | null; // uuid
          username?: string | null;
          role?: string | null;
          action: string;
          details?: string | null;
          timestamp: string;
        };
        Insert: {
          user_id?: string | null;
          username?: string | null;
          role?: string | null;
          action: string;
          details?: string | null;
          timestamp?: string;
        };
        Update: {
          user_id?: string | null;
          username?: string | null;
          role?: string | null;
          action?: string;
          details?: string | null;
          timestamp?: string;
        };
      };
      loyalty_cards: {
        Row: {
          id: number;
          card_number: string;
          customer_name?: string | null;
          points: number;
          created_at: string;
        };
        Insert: {
          card_number: string;
          customer_name?: string | null;
          points?: number;
          created_at?: string;
        };
        Update: {
          card_number?: string;
          customer_name?: string | null;
          points?: number;
          created_at?: string;
        };
      };
      // add other tables as needed...
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
