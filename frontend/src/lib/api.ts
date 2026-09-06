const API_BASE = typeof window !== "undefined" ? "/backend-api" : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1");

/* ─── Scheme Types ─── */
export interface Scheme {
  id: string;
  title: string;
  title_hi?: string;
  ministry_or_org: string;
  category: string;
  description: string;
  target_demographics: string[];
  eligible_business_types: string[];
  max_funding_amount: number;
  max_project_cost: number;
  concessional_interest_rate: number;
  max_tenure_years: number;
  max_moratorium_months: number;
  subsidy_percentage: number;
  promoter_contribution_min: number;
  channel_finance_coverage: number;
  application_url?: string;
  eligibility_criteria: Record<string, any>;
}

export interface SchemeMatchResult {
  scheme: Scheme;
  match_score: number;
  eligibility_status: string;
  ai_reasoning: string;
  key_benefits: string[];
  required_documents: string[];
  channel_guidelines: Record<string, any>;
}

/* ─── User Profile ─── */
export interface EntrepreneurProfile {
  full_name: string;
  email?: string;
  phone?: string;
  gender: string;
  social_category: string;
  annual_family_income: number;
  is_differently_abled: boolean;
  project_type: string;
  education_status: string;
  estimated_project_cost: number;
  state: string;
  district: string;
  is_shg_member: boolean;
  is_udyam_registered: boolean;
}

/* ─── Calculator ─── */
export interface EMIRequest {
  project_cost: number;
  concessional_rate: number;
  tenure_years: number;
  moratorium_months: number;
  promoter_share_pct: number;
  commercial_rate_benchmark: number;
}

export interface AmortizationItem {
  month: number;
  is_moratorium: boolean;
  opening_balance: number;
  principal_paid: number;
  interest_paid: number;
  total_payment: number;
  closing_balance: number;
}

export interface EMIResponse {
  project_cost: number;
  promoter_contribution: number;
  net_loan_amount: number;
  concessional_rate: number;
  tenure_years: number;
  moratorium_months: number;
  monthly_emi_after_moratorium: number;
  moratorium_monthly_interest: number;
  total_concessional_interest: number;
  total_repayment_amount: number;
  commercial_monthly_emi: number;
  total_commercial_interest: number;
  beneficiary_savings_amount: number;
  amortization_schedule: AmortizationItem[];
}

/* ─── Channel Partner ─── */
export interface ChannelPartner {
  id: string;
  name: string;
  category: string;
  state: string;
  district: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  contact_person: string;
  latitude: number;
  longitude: number;
  fund_utilization_rate: number;
  npa_rate: number;
  status: string;
  status_message: string;
  supported_schemes: string[];
  avg_disbursement_days: number;
  distance_km?: number;
  routing_recommendation?: string;
}

export interface PartnerFilter {
  state?: string;
  district?: string;
  category?: string;
  scheme_id?: string;
  active_only: boolean;
  user_lat?: number;
  user_lng?: number;
  max_distance_km?: number;
}

/* ─── API Functions ─── */

export async function fetchSchemes(): Promise<Scheme[]> {
  const res = await fetch(`${API_BASE}/schemes`);
  if (!res.ok) throw new Error("Failed to fetch schemes");
  return res.json();
}

export async function matchSchemes(profile: EntrepreneurProfile): Promise<SchemeMatchResult[]> {
  const res = await fetch(`${API_BASE}/matching/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("Matching failed");
  return res.json();
}

export async function calculateEMI(req: EMIRequest): Promise<EMIResponse> {
  const res = await fetch(`${API_BASE}/calculator/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error("Calculator failed");
  return res.json();
}

export async function locatePartners(filters: PartnerFilter): Promise<ChannelPartner[]> {
  const res = await fetch(`${API_BASE}/partners/locate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
  if (!res.ok) throw new Error("Partner locator failed");
  return res.json();
}

export async function fetchAllPartners(): Promise<ChannelPartner[]> {
  const res = await fetch(`${API_BASE}/partners`);
  if (!res.ok) throw new Error("Failed to fetch partners");
  return res.json();
}
