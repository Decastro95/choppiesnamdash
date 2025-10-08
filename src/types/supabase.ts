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
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          stock: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          stock: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          stock?: number;
          created_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          product_id: string;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          total_price?: number;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          status: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}
