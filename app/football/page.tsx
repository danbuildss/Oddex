import type { Metadata } from "next"
import { getFootballEvents } from "@/lib/gamma"
import { scoreEvents } from "@/lib/scorer"
import { StatCard } from "@/components/oddex/stat-card"
import { SignalCard } from "@/components/oddex/signal-card"
import { MarketTable } from "@/components/oddex/market-table"
import { Panel } from "@/components/oddex/panel"

export const metadata: Metadata = {
  title: "Football Markets — Oddex",
}

export const dynamic = "force-dynamic"

const TOURNAMENTS = [
  { label: "PREMIER_LEAGUE", pattern: /premier league|epl|english/i },
  { label: "CHAMPIONS_LEAGUE", pattern: /champions league|ucl/i },
  { label: "WORLD_CUP", pattern: /world cup|fifa/i },
  { label: "LA_LIGA", pattern: /la liga|spanish|laliga/i },
  { label: "BUNDESLIGA", pattern: /bundesliga|german/i },
  { label: "SERIE_A", pattern: /serie a|italian/i },
  { label: "MLS", pattern: /mls|major league soccer/i },
]

export default async function FootballPage() {
  const events = await getFootballEvents(50)
  const scored = scoreEvents(events)

  const topScore = scored[0]?.score ?? 0
  const signals = scored.filter((s) => s.score >= 60)
  const maxVol = scored[0]?.volume24h ?? 1

  const clusters = TOURNAMENTS.map((t) => ({
    label: t.label,
    items: scored.filter((s) => t.pattern.test(s.event.title)).slice(0, 4),
  })).filter((c) => c.items.length > 0)

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        <StatCard label="FOOTBALL_MARKETS" value={scored.length} sub="active markets" color="#00e5ff" />
        <StatCard label="HIGH_SIGNALS" value={signals.length} sub="score ≥ 60" color="#00ff88" trend="up" />
        <StatCard label="TOP_SIGNAL" value={`${topScore}/100`} sub={scored[0]?.event.title?.slice(0, 28) + "…"} color="#f5a623" />
      </div>

      {/* Signal tape */}
      <Panel title="FOOTBALL_SIGNAL_TAPE">
        <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {scored.slice(0, 12).map((item) => (
            <SignalCard key={item.event.id} item={item} maxVol={maxVol} />
          ))}
        </div>
      </Panel>

      {/* Tournament clusters */}
      {clusters.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {clusters.map((cluster) => (
            <Panel key={cluster.label} title={cluster.label}>
              <div style={{ padding: "8px" }}>
                {cluster.items.map((item) => (
                  <SignalCard key={item.event.id} item={item} maxVol={maxVol} />
                ))}
              </div>
            </Panel>
          ))}
        </div>
      )}

      {scored.length === 0 && (
        <div
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "4px",
            padding: "40px",
            textAlign: "center",
            fontFamily: "JetBrains Mono, monospace",
            color: "#444",
          }}
        >
          // NO_FOOTBALL_MARKETS_ACTIVE
        </div>
      )}

      {/* Full table */}
      {scored.length > 0 && (
        <Panel title="ALL_FOOTBALL_MARKETS">
          <MarketTable items={scored} />
        </Panel>
      )}
    </div>
  )
}
