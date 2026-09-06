"use client";
import React, { useState } from "react";
import { SchemeMatchResult } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";

interface SchemeCardProps {
  match: SchemeMatchResult;
  index: number;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ match, index }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { lang, t } = useLanguage();

  const {
    scheme,
    match_score,
    eligibility_status,
    ai_reasoning,
    key_benefits = [],
    required_documents = [],
    channel_guidelines,
    is_disqualified,
    disqualification_reason,
  } = match;

  const displayTitle =
    lang === "hi" && (scheme as any).title_hi
      ? (scheme as any).title_hi
      : lang === "te" && (scheme as any).title_te
      ? (scheme as any).title_te
      : scheme.title;

  const appUrl = (scheme as any).application_url || "https://pmsuraj.dosje.gov.in";
  let domain = "gov.in";
  try {
    domain = new URL(appUrl).hostname.replace("www.", "");
  } catch (e) {
    // fallback
  }

  const getStatusBadge = () => {
    switch (eligibility_status) {
      case "Highly Eligible":
        return <span className="chip chip-emerald">✓ Highly Eligible ({match_score}%)</span>;
      case "Eligible":
        return <span className="chip chip-cyan">✓ Eligible ({match_score}%)</span>;
      case "Conditional":
        return <span className="chip chip-amber">⚠️ Conditional ({match_score}%)</span>;
      default:
        return <span className="chip chip-rose">✕ Disqualified</span>;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderLeft: `4px solid ${
          eligibility_status === "Highly Eligible"
            ? "var(--status-active)"
            : eligibility_status === "Eligible"
            ? "var(--brand-accent)"
            : is_disqualified
            ? "var(--status-danger)"
            : "var(--status-warning)"
        }`,
        padding: "1.4rem",
        marginBottom: "1.1rem",
        position: "relative",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      <div>
        {/* Header Badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.6rem", marginBottom: "0.6rem" }}>
          <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              #{index + 1} • {scheme.code}
            </span>
            <span className="chip chip-purple" style={{ fontSize: "0.68rem" }}>
              {(scheme as any).ministry || "Govt of India Multi-Portal"}
            </span>
            {(scheme as any).subsidy_percentage ? (
              <span className="chip chip-amber" style={{ fontSize: "0.68rem", fontWeight: "800" }}>
                🎁 {(scheme as any).subsidy_percentage}% {t("stat_subsidy", "Govt Subsidy")}
              </span>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {getStatusBadge()}
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "0 0 0.35rem 0", color: "var(--text-primary)", lineHeight: "1.35" }}>
          {displayTitle}
        </h3>

        {/* Description */}
        <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", margin: "0 0 1rem 0", lineHeight: "1.55" }}>
          {scheme.description}
        </p>

        {/* 4 Key Metric Tiles */}
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
              {t("stat_concessional_rate", "Interest Rate")}
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
              {t("stat_max_funding", "Max Funding")}
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
              {t("stat_moratorium", "Moratorium")}
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
              {t("stat_margin", "Channel Coverage")}
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
          <strong>{t("reasoning_title", "Assessment")}:</strong> {is_disqualified ? disqualification_reason : ai_reasoning}
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
            {expanded ? "▲ Hide Routing Details" : "▼ View Routing & Documents"}
          </button>

          {/* Official Govt Direct Application Portal Link */}
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="chip chip-cyan"
              style={{
                padding: "0.5rem 0.9rem",
                textDecoration: "none",
                fontSize: "0.78rem",
                fontWeight: "800",
                minHeight: "38px",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
              title={`Direct portal: ${appUrl}`}
            >
              🏛️ {domain} ↗
            </a>
            <a
              href="https://pmsuraj.dosje.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="chip chip-emerald"
              style={{
                padding: "0.5rem 0.9rem",
                textDecoration: "none",
                fontSize: "0.78rem",
                fontWeight: "700",
                minHeight: "38px",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
              title="Ministry of Social Justice PM-SURAJ Online Credit Portal"
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
                {t("benefits_title", "Key Benefits & Concessions")}
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: "1.7" }}>
                {key_benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            {/* Channel Route Architecture */}
            {channel_guidelines && (
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
                  <div>• <strong>Routing Channel:</strong> {channel_guidelines.channel_type}</div>
                  <div>• <strong>Authorized Intermediaries:</strong> {channel_guidelines.channel_partners_applicable?.join(", ")}</div>
                  <div>• <strong>Financial Blend:</strong> {channel_guidelines.max_coverage_pct}% Institutional Finance + {channel_guidelines.promoter_margin_pct}% Beneficiary Margin</div>
                  <div>• <strong>Disbursement Action:</strong> {channel_guidelines.next_step}</div>
                </div>
              </div>
            )}

            {/* Required Verification Documents */}
            <div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-primary)", fontWeight: "800", marginBottom: "0.4rem" }}>
                {t("documents_title", "Required Verification Documents")}
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
                    📄 {doc}
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
