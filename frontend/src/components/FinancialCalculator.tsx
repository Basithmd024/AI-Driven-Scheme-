"use client";
import React, { useState, useEffect } from "react";
import { calculateEMI, EMIResponse } from "../lib/api";

export const FinancialCalculator: React.FC = () => {
  const [projectCost, setProjectCost] = useState(500000);
  const [rate, setRate] = useState(6.5);
  const [tenure, setTenure] = useState(5);
  const [moratorium, setMoratorium] = useState(6);
  const [promoter, setPromoter] = useState(10);
  const [commercialRate, setCommercialRate] = useState(13.5);
  const [result, setResult] = useState<EMIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const triggerCalculate = async () => {
    setLoading(true);
    try {
      const res = await calculateEMI({
        project_cost: projectCost,
        concessional_rate: rate,
        tenure_years: tenure,
        moratorium_months: moratorium,
        promoter_share_pct: promoter,
        commercial_rate_benchmark: commercialRate,
      });
      setResult(res);
    } catch (e) {
      const netLoan = projectCost * (1 - promoter / 100);
      const mr = rate / 100 / 12;
      const n = Math.max(1, tenure * 12 - moratorium);
      const pow = Math.pow(1 + mr, n);
      const emi = mr > 0 && pow > 1 ? (netLoan * (mr * pow)) / (pow - 1) : netLoan / n;
      const morInterest = netLoan * mr;
      const totalConc = morInterest * moratorium + (emi * n - netLoan);
      const cmr = commercialRate / 100 / 12;
      const cpow = Math.pow(1 + cmr, n);
      const cemi = cmr > 0 && cpow > 1 ? (netLoan * (cmr * cpow)) / (cpow - 1) : netLoan / n;
      const totalComm = morInterest * moratorium + (cemi * n - netLoan);

      setResult({
        project_cost: projectCost,
        promoter_contribution: (projectCost * promoter) / 100,
        net_loan_amount: netLoan,
        concessional_rate: rate,
        tenure_years: tenure,
        moratorium_months: moratorium,
        monthly_emi_after_moratorium: Math.round(emi),
        moratorium_monthly_interest: Math.round(morInterest),
        total_concessional_interest: Math.round(totalConc),
        total_repayment_amount: Math.round(netLoan + totalConc),
        commercial_monthly_emi: Math.round(cemi),
        total_commercial_interest: Math.round(totalComm),
        beneficiary_savings_amount: Math.round(totalComm - totalConc),
        amortization_schedule: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    triggerCalculate();
  }, [projectCost, rate, tenure, moratorium, promoter, commercialRate]);

  const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");

  const totalMonths = tenure * 12;
  const repaymentMonths = totalMonths - moratorium;

  return (
    <div>
      {/* Header */}
      <div className="section-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)" }}>
            Concessional EMI & Moratorium Simulator
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Concessional reducing balance repayment vs standard 13.5% commercial bank lending
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Left: Controls */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ fontSize: "0.92rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "1.2rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
            Loan Parameters
          </div>

          {/* Project Cost Slider */}
          <div style={{ marginBottom: "1.1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <label className="field-label" style={{ margin: 0 }}>Total Project Cost</label>
              <span style={{ fontWeight: "800", color: "var(--brand-accent)" }}>₹{fmt(projectCost)}</span>
            </div>
            <input
              type="range" min={50000} max={5000000} step={25000}
              value={projectCost} onChange={(e) => setProjectCost(Number(e.target.value))}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
              <span>₹50K</span><span>₹25L</span><span>₹50.00L</span>
            </div>
          </div>

          {/* Promoter Share Slider */}
          <div style={{ marginBottom: "1.1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <label className="field-label" style={{ margin: 0 }}>Promoter Margin: {promoter}%</label>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Equity: ₹{fmt((projectCost * promoter) / 100)}
              </span>
            </div>
            <input
              type="range" min={0} max={20} step={1}
              value={promoter} onChange={(e) => setPromoter(Number(e.target.value))}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
              <span>0% (Micro)</span><span>10% (Term Loan)</span><span>20%</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div style={{ marginBottom: "1.1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <label className="field-label" style={{ margin: 0 }}>Concessional Rate</label>
              <span style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>{rate}% p.a.</span>
            </div>
            <input
              type="range" min={4.0} max={9.0} step={0.5}
              value={rate} onChange={(e) => setRate(Number(e.target.value))}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
              <span>4.0% (Mahila Samriddhi)</span><span>6.5% (MCS)</span><span>8.0%</span>
            </div>
          </div>

          {/* Tenure & Moratorium */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.1rem" }}>
            <div>
              <label className="field-label">Tenure: {tenure} Years ({totalMonths} mo)</label>
              <input
                type="range" min={1} max={10} step={1}
                value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="field-label">Moratorium: {moratorium} Months</label>
              <input
                type="range" min={0} max={18} step={3}
                value={moratorium} onChange={(e) => setMoratorium(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div style={{
            background: "var(--bg-surface)",
            padding: "0.9rem",
            borderRadius: "8px",
            border: "1px solid var(--border-subtle)",
            marginTop: "0.75rem"
          }}>
            <div style={{ fontSize: "0.76rem", fontWeight: "700", color: "var(--text-primary)", marginBottom: "0.45rem" }}>
              Tenure Phasing ({totalMonths} Months)
            </div>
            <div style={{ display: "flex", height: "8px", borderRadius: "4px", overflow: "hidden", background: "var(--bg-inset)" }}>
              {moratorium > 0 && (
                <div
                  style={{
                    width: `${(moratorium / totalMonths) * 100}%`,
                    background: "var(--accent-amber)",
                    transition: "width 0.3s ease"
                  }}
                />
              )}
              <div
                style={{
                  width: `${(repaymentMonths / totalMonths) * 100}%`,
                  background: "var(--brand-primary)",
                  transition: "width 0.3s ease"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
              <span>{moratorium > 0 ? `Moratorium: ${moratorium} mo` : "No Moratorium"}</span>
              <span>Repayment: {repaymentMonths} mo</span>
            </div>
          </div>
        </div>

        {/* Right: Output */}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Savings Highlight */}
            <div className="glass-panel" style={{
              padding: "1.4rem",
              background: "linear-gradient(135deg, var(--status-active-bg) 0%, var(--brand-cyan-glow) 100%)",
              border: "1px solid var(--status-active-border)",
            }}>
              <div style={{ fontSize: "0.74rem", fontWeight: "800", color: "var(--accent-emerald)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Beneficiary Interest Savings
              </div>
              <div style={{
                fontSize: "2.2rem",
                fontWeight: "900",
                color: "var(--accent-emerald)",
                margin: "0.2rem 0",
                letterSpacing: "-0.02em"
              }}>
                ₹{fmt(result.beneficiary_savings_amount)}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Savings compared to commercial benchmark (13.5% p.a.).
              </div>
            </div>

            {/* Figures Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="glass-panel" style={{ padding: "1.1rem" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>
                  Monthly EMI
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "var(--brand-accent)", marginTop: "0.2rem" }}>
                  ₹{fmt(result.monthly_emi_after_moratorium)}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  Commercial: ₹{fmt(result.commercial_monthly_emi)}/mo
                </div>
              </div>

              <div className="glass-panel" style={{ padding: "1.1rem" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>
                  Net Loan Amount
                </div>
                <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "var(--text-primary)", marginTop: "0.2rem" }}>
                  ₹{fmt(result.net_loan_amount)}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  Margin: ₹{fmt(result.promoter_contribution)}
                </div>
              </div>
            </div>

            {/* Comparison Bars */}
            <div className="glass-panel" style={{ padding: "1.2rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.8rem" }}>
                Interest Comparison
              </div>

              <div style={{ marginBottom: "0.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: "700", color: "var(--accent-emerald)" }}>Concessional ({rate}%)</span>
                  <strong style={{ color: "var(--accent-emerald)" }}>₹{fmt(result.total_concessional_interest)}</strong>
                </div>
                <div style={{ height: "8px", borderRadius: "4px", background: "var(--bg-inset)", overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.min(100, (result.total_concessional_interest / result.total_commercial_interest) * 100)}%`,
                    height: "100%",
                    background: "var(--accent-emerald)",
                    transition: "width 0.5s ease"
                  }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: "700", color: "var(--accent-rose)" }}>Commercial Bank (13.5%)</span>
                  <strong style={{ color: "var(--accent-rose)" }}>₹{fmt(result.total_commercial_interest)}</strong>
                </div>
                <div style={{ height: "8px", borderRadius: "4px", background: "var(--bg-inset)", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", background: "var(--accent-rose)" }} />
                </div>
              </div>
            </div>

            {/* Schedule Accordion Toggle */}
            {result.amortization_schedule.length > 0 && (
              <div className="glass-panel" style={{ padding: "0.9rem 1.1rem" }}>
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "var(--brand-accent)",
                    fontWeight: "700",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span>Amortization Schedule ({result.amortization_schedule.length} Months)</span>
                  <span>{showSchedule ? "Close" : "Expand"}</span>
                </button>

                {showSchedule && (
                  <div style={{ marginTop: "0.9rem", maxHeight: "260px", overflowY: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.74rem", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", textAlign: "left" }}>
                          <th style={{ padding: "0.35rem" }}>Month</th>
                          <th style={{ padding: "0.35rem" }}>Type</th>
                          <th style={{ padding: "0.35rem" }}>Principal</th>
                          <th style={{ padding: "0.35rem" }}>Interest</th>
                          <th style={{ padding: "0.35rem" }}>Total</th>
                          <th style={{ padding: "0.35rem" }}>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.amortization_schedule.map((row) => (
                          <tr key={row.month} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                            <td style={{ padding: "0.35rem" }}>{row.month}</td>
                            <td style={{ padding: "0.35rem" }}>
                              <span className={`chip ${row.is_moratorium ? "chip-amber" : "chip-emerald"}`} style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>
                                {row.is_moratorium ? "Grace" : "EMI"}
                              </span>
                            </td>
                            <td style={{ padding: "0.35rem" }}>₹{fmt(row.principal_paid)}</td>
                            <td style={{ padding: "0.35rem" }}>₹{fmt(row.interest_paid)}</td>
                            <td style={{ padding: "0.35rem", fontWeight: "700" }}>₹{fmt(row.total_payment)}</td>
                            <td style={{ padding: "0.35rem" }}>₹{fmt(row.closing_balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
