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
      users: {
        Row: {
          id: number
          shop_id: number
          role_id: number
          email: string
          password: string
          created_at: string
        }
        Insert: {
          id?: number
          shop_id: number
          role_id: number
          email: string
          password: string
          created_at?: string
        }
        Update: {
          id?: number
          shop_id?: number
          role_id?: number
          email?: string
          password?: string
          created_at?: string
        }
      }
      roles: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      shops: {
        Row: {
          id: number
          name: string
          location: string | null
          phone: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          location?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          location?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: number
          product_id: string
          name: string
          category: string
          price: number
          quantity: number
          vat_rate: number
          zero_rated: boolean
          created_at: string
        }
        Insert: {
          id?: number
          product_id: string
          name: string
          category: string
          price: number
          quantity: number
          vat_rate?: number
          zero_rated?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          product_id?: string
          name?: string
          category?: string
          price?: number
          quantity?: number
          vat_rate?: number
          zero_rated?: boolean
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: number
          product_id: number
          user_id: number
          quantity: number
          total_price: number
          vat_amount: number
          plastic_bag_fee: number
          created_at: string
        }
        Insert: {
          id?: number
          product_id: number
          user_id: number
          quantity: number
          total_price: number
          vat_amount?: number
          plastic_bag_fee?: number
          created_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          user_id?: number
          quantity?: number
          total_price?: number
          vat_amount?: number
          plastic_bag_fee?: number
          created_at?: string
        }
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
  }
}
