// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [k: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          price: number;
          category?: string | null;
          quantity?: number | null;
        };
        Insert: {
          id?: number;
          name: string;
          price: number;
          category?: string | null;
          quantity?: number | null;
        };
        Update: {
          id?: number;
          name?: string;
          price?: number;
          category?: string | null;
          quantity?: number | null;
        };
      };
      sales: {
        Row: {
          id: number;
          product_id: number;
          quantity: number;
          total_price: number;
          vat_amount: number;
          plastic_bag_fee: number;
          user_id?: string | null;
          created_at: string;
        };
        Insert: {
          product_id: number;
          quantity?: number;
          total_price: number;
          vat_amount?: number;
          plastic_bag_fee?: number;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          product_id?: number;
          quantity?: number;
          total_price?: number;
          vat_amount?: number;
          plastic_bag_fee?: number;
          user_id?: string | null;
          created_at?: string;
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
      users: {
        Row: {
          id: string;
          email: string;
          role?: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          role?: string | null;
        };
        Update: {
          email?: string;
          role?: string | null;
        };
      };
      activity_log: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string | null;
          action: string;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          user_email?: string | null;
          action: string;
          timestamp?: string;
        };
        Update: {
          user_id?: string | null;
          user_email?: string | null;
          action?: string;
          timestamp?: string;
        };
      };
      roles: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
      };
      shops: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          name?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
