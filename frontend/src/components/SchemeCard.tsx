"use client";
import React, { useState } from "react";
import { SchemeMatchResult } from "../lib/api";

interface SchemeCardProps {
  match: SchemeMatchResult;
  index: number;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ match, index }) => {
  const [expanded, setExpanded] = useState(false);
  const { scheme, match_score, eligibility_status, ai_reasoning, key_benefits, required_documents, channel_guidelines } = match;

  const isEligible = eligibility_status === "Highly Eligible" || eligibility_status === "Eligible";
  const isConditional = eligibility_status === "Conditionally Eligible";
  const isDisqualified = eligibility_status === "Disqualified";

  const statusColor = isEligible
    ? "var(--status-active)"
    : isConditional
    ? "var(--status-warning)"
    : "var(--status-danger)";

  const statusChipClass = isEligible
    ? "chip-emerald"
    : isConditional
    ? "chip-amber"
    : "chip-rose";

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (match_score / 100) * circumference;

  return (
    <div
      className="glass-panel scheme-card-motion"
      style={{
        padding: "1.4rem",
        marginBottom: "1.2rem",
        animationDelay: `${index * 60}ms`,
        borderLeft: `4px solid ${statusColor}`,
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}
    >
      <div>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span className="chip chip-purple" style={{ fontSize: "0.68rem" }}>
                {scheme.category}
              </span>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: "600" }}>
                {scheme.ministry_or_org}
              </span>
            </div>

            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: "800",
              color: "var(--text-primary)",
              margin: "0.4rem 0 0.15rem 0",
              lineHeight: "1.3"
            }}>
              {scheme.title}
            </h3>

            {scheme.title_hi && (
              <div style={{ fontSize: "0.84rem", color: "var(--text-muted)", fontWeight: "500" }}>
                {scheme.title_hi}
              </div>
            )}
          </div>

          {/* Circular Fit Score */}
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
                    stroke: statusColor,
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                  }}
                />
              </svg>
              <div className="score-ring-text" style={{ color: statusColor }}>
                {match_score}%
              </div>
            </div>
            <span
              className={`chip ${statusChipClass}`}
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

        {/* 4 Key Concessional Metric Tiles with Responsive Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.65rem",
          marginBottom: "1.1rem"
        }}>
          <div style={{
            background: "var(--bg-surface)",
            padding: "0.75rem 0.5rem",
            borderRadius: "10px",
            textAlign: "center",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "var(--status-active)" }}>
              {scheme.concessional_interest_rate}%
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", marginTop: "2px" }}>
              Interest Rate p.a.
            </div>
          </div>

          <div style={{
            background: "var(--bg-surface)",
            padding: "0.75rem 0.5rem",
            borderRadius: "10px",
            textAlign: "center",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "var(--brand-accent)" }}>
              ₹{(scheme.max_project_cost / 100000).toFixed(1)}L
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", marginTop: "2px" }}>
              Project Ceiling
            </div>
          </div>

          <div style={{
            background: "var(--bg-surface)",
            padding: "0.75rem 0.5rem",
            borderRadius: "10px",
            textAlign: "center",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "var(--status-warning)" }}>
              {scheme.max_moratorium_months}m
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", marginTop: "2px" }}>
              Moratorium
            </div>
          </div>

          <div style={{
            background: "var(--bg-surface)",
            padding: "0.75rem 0.5rem",
            borderRadius: "10px",
            textAlign: "center",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ fontSize: "1.3rem", fontWeight: "900", color: "var(--status-purple)" }}>
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

        {/* Action Toggle Button & Verified Links */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              padding: "0.55rem 1rem",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
              minHeight: "44px"
            }}
          >
            {expanded ? "Hide Routing Details" : "View Routing & Documents"}
          </button>

          {/* Item 7: Verified External Links */}
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <a
              href="https://nsfdc.nic.in/scheme"
              target="_blank"
              rel="noopener noreferrer"
              className="chip chip-cyan"
              style={{ padding: "0.45rem 0.85rem", textDecoration: "none", fontSize: "0.76rem", minHeight: "36px" }}
              title="Official National Scheduled Castes Finance Corporation Scheme Guidelines"
            >
              NSFDC Guidelines Portal ↗
            </a>
            <a
              href="https://pmsuraj.dosje.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="chip chip-emerald"
              style={{ padding: "0.45rem 0.85rem", textDecoration: "none", fontSize: "0.76rem", minHeight: "36px" }}
              title="Ministry of Social Justice PM-SURAJ Online Application Portal"
            >
              PM-SURAJ Portal ↗
            </a>
          </div>
        </div>

        {/* Expandable Routing Drawer */}
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
