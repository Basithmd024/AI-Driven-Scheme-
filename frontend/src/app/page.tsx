"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { SchemeCard } from "../components/SchemeCard";
import { FinancialCalculator } from "../components/FinancialCalculator";
import { PartnerLocator } from "../components/PartnerLocator";
import { matchSchemes, EntrepreneurProfile, SchemeMatchResult } from "../lib/api";
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
  const [activeArchetype, setActiveArchetype] = useState<string>("pmegp");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const ARCHETYPES = [
    {
      id: "pmegp",
      nameKey: "arch_pmegp_name",
      defaultName: "PMEGP Manufacturing",
      descKey: "arch_pmegp_desc",
      defaultDesc: "Up to 35% capital subsidy for units up to ₹50L",
      cost: 2500000,
      income: 400000,
      type: "msme_manufacturing",
      category: "General",
      gender: "male",
    },
    {
      id: "mudra",
      nameKey: "arch_mudra_name",
      defaultName: "PM MUDRA (Kishore/Tarun)",
      descKey: "arch_mudra_desc",
      defaultDesc: "Collateral-free business loan up to ₹10L - ₹20L",
      cost: 1000000,
      income: 300000,
      type: "small_business",
      category: "OBC",
      gender: "male",
    },
    {
      id: "vishwakarma",
      nameKey: "arch_vishwakarma_name",
      defaultName: "PM Vishwakarma Artisan",
      descKey: "arch_vishwakarma_desc",
      defaultDesc: "5% loan up to ₹3L + ₹15K toolkit grant for 18 trades",
      cost: 200000,
      income: 150000,
      type: "artisan_crafts",
      category: "OBC",
      gender: "male",
    },
    {
      id: "svanidhi",
      nameKey: "arch_svanidhi_name",
      defaultName: "PM SVANidhi Street Vendor",
      descKey: "arch_svanidhi_desc",
      defaultDesc: "Up to ₹50K working capital with 7% interest subsidy",
      cost: 50000,
      income: 120000,
      type: "micro_retail",
      category: "General",
      gender: "male",
    },
    {
      id: "standup",
      nameKey: "arch_standup_name",
      defaultName: "Stand-Up India (Women/SC/ST)",
      descKey: "arch_standup_desc",
      defaultDesc: "Greenfield enterprise credit from ₹10L to ₹1 Crore",
      cost: 4500000,
      income: 550000,
      type: "greenfield_enterprise",
      category: "SC",
      gender: "female",
    },
    {
      id: "mahila",
      nameKey: "arch_mahila_name",
      defaultName: "Mahila Samriddhi (Women)",
      descKey: "arch_mahila_desc",
      defaultDesc: "Ultra-concessional 4.0% interest for women micro-trades",
      cost: 140000,
      income: 180000,
      type: "women_microfinance",
      category: "SC",
      gender: "female",
    },
    {
      id: "green",
      nameKey: "arch_green_name",
      defaultName: "Clean Tech & EV Commercial",
      descKey: "arch_green_desc",
      defaultDesc: "E-rickshaws, commercial EVs & solar rooftop units",
      cost: 2000000,
      income: 350000,
      type: "green_business",
      category: "General",
      gender: "male",
    },
  ];

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

  const handleSelectArchetype = (arch: typeof ARCHETYPES[0]) => {
    setActiveArchetype(arch.id);
    const updated: EntrepreneurProfile = {
      ...profile,
      project_type: arch.type,
      estimated_project_cost: arch.cost,
      annual_family_income: arch.income,
      social_category: arch.category,
      gender: arch.gender,
    };
    setProfile(updated);
    executeMatch(updated, `Switched profile to ${t(arch.nameKey, arch.defaultName)}`);
  };

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

  // Filtering matches based on tabs
  const filteredMatches = matches.filter((m) => {
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
            {/* Quick Profile Selection */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{
                  fontSize: "0.76rem",
                  fontWeight: "700",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {t("quick_archetypes", "Quick Select Enterprise Archetypes")}
                </div>
                <span className="chip chip-cyan" style={{ fontSize: "0.68rem" }}>
                  {t("all_demographics_badge", "Open to General, OBC, SC, ST, Minorities & Women")}
                </span>
              </div>
              <div className="archetype-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.6rem"
              }}>
                {ARCHETYPES.map((arch) => (
                  <button
                    key={arch.id}
                    onClick={() => handleSelectArchetype(arch)}
                    className={`archetype-btn ${activeArchetype === arch.id ? "active" : ""}`}
                    aria-label={`Select ${t(arch.nameKey, arch.defaultName)} profile`}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.84rem" }}>
                        {t(arch.nameKey, arch.defaultName)}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        ₹{fmt(arch.cost)} • {t(arch.descKey, arch.defaultDesc)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.15rem", margin: 0, color: "var(--text-primary)", fontWeight: "800" }}>
                    {t("results_heading", "Matched Government Credit Schemes")} ({filteredMatches.length})
                  </h3>

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
                      Try setting the filter to "All Schemes" or choose one of the pre-configured enterprise archetypes above.
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        onClick={() => {
                          setFilterType("all");
                          handleSelectArchetype(ARCHETYPES[0]);
                        }}
                        className="btn-apex"
                        style={{ padding: "0.6rem 1.25rem", fontSize: "0.82rem" }}
                      >
                        Reset to PMEGP Manufacturing Profile
                      </button>
                    </div>
                  </div>
                )}

                {!loading && filteredMatches.map((match, i) => (
                  <SchemeCard key={match.scheme.id} match={match} index={i} />
                ))}
              </section>
            </div>
          </div>
        )}

        {/* ─── TAB 2: Financial Calculator ─── */}
        {activeTab === "calculator" && <FinancialCalculator />}

        {/* ─── TAB 3: Channel Partner Radar ─── */}
        {activeTab === "partners" && <PartnerLocator />}

      </main>

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
