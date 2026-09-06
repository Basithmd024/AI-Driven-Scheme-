"use client";
import React, { useState, useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
];

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("apex-theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("apex-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const tabs = [
    { id: "recommender", label: "Scheme Recommender", labelHi: "योजना सिफारिश" },
    { id: "calculator", label: "EMI & Moratorium Simulator", labelHi: "ईएमआई सिमुलेटर" },
    { id: "partners", label: "Channel Partner Locator", labelHi: "चैनल पार्टनर लोकेटर" },
  ];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000 }}>
      {/* Indian National Tricolor Line */}
      <div className="national-accent-bar" />

      {/* Credit Metric Ticker */}
      <div className="credit-ticker">
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span>Income Ceiling: <strong>≤ ₹5.00 Lakhs</strong></span>
          <span>Coverage: <strong>Up to 90%</strong></span>
          <span>Concessional Rates: <strong>4.0% – 8.0% p.a.</strong></span>
          <span>Network: <strong>100+ SCAs, PSBs & RRBs</strong></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            display: "inline-block", width: "7px", height: "7px",
            borderRadius: "50%", background: "var(--status-active)",
            boxShadow: "0 0 8px var(--status-active)"
          }} />
          <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--status-active)", letterSpacing: "0.04em" }}>
            ONLINE
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0.85rem 1.75rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "38px", height: "38px",
            background: "var(--brand-badge-bg)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.85rem", fontWeight: "900", color: "var(--brand-accent)",
            border: "1px solid var(--border-highlight)",
            letterSpacing: "0.05em"
          }}>
            NSFDC
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{
                fontSize: "1.2rem", fontWeight: "900", letterSpacing: "-0.01em",
                color: "var(--text-primary)"
              }}>
                SAMARTHYA SETU
              </span>
              <span className="chip chip-cyan" style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}>
                CHANNEL FINANCE
              </span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
              National Scheduled Castes Finance & Development Corporation | Ministry of Social Justice & Empowerment
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <button
            onClick={toggleTheme}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              padding: "0.4rem 0.65rem",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: "600",
              fontFamily: "inherit",
              cursor: "pointer",
              outline: "none"
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} style={{ background: "var(--bg-surface)", color: "var(--text-primary)" }}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav className="command-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-pill-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            {lang === "hi" ? tab.labelHi : tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
