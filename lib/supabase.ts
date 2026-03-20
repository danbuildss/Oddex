import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (for cron endpoints)
export function createServiceClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
}

export type Database = {
  public: {
    Tables: {
      signals: {
        Row: {
          id: string
          market_id: string
          signal_score: number
          yes_price: number
          no_price: number
          volume_24h: number
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["signals"]["Row"], "id" | "created_at">
      }
      trader_scores: {
        Row: {
          wallet: string
          score: number
          win_rate: number
          specialty: string
          total_volume: number
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["trader_scores"]["Row"], "updated_at">
      }
      alert_prefs: {
        Row: {
          wallet: string
          telegram_chat_id: string | null
          min_score: number
          crypto_alerts: boolean
          football_alerts: boolean
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["alert_prefs"]["Row"], "updated_at">
      }
    }
  }
}
