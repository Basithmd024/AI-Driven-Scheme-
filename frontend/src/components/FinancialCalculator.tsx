"use client";
import React, { useState, useEffect } from "react";
import { calculateEMI, EMIResponse } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";

export const FinancialCalculator: React.FC = () => {
  const { t } = useLanguage();
  const [projectCost, setProjectCost] = useState<number>(500000);
  const [promoter, setPromoter] = useState<number>(5);
  const [rate, setRate] = useState<number>(6.0);
  const [tenure, setTenure] = useState<number>(5);
  const [moratorium, setMoratorium] = useState<number>(6);
  const [commercialRate] = useState<number>(13.5);

  const [result, setResult] = useState<EMIResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const triggerCalculate = async () => {
    setLoading(true);
    try {
      const data = await calculateEMI({
        project_cost: projectCost,
        concessional_rate: rate,
        tenure_years: tenure,
        moratorium_months: moratorium,
        promoter_share_pct: promoter,
        commercial_rate_benchmark: commercialRate,
      });
      setResult(data);
    } catch (err) {
      console.warn("Using offline fallback calculation", err);
      const netLoan = projectCost * (1 - promoter / 100);
      const monthlyRate = rate / 100 / 12;
      const repaymentMonths = tenure * 12 - moratorium;
      const emi =
        repaymentMonths > 0
          ? (netLoan * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
            (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
          : 0;
      const totalRepay = emi * repaymentMonths + netLoan * monthlyRate * moratorium;
      const commMonthly = commercialRate / 100 / 12;
      const commTotalMonths = tenure * 12;
      const commEmi =
        (netLoan * commMonthly * Math.pow(1 + commMonthly, commTotalMonths)) /
        (Math.pow(1 + commMonthly, commTotalMonths) - 1);
      const commTotal = commEmi * commTotalMonths;

      setResult({
        project_cost: projectCost,
        promoter_contribution: (projectCost * promoter) / 100,
        net_loan_amount: netLoan,
        concessional_rate: rate,
        tenure_years: tenure,
        moratorium_months: moratorium,
        monthly_emi_after_moratorium: emi,
        moratorium_monthly_interest: netLoan * monthlyRate,
        total_concessional_interest: Math.max(0, totalRepay - netLoan),
        total_repayment_amount: totalRepay,
        total_net_outflow: totalRepay,
        commercial_monthly_emi: commEmi,
        total_commercial_interest: Math.max(0, commTotal - netLoan),
        total_commercial_interest_benchmark: Math.max(0, commTotal - netLoan),
        beneficiary_savings_amount: Math.max(0, commTotal - totalRepay),
        direct_beneficiary_savings: Math.max(0, commTotal - totalRepay),
        amortization_schedule: Array.from({ length: Math.min(12, tenure * 12) }, (_, i) => ({
          month: i + 1,
          is_moratorium: i < moratorium,
          opening_balance: netLoan,
          principal_paid: i < moratorium ? 0 : emi - netLoan * monthlyRate,
          interest_paid: netLoan * monthlyRate,
          total_payment: i < moratorium ? netLoan * monthlyRate : emi,
          closing_balance: netLoan * (1 - (i + 1) * 0.05),
        })),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    triggerCalculate();
  }, [projectCost, rate, tenure, moratorium, promoter, commercialRate]);

  const fmt = (n: any) => {
    const num = Number(n);
    if (isNaN(num) || !isFinite(num)) return "0";
    return Math.round(num).toLocaleString("en-IN");
  };
  const totalMonths = tenure * 12;
  const repaymentMonths = totalMonths - moratorium;

  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-primary)" }}>
          {t("calc_heading", "Concessional EMI & Moratorium Simulator")}
        </h2>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
          {t("calc_subheading", "Compare subsidized government loan repayments against standard 13.5% commercial bank lending benchmarks.")}
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "1.5rem",
        alignItems: "start",
        maxWidth: "100%"
      }}>
        {/* Left: Interactive Controls */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{
            fontSize: "0.92rem",
            fontWeight: "800",
            color: "var(--text-primary)",
            marginBottom: "1.2rem",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid var(--border-subtle)"
          }}>
            {t("calc_inputs_title", "Financing & Term Parameters")}
          </div>

          {/* Project Cost Slider */}
          <div style={{ marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <label className="field-label" style={{ margin: 0 }}>
                {t("calc_slider_cost", "Total Project Cost")}:
              </label>
              <span style={{ fontWeight: "800", color: "var(--brand-accent)" }}>₹{fmt(projectCost)}</span>
            </div>
            <input
              type="range" min={50000} max={5000000} step={25000}
              value={projectCost} onChange={(e) => setProjectCost(Number(e.target.value))}
              aria-label="Total Project Cost"
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
              <span>₹50K</span><span>₹25L</span><span>₹50.00L</span>
            </div>
          </div>

          {/* Promoter Share Slider */}
          <div style={{ marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <label className="field-label" style={{ margin: 0 }}>
                {t("calc_slider_margin", "Promoter Equity Contribution")}: {promoter}%
              </label>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Equity: ₹{fmt((projectCost * promoter) / 100)}
              </span>
            </div>
            <input
              type="range" min={0} max={20} step={1}
              value={promoter} onChange={(e) => setPromoter(Number(e.target.value))}
              aria-label="Promoter Margin percentage"
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
              <span>0% (Micro / PM SVANidhi)</span><span>5-10% (PMEGP / MUDRA)</span><span>20%</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div style={{ marginBottom: "1.2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <label className="field-label" style={{ margin: 0 }}>
                {t("calc_slider_rate", "Concessional Interest Rate")}
              </label>
              <span style={{ fontWeight: "800", color: "var(--accent-emerald)" }}>{rate}% p.a.</span>
            </div>
            <input
              type="range" min={4.0} max={9.0} step={0.5}
              value={rate} onChange={(e) => setRate(Number(e.target.value))}
              aria-label="Concessional Rate"
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "3px" }}>
              <span>4.0% (Mahila / Vishwakarma)</span><span>6.5% (MSME Concessional)</span><span>8.5-9.0%</span>
            </div>
          </div>

          {/* Tenure & Moratorium */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "1.2rem" }}>
            <div>
              <label className="field-label">
                {t("calc_slider_tenure", "Repayment Tenure")}: {tenure} Yrs ({totalMonths} mo)
              </label>
              <input
                type="range" min={1} max={10} step={1}
                value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
                aria-label="Tenure in years"
              />
            </div>
            <div>
              <label className="field-label">
                {t("calc_slider_moratorium", "Moratorium Period")}: {moratorium} Months
              </label>
              <input
                type="range" min={0} max={18} step={3}
                value={moratorium} onChange={(e) => setMoratorium(Number(e.target.value))}
                aria-label="Moratorium in months"
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
                    transition: "width 0.3s"
                  }}
                  title={`Moratorium: ${moratorium} mo`}
                />
              )}
              <div
                style={{
                  flex: 1,
                  background: "var(--brand-primary)",
                  transition: "width 0.3s"
                }}
                title={`EMI Repayment: ${repaymentMonths} mo`}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
              <span style={{ color: "var(--accent-amber)" }}>● {t("calc_phase_moratorium", "Moratorium")} ({moratorium} mo)</span>
              <span style={{ color: "var(--brand-accent)" }}>● {t("calc_phase_repayment", "Repayment")} ({repaymentMonths} mo)</span>
            </div>
          </div>
        </div>

        {/* Right: Repayment Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {result && (
            <>
              {/* Beneficiary Savings Card */}
              <div className="glass-panel" style={{
                padding: "1.25rem",
                background: "var(--accent-emerald-bg)",
                border: "1.5px solid var(--status-active-border)",
                borderRadius: "12px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.74rem", fontWeight: "800", color: "var(--status-active)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    ✓ {t("calc_savings_title", "DIRECT BENEFICIARY SAVINGS")}
                  </span>
                  <span className="chip chip-emerald" style={{ fontSize: "0.68rem" }}>
                    Subsidized Scheme
                  </span>
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--status-active)" }}>
                  ₹{fmt(result.beneficiary_savings_amount ?? result.direct_beneficiary_savings)}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                  {t("calc_savings_desc", "Saved over full loan lifecycle compared to 13.5% commercial bank financing.")}
                </div>
              </div>

              {/* Monthly EMI Comparison Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
                <div className="glass-panel" style={{ padding: "1rem", borderRadius: "10px" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>
                    {t("calc_emi_card", "Concessional Monthly EMI")}
                  </div>
                  <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--brand-accent)", margin: "0.25rem 0" }}>
                    ₹{fmt(result.monthly_emi_after_moratorium)}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    After month {moratorium}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: "1rem", borderRadius: "10px" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>
                    {t("calc_moratorium_card", "Moratorium Phase Cost")}
                  </div>
                  <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--accent-amber)", margin: "0.25rem 0" }}>
                    ₹{fmt(result.moratorium_monthly_interest)}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    Simple interest/month
                  </div>
                </div>
              </div>

              {/* Full Financing Structure Summary */}
              <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "10px" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                  Financing Structure
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>{t("calc_sanctioned_loan", "Sanctioned Loan Amount")}:</span>
                    <strong style={{ color: "var(--text-primary)" }}>₹{fmt(result.net_loan_amount)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>{t("calc_promoter_equity", "Promoter Equity Contribution")}:</span>
                    <strong style={{ color: "var(--text-primary)" }}>₹{fmt(result.promoter_contribution)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>{t("calc_total_interest", "Total Concessional Interest")}:</span>
                    <strong style={{ color: "var(--status-active)" }}>₹{fmt(result.total_concessional_interest)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.45rem" }}>
                    <span>{t("calc_net_outflow", "Total Net Outflow")}:</span>
                    <strong style={{ color: "var(--brand-accent)" }}>₹{fmt(result.total_repayment_amount ?? result.total_net_outflow)}</strong>
                  </div>
                </div>
              </div>

              {/* Collapsible Amortization Schedule */}
              <div className="glass-panel" style={{ padding: "0.9rem 1.25rem", borderRadius: "10px" }}>
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    fontSize: "0.82rem",
                    fontWeight: "700",
                    fontFamily: "inherit",
                    padding: 0
                  }}
                  aria-expanded={showSchedule}
                >
                  <span>{t("calc_schedule_toggle", "Amortization Schedule (First 12 Months)")}</span>
                  <span>{showSchedule ? "▲ Collapse" : "▼ Expand"}</span>
                </button>

                {showSchedule && (
                  <div style={{ marginTop: "1rem", overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.74rem", borderCollapse: "collapse", color: "var(--text-secondary)" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "right" }}>
                          <th style={{ textAlign: "left", padding: "0.4rem" }}>{t("calc_th_month", "Month")}</th>
                          <th style={{ textAlign: "center", padding: "0.4rem" }}>{t("calc_th_phase", "Phase")}</th>
                          <th style={{ padding: "0.4rem" }}>{t("calc_th_principal", "Principal")}</th>
                          <th style={{ padding: "0.4rem" }}>{t("calc_th_interest", "Interest")}</th>
                          <th style={{ padding: "0.4rem" }}>{t("calc_th_total", "Payment")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.amortization_schedule.map((row) => (
                          <tr key={row.month} style={{ borderBottom: "1px solid var(--border-subtle)", textAlign: "right" }}>
                            <td style={{ textAlign: "left", padding: "0.4rem", color: "var(--text-primary)", fontWeight: "600" }}>
                              M{row.month}
                            </td>
                            <td style={{ textAlign: "center", padding: "0.4rem" }}>
                              <span className={row.is_moratorium ? "chip chip-amber" : "chip chip-emerald"} style={{ fontSize: "0.62rem" }}>
                                {row.is_moratorium ? t("calc_phase_moratorium", "Moratorium") : t("calc_phase_repayment", "Repay")}
                              </span>
                            </td>
                            <td style={{ padding: "0.4rem" }}>₹{fmt(row.principal_paid)}</td>
                            <td style={{ padding: "0.4rem" }}>₹{fmt(row.interest_paid)}</td>
                            <td style={{ padding: "0.4rem", fontWeight: "700", color: "var(--text-primary)" }}>
                              ₹{fmt(row.total_payment)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
