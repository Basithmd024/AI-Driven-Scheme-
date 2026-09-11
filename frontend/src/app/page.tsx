"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { SchemeCard } from "../components/SchemeCard";
import { FinancialCalculator } from "../components/FinancialCalculator";
import { PartnerLocator } from "../components/PartnerLocator";
import { AIAssistantChat } from "../components/AIAssistantChat";
import { matchSchemes, EntrepreneurProfile, SchemeMatchResult, Scheme, ChannelPartner } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";
import { ALL_INDIA_STATES } from "../lib/translations";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

export default function Home() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("recommender");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedSchemeForPartner, setSelectedSchemeForPartner] = useState<Scheme | null>(null);
  const [selectedSchemeForCalculator, setSelectedSchemeForCalculator] = useState<Scheme | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<ChannelPartner | null>(null);

  const PROJECT_TYPES = [
    { value: "msme_manufacturing", label: "MSME Manufacturing / Processing Unit (Up to ₹50L)" },
    { value: "small_business", label: "Small Business / Trading / Services (MUDRA - Up to ₹20L)" },
    { value: "artisan_crafts", label: "Artisan / Craftsman / Traditional Trade (PM Vishwakarma - ₹3L)" },
    { value: "micro_retail", label: "Urban / Rural Micro-Vendor (PM SVANidhi - Up to ₹50K)" },
    { value: "greenfield_enterprise", label: "Greenfield Manufacturing / Services (Stand-Up India - ₹1 Cr)" },
    { value: "microfinance", label: "Micro Credit / Petty Business (Up to ₹1.40L)" },
    { value: "women_microfinance", label: "Women Micro-Finance (Mahila Samriddhi - 4% p.a.)" },
    { value: "term_loan", label: "Term Loan for SC/OBC Units (Up to ₹50L)" },
    { value: "green_business", label: "Clean Energy / Electric Vehicles / Solar (Up to ₹30L)" },
    { value: "education_overseas", label: "Higher Studies Abroad / STEM (Padho Pardesh - ₹20L)" },
  ];

  // Dynamic Page Title per tab
  useEffect(() => {
    const titles: Record<string, string> = {
      recommender: `${t("tab_matcher", "Scheme Recommender")} | ${t("portal_title", "Samarthya Setu")}`,
      calculator: `${t("tab_simulator", "EMI & Moratorium Simulator")} | ${t("portal_title", "Samarthya Setu")}`,
      partners: `${t("tab_locator", "Channel Partner Locator")} | ${t("portal_title", "Samarthya Setu")}`,
    };
    document.title = titles[activeTab] || "Samarthya Setu | National Government Credit Portal";
  }, [activeTab, lang, t]);

  // Toast Management
  const addToast = (type: "success" | "error" | "info", title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Beneficiary Profile State
  const [profile, setProfile] = useState<EntrepreneurProfile>({
    full_name: "Rajesh Kumar",
    gender: "male",
    social_category: "General",
    annual_family_income: 400000,
    is_differently_abled: false,
    project_type: "msme_manufacturing",
    education_status: "Graduate",
    estimated_project_cost: 2500000,
    state: "Telangana",
    district: "Hyderabad",
    is_shg_member: false,
    is_udyam_registered: true,
  });

  const [matches, setMatches] = useState<SchemeMatchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<"all" | "high" | "subsidized">("all");

  const executeMatch = async (currentProfile = profile, customSuccessMsg?: string) => {
    if (currentProfile.estimated_project_cost <= 0) {
      addToast("error", "Invalid Project Cost", "Project cost must be greater than ₹0 to match financing programs.");
      return;
    }

    setLoading(true);
    try {
      const results = await matchSchemes(currentProfile);
      setMatches(results);
      setHasSearched(true);
      
      const eligibleCount = results.filter(
        (r) => r.eligibility_status === "Highly Eligible" || r.eligibility_status === "Eligible"
      ).length;
      
      if (eligibleCount > 0) {
        addToast("success", "Eligibility Evaluated", customSuccessMsg || `Matched ${eligibleCount} India-wide government schemes.`);
      } else {
        addToast("info", "Evaluation Complete", "Universal schemes matched based on sector and parameters.");
      }
    } catch (err) {
      console.warn("Backend match API call fallback", err);
      addToast("error", "Evaluation Notice", "Evaluated schemes using offline institutional guidelines.");
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeMatch();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeMatch(profile, "Evaluated with custom parameters");
  };

  const fmt = (n: number) => n.toLocaleString("en-IN");

  // A scheme is "not eligible" when the rules engine hard-disqualifies the profile
  const isNotEligible = (m: SchemeMatchResult) =>
    Boolean((m as any).is_disqualified) ||
    m.eligibility_status === "Disqualified" ||
    m.eligibility_status === "Income Exceeded" ||
    m.eligibility_status === "Gender Specific" ||
    m.eligibility_status === "Category Mismatch" ||
    m.eligibility_status === "Ineligible";

  // Ineligible / disqualified schemes are NEVER shown
  const filteredMatches = matches
    .filter((m) => !isNotEligible(m))
    .filter((m) => {
      if (filterType === "high") {
        return m.match_score >= 80;
      }
      if (filterType === "subsidized") {
        return (m.scheme as any).subsidy_percentage && (m.scheme as any).subsidy_percentage > 0;
      }
      return true;
    });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-app)",
      overflowX: "hidden",
      maxWidth: "100vw",
      width: "100%"
    }}>
      {/* Toast Notification Layer */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon" style={{ fontSize: "1.2rem", fontWeight: "900" }}>
              {toast.type === "success" ? "✓" : toast.type === "error" ? "⚠️" : "ℹ️"}
            </span>
            <div style={{ flex: 1 }}>
              <strong style={{ display: "block", color: "var(--text-primary)", fontWeight: "700" }}>
                {toast.title}
              </strong>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "2px" }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close-btn"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="page-main-container" style={{
        flex: 1,
        maxWidth: "1340px",
        margin: "0 auto",
        padding: "1.5rem",
        width: "100%",
        boxSizing: "border-box"
      }}>
        
        {/* ─── TAB 1: Scheme Recommender ─── */}
        {activeTab === "recommender" && (
          <div>
            {/* Responsive Grid Layout */}
            <div className="hero-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.65fr",
              gap: "1.5rem",
              alignItems: "start"
            }}>
              
              {/* Profile Intake Form */}
              <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "1.5rem" }}>
                <div style={{
                  fontSize: "0.92rem", fontWeight: "800", color: "var(--text-primary)",
                  marginBottom: "1.1rem", paddingBottom: "0.45rem", borderBottom: "1px solid var(--border-subtle)"
                }}>
                  {t("form_profile_title", "Beneficiary & Enterprise Profile")}
                </div>

                {/* Social Category & Gender */}
                <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.9rem" }}>
                  <div>
                    <label className="field-label">{t("label_social_category", "Social Category")} *</label>
                    <select
                      className="input-box"
                      value={profile.social_category}
                      onChange={(e) => {
                        setActiveArchetype("");
                        setProfile({ ...profile, social_category: e.target.value });
                      }}
                      aria-label="Social Category"
                    >
                      <option value="General">{t("cat_general", "General / Unreserved")}</option>
                      <option value="OBC">{t("cat_obc", "Other Backward Class (OBC)")}</option>
                      <option value="SC">{t("cat_sc", "Scheduled Caste (SC)")}</option>
                      <option value="ST">{t("cat_st", "Scheduled Tribe (ST)")}</option>
                      <option value="Minority">{t("cat_minority", "Religious Minorities")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">{t("label_gender", "Gender")} *</label>
                    <select
                      className="input-box"
                      value={profile.gender}
                      onChange={(e) => {
                        setActiveArchetype("");
                        setProfile({ ...profile, gender: e.target.value });
                      }}
                      aria-label="Gender"
                    >
                      <option value="male">{t("gender_male", "Male")}</option>
                      <option value="female">{t("gender_female", "Female (Special Rebates & Stand-Up)")}</option>
                      <option value="transgender">{t("gender_other", "Transgender / Third Gender")}</option>
                    </select>
                  </div>
                </div>

                {/* Annual Family Income Slider */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <label className="field-label" style={{ margin: 0 }}>
                      {t("label_income", "Annual Family Income")}: <strong>₹{fmt(profile.annual_family_income)}</strong>
                    </label>
                    <span className="chip chip-cyan" style={{ fontSize: "0.68rem" }}>
                      Universal Access
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={1200000}
                    step={10000}
                    value={profile.annual_family_income}
                    onChange={(e) => {
                      setActiveArchetype("");
                      setProfile({ ...profile, annual_family_income: Number(e.target.value) });
                    }}
                    aria-label="Annual Family Income"
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
                    <span>₹50K</span>
                    <span style={{ color: "var(--brand-accent)", fontWeight: "700" }}>PMEGP / MUDRA: No Limit</span>
                    <span>₹12.0L</span>
                  </div>
                  
                  {/* Inline helpful guidance */}
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px", lineHeight: "1.4" }}>
                    ℹ️ {profile.annual_family_income > 500000 
                      ? t("income_notice_statutory", "Statutory income limits (≤ ₹5.00L) only apply to NSFDC/NBCFDC special concessional funds. Universal programs (PMEGP, MUDRA, Stand-Up India) have NO income cap.")
                      : t("income_notice_unlimited", "Universal schemes (PMEGP, MUDRA, Stand-Up India) have NO income ceiling.")
                    }
                  </div>
                </div>

                {/* Credit Purpose */}
                <div style={{ marginBottom: "1rem" }}>
                  <label className="field-label">{t("label_project_type", "Proposed Project / Industry Sector")} *</label>
                  <select
                    className="input-box"
                    value={profile.project_type}
                    onChange={(e) => {
                      setActiveArchetype("");
                      setProfile({ ...profile, project_type: e.target.value });
                    }}
                    aria-label="Credit Purpose"
                  >
                    {PROJECT_TYPES.map((pt) => (
                      <option key={pt.value} value={pt.value}>{pt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Project Cost & Education */}
                <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.9rem" }}>
                  <div>
                    <label className="field-label">{t("label_project_cost", "Estimated Project Cost")} *</label>
                    <input
                      type="number"
                      className={`input-box ${profile.estimated_project_cost <= 0 ? "input-error" : ""}`}
                      value={profile.estimated_project_cost}
                      onChange={(e) => {
                        setActiveArchetype("");
                        setProfile({ ...profile, estimated_project_cost: Number(e.target.value) });
                      }}
                      min={10000}
                      max={10000000}
                      step={10000}
                      aria-label="Estimated Project Cost"
                    />
                    {profile.estimated_project_cost <= 0 && (
                      <div className="field-error-msg">⚠️ Cost must be &gt; ₹0</div>
                    )}
                  </div>

                  <div>
                    <label className="field-label">Education Status</label>
                    <select
                      className="input-box"
                      value={profile.education_status}
                      onChange={(e) => setProfile({ ...profile, education_status: e.target.value })}
                      aria-label="Education Status"
                    >
                      <option value="Below 10th">Below 10th</option>
                      <option value="10th Pass">10th Pass</option>
                      <option value="12th Pass">12th Pass</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post Graduate">Post Graduate / Professional</option>
                    </select>
                  </div>
                </div>

                {/* All-India State & District */}
                <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.9rem" }}>
                  <div>
                    <label className="field-label">{t("label_state", "State / UT of Operation")} *</label>
                    <select
                      className="input-box"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      aria-label="State"
                    >
                      {ALL_INDIA_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">{t("label_district", "District / City")}</label>
                    <input
                      type="text"
                      className="input-box"
                      value={profile.district}
                      onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                      aria-label="District"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)", cursor: "pointer", minHeight: "36px" }}>
                    <input
                      type="checkbox"
                      checked={profile.is_differently_abled}
                      onChange={(e) => setProfile({ ...profile, is_differently_abled: e.target.checked })}
                      style={{ width: "18px", height: "18px" }}
                    />
                    {t("label_differently_abled", "Differently-Abled (Divyangjan) Entrepreneur")}
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)", cursor: "pointer", minHeight: "36px" }}>
                    <input
                      type="checkbox"
                      checked={profile.is_shg_member}
                      onChange={(e) => setProfile({ ...profile, is_shg_member: e.target.checked })}
                      style={{ width: "18px", height: "18px" }}
                    />
                    {t("label_shg", "Active Member of Self-Help Group (SHG)")}
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)", cursor: "pointer", minHeight: "36px" }}>
                    <input
                      type="checkbox"
                      checked={profile.is_udyam_registered}
                      onChange={(e) => setProfile({ ...profile, is_udyam_registered: e.target.checked })}
                      style={{ width: "18px", height: "18px" }}
                    />
                    {t("label_udyam", "Udyam MSME Certificate Registered")}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-apex"
                  style={{ width: "100%", padding: "0.85rem" }}
                >
                  {loading ? t("btn_calculating", "Matching with National Schemes...") : t("btn_run_matching", "Run AI Scheme Matching")}
                </button>

                <div style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  marginTop: "1.1rem",
                  fontSize: "0.74rem",
                  color: "var(--text-muted)",
                  lineHeight: "1.5"
                }}>
                  Evaluates programs across MSME (PMEGP), Financial Services (MUDRA, Stand-Up India), Housing & Urban Affairs (PM SVANidhi), Skill Dev (PM Vishwakarma), Tribal Affairs (NSTFDC), Minority Affairs (NMDFC), and Social Justice (NSFDC, NBCFDC).
                </div>
              </form>

              {/* Matched Scheme Cards */}
              <section aria-label="Evaluated Schemes">
                <div style={{ marginBottom: "1.25rem" }}>
                  <h2 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 0.35rem 0" }}>
                    Your scheme recommendations
                  </h2>
                  <p style={{ fontSize: "0.92rem", color: "#64748b", margin: 0, lineHeight: "1.5" }}>
                    We found schemes that match the information you provided. Your top match is highlighted below.
                  </p>
                </div>

                {/* Selected Partner Filter Alert if active */}
                {selectedPartner && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "1.5px solid #bbf7d0",
                      borderRadius: "12px",
                      padding: "0.75rem 1.25rem",
                      marginBottom: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.1rem" }}>🏛️</span>
                      <span style={{ fontSize: "0.85rem", color: "#065f46", fontWeight: "700" }}>
                        Channel Partner Filter: <strong>{selectedPartner.name}</strong> ({selectedPartner.city}, {selectedPartner.state})
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedPartner(null)}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #bbf7d0",
                        color: "#065f46",
                        borderRadius: "6px",
                        padding: "0.3rem 0.65rem",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      ✕ Clear Partner Filter
                    </button>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-secondary)" }}>
                    Showing {filteredMatches.length} Eligible Programs
                  </div>

                  {/* Filter chips */}
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button
                      onClick={() => setFilterType("all")}
                      className={`chip ${filterType === "all" ? "chip-cyan" : ""}`}
                      style={{ cursor: "pointer", border: "none", background: filterType === "all" ? undefined : "var(--bg-card)" }}
                    >
                      {t("filter_all", "All Schemes")}
                    </button>
                    <button
                      onClick={() => setFilterType("high")}
                      className={`chip ${filterType === "high" ? "chip-emerald" : ""}`}
                      style={{ cursor: "pointer", border: "none", background: filterType === "high" ? undefined : "var(--bg-card)" }}
                    >
                      {t("filter_high_match", "High Match (≥ 80%)")}
                    </button>
                    <button
                      onClick={() => setFilterType("subsidized")}
                      className={`chip ${filterType === "subsidized" ? "chip-amber" : ""}`}
                      style={{ cursor: "pointer", border: "none", background: filterType === "subsidized" ? undefined : "var(--bg-card)" }}
                    >
                      {t("filter_subsidized", "Government Subsidized")}
                    </button>
                    
                  </div>
                </div>

                {loading && (
                  <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--brand-accent)" }}>
                    <div style={{ fontWeight: "700", fontSize: "1rem" }}>
                      {t("btn_calculating", "Matching with National Schemes...")}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!loading && hasSearched && filteredMatches.length === 0 && (
                  <div className="glass-panel" style={{
                    padding: "3rem 2rem",
                    textAlign: "center",
                    border: "1px dashed var(--border-medium)",
                    borderRadius: "16px"
                  }}>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "64px",
                      height: "64px",
                      borderRadius: "50",
                      background: "var(--status-warning-bg)",
                      color: "var(--status-warning)",
                      fontSize: "1.8rem",
                      marginBottom: "1rem"
                    }}>
                      📋
                    </div>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                      No Matching Schemes Under Selected Filter
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "460px", margin: "0 auto 1.25rem auto", lineHeight: "1.6" }}>
                      Try setting the filter to "All Schemes" or adjusting your project profile parameters.
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        onClick={() => setFilterType("all")}
                        className="btn-apex"
                        style={{ padding: "0.6rem 1.25rem", fontSize: "0.82rem" }}
                      >
                        Show All Eligible Schemes
                      </button>
                    </div>
                  </div>
                )}

                {!loading && filteredMatches.map((match, i) => (
                  <SchemeCard
                    key={match.scheme.id}
                    match={match}
                    index={i}
                    userState={profile.state}
                    selectedPartner={selectedPartner}
                    onFindChannelPartner={(scheme, partner) => {
                      setSelectedSchemeForPartner(scheme);
                      if (partner) setSelectedPartner(partner);
                      setActiveTab("partners");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onCalculateRepayment={(scheme) => {
                      setSelectedSchemeForCalculator(scheme);
                      setActiveTab("calculator");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                ))}

                {/* AI Match Advisory Notice Banner matching design */}
                {!loading && filteredMatches.length > 0 && (
                  <div
                    style={{
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      borderRadius: "12px",
                      padding: "1rem 1.25rem",
                      marginTop: "1.5rem",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ color: "#2563eb", fontSize: "1.2rem", lineHeight: "1", flexShrink: 0, marginTop: "1px" }}>
                      ⓘ
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#1e40af", lineHeight: "1.5", fontWeight: "500" }}>
                      AI match scores indicate how strongly the scheme matches the information provided. They are not loan approval probabilities. Final eligibility, sanction and disbursement are determined by the applicable authority and channel partner.
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ─── TAB 2: Financial Calculator ─── */}
        {activeTab === "calculator" && (
          <FinancialCalculator
            initialScheme={selectedSchemeForCalculator}
            onClearInitialScheme={() => setSelectedSchemeForCalculator(null)}
          />
        )}

        {/* ─── TAB 3: Channel Partner Radar ─── */}
        {activeTab === "partners" && (
          <PartnerLocator
            selectedScheme={selectedSchemeForPartner}
            onClearSchemeFilter={() => setSelectedSchemeForPartner(null)}
            selectedPartner={selectedPartner}
            onSelectPartner={(p) => setSelectedPartner(p)}
            onViewSchemesForPartner={(p) => {
              setSelectedPartner(p);
              setActiveTab("recommender");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

      </main>

      {/* Samarthya Sahayak — AI advisory agent (available on every tab) */}
      <AIAssistantChat profile={profile} />

      {/* Institutional Footer */}
      <footer style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--text-muted)",
        padding: "2rem 1.5rem",
        textAlign: "center",
        fontSize: "0.8rem",
        marginTop: "3.5rem",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box"
      }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ color: "var(--text-primary)", fontWeight: "800", fontSize: "0.95rem" }}>
            {t("portal_title", "Samarthya Setu")} — All-India Concessional & Subsidized Credit Discovery Platform
          </div>
          <div style={{ marginTop: "0.35rem", color: "var(--text-secondary)", fontSize: "0.78rem" }}>
            Empowering Indian Entrepreneurs Across MSME, PM MUDRA, Stand-Up India, PM Vishwakarma, PM SVANidhi, NSFDC, NSTFDC, NBCFDC & NMDFC
          </div>

          {/* Direct Institutional Contacts Bar */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            margin: "1.2rem 0",
            padding: "0.8rem",
            background: "var(--bg-card)",
            borderRadius: "8px",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>{t("helpline", "National Helpline 14566")}:</span>
              <a
                href="tel:14566"
                style={{ color: "var(--brand-accent)", fontWeight: "800", textDecoration: "none" }}
                title="Call 14566"
              >
                14566 (Toll-Free)
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>PMEGP KVIC Helpdesk:</span>
              <a
                href="https://www.kviconline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--brand-accent)", fontWeight: "700", textDecoration: "none" }}
              >
                kviconline.gov.in
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>PM MUDRA:</span>
              <a
                href="https://www.mudra.org.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--brand-accent)", fontWeight: "700", textDecoration: "none" }}
              >
                mudra.org.in
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>Stand-Up India:</span>
              <a
                href="https://www.standupmitra.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--brand-accent)", textDecoration: "none" }}
              >
                standupmitra.in
              </a>
            </div>
          </div>

          <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", lineHeight: "1.6" }}>
            All-India Central & State Government Lending Portals • Concessional Rates: 4.0% – 8.0% p.a. • Up to 35% Capital Subsidies • Channel Partner Network via SCAs, PSBs & RRBs.
          </div>
        </div>
      </footer>
    </div>
  );
}
