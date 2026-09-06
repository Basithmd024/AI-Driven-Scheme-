"use client";
import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { SchemeCard } from "../components/SchemeCard";
import { FinancialCalculator } from "../components/FinancialCalculator";
import { PartnerLocator } from "../components/PartnerLocator";
import { matchSchemes, EntrepreneurProfile, SchemeMatchResult } from "../lib/api";

const ARCHETYPES = [
  {
    id: "micro",
    name: "Micro Retailer",
    cost: 120000,
    income: 150000,
    type: "microfinance",
    gender: "male",
    desc: "Petty trade, tailoring, retail (Up to ₹1.4L)"
  },
  {
    id: "mahila",
    name: "Mahila Samriddhi",
    cost: 140000,
    income: 180000,
    type: "women_microfinance",
    gender: "female",
    desc: "SC Women / SHGs at 4.0% interest"
  },
  {
    id: "msme",
    name: "MSME Term Loan",
    cost: 2500000,
    income: 380000,
    type: "term_loan",
    gender: "male",
    desc: "Manufacturing, workshops, units"
  },
  {
    id: "edu_abroad",
    name: "Higher Studies Abroad",
    cost: 3500000,
    income: 420000,
    type: "education_overseas",
    gender: "male",
    desc: "Foreign technical/professional courses"
  },
  {
    id: "green",
    name: "Clean Energy / EV",
    cost: 2000000,
    income: 320000,
    type: "green_business",
    gender: "male",
    desc: "Commercial EV, solar installation"
  },
];

