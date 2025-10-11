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
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'ceo' | 'manager' | 'supplier' | 'cashier';
          password_hash: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          role: 'admin' | 'ceo' | 'manager' | 'supplier' | 'cashier';
          password_hash?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'ceo' | 'manager' | 'supplier' | 'cashier';
          password_hash?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };

      activity_log: {
        Row: {
          id: number;
          user_id: string | null;
          action: string;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          action: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          action?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'activity_log_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      products: {
        Row: {
          id: number;
          name: string;
          category: string | null;
          quantity: number;
          price: number;
          supplier_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          category?: string | null;
          quantity?: number;
          price?: number;
          supplier_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          category?: string | null;
          quantity?: number;
          price?: number;
          supplier_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'products_supplier_id_fkey';
            columns: ['supplier_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      sales: {
        Row: {
          id: number;
          product_id: number;
          quantity: number;
          total: number;
          cashier_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          product_id: number;
          quantity: number;
          total?: number;
          cashier_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          product_id?: number;
          quantity?: number;
          total?: number;
          cashier_id?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'sales_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sales_cashier_id_fkey';
            columns: ['cashier_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      deliveries: {
        Row: {
          id: number;
          supplier_id: string | null;
          product_id: number;
          quantity_delivered: number;
          delivery_date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          supplier_id?: string | null;
          product_id: number;
          quantity_delivered: number;
          delivery_date?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          supplier_id?: string | null;
          product_id?: number;
          quantity_delivered?: number;
          delivery_date?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deliveries_supplier_id_fkey';
            columns: ['supplier_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deliveries_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
    };

    Views: {
      user_roles: {
        Row: {
          user_id: string;
          role: string;
        };
      };
    };

    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
