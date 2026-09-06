import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The requested page could not be located on the Samarthya Setu portal.",
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-base)",
      color: "var(--text-primary)",
      fontFamily: "Inter, -apple-system, sans-serif"
    }}>
      {/* National Accent Bar */}
      <div className="national-accent-bar" style={{ height: "4px" }} />

      <main style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}>
        <div className="glass-panel" style={{
          maxWidth: "560px",
          width: "100%",
          padding: "3rem 2rem",
          textAlign: "center",
          borderRadius: "16px",
          boxShadow: "0 20px 40px var(--shadow-color)"
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "var(--accent-rose-bg)",
            color: "var(--accent-rose)",
            fontSize: "2rem",
            fontWeight: "900",
            marginBottom: "1.5rem",
            border: "1px solid var(--status-danger-border)"
          }}>
            !
          </div>

          <div className="chip chip-rose" style={{ marginBottom: "0.75rem" }}>
            HTTP 404 • Resource Not Found
          </div>

          <h1 style={{
            fontSize: "2rem",
            fontWeight: "800",
            margin: "0.5rem 0 1rem 0",
            color: "var(--text-primary)",
            lineHeight: "1.2"
          }}>
            Page Not Found
          </h1>

          <p style={{
            color: "var(--text-secondary)",
            fontSize: "0.95rem",
            lineHeight: "1.6",
            marginBottom: "2rem"
          }}>
            The designated resource or section does not exist or has been relocated within the Samarthya Setu portal. Please return to the homepage or access the direct tools below.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
            <Link
              href="/"
              className="btn-apex"
              style={{
                textDecoration: "none",
                display: "inline-block",
                padding: "0.85rem 1.5rem",
                fontSize: "0.92rem",
                borderRadius: "8px",
                fontWeight: "700"
              }}
            >
              Return to Platform Home
            </Link>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0.5rem",
              marginTop: "0.5rem"
            }}>
              <Link
                href="/?tab=recommender"
                style={{
                  padding: "0.6rem",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  color: "var(--text-primary)",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                Scheme Recommender
              </Link>
              <Link
                href="/?tab=calculator"
                style={{
                  padding: "0.6rem",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  color: "var(--text-primary)",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                EMI Simulator
              </Link>
              <Link
                href="/?tab=partners"
                style={{
                  padding: "0.6rem",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  color: "var(--text-primary)",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                Partner Locator
              </Link>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "1.25rem",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            alignItems: "center"
          }}>
            <div>
              National SC Toll-Free Helpline:{" "}
              <a href="tel:14566" style={{ color: "var(--brand-accent)", fontWeight: "700", textDecoration: "none" }}>
                14566
              </a>
            </div>
            <div>
              Technical Support:{" "}
              <a href="mailto:support@samarthya-setu.gov.in" style={{ color: "var(--brand-accent)", textDecoration: "none" }}>
                support@samarthya-setu.gov.in
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
