export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activity_log: {
        Row: {
          id: number
          user_id: string | null
          action: string
          details: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id?: string | null
          action: string
          details?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string | null
          action?: string
          details?: string | null
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: number
          supplier_id: number | null
          product_id: number | null
          quantity: number
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          supplier_id?: number | null
          product_id?: number | null
          quantity: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: number
          supplier_id?: number | null
          product_id?: number | null
          quantity?: number
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: number
          name: string
          category: string | null
          price: number
          stock: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          category?: string | null
          price: number
          stock?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          category?: string | null
          price?: number
          stock?: number
          created_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          id: number
          product_id: number
          discount_percentage: number
          start_date: string | null
          end_date: string | null
          created_at: string
        }
        Insert: {
          id?: number
          product_id: number
          discount_percentage: number
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          discount_percentage?: number
          start_date?: string | null
          end_date?: string | null
          created_at?: string
        }
        Relationships: []
      }
      purchase_orders: {
        Row: {
          id: number
          supplier_id: number | null
          product_id: number | null
          quantity: number
          status: string
          created_at: string
        }
        Insert: {
          id?: number
          supplier_id?: number | null
          product_id?: number | null
          quantity: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: number
          supplier_id?: number | null
          product_id?: number | null
          quantity?: number
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          id: number
          product_id: number
          quantity: number
          price: number
          total_price: number | null
          payment_method: string | null
          loyalty_card_number: string | null
          created_at: string
        }
        Insert: {
          id?: number
          product_id: number
          quantity: number
          price: number
          total_price?: number | null
          payment_method?: string | null
          loyalty_card_number?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          quantity?: number
          price?: number
          total_price?: number | null
          payment_method?: string | null
          loyalty_card_number?: string | null
          created_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string
          role_id: number | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role_id?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role_id?: number | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
