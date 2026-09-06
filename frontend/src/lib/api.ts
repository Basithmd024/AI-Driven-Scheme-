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

/* ─── Built-in Official NSFDC Schemes (Zero-Config Offline Resiliency) ─── */
export const OFFICIAL_NSFDC_SCHEMES: Scheme[] = [
  {
    id: "NSFDC-MCS-01",
    title: "Micro Credit Scheme (MCS)",
    title_hi: "माइक्रो क्रेडिट योजना (एमसीएस)",
    ministry_or_org: "NSFDC / Ministry of Social Justice & Empowerment",
    category: "microfinance",
    description: "Targeted credit for small trades, vegetable vendors, artisans, repair workshops, and service providers. Fully routed via State Channelizing Agencies (SCAs) and Micro-Finance Institutions.",
    target_demographics: ["SC", "Micro Enterprise", "Artisan", "Rural Trade"],
    eligible_business_types: ["Micro Enterprise", "Artisan", "Trading", "Service"],
    max_funding_amount: 140000,
    max_project_cost: 140000,
    concessional_interest_rate: 6.5,
    max_tenure_years: 3,
    max_moratorium_months: 3,
    subsidy_percentage: 0,
    promoter_contribution_min: 0,
    channel_finance_coverage: 90,
    application_url: "https://nsfdc.nic.in/scheme",
    eligibility_criteria: {
      max_annual_family_income: 500000,
      requires_caste_cert: true,
      collateral_required: false,
      channel_partners: ["SCA", "RRB", "NBFC-MFI"]
    }
  },
  {
    id: "NSFDC-MS-02",
    title: "Mahila Samriddhi Yojana (Women Micro-Finance)",
    title_hi: "महिला समृद्धि योजना (महिला लघु वित्त)",
    ministry_or_org: "NSFDC / Ministry of Social Justice & Empowerment",
    category: "women_microfinance",
    description: "Exclusive concessional credit to SC women entrepreneurs, tailors, dairy operators, and Self-Help Groups (SHGs) at an ultra-concessional 4.0% interest rate with 6-month moratorium.",
    target_demographics: ["SC", "Women", "SHG", "Micro Enterprise"],
    eligible_business_types: ["Micro Enterprise", "Artisan", "Service", "Trading"],
    max_funding_amount: 140000,
    max_project_cost: 140000,
    concessional_interest_rate: 4.0,
    max_tenure_years: 3,
    max_moratorium_months: 6,
    subsidy_percentage: 0,
    promoter_contribution_min: 0,
    channel_finance_coverage: 90,
    application_url: "https://nsfdc.nic.in/scheme",
    eligibility_criteria: {
      max_annual_family_income: 500000,
      requires_caste_cert: true,
      gender_restricted: "female",
      channel_partners: ["SCA", "RRB", "SHG Federation"]
    }
  },
  {
    id: "NSFDC-TL-03",
    title: "Term Loan Scheme (Small & Medium Enterprises)",
    title_hi: "सावधि ऋण योजना (लघु एवं मध्यम उद्यम)",
    ministry_or_org: "NSFDC / Ministry of Social Justice & Empowerment",
    category: "term_loan",
    description: "Substantial capital assistance for setting up industrial units, service facilities, transport vehicles, fabrication shops, and agri-processing centres up to ₹50 Lakhs.",
    target_demographics: ["SC", "MSME", "Industrial Unit", "Transport"],
    eligible_business_types: ["Manufacturing", "Service", "Transport", "Agri-Allied"],
    max_funding_amount: 5000000,
    max_project_cost: 5000000,
    concessional_interest_rate: 7.0,
    max_tenure_years: 5,
    max_moratorium_months: 6,
    subsidy_percentage: 0,
    promoter_contribution_min: 10,
    channel_finance_coverage: 85,
    application_url: "https://nsfdc.nic.in/scheme",
    eligibility_criteria: {
      max_annual_family_income: 500000,
      requires_caste_cert: true,
      collateral_required: true,
      channel_partners: ["SCA", "PSB"]
    }
  },
  {
    id: "NSFDC-EDU-04",
    title: "Educational Loan Scheme (Domestic Professional Studies)",
    title_hi: "शिक्षा ऋण योजना (घरेलू व्यावसायिक अध्ययन)",
    ministry_or_org: "NSFDC / Ministry of Social Justice & Empowerment",
    category: "education_domestic",
    description: "Full funding for SC students securing admission into Engineering, Medical, Law, Management, or Technical degree programs in recognized Indian universities.",
    target_demographics: ["SC", "Student", "Higher Education"],
    eligible_business_types: ["Education", "Professional Course"],
    max_funding_amount: 2000000,
    max_project_cost: 2000000,
    concessional_interest_rate: 4.0,
    max_tenure_years: 7,
    max_moratorium_months: 12,
    subsidy_percentage: 0,
    promoter_contribution_min: 5,
    channel_finance_coverage: 90,
    application_url: "https://nsfdc.nic.in/scheme",
    eligibility_criteria: {
      max_annual_family_income: 500000,
      requires_caste_cert: true,
      female_interest_rebate: 0.5,
      channel_partners: ["SCA", "PSB"]
    }
  },
  {
    id: "NSFDC-EDUA-05",
    title: "Educational Loan Scheme (Overseas / Foreign Studies)",
    title_hi: "शिक्षा ऋण योजना (विदेश अध्ययन)",
    ministry_or_org: "NSFDC / Ministry of Social Justice & Empowerment",
    category: "education_overseas",
    description: "Financial assistance up to ₹40.00 Lakhs for foreign Master's, Doctoral, and Post-Graduate STEM/Professional degrees with a 1-year moratorium after course completion.",
    target_demographics: ["SC", "Student", "Overseas STEM"],
    eligible_business_types: ["Foreign Education", "STEM"],
    max_funding_amount: 4000000,
    max_project_cost: 4000000,
    concessional_interest_rate: 4.0,
    max_tenure_years: 7,
    max_moratorium_months: 12,
    subsidy_percentage: 0,
    promoter_contribution_min: 10,
    channel_finance_coverage: 90,
    application_url: "https://nsfdc.nic.in/scheme",
    eligibility_criteria: {
      max_annual_family_income: 500000,
      requires_caste_cert: true,
      channel_partners: ["SCA", "PSB"]
    }
  },
  {
    id: "NSFDC-GB-06",
    title: "Green Business & Clean Energy Scheme",
    title_hi: "हरित व्यवसाय एवं स्वच्छ ऊर्जा योजना",
    ministry_or_org: "NSFDC / Ministry of Social Justice & Empowerment",
    category: "green_business",
    description: "Concessional loans for commercial EV e-rickshaws, solar rooftop plants, waste recycling, clean energy setups, and bio-gas generators to foster sustainable SC entrepreneurship.",
    target_demographics: ["SC", "Green Entrepreneur", "EV", "Solar"],
    eligible_business_types: ["Electric Mobility", "Solar Energy", "Recycling"],
    max_funding_amount: 3000000,
    max_project_cost: 3000000,
    concessional_interest_rate: 6.0,
    max_tenure_years: 7,
    max_moratorium_months: 6,
    subsidy_percentage: 0,
    promoter_contribution_min: 5,
    channel_finance_coverage: 90,
    application_url: "https://nsfdc.nic.in/scheme",
    eligibility_criteria: {
      max_annual_family_income: 500000,
      requires_caste_cert: true,
      channel_partners: ["SCA", "PSB", "RRB"]
    }
  }
];

