"use client";

import React, { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        color: "var(--text-primary, #0f172a)",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          background: "var(--bg-card, #ffffff)",
          padding: "2.5rem",
          borderRadius: "16px",
          border: "1px solid var(--border-subtle, #e2e8f0)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: "800", marginBottom: "0.5rem" }}>
          Something went wrong
        </h2>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted, #64748b)",
            marginBottom: "1.5rem",
            lineHeight: 1.5,
          }}
        >
          {error?.message || "An unexpected error occurred while loading this section."}
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
              color: "#ffffff",
              border: "none",
              padding: "0.65rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "0.85rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              background: "var(--bg-surface, #f8fafc)",
              color: "var(--text-primary, #0f172a)",
              border: "1px solid var(--border-subtle, #e2e8f0)",
              padding: "0.65rem 1.5rem",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Reload Home
          </button>
        </div>
      </div>
    </div>
  );
}
