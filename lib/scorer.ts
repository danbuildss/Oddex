import type { Event, Market } from "./gamma"
import { detectCategory } from "./gamma"

export type SignalLabel = "STRONG" | "HIGH" | "MEDIUM" | "LOW"
export type Category = "CRYPTO" | "FOOTBALL" | "OTHER"

export interface ScoredMarket {
  event: Event
  market: Market
  score: number
  label: SignalLabel
  category: Category
  yesPrice: number
  noPrice: number
  volume24h: number
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function parseYesPrice(market: Market): number {
  try {
    const prices = JSON.parse(market.outcomePrices ?? market.outcome_prices ?? "[]") as number[]
    return prices[0] ?? 0.5
  } catch {
    return 0.5
  }
}

function volumeVelocityScore(vol24h: number, totalVol: number): number {
  // 40 pts: ratio of 24h vol to total — high ratio = recent activity spike
  if (totalVol <= 0) return 0
  const ratio = vol24h / totalVol
  // also reward raw 24h volume on log scale
  const rawLog = Math.log10(Math.max(1, vol24h)) / Math.log10(1_000_000) // 0–1 at $1M
  const combined = ratio * 0.6 + rawLog * 0.4
  return clamp(combined * 40, 0, 40)
}

function absoluteVolumeScore(vol24h: number): number {
  // 30 pts: log scale from $100 to $1M+
  const logVal = Math.log10(Math.max(1, vol24h))
  const logMin = Math.log10(100) // ~2
  const logMax = Math.log10(1_000_000) // 6
  const normalized = (logVal - logMin) / (logMax - logMin)
  return clamp(normalized * 30, 0, 30)
}

function oddsUncertaintyScore(yesPrice: number): number {
  // 20 pts: peak uncertainty at 0.5; certainty (near 0 or 1) scores low
  // formula: 4 * p * (1-p) gives 0–1 with peak at 0.5
  const uncertainty = 4 * yesPrice * (1 - yesPrice)
  return clamp(uncertainty * 20, 0, 20)
}

function liquidityScore(liquidity: number): number {
  // 10 pts: log scale on liquidity
  const logVal = Math.log10(Math.max(1, liquidity))
  const logMax = Math.log10(500_000)
  return clamp((logVal / logMax) * 10, 0, 10)
}

export function scoreMarket(event: Event, market: Market): ScoredMarket {
  const vol24h = market.volume_24hr ?? event.volume_24hr ?? 0
  const totalVol = market.volumeNum ?? market.volume ?? event.volume ?? 0
  const liquidity = market.liquidity ?? event.liquidity ?? 0
  const yesPrice = parseYesPrice(market)
  const noPrice = 1 - yesPrice

  const pts =
    volumeVelocityScore(vol24h, totalVol) +
    absoluteVolumeScore(vol24h) +
    oddsUncertaintyScore(yesPrice) +
    liquidityScore(liquidity)

  const score = Math.round(clamp(pts, 0, 100))

  let label: SignalLabel
  if (score >= 80) label = "STRONG"
  else if (score >= 60) label = "HIGH"
  else if (score >= 40) label = "MEDIUM"
  else label = "LOW"

  return {
    event,
    market,
    score,
    label,
    category: detectCategory(event),
    yesPrice,
    noPrice,
    volume24h: vol24h,
  }
}

export function scoreEvent(event: Event): ScoredMarket | null {
  if (!event.markets || event.markets.length === 0) return null
  // Use the highest-volume market for the event score
  const topMarket = [...event.markets].sort(
    (a, b) => (b.volume_24hr ?? 0) - (a.volume_24hr ?? 0)
  )[0]
  return scoreMarket(event, topMarket)
}

export function scoreEvents(events: Event[]): ScoredMarket[] {
  return events
    .map(scoreEvent)
    .filter((s): s is ScoredMarket => s !== null)
    .sort((a, b) => b.score - a.score)
}

export function labelColor(label: SignalLabel): string {
  switch (label) {
    case "STRONG": return "#00ff88"
    case "HIGH": return "#00e5ff"
    case "MEDIUM": return "#f5a623"
    case "LOW": return "#666666"
  }
}