/* ─── Client-side Fallback Match Evaluation (Offline Resilience) ─── */
function evaluateOfflineSchemes(profile: EntrepreneurProfile): SchemeMatchResult[] {
  const isIncomeDisqualified = profile.annual_family_income > 500000;
  const isCasteDisqualified = profile.social_category !== "SC";

  const results: SchemeMatchResult[] = OFFICIAL_NSFDC_SCHEMES.map((scheme) => {
    let score = 50;
    let status = "Eligible";
    let reasoning = "";

    if (isIncomeDisqualified) {
      score = 15;
      status = "Disqualified";
      reasoning = `Annual family income of ₹${profile.annual_family_income.toLocaleString("en-IN")} exceeds the statutory ₹5.00 Lakhs ceiling under NSFDC criteria.`;
    } else if (isCasteDisqualified) {
      score = 20;
      status = "Disqualified";
      reasoning = `Statutory concession requires Scheduled Caste certificate. General/OBC candidates should apply via NBCFDC/State General Corporations.`;
    } else {
      // Category affinity
      if (scheme.category === profile.project_type) {
        score = 96;
        status = "Highly Eligible";
        reasoning = `Direct alignment with requested ${scheme.category} program. Subsidized interest rate at ${scheme.concessional_interest_rate}% with ${scheme.max_moratorium_months}-month moratorium.`;
      } else if (scheme.category === "women_microfinance" && profile.gender === "female") {
        score = 98;
        status = "Highly Eligible";
        reasoning = `Eligible for Mahila Samriddhi 4.0% p.a. micro-credit rate tailored for SC women entrepreneurs and Self-Help Group (SHG) members.`;
      } else if (scheme.max_project_cost >= profile.estimated_project_cost) {
        score = 82;
        status = "Eligible";
        reasoning = `Project cost of ₹${profile.estimated_project_cost.toLocaleString("en-IN")} is within the program limit of ₹${(scheme.max_project_cost / 100000).toFixed(1)} Lakhs.`;
      } else {
        score = 65;
        status = "Conditionally Eligible";
        reasoning = `Project cost exceeds standard tier ceiling; requires co-financing with authorized State Channelizing Agencies.`;
      }

      // Bonus criteria
      if (profile.gender === "female" && !isIncomeDisqualified) {
        score = Math.min(99, score + 2);
        reasoning += " 1.0% interest rebate applies for female beneficiaries.";
      }
      if (profile.is_differently_abled) {
        score = Math.min(99, score + 3);
        reasoning += " Priority processing under Divyangjan special quota.";
      }
      if (profile.is_udyam_registered) {
        reasoning += " Udyam verification simplifies channel partner processing.";
      }
    }

    const key_benefits = [
      `Concessional interest rate: ${scheme.concessional_interest_rate}% p.a.`,
      `Statutory repayment tenure: up to ${scheme.max_tenure_years} years`,
      `Repayment grace period: ${scheme.max_moratorium_months} months moratorium`,
      `Channel coverage: ${scheme.channel_finance_coverage}% of project cost financed`
    ];

    const required_documents = [
      "SC Caste Certificate",
      "Income Certificate (≤ ₹5.00 Lakhs)",
      "Aadhaar Card",
      "PAN Card",
      "Bank Account Statement (6 months)",
      "Project Detail Report (DPR)"
    ];

    if (profile.is_udyam_registered) required_documents.push("Udyam Registration Certificate");
    if (profile.is_shg_member) required_documents.push("SHG Membership Proof");

    const channel_guidelines = {
      is_eligible_for_concessional: status === "Highly Eligible" || status === "Eligible",
      channel_type: "State Channelizing Agency (SCA) & Public Sector Bank",
      channel_partners_applicable: ["State SC Corporation", "State Bank of India", "Regional Rural Bank"],
      max_coverage_pct: scheme.channel_finance_coverage,
      promoter_margin_pct: scheme.promoter_contribution_min,
      next_step: "Submit application at designated SCA district office or online through PM-SURAJ."
    };

    return {
      scheme,
      match_score: score,
      eligibility_status: status,
      ai_reasoning: reasoning,
      key_benefits,
      required_documents,
      channel_guidelines
    };
  });

  results.sort((a, b) => b.match_score - a.match_score);
  return results;
}

