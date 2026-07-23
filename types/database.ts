/**
 * Database types for the Supabase client.
 * Hand-maintained to match supabase/schema.sql. If the schema grows a lot,
 * consider generating these with `supabase gen types typescript`.
 */

export type ProductType = "resale" | "supply"

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          type: ProductType
          default_price: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: ProductType
          default_price?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: ProductType
          default_price?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          id: string
          product_id: string
          purchase_date: string
          quantity: number
          rate: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          purchase_date?: string
          quantity: number
          rate: number
          // total is a generated column — never inserted
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          purchase_date?: string
          quantity?: number
          rate?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
            isOneToOne: false
          },
        ]
      }
    }
    Views: {
      product_stats: {
        Row: {
          product_id: string
          purchase_count: number
          total_quantity: number
          total_spent: number
          min_rate: number | null
          max_rate: number | null
          avg_rate: number | null
          last_rate: number | null
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience aliases used across the app.
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

export type Purchase = Database["public"]["Tables"]["purchases"]["Row"]
export type PurchaseInsert = Database["public"]["Tables"]["purchases"]["Insert"]
export type PurchaseUpdate = Database["public"]["Tables"]["purchases"]["Update"]

export type ProductStats = Database["public"]["Views"]["product_stats"]["Row"]
