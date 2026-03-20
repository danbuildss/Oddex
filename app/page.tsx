import { getTopEvents, getCryptoEvents, getFootballEvents } from "@/lib/gamma"
import { scoreEvents } from "@/lib/scorer"
import { StatCard } from "@/components/oddex/stat-card"
import { SignalCard } from "@/components/oddex/signal-card"
import { HeatRow } from "@/components/oddex/heat-row"
import { MarketTable } from "@/components/oddex/market-table"
import { Panel } from "@/components/oddex/panel"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [topEvents, cryptoEvents, footballEvents] = await Promise.all([
    getTopEvents(50),
    getCryptoEvents(20),
    getFootballEvents(20),
  ])

  const allScored = scoreEvents(topEvents)
  const cryptoScored = scoreEvents(cryptoEvents)
  const footballScored = scoreEvents(footballEvents)

  const signals = allScored.filter((s) => s.score >= 60)
  const totalVol = allScored.reduce((s, m) => s + m.volume24h, 0)
  const maxVol = allScored[0]?.volume24h ?? 1

  const topSignals = allScored.slice(0, 12)
  const topCrypto = cryptoScored.slice(0, 6)
  const topFootball = footballScored.slice(0, 6)

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        <StatCard
          label="LIVE_SIGNALS"
          value={signals.length}
          sub="score ≥ 60"
          color="#00ff88"
          trend="up"
        />
        <StatCard
          label="ACTIVE_MARKETS"
          value={allScored.length}
          sub="polymarket feed"
          color="#00e5ff"
        />
        <StatCard
          label="CRYPTO_SIGNALS"
          value={cryptoScored.filter((s) => s.score >= 60).length}
          sub={`of ${cryptoScored.length} crypto markets`}
          color="#f5a623"
        />
        <StatCard
          label="VOL_24H"
          value={totalVol}
          sub="across all markets"
          color="#00ff88"
          trend="up"
        />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "16px", alignItems: "start" }}>
        {/* Signal tape */}
        <Panel title="SIGNAL_TAPE">
          <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {topSignals.map((item) => (
              <SignalCard key={item.event.id} item={item} maxVol={maxVol} />
            ))}
          </div>
        </Panel>

        {/* Right panels */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Panel title="CRYPTO_HEAT">
            <div style={{ padding: "4px 0" }}>
              {topCrypto.map((item, i) => (
                <HeatRow key={item.event.id} item={item} rank={i + 1} maxVol={topCrypto[0]?.volume24h ?? 1} />
              ))}
              {topCrypto.length === 0 && (
                <div style={{ padding: "16px 12px", color: "#444", fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}>
                  No crypto markets found
                </div>
              )}
            </div>
          </Panel>

          <Panel title="FOOTBALL_HEAT">
            <div style={{ padding: "4px 0" }}>
              {topFootball.map((item, i) => (
                <HeatRow key={item.event.id} item={item} rank={i + 1} maxVol={topFootball[0]?.volume24h ?? 1} />
              ))}
              {topFootball.length === 0 && (
                <div style={{ padding: "16px 12px", color: "#444", fontFamily: "JetBrains Mono, monospace", fontSize: "11px" }}>
                  No football markets found
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>

      {/* Full table */}
      <Panel title="TOP_MARKETS">
        <MarketTable items={allScored} />
      </Panel>
    </div>
  )
}
