import type { Activity, Position } from "./data-api"

export interface TraderScore {
  wallet: string
  score: number
  winRate: number
  avgConviction: number
  totalVolume: number
  tradeCount: number
  specialty: "CRYPTO" | "FOOTBALL" | "OTHER" | "GENERALIST"
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

export function scoreTrader(
  wallet: string,
  activity: Activity[],
  positions: Position[]
): TraderScore {
  const trades = activity.filter((a) => a.type === "TRADE")

  if (trades.length === 0) {
    return {
      wallet,
      score: 0,
      winRate: 0,
      avgConviction: 0,
      totalVolume: 0,
      tradeCount: 0,
      specialty: "GENERALIST",
    }
  }

  // Win rate from closed positions PnL
  const profitable = positions.filter((p) => p.cashPnl > 0).length
  const winRate = positions.length > 0 ? profitable / positions.length : 0

  // Average conviction size (avg USDC per trade)
  const totalVol = trades.reduce((s, t) => s + (t.usdcSize ?? 0), 0)
  const avgConviction = totalVol / trades.length

  // Timing consistency: std deviation of time between trades (lower = more consistent)
  const timestamps = trades.map((t) => t.timestamp).sort((a, b) => a - b)
  let consistencyScore = 0.5
  if (timestamps.length > 2) {
    const gaps = timestamps.slice(1).map((t, i) => t - timestamps[i])
    const meanGap = gaps.reduce((s, g) => s + g, 0) / gaps.length
    const variance = gaps.reduce((s, g) => s + Math.pow(g - meanGap, 2), 0) / gaps.length
    const cv = Math.sqrt(variance) / (meanGap || 1) // coefficient of variation
    consistencyScore = clamp(1 - cv / 2, 0, 1) // lower cv = more consistent
  }

  // Specialty detection
  const slugs = trades.map((t) => t.slug ?? "").join(" ").toLowerCase()
  const cryptoHits = (slugs.match(/bitcoin|btc|ethereum|eth|crypto|solana|doge/g) ?? []).length
  const footballHits = (slugs.match(/soccer|football|premier|champions|fifa|epl/g) ?? []).length
  let specialty: TraderScore["specialty"] = "GENERALIST"
  if (cryptoHits > footballHits * 2) specialty = "CRYPTO"
  else if (footballHits > cryptoHits * 2) specialty = "FOOTBALL"
  else if (cryptoHits + footballHits > 0) specialty = "OTHER"

  // Score: win rate (40pts) + conviction (30pts) + consistency (20pts) + volume (10pts)
  const winRatePts = winRate * 40
  const convictionPts = clamp((Math.log10(Math.max(1, avgConviction)) / Math.log10(10000)) * 30, 0, 30)
  const consistencyPts = consistencyScore * 20
  const volumePts = clamp((Math.log10(Math.max(1, totalVol)) / Math.log10(1_000_000)) * 10, 0, 10)

  const score = Math.round(clamp(winRatePts + convictionPts + consistencyPts + volumePts, 0, 100))

  return {
    wallet,
    score,
    winRate,
    avgConviction,
    totalVolume: totalVol,
    tradeCount: trades.length,
    specialty,
  }
}
