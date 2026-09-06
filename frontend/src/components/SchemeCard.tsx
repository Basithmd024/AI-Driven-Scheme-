"use client";
import React, { useState } from "react";
import { SchemeMatchResult } from "../lib/api";

export const SchemeCard: React.FC<{ match: SchemeMatchResult; index: number }> = ({ match, index }) => {
  const { scheme, match_score, eligibility_status, ai_reasoning, key_benefits, required_documents, channel_guidelines } = match;
  const [expanded, setExpanded] = useState(false);

  // Circular SVG ring calculation (radius = 28, perimeter ~ 175.9)
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (match_score / 100) * circumference;

  const scoreColor = match_score >= 80 ? "var(--status-active)" : match_score >= 60 ? "var(--status-info)" : "var(--status-warning)";
  const isDisqualified = eligibility_status === "Income Exceeded";

  return (
    <div
      className="glass-panel scheme-card-motion"
      style={{
        padding: "1.6rem",
        marginBottom: "1.25rem",
        animationDelay: `${index * 70}ms`,
        borderLeft: `5px solid ${isDisqualified ? "var(--status-danger)" : scoreColor}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap" }}>
              <span className="chip chip-cyan" style={{ fontSize: "0.7rem" }}>
                {scheme.category}
              </span>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: "600" }}>
                CODE: {scheme.id}
              </span>
            </div>
            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: "800",
              color: "var(--text-primary)",
              margin: "0.45rem 0 0.2rem 0",
              letterSpacing: "-0.01em"
            }}>
              {scheme.title}
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
              Target: {scheme.target_demographics?.join(", ") || scheme.category} • Org: {scheme.ministry_or_org}
            </div>
          </div>

          {/* SVG Circular Score Dial */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
            <div className="score-ring-container">
              <svg className="score-ring-svg" viewBox="0 0 68 68">
                <circle cx="34" cy="34" r={radius} className="score-ring-bg" />
                <circle
                  cx="34"
                  cy="34"
                  r={radius}
                  className="score-ring-fill"
                  style={{
                    stroke: scoreColor,
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                  }}
                />
              </svg>
              <div className="score-ring-text" style={{ color: scoreColor }}>
                {match_score}%
              </div>
            </div>
            <span
              className={`chip ${isDisqualified ? "chip-rose" : match_score >= 80 ? "chip-emerald" : "chip-cyan"}`}
              style={{ fontSize: "0.68rem", marginTop: "0.35rem" }}
            >
              {isDisqualified ? "Exceeded" : eligibility_status}
            </span>
          </div>
        </div>

        <p style={{
          color: "var(--text-secondary)",
          fontSize: "0.88rem",
          lineHeight: "1.6",
          margin: "0.85rem 0 1.1rem 0"
        }}>
          {scheme.description}
        </p>

        {/* 4 Key Concessional Metric Tiles */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.75rem",
          marginBottom: "1.1rem"
        }}>
          <div style={{
            background: "var(--bg-surface)",
            padding: "0.85rem 0.6rem",
            borderRadius: "10px",
            textAlign: "center",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--status-active)" }}>
              {scheme.concessional_interest_rate}%
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", marginTop: "2px" }}>
              Interest Rate p.a.
            </div>
          </div>

          <div style={{
            background: "var(--bg-surface)",
            padding: "0.85rem 0.6rem",
            borderRadius: "10px",
            textAlign: "center",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--brand-accent)" }}>
              ₹{(scheme.max_project_cost / 100000).toFixed(1)}L
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", marginTop: "2px" }}>
              Project Ceiling
            </div>
          </div>

          <div style={{
            background: "var(--bg-surface)",
            padding: "0.85rem 0.6rem",
            borderRadius: "10px",
            textAlign: "center",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--status-warning)" }}>
              {scheme.max_moratorium_months}m
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", marginTop: "2px" }}>
              Moratorium
            </div>
          </div>

          <div style={{
            background: "var(--bg-surface)",
            padding: "0.85rem 0.6rem",
            borderRadius: "10px",
            textAlign: "center",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--status-purple)" }}>
              {scheme.channel_finance_coverage}%
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", marginTop: "2px" }}>
              Coverage
            </div>
          </div>
        </div>

        {/* AI Eligibility Insight */}
        <div style={{
          background: isDisqualified ? "var(--status-danger-bg)" : "var(--brand-cyan-glow)",
          borderLeft: `4px solid ${isDisqualified ? "var(--status-danger)" : "var(--brand-accent)"}`,
          padding: "0.85rem 1.1rem",
          borderRadius: "0 8px 8px 0",
          marginBottom: "1rem",
          fontSize: "0.83rem",
          color: isDisqualified ? "var(--status-danger)" : "var(--brand-accent)",
          lineHeight: "1.55"
        }}>
          <strong>Assessment:</strong> {ai_reasoning}
        </div>

        {/* Action Toggle Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              padding: "0.45rem 1rem",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            {expanded ? "Hide Routing Details" : "View Routing & Documents"}
          </button>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <a
              href="https://nsfdc.nic.in/scheme"
              target="_blank"
              rel="noopener noreferrer"
              className="chip chip-cyan"
              style={{ padding: "0.4rem 0.8rem", textDecoration: "none", fontSize: "0.76rem" }}
            >
              NSFDC Guidelines Portal
            </a>
            <a
              href="https://pmsuraj.dosje.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="chip chip-emerald"
              style={{ padding: "0.4rem 0.8rem", textDecoration: "none", fontSize: "0.76rem" }}
            >
              PM-SURAJ Application Portal
            </a>
          </div>
        </div>

        {/* Expandable Drawer */}
        {expanded && (
          <div style={{
            marginTop: "1.25rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-subtle)",
          }}>
            {/* Key Benefits */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.82rem", color: "var(--status-active)", fontWeight: "800", marginBottom: "0.4rem" }}>
                Key Benefits & Concessions
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: "1.7" }}>
                {key_benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            {/* Channel Route Architecture */}
            {channel_guidelines?.is_eligible_for_concessional && (
              <div style={{
                background: "var(--bg-inset)",
                border: "1px solid var(--border-subtle)",
                padding: "0.9rem",
                borderRadius: "8px",
                marginBottom: "1rem"
              }}>
                <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "800", marginBottom: "0.4rem" }}>
                  Channel Partner Allocation
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  <div>• Routing: {channel_guidelines.channel_type}</div>
                  <div>• Authorized Partners: {channel_guidelines.channel_partners_applicable?.join(", ")}</div>
                  <div>• Allocation: {channel_guidelines.max_coverage_pct}% Channel Finance + {channel_guidelines.promoter_margin_pct}% Beneficiary Margin</div>
                  <div>• Next Action: {channel_guidelines.next_step}</div>
                </div>
              </div>
            )}

            {/* Required Verification Documents */}
            <div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "800", marginBottom: "0.4rem" }}>
                Required Verification Documents
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {required_documents.map((doc, i) => (
                  <span
                    key={i}
                    style={{
                      background: "var(--bg-surface)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: "600"
                    }}
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
