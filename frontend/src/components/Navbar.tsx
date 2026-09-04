import React from "react";

export const Navbar = () => {
  return (
    <header style={{
      background: "#1e3a8a",
      color: "#ffffff",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>🇮🇳 SchemeMatch AI</span>
      </div>
      <nav style={{ fontSize: "0.9rem", color: "#e2e8f0" }}>
        Targeted Aid for Marginalized & Women Entrepreneurs
      </nav>
    </header>
  );
};
