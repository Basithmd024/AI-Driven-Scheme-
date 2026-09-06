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

export default function Home() {
  const [activeTab, setActiveTab] = useState("recommender");
  const [activeArchetype, setActiveArchetype] = useState<string>("micro");

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
    is_udyam_registered: false,
  });

  const [matches, setMatches] = useState<SchemeMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSelectArchetype = (arch: typeof ARCHETYPES[0]) => {
    setActiveArchetype(arch.id);
    const updated = {
      ...profile,
      project_type: arch.type,
      estimated_project_cost: arch.cost,
      annual_family_income: arch.income,
      gender: arch.gender,
      is_shg_member: arch.id === "mahila"
    };
    setProfile(updated);
    executeMatch(updated);
  };

  const executeMatch = async (currentProfile = profile) => {
    setLoading(true);
    try {
      const results = await matchSchemes(currentProfile);
      setMatches(results);
      setHasSearched(true);
    } catch (err) {
      console.warn("Backend match API call fallback", err);
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
    executeMatch();
  };

  const fmt = (n: number) => n.toLocaleString("en-IN");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ flex: 1, maxWidth: "1340px", margin: "0 auto", padding: "1.5rem", width: "100%" }}>
        
        {/* ─── TAB 1: Scheme Recommender ─── */}
        {activeTab === "recommender" && (
          <div>
            {/* Quick Profile Selection */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.76rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.45rem" }}>
                Target Profiles
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.6rem" }}>
                {ARCHETYPES.map((arch) => (
                  <button
                    key={arch.id}
                    onClick={() => handleSelectArchetype(arch)}
                    className={`archetype-btn ${activeArchetype === arch.id ? "active" : ""}`}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>{arch.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>₹{fmt(arch.cost)} • {arch.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Split Screen Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.65fr", gap: "1.5rem", alignItems: "start" }}>
              
              {/* Profile Intake Form */}
              <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: "1.5rem" }}>
                <div style={{
                  fontSize: "0.92rem", fontWeight: "800", color: "var(--text-primary)",
                  marginBottom: "1.1rem", paddingBottom: "0.45rem", borderBottom: "1px solid var(--border-subtle)"
                }}>
                  Eligibility Assessment
                </div>

                {/* Social Category & Gender */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.9rem" }}>
                  <div>
                    <label className="field-label">Social Category</label>
                    <select
                      className="input-box"
                      value={profile.social_category}
                      onChange={(e) => setProfile({ ...profile, social_category: e.target.value })}
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
                    >
                      <option value="male">Male</option>
                      <option value="female">Female (Rebate)</option>
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
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
                    <span>₹50K</span>
                    <span style={{ color: "var(--accent-emerald)", fontWeight: "700" }}>₹5.00L Statutory Ceiling</span>
                    <span>₹10.0L</span>
                  </div>
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
                  >
                    {PROJECT_TYPES.map((pt) => (
                      <option key={pt.value} value={pt.value}>{pt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Estimated Project Cost Slider */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <label className="field-label" style={{ margin: 0 }}>
                      Estimated Project Cost: <strong>₹{fmt(profile.estimated_project_cost)}</strong>
                    </label>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={5000000}
                    step={20000}
                    value={profile.estimated_project_cost}
                    onChange={(e) => {
                      setActiveArchetype("");
                      setProfile({ ...profile, estimated_project_cost: Number(e.target.value) });
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
                    <span>₹20K</span>
                    <span>₹20L</span>
                    <span>₹50.00L</span>
                  </div>
                </div>

                {/* State & District */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="field-label">State</label>
                    <select
                      className="input-box"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    >
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>
                  <div>
                    <label className="field-label">District</label>
                    <input
                      className="input-box"
                      type="text"
                      value={profile.district}
                      onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    />
                  </div>
                </div>

                {/* Special Criteria */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "1.3rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={profile.is_shg_member}
                      onChange={(e) => setProfile({ ...profile, is_shg_member: e.target.checked })}
                    />
                    Self-Help Group (SHG) Member
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.55rem", fontSize: "0.82rem", fontWeight: "600", color: "var(--text-secondary)", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={profile.is_differently_abled}
                      onChange={(e) => setProfile({ ...profile, is_differently_abled: e.target.checked })}
                    />
                    Differently Abled Concession
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-apex"
                  style={{ width: "100%", padding: "0.8rem" }}
                >
                  {loading ? "Evaluating Schemes..." : "Match Concessional Schemes"}
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
                  Funds are disbursed through authorized State Channelizing Agencies (SCAs), Public Sector Banks, and Regional Rural Banks.
                </div>
              </form>

              {/* Matched Scheme Cards */}
              <section>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-primary)", fontWeight: "800" }}>
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
                    <div style={{ fontWeight: "700" }}>Processing eligibility criteria...</div>
                  </div>
                )}

                {!loading && hasSearched && matches.length === 0 && (
                  <div className="glass-panel" style={{
                    padding: "2.5rem 1.5rem", textAlign: "center", color: "var(--accent-rose)",
                    background: "var(--accent-rose-bg)", border: "1px solid var(--status-danger-border)"
                  }}>
                    <strong>No Schemes Matched</strong>
                    <div style={{ fontSize: "0.82rem", marginTop: "0.3rem", color: "var(--text-muted)" }}>
                      Annual family income exceeds the statutory ₹5.00 Lakhs ceiling.
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

      {/* Footer */}
      <footer style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--text-muted)",
        padding: "1.5rem 2rem",
        textAlign: "center",
        fontSize: "0.76rem",
        marginTop: "3rem"
      }}>
        <div style={{ color: "var(--text-secondary)", fontWeight: "700" }}>
          Samarthya Setu — Scheduled Caste Concessional Channel Finance System
        </div>
        <div style={{ marginTop: "0.35rem", color: "var(--text-faint)" }}>
          NSFDC Mandate | Statutory Income Ceiling: ₹5.00 Lakhs | Subsidized Rates: 4.0% – 8.0% p.a.
        </div>
      </footer>
    </div>
  );
}
