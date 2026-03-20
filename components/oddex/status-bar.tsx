"use client"

import { useEffect, useState } from "react"

interface StatusBarProps {
  feedLatency?: number
  marketsActive?: number
}

export function StatusBar({ feedLatency = 42, marketsActive = 1247 }: StatusBarProps) {
  const [utc, setUtc] = useState("")

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const h = now.getUTCHours().toString().padStart(2, "0")
      const m = now.getUTCMinutes().toString().padStart(2, "0")
      const s = now.getUTCSeconds().toString().padStart(2, "0")
      setUtc(`${h}:${m}:${s}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const items = [
    { label: "● ALL_SYSTEMS_NOMINAL", color: "var(--green)" },
    { label: `FEED_LATENCY ${feedLatency}ms`, color: "#666" },
    { label: `MKTS_ACTIVE ${marketsActive.toLocaleString()}`, color: "#666" },
    { label: `UTC ${utc}`, color: "var(--cyan)" },
  ]

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "200px",
        right: 0,
        height: "28px",
        background: "#050505",
        borderTop: "1px solid var(--panel-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: "24px",
        zIndex: 40,
      }}
    >
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "9px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: item.color,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          {item.label}
        </span>
      ))}
    </div>
  )
}
