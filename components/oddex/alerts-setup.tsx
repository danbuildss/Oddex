"use client"

import { useState } from "react"
import { Panel } from "./panel"

interface AlertPrefs {
  telegramChatId: string
  minScore: number
  cryptoAlerts: boolean
  footballAlerts: boolean
  strongSignals: boolean
  fakeSpikeWarnings: boolean
}

export function AlertsSetup() {
  const [prefs, setPrefs] = useState<AlertPrefs>({
    telegramChatId: "",
    minScore: 70,
    cryptoAlerts: true,
    footballAlerts: true,
    strongSignals: true,
    fakeSpikeWarnings: false,
  })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    // In production: POST to /api/alerts/prefs with wallet auth
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputStyle: React.CSSProperties = {
    background: "#111",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "3px",
    padding: "8px 12px",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "12px",
    color: "#e0e0e0",
    width: "100%",
    outline: "none",
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#555",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
  }

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "20px",
    borderRadius: "10px",
    background: active ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.06)",
    border: `1px solid ${active ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.08)"}`,
    cursor: "pointer",
    transition: "all 0.15s",
    flexShrink: 0,
    position: "relative",
  })

  const toggleDot = (active: boolean): React.CSSProperties => ({
    position: "absolute",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: active ? "#00ff88" : "#444",
    transition: "all 0.15s",
    left: active ? "20px" : "4px",
  })

  const alertTypes = [
    { key: "strongSignals" as const, label: "STRONG_SIGNALS", desc: "Score ≥ 80 alerts" },
    { key: "cryptoAlerts" as const, label: "CRYPTO_CLUSTER_HEAT", desc: "Crypto market spikes" },
    { key: "footballAlerts" as const, label: "FOOTBALL_MOVES", desc: "Football market activity" },
    { key: "fakeSpikeWarnings" as const, label: "FAKE_SPIKE_WARNINGS", desc: "Suspicious volume patterns" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Panel title="TELEGRAM_CONFIG">
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Telegram Chat ID</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="e.g. -1001234567890"
              value={prefs.telegramChatId}
              onChange={(e) => setPrefs((p) => ({ ...p, telegramChatId: e.target.value }))}
            />
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#444", margin: "6px 0 0" }}>
              Get your chat ID from @userinfobot on Telegram
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="ALERT_TYPES">
        <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {alertTypes.map((type) => (
            <div
              key={type.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 8px",
                borderRadius: "3px",
                transition: "background 0.1s",
                cursor: "pointer",
              }}
              onClick={() => setPrefs((p) => ({ ...p, [type.key]: !p[type.key] }))}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = "transparent"
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#bbb",
                    margin: "0 0 2px",
                  }}
                >
                  {type.label}
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#555", margin: 0 }}>
                  {type.desc}
                </p>
              </div>
              <div style={toggleStyle(prefs[type.key])}>
                <div style={toggleDot(prefs[type.key])} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="MIN_SIGNAL_SCORE">
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={labelStyle}>Threshold</span>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "16px",
                fontWeight: 800,
                color: prefs.minScore >= 80 ? "#00ff88" : prefs.minScore >= 60 ? "#00e5ff" : "#f5a623",
              }}
            >
              {prefs.minScore}/100
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={95}
            step={5}
            value={prefs.minScore}
            onChange={(e) => setPrefs((p) => ({ ...p, minScore: Number(e.target.value) }))}
            style={{ width: "100%", accentColor: "#00ff88" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "#f5a623" }}>MEDIUM 40</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "#00e5ff" }}>HIGH 60</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "9px", color: "#00ff88" }}>STRONG 80</span>
          </div>
        </div>
      </Panel>

      <button
        onClick={handleSave}
        style={{
          background: saved ? "rgba(0,255,136,0.2)" : "rgba(0,255,136,0.1)",
          border: "1px solid rgba(0,255,136,0.3)",
          borderRadius: "4px",
          padding: "12px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#00ff88",
          cursor: "pointer",
          transition: "background 0.15s",
          width: "100%",
        }}
      >
        {saved ? "✓ PREFERENCES_SAVED" : "SAVE_ALERT_PREFS"}
      </button>
    </div>
  )
}