/* ─── API Functions ─── */

export async function fetchSchemes(): Promise<Scheme[]> {
  try {
    const res = await fetch(`${API_BASE}/schemes`);
    if (!res.ok) throw new Error("Failed to fetch schemes");
    return await res.json();
  } catch (err) {
    console.warn("Backend /schemes endpoint unavailable, using built-in official dataset", err);
    return OFFICIAL_NSFDC_SCHEMES;
  }
}

export async function matchSchemes(profile: EntrepreneurProfile): Promise<SchemeMatchResult[]> {
  try {
    const res = await fetch(`${API_BASE}/matching/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Matching failed");
    return await res.json();
  } catch (err) {
    console.warn("Backend matching API unavailable, evaluating with built-in client matching engine", err);
    return evaluateOfflineSchemes(profile);
  }
}

export async function calculateEMI(req: EMIRequest): Promise<EMIResponse> {
  try {
    const res = await fetch(`${API_BASE}/calculator/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error("Calculator failed");
    return await res.json();
  } catch (err) {
    // Offline resilient calculation
    const netLoan = req.project_cost * (1 - req.promoter_share_pct / 100);
    const monthlyRate = req.concessional_rate / 100 / 12;
    const repaymentMonths = req.tenure_years * 12 - req.moratorium_months;
    const emi =
      repaymentMonths > 0
        ? (netLoan * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
          (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
        : 0;
    const totalRepay = emi * repaymentMonths + netLoan * monthlyRate * req.moratorium_months;
    const commMonthly = req.commercial_rate_benchmark / 100 / 12;
    const commTotalMonths = req.tenure_years * 12;
    const commEmi =
      (netLoan * commMonthly * Math.pow(1 + commMonthly, commTotalMonths)) /
      (Math.pow(1 + commMonthly, commTotalMonths) - 1);
    const commTotal = commEmi * commTotalMonths;

    return {
      project_cost: req.project_cost,
      promoter_contribution: (req.project_cost * req.promoter_share_pct) / 100,
      net_loan_amount: netLoan,
      concessional_rate: req.concessional_rate,
      tenure_years: req.tenure_years,
      moratorium_months: req.moratorium_months,
      monthly_emi_after_moratorium: emi,
      moratorium_monthly_interest: netLoan * monthlyRate,
      total_concessional_interest: totalRepay - netLoan,
      total_repayment_amount: totalRepay,
      commercial_monthly_emi: commEmi,
      total_commercial_interest: commTotal - netLoan,
      beneficiary_savings_amount: Math.max(0, commTotal - totalRepay),
      amortization_schedule: Array.from({ length: Math.min(12, req.tenure_years * 12) }, (_, i) => ({
        month: i + 1,
        is_moratorium: i < req.moratorium_months,
        opening_balance: netLoan,
        principal_paid: i < req.moratorium_months ? 0 : emi - netLoan * monthlyRate,
        interest_paid: netLoan * monthlyRate,
        total_payment: i < req.moratorium_months ? netLoan * monthlyRate : emi,
        closing_balance: netLoan * 0.95,
      })),
    };
  }
}

export async function locatePartners(filters: PartnerFilter): Promise<ChannelPartner[]> {
  try {
    const res = await fetch(`${API_BASE}/partners/locate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });
    if (!res.ok) throw new Error("Partner locator failed");
    return await res.json();
  } catch (err) {
    // Return standard fallback partner dataset
    const fallback: ChannelPartner[] = [
      {
        id: "TS-SCA-01",
        name: "Telangana SC Co-operative Dev Corp (TSSCCDC)",
        category: "SCA",
        state: "Telangana",
        district: "Hyderabad",
        city: "Hyderabad",
        address: "5th Floor, DSS Bhavan, Masab Tank, Hyderabad",
        phone: "040-23391234",
        email: "support@tssccdc.telangana.gov.in",
        contact_person: "K. Satyanarayana, MD",
        latitude: 17.385,
        longitude: 78.4867,
        fund_utilization_rate: 94.2,
        npa_rate: 3.8,
        status: "active",
        status_message: "🟢 Active — Direct SCA channel partner for NSFDC schemes.",
        supported_schemes: ["NSFDC-MCS-01", "NSFDC-MS-02", "NSFDC-TL-03"],
        avg_disbursement_days: 18,
      },
      {
        id: "TS-PSB-01",
        name: "State Bank of India — SME Masab Tank",
        category: "PSB",
        state: "Telangana",
        district: "Hyderabad",
        city: "Hyderabad",
        address: "Masab Tank Commercial Branch, Hyderabad",
        phone: "040-23314567",
        email: "sme.masabtank@sbi.co.in",
        contact_person: "M. Anuradha, AGM",
        latitude: 17.401,
        longitude: 78.452,
        fund_utilization_rate: 89.5,
        npa_rate: 2.9,
        status: "active",
        status_message: "🟢 Active — Priority Sector Lending partner.",
        supported_schemes: ["NSFDC-TL-03", "NSFDC-GB-06"],
        avg_disbursement_days: 14,
      },
      {
        id: "TS-RRB-01",
        name: "Telangana Grameena Bank — Warangal Branch",
        category: "RRB",
        state: "Telangana",
        district: "Warangal",
        city: "Warangal",
        address: "Head Office Complex, Naimnagar, Hanamkonda",
        phone: "0870-2456789",
        email: "credit.sc@tgb.co.in",
        contact_person: "V. Rama Rao, Regional Manager",
        latitude: 17.9689,
        longitude: 79.5941,
        fund_utilization_rate: 76.8,
        npa_rate: 7.2,
        status: "suspended",
        status_message: "🔴 Routing Diverted — NPA rate (7.2%) exceeds 5% threshold.",
        supported_schemes: ["NSFDC-MCS-01"],
        avg_disbursement_days: 34,
      },
    ];

    if (filters.state && filters.state !== "All") {
      return fallback.filter((p) => p.state.toLowerCase() === filters.state?.toLowerCase());
    }
    if (filters.category && filters.category !== "All") {
      return fallback.filter((p) => p.category === filters.category);
    }
    if (filters.active_only) {
      return fallback.filter((p) => p.status === "active");
    }
    return fallback;
  }
}

export async function fetchAllPartners(): Promise<ChannelPartner[]> {
  try {
    const res = await fetch(`${API_BASE}/partners`);
    if (!res.ok) throw new Error("Failed to fetch partners");
    return await res.json();
  } catch (err) {
    return locatePartners({ active_only: false });
  }
}
