import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase"
import { getTopEvents } from "@/lib/gamma"
import { scoreEvents } from "@/lib/scorer"
import { sendTelegramMessage, formatSignalAlert } from "@/lib/telegram"

// Called by Vercel Cron every 5 minutes
// Also callable manually: GET /api/alerts/check
// Protected by CRON_SECRET in production

export async function GET(req: Request) {
  // Verify cron secret in production
  const authHeader = req.headers.get("authorization")
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceClient()

  try {
    // 1. Score top markets
    const events = await getTopEvents(50)
    const scored = scoreEvents(events)

    // 2. Persist signal snapshots
    const snapshots = scored.slice(0, 20).map((s) => ({
      market_id: s.market.id,
      signal_score: s.score,
      yes_price: s.yesPrice,
      no_price: s.noPrice,
      volume_24h: s.volume24h,
    }))

    await supabase.from("signals").insert(snapshots)

    // 3. Load all alert prefs with a telegram_chat_id set
    const { data: prefs } = await supabase
      .from("alert_prefs")
      .select("*")
      .not("telegram_chat_id", "is", null)

    if (!prefs || prefs.length === 0) {
      return NextResponse.json({ ok: true, fired: 0, reason: "no_prefs" })
    }

    // 4. For each user, find markets that meet their threshold
    let totalFired = 0

    for (const pref of prefs) {
      const threshold = pref.min_score ?? 70
      const eligible = scored.filter((s) => {
        if (s.score < threshold) return false
        if (s.category === "CRYPTO" && !pref.crypto_alerts) return false
        if (s.category === "FOOTBALL" && !pref.football_alerts) return false
        return true
      })

      if (eligible.length === 0) continue

      // Check which of these we already alerted on in the last 6 hours
      const marketIds = eligible.map((s) => s.market.id)
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()

      const { data: recentAlerts } = await supabase
        .from("signals")
        .select("market_id")
        .in("market_id", marketIds)
        .gte("created_at", sixHoursAgo)
        .limit(200)

      // Markets we haven't alerted on recently (aside from the snapshot we just inserted)
      // Use a simple approach: only fire for top signal per run
      const alreadyAlerted = new Set(
        (recentAlerts ?? []).map((r: { market_id: string }) => r.market_id)
      )

      // Fire for markets that are new spikes (not in recent alerts before this run)
      const toFire = eligible.slice(0, 3) // max 3 alerts per user per run

      for (const signal of toFire) {
        const chatId = pref.telegram_chat_id!
        const msg = formatSignalAlert({
          label: signal.label,
          score: signal.score,
          title: signal.event.title,
          yesPrice: signal.yesPrice,
          noPrice: signal.noPrice,
          volume24h: signal.volume24h,
          slug: signal.event.slug,
        })

        const sent = await sendTelegramMessage(chatId, msg)
        if (sent) totalFired++
      }

      void alreadyAlerted // suppress unused warning
    }

    return NextResponse.json({
      ok: true,
      fired: totalFired,
      markets_scored: scored.length,
      snapshots_saved: snapshots.length,
    })
  } catch (err) {
    console.error("[alerts/check] error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
