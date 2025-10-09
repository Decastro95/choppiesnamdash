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
          id: number;
          email: string;
          password: string;
          role_id: number;
          shop_id: number;
          created_at: string | null;
        };
        Insert: {
          email: string;
          password: string;
          role_id: number;
          shop_id: number;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };

      roles: {
        Row: {
          id: number;
          name: string;
        };
        Insert: { name: string };
        Update: Partial<Database["public"]["Tables"]["roles"]["Insert"]>;
      };

      shops: {
        Row: {
          id: number;
          name: string;
          location: string;
        };
        Insert: { name: string; location: string };
        Update: Partial<Database["public"]["Tables"]["shops"]["Insert"]>;
      };

      products: {
        Row: {
          id: number;
          name: string;
          category: string;
          price: number;
          stock: number;
          expiry_date: string | null;
        };
        Insert: {
          name: string;
          category: string;
          price: number;
          stock: number;
          expiry_date?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };

      sales: {
        Row: {
          id: number;
          product_id: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          product_id: number;
          total_price: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sales"]["Insert"]>;
      };

      orders: {
        Row: {
          id: number;
          supplier_id: number | null;
          status: string;
          created_at: string;
        };
        Insert: {
          supplier_id?: number | null;
          status: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
    };
  };
}
