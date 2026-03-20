import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"

// GET /api/alerts/prefs?wallet=0x...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get("wallet")
  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from("alert_prefs")
    .select("*")
    .eq("wallet", wallet)
    .single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? null)
}

// POST /api/alerts/prefs
// Body: { wallet, telegram_chat_id, min_score, crypto_alerts, football_alerts }
export async function POST(req: Request) {
  const body = await req.json()
  const { wallet, telegram_chat_id, min_score, crypto_alerts, football_alerts } = body

  if (!wallet) return NextResponse.json({ error: "wallet required" }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase.from("alert_prefs").upsert(
    {
      wallet,
      telegram_chat_id: telegram_chat_id ?? null,
      min_score: min_score ?? 70,
      crypto_alerts: crypto_alerts ?? true,
      football_alerts: football_alerts ?? true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "wallet" }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
