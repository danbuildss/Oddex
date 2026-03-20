"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AuthButton } from "@/components/auth-button"

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "◈" },
  { href: "/crypto", label: "Crypto", icon: "₿" },
  { href: "/football", label: "Football", icon: "⬡" },
  { href: "/traders", label: "Traders", icon: "◎" },
  { href: "/alerts", label: "Alerts", icon: "◉" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{ borderRight: "1px solid var(--panel-border)" }}
      className="fixed left-0 top-0 bottom-0 w-[200px] flex flex-col z-40"
      css-bg="var(--sidebar)"
    >
      <div
        style={{
          background: "var(--sidebar)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: "1px solid var(--panel-border)",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "var(--green)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#000", fontSize: "14px", fontWeight: 900, fontFamily: "monospace" }}>O</span>
            </div>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 800,
                fontSize: "15px",
                letterSpacing: "0.08em",
                color: "var(--green)",
              }}
            >
              ODDEX
            </span>
          </Link>
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "9px",
              color: "#444",
              letterSpacing: "0.1em",
              marginTop: "4px",
              paddingLeft: "36px",
            }}
          >
            SIGNAL_TERMINAL
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  marginBottom: "2px",
                  background: isActive ? "rgba(0,255,136,0.08)" : "transparent",
                  borderLeft: isActive
                    ? "2px solid var(--green)"
                    : "2px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "13px",
                    color: isActive ? "var(--green)" : "#555",
                    width: "16px",
                    textAlign: "center",
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: isActive ? "var(--green)" : "#888",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Auth */}
        <div
          style={{
            padding: "12px",
            borderTop: "1px solid var(--panel-border)",
          }}
        >
          <AuthButton />
        </div>
      </div>
    </aside>
  )
}
