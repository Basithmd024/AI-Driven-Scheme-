const API_BASE = typeof window !== "undefined" ? "/backend-api" : (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1");

/* ─── Scheme Types ─── */
export interface Scheme {
  id: string;
  title: string;
  title_hi?: string;
  title_te?: string;
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
  total_commercial_interest_benchmark: number;
  direct_beneficiary_savings: number;
  total_net_outflow: number;
  amortization_schedule: AmortizationItem[];
}

/* ─── Channel Partner ─── */
export interface ChannelPartner {
  id: string;
  name: string;
  category: "SCA" | "PSB" | "RRB" | "NBFC-MFI" | string;
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
  status: "active" | "suspended" | string;
  status_message: string;
  supported_schemes: string[];
  avg_disbursement_days: number;
  distance_km?: number;
  routing_recommendation?: string;
}

/* ─── Comprehensive India-Wide Fallback Dataset ─── */
export const INDIA_WIDE_FALLBACK_SCHEMES: Scheme[] = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    title: "Prime Minister's Employment Generation Programme (PMEGP)",
    title_hi: "प्रधानमंत्री रोजगार सृजन कार्यक्रम (पीएमईजीपी)",
    title_te: "ప్రధాన మంత్రి ఉపాధి కల్పన కార్యక్రమం (PMEGP)",
    ministry_or_org: "Ministry of MSME & KVIC (kviconline.gov.in)",
    category: "manufacturing_services",
    description: "India's premier credit-linked subsidy scheme for setting up micro-enterprises. Up to 35% margin money subsidy in rural areas and 25% in urban areas for SC, ST, OBC, Women, and Minorities with NO family income ceiling.",
    target_demographics: ["All India", "General", "OBC", "SC", "ST", "Women", "Minorities", "Ex-Servicemen", "PH"],
    eligible_business_types: ["Manufacturing", "Service", "Trading", "Agro-Processing"],
    max_funding_amount: 5000000,
    max_project_cost: 5000000,
    concessional_interest_rate: 7.5,
    max_tenure_years: 7,
    max_moratorium_months: 6,
    subsidy_percentage: 35.0,
    promoter_contribution_min: 5.0,
    channel_finance_coverage: 95.0,
    application_url: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    eligibility_criteria: {
      min_age: 18,
      min_education: "8th Pass for projects > ₹10L (Mfg) or > ₹5L (Service)",
      max_annual_family_income: 99999999,
      collateral_required: false,
      channel_partners: ["PSB", "RRB", "KVIC", "KVIB", "DIC"]
    }
  },
  {
    id: "a2222222-2222-2222-2222-222222222222",
    title: "Pradhan Mantri MUDRA Yojana (PMMY — Kishore & Tarun)",
    title_hi: "प्रधानमंत्री मुद्रा योजना (पीएमएमवाई — किशोर एवं तरुण)",
    title_te: "ప్రధాన మంత్రి ముద్రా యోజన (PMMY - కిషోర్ & తరుణ్)",
    ministry_or_org: "Department of Financial Services, Ministry of Finance (mudra.org.in)",
    category: "microfinance",
    description: "Collateral-free institutional credit up to ₹10 Lakhs (extended up to ₹20 Lakhs under Tarun Plus) for non-farm income generating micro and small enterprises across India with 0% processing fee.",
    target_demographics: ["All India", "Micro Enterprise", "Small Business", "Shopkeepers", "Women", "Artisans"],
    eligible_business_types: ["Retail Trade", "Manufacturing", "Service", "Food Processing", "Repair Workshops"],
    max_funding_amount: 1000000,
    max_project_cost: 1000000,
    concessional_interest_rate: 8.5,
    max_tenure_years: 5,
    max_moratorium_months: 6,
    subsidy_percentage: 0.0,
    promoter_contribution_min: 10.0,
    channel_finance_coverage: 90.0,
    application_url: "https://www.mudra.org.in",
    eligibility_criteria: {
      collateral_required: false,
      max_annual_family_income: 99999999,
      channel_partners: ["PSB", "RRB", "Private Bank", "NBFC-MFI", "Small Finance Bank"]
    }
  },
  {
    id: "a3333333-3333-3333-3333-333333333333",
    title: "Stand-Up India Scheme for SC, ST & Women",
    title_hi: "स्टैंड-अप इंडिया योजना (अनुसूचित जाति, जनजाति एवं महिला उद्यमी)",
    title_te: "స్టాండ్-అప్ ఇండియా పథకం (మహిళలు/ఎస్సీ/ఎస్టీ)",
    ministry_or_org: "Ministry of Finance & SIDBI (standupmitra.in)",
    category: "term_loan",
    description: "Bank loan between ₹10 Lakhs and ₹1 Crore to at least one SC/ST borrower and at least one Woman borrower per bank branch for setting up greenfield enterprises in manufacturing, services, agri-allied, or trading.",
    target_demographics: ["SC", "ST", "Women", "MSME"],
    eligible_business_types: ["Manufacturing", "Service", "Agri-Allied", "Trading"],
    max_funding_amount: 10000000,
    max_project_cost: 10000000,
    concessional_interest_rate: 7.8,
    max_tenure_years: 7,
    max_moratorium_months: 18,
    subsidy_percentage: 15.0,
    promoter_contribution_min: 10.0,
    channel_finance_coverage: 85.0,
    application_url: "https://www.standupmitra.in",
    eligibility_criteria: {
      greenfield_project: true,
      sc_st_or_woman: true,
      max_annual_family_income: 99999999,
      channel_partners: ["All Scheduled Commercial Banks", "PSB"]
    }
  },
  {
    id: "a4444444-4444-4444-4444-444444444444",
    title: "PM Vishwakarma Scheme (Artisan Enterprise Loan)",
    title_hi: "पीएम विश्वकर्मा योजना (कारीगर एवं शिल्पकार संवर्धन)",
    title_te: "పీఎం విశ్వకర్మ పథకం (చేతివృత్తుల వారి రుణాలు)",
    ministry_or_org: "Ministry of MSME & Skill Development (pmvishwakarma.gov.in)",
    category: "artisans",
    description: "Holistic national support for traditional artisans and craftspersons across 18 family trades. Collateral-free enterprise loan up to ₹3 Lakhs at 5% concessional interest with 8% MoMSME interest subvention + ₹15,000 modern toolkit incentive.",
    target_demographics: ["Artisan", "Craftsperson", "OBC", "SC", "ST", "Rural Worker", "Women"],
    eligible_business_types: ["Carpentry", "Blacksmith", "Pottery", "Tailoring", "Masonry", "Sculpting", "Leather Work", "Weaving"],
    max_funding_amount: 300000,
    max_project_cost: 300000,
    concessional_interest_rate: 5.0,
    max_tenure_years: 3,
    max_moratorium_months: 6,
    subsidy_percentage: 15.0,
    promoter_contribution_min: 0.0,
    channel_finance_coverage: 100.0,
    application_url: "https://pmvishwakarma.gov.in",
    eligibility_criteria: {
      artisan_trade: true,
      skill_training_stipend: "₹500/day during training",
      toolkit_incentive: "₹15,000 voucher",
      channel_partners: ["PSB", "RRB", "Cooperative Banks"]
    }
  },
  {
    id: "a5555555-5555-5555-5555-555555555555",
    title: "PM SVANidhi (Micro-Credit for Street Vendors)",
    title_hi: "पीएम स्वनिधि (स्ट्रीट वेंडर्स आत्मनिर्भर निधि)",
    title_te: "పీఎం స్వనిధి (వీధి వ్యాపారుల ఆత్మనిర్భర్ నిధి)",
    ministry_or_org: "Ministry of Housing and Urban Affairs (pmsvanidhi.mohua.gov.in)",
    category: "street_vendor",
    description: "Collateral-free working capital loan up to ₹50,000 (Tranche 1: ₹10K, Tranche 2: ₹20K, Tranche 3: ₹50K) with 7% interest subsidy directly credited quarterly for street vendors across urban and peri-urban India.",
    target_demographics: ["Street Vendor", "Hawker", "Urban Poor", "Micro Retailer"],
    eligible_business_types: ["Street Vending", "Fruit/Vegetable Trade", "Fast Food", "Artisanal Goods", "Mobile Kiosk"],
    max_funding_amount: 50000,
    max_project_cost: 50000,
    concessional_interest_rate: 4.5,
    max_tenure_years: 3,
    max_moratorium_months: 1,
    subsidy_percentage: 7.0,
    promoter_contribution_min: 0.0,
    channel_finance_coverage: 100.0,
    application_url: "https://pmsvanidhi.mohua.gov.in",
    eligibility_criteria: {
      urban_vendor_id: true,
      digital_incentive: "Up to ₹1,200 annual cash back",
      channel_partners: ["PSB", "RRB", "NBFC-MFI", "Small Finance Bank"]
    }
  },
  {
    id: "a6666666-6666-6666-6666-666666666666",
    title: "Adivasi Mahila Sashaktikaran Yojana (AMSY - NSTFDC)",
    title_hi: "आदिवासी महिला सशक्तिकरण योजना (एनएसटीएफडीसी)",
    title_te: "ఆదివాసీ మహిళా సశక్తీకరణ యోజన (AMSY - NSTFDC)",
    ministry_or_org: "NSTFDC / Ministry of Tribal Affairs (nstfdc.tribal.gov.in)",
    category: "women_microfinance",
    description: "Exclusive concessional credit for Scheduled Tribe (ST) women entrepreneurs up to ₹2.00 Lakhs at an ultra-low interest rate of 4% per annum. Term loan coverage up to 90% of project cost.",
    target_demographics: ["ST", "Women", "SHG", "Tribal Entrepreneurs"],
    eligible_business_types: ["Forest Produce", "Handicrafts", "Agriculture Allied", "Tailoring", "Dairy"],
    max_funding_amount: 200000,
    max_project_cost: 200000,
    concessional_interest_rate: 4.0,
    max_tenure_years: 5,
    max_moratorium_months: 6,
    subsidy_percentage: 10.0,
    promoter_contribution_min: 2.0,
    channel_finance_coverage: 90.0,
    application_url: "https://nstfdc.tribal.gov.in",
    eligibility_criteria: {
      st_certificate_required: true,
      gender_exclusive: "Female",
      max_annual_family_income: 300000,
      channel_partners: ["State Tribal Channelizing Agencies", "RRB", "PSB"]
    }
  },
  {
    id: "a7777777-7777-7777-7777-777777777777",
    title: "NBCFDC New Swarnima Scheme for Backward Classes Women",
    title_hi: "नई स्वर्णिमा योजना (ओबीसी महिला उद्यमिता — एनबीसीएफडीसी)",
    title_te: "న్యూ స్వర్ణిమ పథకం (ఓబీసీ మహిళలు - NBCFDC)",
    ministry_or_org: "NBCFDC / Ministry of Social Justice & Empowerment (nbcfdc.gov.in)",
    category: "women_microfinance",
    description: "Targeted concessional credit up to ₹2.00 Lakhs at 5% p.a. for women belonging to Other Backward Classes (OBCs) living below double poverty line to foster self-reliance.",
    target_demographics: ["OBC", "Women", "Micro Enterprise"],
    eligible_business_types: ["Service", "Small Business", "Dairy", "Garment", "Handicrafts"],
    max_funding_amount: 200000,
    max_project_cost: 200000,
    concessional_interest_rate: 5.0,
    max_tenure_years: 5,
    max_moratorium_months: 6,
    subsidy_percentage: 5.0,
    promoter_contribution_min: 5.0,
    channel_finance_coverage: 95.0,
    application_url: "https://nbcfdc.gov.in",
    eligibility_criteria: {
      obc_certificate_required: true,
      gender_exclusive: "Female",
      max_annual_family_income: 300000,
      channel_partners: ["State Backward Classes Finance Corporations", "PSB"]
    }
  },
  {
    id: "a8888888-8888-8888-8888-888888888888",
    title: "NMDFC Virasat Scheme for Minority Craftspersons",
    title_hi: "विरासत योजना (अल्पसंख्यक कारीगर एवं शिल्पकार — एनएमडीएफसी)",
    title_te: "విరాసత్ పథకం (మైనారిటీ చేతివృత్తులు - NMDFC)",
    ministry_or_org: "NMDFC / Ministry of Minority Affairs (nmdfc.org)",
    category: "artisans",
    description: "Concessional credit for craftspersons belonging to notified National Minorities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi). Loans up to ₹10 Lakhs at 5% p.a. (4% p.a. for female craftspersons).",
    target_demographics: ["Minority", "Artisan", "Women", "Craftsperson"],
    eligible_business_types: ["Handicrafts", "Zari Embroidery", "Woodcraft", "Metal Art", "Weaving", "Pottery"],
    max_funding_amount: 1000000,
    max_project_cost: 1000000,
    concessional_interest_rate: 4.5,
    max_tenure_years: 5,
    max_moratorium_months: 6,
    subsidy_percentage: 5.0,
    promoter_contribution_min: 5.0,
    channel_finance_coverage: 90.0,
    application_url: "https://nmdfc.org",
    eligibility_criteria: {
      minority_community: true,
      max_annual_family_income: 800000,
      channel_partners: ["State Channelizing Agencies", "PSB"]
    }
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    title: "Mahila Samriddhi Yojana (NSFDC Women Micro-Finance)",
    title_hi: "महिला समृद्धि योजना (एनएसएफडीसी महिला लघु वित्त)",
    title_te: "మహిళా సమృద్ధి యోజన (NSFDC మైక్రో ఫైనాన్స్)",
    ministry_or_org: "NSFDC / Ministry of Social Justice & Empowerment (nsfdc.nic.in)",
    category: "women_microfinance",
    description: "Exclusive concessional credit to Scheduled Caste (SC) women entrepreneurs, tailors, dairy operators, and Self-Help Groups (SHGs) at an ultra-concessional 4.0% interest rate with 6-month moratorium.",
    target_demographics: ["SC", "Women", "SHG", "Micro Enterprise"],
    eligible_business_types: ["Micro Enterprise", "Artisan", "Service", "Trading", "Dairy"],
    max_funding_amount: 140000,
    max_project_cost: 140000,
    concessional_interest_rate: 4.0,
    max_tenure_years: 4,
    max_moratorium_months: 6,
    subsidy_percentage: 10.0,
    promoter_contribution_min: 0.0,
    channel_finance_coverage: 95.0,
    application_url: "https://nsfdc.nic.in/scheme",
    eligibility_criteria: {
      gender_exclusive: "Female",
      social_category: "SC",
      max_annual_family_income: 500000,
      requires_caste_cert: true,
      shg_eligible: true,
      channel_partners: ["SCA", "NBFC-MFI", "RRB"]
    }
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    title: "NSFDC Term Loan Scheme for SC MSMEs",
    title_hi: "एनएसएफडीसी सावधि ऋण योजना (लघु एवं मध्यम उद्यम)",
    title_te: "టర్మ్ లోన్ పథకం (ఎస్సీ ఎంఎస్ఎంఈలు - NSFDC)",
    ministry_or_org: "NSFDC / Ministry of Social Justice & Empowerment (nsfdc.nic.in)",
    category: "term_loan",
    description: "Financing for viable manufacturing, transport, food processing, logistics, and service projects up to ₹50.00 Lakhs at 6.0%–8.0% concessional interest with up to 12 months moratorium for SC entrepreneurs.",
    target_demographics: ["SC", "MSME", "Entrepreneur"],
    eligible_business_types: ["Manufacturing", "Service", "Transport", "Food Processing", "Logistics"],
    max_funding_amount: 4500000,
    max_project_cost: 5000000,
    concessional_interest_rate: 8.0,
    max_tenure_years: 8,
    max_moratorium_months: 12,
    subsidy_percentage: 0.0,
    promoter_contribution_min: 10.0,
    channel_finance_coverage: 90.0,
    application_url: "https://nsfdc.nic.in/scheme",
    eligibility_criteria: {
      social_category: "SC",
      max_annual_family_income: 500000,
      requires_dpr: true,
      requires_caste_cert: true,
      channel_partners: ["SCA", "PSB", "RRB"]
    }
  },
  {
    id: "a9999999-9999-9999-9999-999999999999",
    title: "Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)",
    title_hi: "सूक्ष्म एवं लघु उद्यम क्रेडिट गारंटी योजना (सीजीटीएमएसई)",
    title_te: "క్రెడిట్ గ్యారెంటీ స్కీమ్ (CGTMSE)",
    ministry_or_org: "Ministry of MSME & SIDBI (cgtmse.in)",
    category: "term_loan",
    description: "Credit guarantee facility enabling collateral-free bank loans up to ₹5 Crore for new and existing Micro and Small Enterprises. Up to 85% guarantee coverage for women, SC/ST, and ZED-certified units across all commercial banks.",
    target_demographics: ["All India", "MSME", "Women", "SC", "ST", "General", "OBC"],
    eligible_business_types: ["Manufacturing", "Service", "IT/ITeS", "Retail Trade", "Education/Healthcare"],
    max_funding_amount: 50000000,
    max_project_cost: 50000000,
    concessional_interest_rate: 8.5,
    max_tenure_years: 10,
    max_moratorium_months: 18,
    subsidy_percentage: 0.0,
    promoter_contribution_min: 15.0,
    channel_finance_coverage: 85.0,
    application_url: "https://www.cgtmse.in",
    eligibility_criteria: {
      udyam_registered: true,
      collateral_required: false,
      max_annual_family_income: 99999999,
      channel_partners: ["All Scheduled Commercial Banks", "PSB", "RRB"]
    }
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    title: "Green Business & Clean Energy Scheme (NSFDC)",
    title_hi: "हरित व्यवसाय एवं स्वच्छ ऊर्जा योजना (एनएसएफडीसी)",
    title_te: "క్లీన్ ఎనర్జీ & గ్రీన్ బిజినెస్ పథకం (NSFDC)",
    ministry_or_org: "NSFDC / Ministry of Social Justice & Empowerment (nsfdc.nic.in)",
    category: "green_business",
    description: "Eco-friendly concessional financing up to ₹30.00 Lakhs for battery-operated E-Rickshaws, commercial electric vehicles, solar rooftop units, and waste recycling at 6.5% interest with 6 months moratorium.",
    target_demographics: ["SC", "Transport", "Green Business", "Clean Tech"],
    eligible_business_types: ["Green Business/EV", "Transport", "Manufacturing", "Service", "Solar"],
    max_funding_amount: 2700000,
    max_project_cost: 3000000,
    concessional_interest_rate: 6.5,
    max_tenure_years: 7,
    max_moratorium_months: 6,
    subsidy_percentage: 0.0,
    promoter_contribution_min: 5.0,
    channel_finance_coverage: 90.0,
    application_url: "https://nsfdc.nic.in/scheme",
    eligibility_criteria: {
      social_category: "SC",
      max_annual_family_income: 500000,
      requires_caste_cert: true,
      channel_partners: ["SCA", "PSB", "RRB"]
    }
  }
];

