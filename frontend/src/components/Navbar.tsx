"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { LANGUAGES, LanguageCode } from "../lib/translations";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const { lang, setLang, t } = useLanguage();
  const [theme, setTheme] = useState("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  const tabs = [
    { id: "recommender", label: t("tab_matcher", "Scheme Recommender"), icon: "📋" },
    { id: "calculator", label: t("tab_simulator", "EMI & Moratorium Simulator"), icon: "📊" },
    { id: "partners", label: t("tab_locator", "Channel Partner Locator"), icon: "📍" },
  ];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000, width: "100%", maxWidth: "100vw" }}>
      {/* Indian National Tricolor Accent Bar */}
      <div className="national-accent-bar" />

      {/* Main Bar */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        padding: "0.75rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem"
      }}>
        {/* Brand Identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "8px",
            background: "var(--brand-badge-bg)",
            border: "1px solid var(--border-highlight)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--brand-accent)",
            fontWeight: "900",
            fontSize: "1.1rem",
            boxShadow: "0 4px 12px var(--brand-cyan-glow)"
          }}>
            SS
          </div>
          <div>
            <div style={{
              fontSize: "1.15rem",
              fontWeight: "900",
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}>
              {t("portal_title", "SAMARTHYA SETU")}
              <span className="chip chip-emerald" style={{ fontSize: "0.62rem", padding: "0.15rem 0.45rem" }}>
                {t("portal_badge", "Govt of India Multi-Portal")}
              </span>
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "500" }}>
              {t("portal_tagline", "National AI Scheme Matching & Concessional Channel Finance Network")}
            </div>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="desktop-controls" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Quick Helpline Button */}
          <a
            href="tel:14566"
            className="chip chip-cyan"
            style={{ textDecoration: "none", fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
            title="Click to call National Helpline"
          >
            📞 14566
          </a>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              padding: "0.45rem 0.85rem",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
              minHeight: "40px",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            {theme === "dark" ? `☀️ ${t("theme_light", "Light Mode")}` : `🌙 ${t("theme_dark", "Dark Mode")}`}
          </button>

          {/* Multilingual Selector */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as LanguageCode)}
            aria-label="Select portal language"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              padding: "0.45rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.82rem",
              fontWeight: "700",
              fontFamily: "inherit",
              cursor: "pointer",
              outline: "none",
              minHeight: "40px"
            }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} style={{ background: "var(--bg-surface)", color: "var(--text-primary)" }}>
                {l.nativeLabel} ({l.label})
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Desktop Nav Tabs */}
      <nav className="command-nav" aria-label="Main Navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-pill-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Mobile Navigation Drawer Backdrop */}
      <div
        className={`mobile-nav-backdrop ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Navigation Drawer Content */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "1rem" }}>
          <div style={{ fontWeight: "800", color: "var(--text-primary)", fontSize: "1rem" }}>
            {t("portal_title", "Samarthya Setu")}
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "1.4rem",
              cursor: "pointer",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
            Navigation
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                border: activeTab === tab.id ? "1px solid var(--border-highlight)" : "1px solid var(--border-subtle)",
                background: activeTab === tab.id ? "var(--brand-gradient)" : "var(--bg-card)",
                color: activeTab === tab.id ? "var(--text-contrast)" : "var(--text-primary)",
                fontSize: "0.88rem",
                fontWeight: "700",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                minHeight: "48px"
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Preferences & Quick Actions */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Preferences & Language
          </div>

          <button
            onClick={toggleTheme}
            style={{
              width: "100",
              padding: "0.75rem",
              borderRadius: "8px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.84rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "44px"
            }}
          >
            <span>Theme</span>
            <span>{theme === "dark" ? `☀️ ${t("theme_light", "Light Mode")}` : `🌙 ${t("theme_dark", "Dark Mode")}`}</span>
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.4rem" }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                style={{
                  padding: "0.55rem 0.25rem",
                  borderRadius: "6px",
                  background: lang === l.code ? "var(--brand-primary)" : "var(--bg-card)",
                  color: lang === l.code ? "var(--text-contrast)" : "var(--text-secondary)",
                  border: "1px solid var(--border-subtle)",
                  fontWeight: "700",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  minHeight: "40px"
                }}
              >
                {l.nativeLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Institutional Contacts */}
        <div style={{
          marginTop: "auto",
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem"
        }}>
          <a
            href="tel:14566"
            className="btn-apex"
            style={{
              textDecoration: "none",
              fontSize: "0.82rem",
              padding: "0.65rem 1rem",
              borderRadius: "6px",
              minHeight: "44px",
              textAlign: "center"
            }}
          >
            📞 {t("helpline", "National Helpline 14566")}
          </a>

        </div>
      </div>
    </header>
  );
};