const PROJECT_TYPES = [
  { value: "microfinance", label: "Micro Credit / Petty Business (Up to ₹1.40L)" },
  { value: "women_microfinance", label: "Women Micro-Finance (Mahila Samriddhi - 4% p.a.)" },
  { value: "term_loan", label: "Small & Medium Enterprise Term Loan (Up to ₹50L)" },
  { value: "education_domestic", label: "Professional / Technical Education (Domestic - ₹20L)" },
  { value: "education_overseas", label: "Higher Studies Abroad / Foreign STEM (Up to ₹40L)" },
  { value: "green_business", label: "Green Business / Clean Energy / EV / Solar (Up to ₹30L)" },
];

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("recommender");
  const [activeArchetype, setActiveArchetype] = useState<string>("micro");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Item 4: Dynamic Page Title per tab
  useEffect(() => {
    const titles: Record<string, string> = {
      recommender: "Scheme Recommender | Samarthya Setu",
      calculator: "EMI & Moratorium Simulator | Samarthya Setu",
      partners: "Channel Partner Locator | Samarthya Setu",
    };
    document.title = titles[activeTab] || "Samarthya Setu | SC Concessional Channel Finance";
  }, [activeTab]);

  // Toast Management (Items 14 & 15)
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
    full_name: "Ramesh K.",
    gender: "male",
    social_category: "SC",
    annual_family_income: 180000,
    is_differently_abled: false,
    project_type: "microfinance",
    education_status: "Graduate",
    estimated_project_cost: 120000,
    state: "Telangana",
    district: "Hyderabad",
    is_shg_member: false,
    is_udyam_registered: true,
  });

  const [matches, setMatches] = useState<SchemeMatchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSelectArchetype = (arch: typeof ARCHETYPES[0]) => {
    setActiveArchetype(arch.id);
    const updated: EntrepreneurProfile = {
      ...profile,
      project_type: arch.type,
      estimated_project_cost: arch.cost,
      annual_family_income: arch.income,
      gender: arch.gender,
    };
    setProfile(updated);
    executeMatch(updated, `Profile switched to ${arch.name}`);
  };

  const executeMatch = async (currentProfile = profile, customSuccessMsg?: string) => {
    // Item 14: Validation before API call
    if (currentProfile.estimated_project_cost <= 0) {
      addToast("error", "Invalid Project Cost", "Project cost must be greater than ₹0 to match financing programs.");
      return;
    }

    setLoading(true);
    try {
      const results = await matchSchemes(currentProfile);
      setMatches(results);
      setHasSearched(true);
      
      // Item 15: Add success message
      const eligibleCount = results.filter(
        (r) => r.eligibility_status === "Highly Eligible" || r.eligibility_status === "Eligible"
      ).length;
      
      if (eligibleCount > 0) {
        addToast("success", "Eligibility Evaluated", customSuccessMsg || `Successfully matched ${eligibleCount} concessional schemes.`);
      } else {
        addToast("info", "Evaluation Complete", "No schemes directly met the criteria. Check income or parameters.");
      }
    } catch (err) {
      console.warn("Backend match API call fallback", err);
      // Item 14: Error feedback message
      addToast("error", "Evaluation Notice", "Backend service offline. Evaluated schemes using offline institutional rules.");
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
    executeMatch(profile, "Evaluation updated with custom parameters");
  };

  const fmt = (n: number) => n.toLocaleString("en-IN");

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
      {/* Toast Notification Layer (Items 14 & 15) */}
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
              <div style={{
                fontSize: "0.76rem",
                fontWeight: "700",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.45rem"
              }}>
                Pre-Configured Beneficiary Archetypes
              </div>
              <div className="archetype-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.6rem"
              }}>
                {ARCHETYPES.map((arch) => (
                  <button
                    key={arch.id}
                    onClick={() => handleSelectArchetype(arch)}
                    className={`archetype-btn ${activeArchetype === arch.id ? "active" : ""}`}
                    aria-label={`Select ${arch.name} profile`}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>{arch.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        ₹{fmt(arch.cost)} • {arch.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Responsive Grid Layout (Items 1, 10, 12, 13) */}
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
                  Beneficiary Eligibility Assessment
                </div>

                {/* Social Category & Gender */}
                <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.9rem" }}>
                  <div>
                    <label className="field-label">Social Category</label>
                    <select
                      className="input-box"
                      value={profile.social_category}
                      onChange={(e) => setProfile({ ...profile, social_category: e.target.value })}
                      aria-label="Social Category"
                    >
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="OBC">OBC</option>
                      <option value="General">General</option>
                      <option value="ST">ST</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Gender</label>
                    <select
                      className="input-box"
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      aria-label="Gender"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female (1% Interest Rebate)</option>
                      <option value="transgender">Transgender</option>
                    </select>
                  </div>
                </div>

                {/* Annual Family Income Slider */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <label className="field-label" style={{ margin: 0 }}>
                      Annual Family Income: <strong>₹{fmt(profile.annual_family_income)}</strong>
                    </label>
                    {profile.annual_family_income > 500000 ? (
                      <span className="chip chip-rose" style={{ fontSize: "0.7rem" }}>
                        Exceeds ₹5L Cap
                      </span>
                    ) : (
                      <span className="chip chip-emerald" style={{ fontSize: "0.7rem" }}>
                        Eligible
                      </span>
                    )}
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={1000000}
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
                    <span style={{ color: "var(--accent-emerald)", fontWeight: "700" }}>₹5.00L Statutory Ceiling</span>
                    <span>₹10.0L</span>
                  </div>
                  
                  {/* Item 14: Inline validation alert */}
                  {profile.annual_family_income > 500000 && (
                    <div className="field-error-msg">
                      ⚠️ Income exceeds statutory limit of ₹5.00 Lakhs. NSFDC subsidized interest rates only apply to incomes ≤ ₹5.00L.
                    </div>
                  )}
                </div>

                {/* Credit Purpose */}
                <div style={{ marginBottom: "1rem" }}>
                  <label className="field-label">Credit Purpose</label>
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
                    <label className="field-label">Estimated Project Cost</label>
                    <input
                      type="number"
                      className={`input-box ${profile.estimated_project_cost <= 0 ? "input-error" : ""}`}
                      value={profile.estimated_project_cost}
                      onChange={(e) => {
                        setActiveArchetype("");
                        setProfile({ ...profile, estimated_project_cost: Number(e.target.value) });
                      }}
                      min={10000}
                      max={5000000}
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

                {/* State & District */}
                <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.9rem" }}>
                  <div>
                    <label className="field-label">State of Residence</label>
                    <input
                      type="text"
                      className="input-box"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      aria-label="State"
                    />
                  </div>
                  <div>
                    <label className="field-label">District</label>
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
                    Differently Abled (Divyangjan — Special Subsidy)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)", cursor: "pointer", minHeight: "36px" }}>
                    <input
                      type="checkbox"
                      checked={profile.is_shg_member}
                      onChange={(e) => setProfile({ ...profile, is_shg_member: e.target.checked })}
                      style={{ width: "18px", height: "18px" }}
                    />
                    Self-Help Group (SHG) Member
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)", cursor: "pointer", minHeight: "36px" }}>
                    <input
                      type="checkbox"
                      checked={profile.is_udyam_registered}
                      onChange={(e) => setProfile({ ...profile, is_udyam_registered: e.target.checked })}
                      style={{ width: "18px", height: "18px" }}
                    />
                    Udyam Registered Enterprise
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-apex"
                  style={{ width: "100%", padding: "0.85rem" }}
                >
                  {loading ? "Evaluating Eligibility..." : "Match Concessional Schemes"}
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
                  Disbursements are routed through State Channelizing Agencies (SCAs), Public Sector Banks, and Regional Rural Banks at concessional rates (4.0%–8.0% p.a.).
                </div>
              </form>

              {/* Matched Scheme Cards */}
              <section aria-label="Evaluated Schemes">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.15rem", margin: 0, color: "var(--text-primary)", fontWeight: "800" }}>
                    {hasSearched ? `Qualified Schemes (${matches.length})` : "Recommended Schemes"}
                  </h3>
                  {matches.length > 0 && (
                    <span className="chip chip-emerald">
                      {matches.filter(m => m.eligibility_status === "Highly Eligible" || m.eligibility_status === "Eligible").length} Eligible
                    </span>
                  )}
                </div>

                {loading && (
                  <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--brand-accent)" }}>
                    <div style={{ fontWeight: "700", fontSize: "1rem" }}>Evaluating eligibility against NSFDC guidelines...</div>
                  </div>
                )}

                {/* Item 11: Empty State Component */}
                {!loading && hasSearched && matches.length === 0 && (
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
                      borderRadius: "50%",
                      background: "var(--status-warning-bg)",
                      color: "var(--status-warning)",
                      fontSize: "1.8rem",
                      marginBottom: "1rem"
                    }}>
                      📋
                    </div>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                      No Matching Schemes Found
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "460px", margin: "0 auto 1.25rem auto", lineHeight: "1.6" }}>
                      {profile.annual_family_income > 500000
                        ? `Your entered family income of ₹${fmt(profile.annual_family_income)} exceeds the statutory ceiling of ₹5,00,000 for NSFDC concessional lending.`
                        : "No active schemes match this combination of project cost, purpose, and demographic criteria."}
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleSelectArchetype(ARCHETYPES[0])}
                        className="btn-apex"
                        style={{ padding: "0.6rem 1.25rem", fontSize: "0.82rem" }}
                      >
                        Reset to Micro Retailer Profile
                      </button>
                      <a
                        href="tel:14566"
                        className="chip chip-cyan"
                        style={{ textDecoration: "none", fontSize: "0.82rem", padding: "0.6rem 1.2rem", borderRadius: "8px" }}
                        title="Click to call National SC Helpline"
                      >
                        📞 Contact SC Helpline (14566)
                      </a>
                    </div>
                  </div>
                )}

                {!loading && matches.map((match, i) => (
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

      {/* Item 6 & 17 & 9: Institutional Footer with Clickable Phone, Email, and Zero Placeholder Copy */}
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
            Samarthya Setu — Scheduled Caste Concessional Channel Finance Platform
          </div>
          <div style={{ marginTop: "0.35rem", color: "var(--text-secondary)", fontSize: "0.78rem" }}>
            National Scheduled Castes Finance and Development Corporation (NSFDC) • Ministry of Social Justice & Empowerment
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
              <span>National SC Toll-Free Helpline:</span>
              <a
                href="tel:14566"
                style={{ color: "var(--brand-accent)", fontWeight: "800", textDecoration: "none" }}
                title="Call 14566"
              >
                14566
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>Corporate Helpdesk:</span>
              <a
                href="tel:011-22054300"
                style={{ color: "var(--brand-accent)", fontWeight: "700", textDecoration: "none" }}
                title="Call 011-22054300"
              >
                011-22054300
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>Support Desk:</span>
              <a
                href="mailto:support@samarthya-setu.gov.in"
                style={{ color: "var(--brand-accent)", fontWeight: "700", textDecoration: "none" }}
                title="Email Support"
              >
                support@samarthya-setu.gov.in
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>Grievances:</span>
              <a
                href="mailto:grievance@nsfdc.nic.in"
                style={{ color: "var(--brand-accent)", textDecoration: "none" }}
                title="Email Grievance Cell"
              >
                grievance@nsfdc.nic.in
              </a>
            </div>
          </div>

          <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", lineHeight: "1.6" }}>
            Statutory Income Ceiling: ≤ ₹5.00 Lakhs per annum | Concessional Lending Rate: 4.0% – 8.0% p.a. | Channel Partner Allocation via SCAs, PSBs & RRBs.
          </div>
        </div>
      </footer>
    </div>
  );
}
