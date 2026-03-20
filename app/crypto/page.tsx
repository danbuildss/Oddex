import type { Metadata } from "next"
import { getCryptoEvents } from "@/lib/gamma"
import { scoreEvents } from "@/lib/scorer"
import { StatCard } from "@/components/oddex/stat-card"
import { SignalCard } from "@/components/oddex/signal-card"
import { MarketTable } from "@/components/oddex/market-table"
import { Panel } from "@/components/oddex/panel"

export const metadata: Metadata = {
  title: "Crypto Markets — Oddex",
}

export const dynamic = "force-dynamic"

const CLUSTERS = [
  { label: "BTC", pattern: /bitcoin|btc/i },
  { label: "ETH", pattern: /ethereum|eth/i },
  { label: "MACRO", pattern: /fed|rate|inflation|treasury|dollar|usd|gdp/i },
  { label: "REGULATION", pattern: /sec|regulation|ban|legal|law|congress|senate/i },
]

export default async function CryptoPage() {
  const events = await getCryptoEvents(50)
  const scored = scoreEvents(events)

  const topScore = scored[0]?.score ?? 0
  const totalVol = scored.reduce((s, m) => s + m.volume24h, 0)
  const signals = scored.filter((s) => s.score >= 60)
  const maxVol = scored[0]?.volume24h ?? 1

  const clusters = CLUSTERS.map((c) => ({
    label: c.label,
    items: scored.filter((s) => c.pattern.test(s.event.title)).slice(0, 4),
  })).filter((c) => c.items.length > 0)

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        <StatCard label="CRYPTO_MARKETS" value={scored.length} sub="active markets" color="#f5a623" />
        <StatCard label="TOP_SIGNAL" value={`${topScore}/100`} sub={scored[0]?.event.title?.slice(0, 24) + "…"} color="#00ff88" />
        <StatCard label="HIGH_SIGNALS" value={signals.length} sub="score ≥ 60" color="#00e5ff" trend="up" />
        <StatCard label="CRYPTO_VOL_24H" value={totalVol} sub="aggregate volume" color="#f5a623" />
      </div>

      {/* Signal tape */}
      <Panel title="CRYPTO_SIGNAL_TAPE">
        <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {scored.slice(0, 12).map((item) => (
            <SignalCard key={item.event.id} item={item} maxVol={maxVol} />
          ))}
        </div>
      </Panel>

      {/* Clusters */}
      {clusters.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {clusters.map((cluster) => (
            <Panel key={cluster.label} title={`${cluster.label}_CLUSTER`}>
              <div style={{ padding: "8px" }}>
                {cluster.items.map((item) => (
                  <SignalCard key={item.event.id} item={item} maxVol={maxVol} />
                ))}
              </div>
            </Panel>
          ))}
        </div>
      )}

      {/* Full table */}
      <Panel title="ALL_CRYPTO_MARKETS">
        <MarketTable items={scored} />
      </Panel>
    </div>
  )
}