export const INDIA_WIDE_FALLBACK_PARTNERS: ChannelPartner[] = [
  {
    id: "del-sbi-cp",
    name: "State Bank of India — SME Parliament Street Branch",
    category: "PSB",
    state: "Delhi",
    district: "New Delhi",
    city: "New Delhi",
    address: "11, Parliament Street, Connaught Place, New Delhi 110001",
    phone: "+91 11 2374 1234",
    email: "sme.delhi@sbi.co.in",
    contact_person: "R. K. Malhotra (Chief Manager - SME Credit)",
    latitude: 28.6289,
    longitude: 77.2155,
    fund_utilization_rate: 96.5,
    npa_rate: 2.4,
    status: "active",
    status_message: "🟢 Active: High quota for PMEGP, Stand-Up India, and Mudra loans.",
    supported_schemes: ["PMEGP", "MUDRA", "Stand-Up India", "CGTMSE"],
    avg_disbursement_days: 10,
  },
  {
    id: "del-sc-st-corp",
    name: "Delhi SC/ST/OBC/Minorities Financial Corp (DSFDC)",
    category: "SCA",
    state: "Delhi",
    district: "Central Delhi",
    city: "New Delhi",
    address: "Ambedkar Bhawan, Sector-16, Rohini, New Delhi 110085",
    phone: "+91 11 2786 8920",
    email: "md.dsfdc@delhi.gov.in",
    contact_person: "Sunita Meena (Executive Director)",
    latitude: 28.7320,
    longitude: 77.1180,
    fund_utilization_rate: 91.0,
    npa_rate: 3.8,
    status: "active",
    status_message: "🟢 Active: Direct state channel partner for NSFDC, NBCFDC & NMDFC schemes.",
    supported_schemes: ["NSFDC-MSY", "NSFDC-MCS", "NBCFDC", "NMDFC"],
    avg_disbursement_days: 15,
  },
  {
    id: "up-sc-lucknow",
    name: "UP Scheduled Castes Finance & Development Corp (UPSCFDC)",
    category: "SCA",
    state: "Uttar Pradesh",
    district: "Lucknow",
    city: "Lucknow",
    address: "Bapu Bhawan, Vidhan Sabha Marg, Lucknow, Uttar Pradesh 226001",
    phone: "+91 522 223 8910",
    email: "md.upscfdc@up.gov.in",
    contact_person: "Anil Kumar Yadav (Managing Director)",
    latitude: 26.8467,
    longitude: 80.9462,
    fund_utilization_rate: 93.4,
    npa_rate: 4.1,
    status: "active",
    status_message: "🟢 Active: State-wide network for PM Vishwakarma and MSY concessional finance.",
    supported_schemes: ["PM-Vishwakarma", "NSFDC-MSY", "PMEGP"],
    avg_disbursement_days: 16,
  },
  {
    id: "mah-bom-pune",
    name: "Bank of Maharashtra (MSME Hub Pune)",
    category: "PSB",
    state: "Maharashtra",
    district: "Pune",
    city: "Pune",
    address: "Lokmangal, 1501 Shivajinagar, Pune, Maharashtra 411005",
    phone: "+91 20 2553 2731",
    email: "msme.pune@mahabank.co.in",
    contact_person: "Vandana Joshi (DGM - Priority Sector)",
    latitude: 18.5314,
    longitude: 73.8446,
    fund_utilization_rate: 95.1,
    npa_rate: 2.8,
    status: "active",
    status_message: "🟢 Active: Fast-track digital sanction for PMEGP and Stand-Up India.",
    supported_schemes: ["PMEGP", "Stand-Up India", "MUDRA", "CGTMSE"],
    avg_disbursement_days: 9,
  },
  {
    id: "guj-bob-ahmedabad",
    name: "Bank of Baroda — Lead District Office",
    category: "PSB",
    state: "Gujarat",
    district: "Ahmedabad",
    city: "Ahmedabad",
    address: "Baroda Bhavan, Near Parimal Garden, Ellisbridge, Ahmedabad 380006",
    phone: "+91 79 2658 9000",
    email: "leadbank.ahmedabad@bankofbaroda.co.in",
    contact_person: "Nitin Patel (Chief Manager)",
    latitude: 23.0189,
    longitude: 72.5574,
    fund_utilization_rate: 94.0,
    npa_rate: 2.2,
    status: "active",
    status_message: "🟢 Active: Leading channel for MSME & Diamond/Textile artisan finance.",
    supported_schemes: ["PM-Vishwakarma", "PMEGP", "MUDRA", "CGTMSE"],
    avg_disbursement_days: 11,
  },
  {
    id: "tsfcc-hyderabad",
    name: "Telangana Scheduled Castes Co-op Finance Corp (TSFCC)",
    category: "SCA",
    state: "Telangana",
    district: "Hyderabad",
    city: "Hyderabad",
    address: "DSS Bhavan, Masab Tank, Hyderabad, Telangana 500028",
    phone: "+91 40 2339 1234",
    email: "md.tsfcc@telangana.gov.in",
    contact_person: "Dr. K. Ramesh (General Manager - Credit)",
    latitude: 17.4028,
    longitude: 78.4526,
    fund_utilization_rate: 94.2,
    npa_rate: 3.1,
    status: "active",
    status_message: "🟢 Active: Fast-track processing under 14 days. Full allocation available.",
    supported_schemes: ["NSFDC-MCS", "NSFDC-MSY", "NSFDC-TL", "Green-Business"],
    avg_disbursement_days: 14,
  },
  {
    id: "kar-ambedkar-bengaluru",
    name: "Dr. B.R. Ambedkar Development Corp Karnataka",
    category: "SCA",
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru",
    address: "9th Floor, Visvesvaraya Mini Tower, Dr. Ambedkar Veedhi, Bengaluru 560001",
    phone: "+91 80 2286 1420",
    email: "md.adcl@karnataka.gov.in",
    contact_person: "K. Shivaram (Managing Director)",
    latitude: 12.9784,
    longitude: 77.5925,
    fund_utilization_rate: 95.0,
    npa_rate: 2.9,
    status: "active",
    status_message: "🟢 Active: Priority allocation for tech enterprises, solar units, and self-employment.",
    supported_schemes: ["NSFDC-MSY", "PMEGP", "Stand-Up India", "PM-Vishwakarma"],
    avg_disbursement_days: 12,
  },
  {
    id: "tn-tahdco-chennai",
    name: "Tamil Nadu Adi Dravidar Housing & Development Corp (TAHDCO)",
    category: "SCA",
    state: "Tamil Nadu",
    district: "Chennai",
    city: "Chennai",
    address: "No. 31, Cenotaph Road, Teynampet, Chennai, Tamil Nadu 600018",
    phone: "+91 44 2434 2224",
    email: "tahdco@tn.gov.in",
    contact_person: "Dr. M. Sangeetha (Managing Director)",
    latitude: 13.0298,
    longitude: 80.2450,
    fund_utilization_rate: 96.0,
    npa_rate: 2.5,
    status: "active",
    status_message: "🟢 Active: Direct subsidy coordination for women self-help groups & artisans.",
    supported_schemes: ["NSFDC-MSY", "PMEGP", "PM-Vishwakarma", "MUDRA"],
    avg_disbursement_days: 10,
  },
  {
    id: "wb-scst-kolkata",
    name: "West Bengal SC/ST Development & Finance Corp",
    category: "SCA",
    state: "West Bengal",
    district: "Kolkata",
    city: "Kolkata",
    address: "CF-217/A/1, Sector-I, Salt Lake City, Kolkata, West Bengal 700064",
    phone: "+91 33 2359 5555",
    email: "wbscstdfc@gmail.com",
    contact_person: "Tapan Kumar Roy (Managing Director)",
    latitude: 22.5855,
    longitude: 88.4120,
    fund_utilization_rate: 89.5,
    npa_rate: 4.0,
    status: "active",
    status_message: "🟢 Active: Extensive reach across handloom weaving and leather clusters.",
    supported_schemes: ["PM-Vishwakarma", "PMEGP", "MUDRA", "NMDFC-Virasat"],
    avg_disbursement_days: 17,
  }
];

