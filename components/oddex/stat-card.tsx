interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: string
  trend?: "up" | "down" | "neutral"
}

function formatValue(v: string | number): string {
  if (typeof v === "number") {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
    return v.toLocaleString()
  }
  return v
}

export function StatCard({ label, value, sub, color = "#00ff88", trend }: StatCardProps) {
  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "4px",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, ${color}60, transparent)`,
        }}
      />
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "#555",
          textTransform: "uppercase",
        }}
      >
        // {label}
      </span>
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "22px",
          fontWeight: 800,
          color,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {formatValue(value)}
      </span>
      {sub && (
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "10px",
            color: "#444",
            letterSpacing: "0.04em",
          }}
        >
          {trend === "up" && <span style={{ color: "#00ff88" }}>↑ </span>}
          {trend === "down" && <span style={{ color: "#ff3b5c" }}>↓ </span>}
          {sub}
        </span>
      )}
    </div>
  )
}
