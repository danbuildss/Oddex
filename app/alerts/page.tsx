import type { Metadata } from "next"
import { Panel } from "@/components/oddex/panel"
import { AlertsSetup } from "@/components/oddex/alerts-setup"

export const metadata: Metadata = {
  title: "Alerts — Oddex",
}

export default function AlertsPage() {
  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px", alignItems: "start" }}>
        <AlertsSetup />

        {/* Instructions panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Panel title="TELEGRAM_SETUP">
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                {
                  step: "01",
                  label: "Create bot",
                  desc: "Message @BotFather on Telegram. Send /newbot and follow the prompts.",
                },
                {
                  step: "02",
                  label: "Get token",
                  desc: "BotFather gives you an API token. Copy it.",
                },
                {
                  step: "03",
                  label: "Get chat ID",
                  desc: "Start a chat with your bot, then message @userinfobot to get your chat ID.",
                },
                {
                  step: "04",
                  label: "Enter below",
                  desc: "Paste your chat ID in the form. Alerts fire within 5 minutes of signal.",
                },
              ].map((s) => (
                <div key={s.step} style={{ display: "flex", gap: "12px" }}>
                  <span
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "10px",
                      fontWeight: 800,
                      color: "rgba(0,255,136,0.5)",
                      flexShrink: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {s.step}
                  </span>
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
                      {s.label.toUpperCase()}
                    </p>
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "11px",
                        color: "#555",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="ALERT_FORMAT">
            <div
              style={{
                padding: "14px",
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "10px",
                color: "#555",
                lineHeight: 1.7,
                background: "#060606",
              }}
            >
              <p style={{ color: "#00ff88", margin: "0 0 4px", fontWeight: 700 }}>🟢 STRONG SIGNAL — Score 87/100</p>
              <p style={{ margin: "0 0 2px" }}>Will Bitcoin hit $100K before June?</p>
              <p style={{ color: "#00ff88", margin: "0 0 2px" }}>YES 73¢ · <span style={{ color: "#ff3b5c" }}>NO 27¢</span></p>
              <p style={{ margin: "0 0 2px" }}>Vol 24H: $284K · +41% spike</p>
              <p style={{ color: "#00e5ff", margin: 0 }}>→ oddex.io/bitcoin-100k</p>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