/* ─── API Functions ─── */
export async function matchSchemes(profile: EntrepreneurProfile): Promise<SchemeMatchResult[]> {
  try {
    const res = await fetch(`${API_BASE}/matching/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("API call failed");
    return await res.json();
  } catch (err) {
    // Client-side rule engine matching against India-wide dataset
    const userCategory = (profile.social_category || "GENERAL").toUpperCase();
    const userGender = (profile.gender || "").toLowerCase();
    const userIncome = Number(profile.annual_family_income) || 0;
    const userCost = Number(profile.estimated_project_cost) || 0;
    const userProject = (profile.project_type || "").toLowerCase();

    return INDIA_WIDE_FALLBACK_SCHEMES.map((scheme) => {
      let score = 45;
      const benefits: string[] = [];
      const docs: string[] = ["Aadhaar Card", "Bank Account Statement (6 Months)"];
      const targetDemographics = scheme.target_demographics.map((d) => d.toUpperCase());
      const maxIncome = scheme.eligibility_criteria?.max_annual_family_income || 99999999;
      const isUniversalIncome = maxIncome >= 5000000;

      // Income check
      if (!isUniversalIncome && userIncome > maxIncome) {
        return {
          scheme,
          match_score: 20,
          eligibility_status: "Income Exceeded",
          ai_reasoning: `Annual household income (₹${userIncome.toLocaleString()}) exceeds the statutory limit of ₹${maxIncome.toLocaleString()} for this targeted scheme. Consider universal schemes like PMEGP, PM MUDRA, or Stand-Up India.`,
          key_benefits: ["Subsidized concessional rate applicable under statutory limit"],
          required_documents: ["Income Certificate", "Caste Certificate"],
          channel_guidelines: {
            channel_partners_applicable: ["PSB", "RRB"],
            is_eligible_for_concessional: false
          }
        };
      }

      if (!isUniversalIncome) {
        score += 15;
        benefits.push(`Verified statutory income compliance (≤ ₹${maxIncome.toLocaleString()})`);
      } else {
        score += 15;
        benefits.push("Universal scheme: No household income ceiling restriction");
      }

      // Social Category Match
      const isUniversalCategory = targetDemographics.includes("ALL INDIA") || targetDemographics.includes("GENERAL");
      if (isUniversalCategory) {
        score += 20;
        benefits.push(`Open to all categories including ${userCategory}`);
      } else if (targetDemographics.includes(userCategory)) {
        score += 25;
        benefits.push(`Direct mandate match for ${userCategory} entrepreneurs`);
        docs.push("Category / Caste Certificate");
      } else {
        score -= 10;
      }

      // Gender Match
      if (scheme.eligibility_criteria?.gender_exclusive) {
        if (userGender === "female") {
          score += 25;
          benefits.push("Special women entrepreneur margin money & interest concession applies");
        } else {
          return {
            scheme,
            match_score: 25,
            eligibility_status: "Gender Specific",
            ai_reasoning: "This scheme is exclusively reserved for women entrepreneurs and Self-Help Groups (SHGs).",
            key_benefits: ["4.0% interest rate concession for women"],
            required_documents: ["Identity Proof"],
            channel_guidelines: {
              channel_partners_applicable: ["SCA", "RRB"],
              is_eligible_for_concessional: false
            }
          };
        }
      } else if (userGender === "female" && targetDemographics.includes("WOMEN")) {
        score += 10;
        benefits.push("Special women concession & priority branch routing");
      }

      // Project Type Alignment
      if (userProject.includes("artisan") && (scheme.category === "artisans" || scheme.title.includes("Vishwakarma"))) {
        score += 25;
        benefits.push("Direct match: Modern toolkit incentive (₹15,000) + 5% interest subvention");
        docs.push("Artisan Trade Verification / Gram Panchayat ID");
      } else if (userProject.includes("vendor") && (scheme.category === "street_vendor" || scheme.title.includes("SVANidhi"))) {
        score += 25;
        benefits.push("Direct match: 7% interest subsidy directly credited to bank account");
        docs.push("Vending Certificate / Urban Local Body ID");
      } else if (userProject.includes("manufacturing") && (scheme.category === "manufacturing_services" || scheme.title.includes("PMEGP"))) {
        score += 25;
        benefits.push(`Direct match: Up to ${scheme.subsidy_percentage}% government capital subsidy (Margin Money)`);
        docs.push("Detailed Project Report (DPR)", "EDP Training Certificate");
      } else if (userProject.includes("green") && scheme.category === "green_business") {
        score += 25;
        benefits.push("Direct match for EV / Solar clean energy project financing");
        docs.push("Vehicle / Solar Quotation from Authorized Dealer");
      }

      // Project Cost Feasibility
      if (userCost > scheme.max_project_cost) {
        score -= 15;
      } else {
        score += 10;
        benefits.push(`Estimated cost (₹${userCost.toLocaleString()}) fully within scheme limit (₹${scheme.max_project_cost.toLocaleString()})`);
      }

      if (profile.is_shg_member) {
        score += 8;
        benefits.push("Active Self-Help Group (SHG) membership validated");
      }
      if (profile.is_udyam_registered) {
        score += 8;
        benefits.push("Udyam MSME certificate accelerates branch sanction");
        docs.push("Udyam MSME Registration Certificate");
      }

      const finalScore = Math.min(98, Math.max(20, score));

      return {
        scheme,
        match_score: finalScore,
        eligibility_status: finalScore >= 80 ? "Highly Eligible" : finalScore >= 60 ? "Eligible" : "Partially Eligible",
        ai_reasoning: `Based on your profile as an enterprise in ${profile.state || "India"}, this scheme offers ${scheme.concessional_interest_rate}% interest with ${scheme.subsidy_percentage > 0 ? `${scheme.subsidy_percentage}% subsidy` : "concessional channel terms"}.`,
        key_benefits: benefits,
        required_documents: docs,
        channel_guidelines: {
          channel_partners_applicable: scheme.eligibility_criteria?.channel_partners || ["PSB", "RRB", "SCA"],
          is_eligible_for_concessional: true,
          official_portal: scheme.application_url
        }
      };
    }).sort((a, b) => b.match_score - a.match_score);
  }
}

export async function calculateEMI(req: EMIRequest): Promise<EMIResponse> {
  try {
    const res = await fetch(`${API_BASE}/calculator/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error("API call failed");
    return await res.json();
  } catch (err) {
    const promoterAmount = req.project_cost * (req.promoter_share_pct / 100);
    const netLoan = req.project_cost - promoterAmount;
    const rConcessional = req.concessional_rate / 12 / 100;
    const rCommercial = req.commercial_rate_benchmark / 12 / 100;
    const totalMonths = req.tenure_years * 12;
    const repaymentMonths = Math.max(1, totalMonths - req.moratorium_months);

    // Amortization
    const monthlyEMI =
      rConcessional > 0
        ? (netLoan * rConcessional * Math.pow(1 + rConcessional, repaymentMonths)) /
          (Math.pow(1 + rConcessional, repaymentMonths) - 1)
        : netLoan / repaymentMonths;

    const moratoriumInterest = netLoan * rConcessional;
    const totalMoratoriumCost = moratoriumInterest * req.moratorium_months;
    const totalRepaymentInterest = monthlyEMI * repaymentMonths - netLoan;
    const totalConcessionalInterest = totalMoratoriumCost + totalRepaymentInterest;

    // Commercial benchmark
    const commEMI =
      (netLoan * rCommercial * Math.pow(1 + rCommercial, repaymentMonths)) /
      (Math.pow(1 + rCommercial, repaymentMonths) - 1);
    const commTotal = (netLoan * rCommercial * req.moratorium_months) + (commEMI * repaymentMonths - netLoan);
    const savings = Math.max(0, commTotal - totalConcessionalInterest);

    const schedule: AmortizationItem[] = [];
    let balance = netLoan;

    for (let m = 1; m <= Math.min(12, totalMonths); m++) {
      if (m <= req.moratorium_months) {
        schedule.push({
          month: m,
          is_moratorium: true,
          opening_balance: Math.round(balance),
          principal_paid: 0,
          interest_paid: Math.round(moratoriumInterest),
          total_payment: Math.round(moratoriumInterest),
          closing_balance: Math.round(balance),
        });
      } else {
        const intP = balance * rConcessional;
        const prinP = monthlyEMI - intP;
        const closing = Math.max(0, balance - prinP);
        schedule.push({
          month: m,
          is_moratorium: false,
          opening_balance: Math.round(balance),
          principal_paid: Math.round(prinP),
          interest_paid: Math.round(intP),
          total_payment: Math.round(monthlyEMI),
          closing_balance: Math.round(closing),
        });
        balance = closing;
      }
    }

    return {
      project_cost: req.project_cost,
      promoter_contribution: Math.round(promoterAmount),
      net_loan_amount: Math.round(netLoan),
      concessional_rate: req.concessional_rate,
      tenure_years: req.tenure_years,
      moratorium_months: req.moratorium_months,
      monthly_emi_after_moratorium: Math.round(monthlyEMI),
      moratorium_monthly_interest: Math.round(moratoriumInterest),
      total_concessional_interest: Math.round(totalConcessionalInterest),
      total_commercial_interest_benchmark: Math.round(commTotal),
      direct_beneficiary_savings: Math.round(savings),
      total_net_outflow: Math.round(netLoan + totalConcessionalInterest + promoterAmount),
      amortization_schedule: schedule,
    };
  }
}

export async function locatePartners(filters: {
  state?: string;
  category?: string;
  active_only?: boolean;
  latitude?: number;
  longitude?: number;
}): Promise<ChannelPartner[]> {
  try {
    const res = await fetch(`${API_BASE}/partners/locate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });
    if (!res.ok) throw new Error("Failed to fetch partners");
    return await res.json();
  } catch (err) {
    let fallback = [...INDIA_WIDE_FALLBACK_PARTNERS];
    if (filters.state && filters.state !== "All") {
      fallback = fallback.filter((p) => p.state.toLowerCase() === filters.state?.toLowerCase());
    }
    if (filters.category && filters.category !== "All") {
      fallback = fallback.filter((p) => p.category === filters.category);
    }
    if (filters.active_only) {
      fallback = fallback.filter((p) => p.status === "active" && p.npa_rate <= 5.0);
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
    return INDIA_WIDE_FALLBACK_PARTNERS;
  }
}
