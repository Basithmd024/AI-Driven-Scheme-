"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            textAlign: "center",
            padding: "2rem",
            background: "#1e293b",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🛡️</div>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem 0", fontWeight: 700 }}>
            Application Error
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
            {error?.message || "A critical error occurred while loading the application portal."}
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#3b82f6",
              color: "#ffffff",
              border: "none",
              padding: "0.6rem 1.4rem",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
