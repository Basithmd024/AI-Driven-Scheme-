from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from decimal import Decimal
from datetime import datetime

from app.schemas.scheme import SchemeResponse

router = APIRouter()

# Comprehensive Multi-Portal India-Wide Government Schemes
INDIA_WIDE_GOVERNMENT_SCHEMES: List[SchemeResponse] = [
    # 1. PMEGP - KVIC / MoMSME (kviconline.gov.in)
    SchemeResponse(
        id=UUID("a1111111-1111-1111-1111-111111111111"),
        title="Prime Minister's Employment Generation Programme (PMEGP)",
        title_hi="प्रधानमंत्री रोजगार सृजन कार्यक्रम (पीएमईजीपी)",
        ministry_or_org="Ministry of MSME & KVIC (kviconline.gov.in)",
        category="manufacturing_services",
        description="India's premier credit-linked subsidy scheme for setting up micro-enterprises. Up to 35% margin money subsidy in rural areas and 25% in urban areas for SC, ST, OBC, Women, and Minorities with NO family income ceiling.",
        target_demographics=["All India", "General", "OBC", "SC", "ST", "Women", "Minorities", "Ex-Servicemen", "PH"],
        eligible_business_types=["Manufacturing", "Service", "Trading", "Agro-Processing"],
        max_funding_amount=Decimal("5000000.00"),
        max_project_cost=Decimal("5000000.00"),
        concessional_interest_rate=Decimal("7.5"),
        max_tenure_years=7,
        max_moratorium_months=6,
        subsidy_percentage=Decimal("35.00"),
        promoter_contribution_min=Decimal("5.00"),
        channel_finance_coverage=Decimal("95.00"),
        application_url="https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
        eligibility_criteria={
            "min_age": 18,
            "min_education": "8th Pass for projects > ₹10L (Mfg) or > ₹5L (Service)",
            "max_annual_family_income": 99999999.00,
            "collateral_required": False,
            "channel_partners": ["PSB", "RRB", "KVIC", "KVIB", "DIC"]
        },
        created_at=datetime.utcnow()
    ),
    # 2. PM MUDRA Yojana - Dept of Financial Services (mudra.org.in)
    SchemeResponse(
        id=UUID("a2222222-2222-2222-2222-222222222222"),
        title="Pradhan Mantri MUDRA Yojana (PMMY — Kishore & Tarun)",
        title_hi="प्रधानमंत्री मुद्रा योजना (पीएमएमवाई — किशोर एवं तरुण)",
        ministry_or_org="Department of Financial Services, Ministry of Finance (mudra.org.in)",
        category="microfinance",
        description="Collateral-free institutional credit up to ₹10 Lakhs (extended up to ₹20 Lakhs under Tarun Plus for past repayers) for non-farm income generating micro and small enterprises across India with 0% processing fee.",
        target_demographics=["All India", "Micro Enterprise", "Small Business", "Shopkeepers", "Women", "Artisans"],
        eligible_business_types=["Retail Trade", "Manufacturing", "Service", "Food Processing", "Repair Workshops"],
        max_funding_amount=Decimal("1000000.00"),
        max_project_cost=Decimal("1000000.00"),
        concessional_interest_rate=Decimal("8.5"),
        max_tenure_years=5,
        max_moratorium_months=6,
        subsidy_percentage=Decimal("0.00"),
        promoter_contribution_min=Decimal("10.00"),
        channel_finance_coverage=Decimal("90.00"),
        application_url="https://www.mudra.org.in",
        eligibility_criteria={
            "collateral_required": False,
            "max_annual_family_income": 99999999.00,
            "channel_partners": ["PSB", "RRB", "Private Bank", "NBFC-MFI", "Small Finance Bank"]
        },
        created_at=datetime.utcnow()
    ),
    # 3. Stand-Up India - SIDBI / MoF (standupmitra.in)
    SchemeResponse(
        id=UUID("a3333333-3333-3333-3333-333333333333"),
        title="Stand-Up India Scheme for SC, ST & Women",
        title_hi="स्टैंड-अप इंडिया योजना (अनुसूचित जाति, जनजाति एवं महिला उद्यमी)",
        ministry_or_org="Ministry of Finance & SIDBI (standupmitra.in)",
        category="term_loan",
        description="Bank loan between ₹10 Lakhs and ₹1 Crore to at least one SC/ST borrower and at least one Woman borrower per bank branch for setting up greenfield enterprises in manufacturing, services, agri-allied, or trading.",
        target_demographics=["SC", "ST", "Women", "MSME"],
        eligible_business_types=["Manufacturing", "Service", "Agri-Allied", "Trading"],
        max_funding_amount=Decimal("10000000.00"),
        max_project_cost=Decimal("10000000.00"),
        concessional_interest_rate=Decimal("7.8"),
        max_tenure_years=7,
        max_moratorium_months=18,
        subsidy_percentage=Decimal("15.00"),
        promoter_contribution_min=Decimal("10.00"),
        channel_finance_coverage=Decimal("85.00"),
        application_url="https://www.standupmitra.in",
        eligibility_criteria={
            "greenfield_project": True,
            "sc_st_or_woman": True,
            "max_annual_family_income": 99999999.00,
            "channel_partners": ["All Scheduled Commercial Banks", "PSB"]
        },
        created_at=datetime.utcnow()
    ),
    # 4. PM Vishwakarma - MoMSME (pmvishwakarma.gov.in)
    SchemeResponse(
        id=UUID("a4444444-4444-4444-4444-444444444444"),
        title="PM Vishwakarma Scheme (Artisan Enterprise Loan)",
        title_hi="पीएम विश्वकर्मा योजना (कारीगर एवं शिल्पकार संवर्धन)",
        ministry_or_org="Ministry of MSME & Skill Development (pmvishwakarma.gov.in)",
        category="artisans",
        description="Holistic national support for traditional artisans and craftspersons across 18 family trades. Collateral-free enterprise loan up to ₹3 Lakhs at 5% concessional interest with 8% MoMSME interest subvention + ₹15,000 modern toolkit incentive.",
        target_demographics=["Artisan", "Craftsperson", "OBC", "SC", "ST", "Rural Worker", "Women"],
        eligible_business_types=["Carpentry", "Blacksmith", "Pottery", "Tailoring", "Masonry", "Sculpting", "Leather Work", "Weaving"],
        max_funding_amount=Decimal("300000.00"),
        max_project_cost=Decimal("300000.00"),
        concessional_interest_rate=Decimal("5.0"),
        max_tenure_years=3,
        max_moratorium_months=6,
        subsidy_percentage=Decimal("15.00"),
        promoter_contribution_min=Decimal("0.00"),
        channel_finance_coverage=Decimal("100.00"),
        application_url="https://pmvishwakarma.gov.in",
        eligibility_criteria={
            "artisan_trade": True,
            "skill_training_stipend": "₹500/day during training",
            "toolkit_incentive": "₹15,000 voucher",
            "channel_partners": ["PSB", "RRB", "Cooperative Banks"]
        },
        created_at=datetime.utcnow()
    ),
    # 5. PM SVANidhi - MoHUA (pmsvanidhi.mohua.gov.in)
    SchemeResponse(
        id=UUID("a5555555-5555-5555-5555-555555555555"),
        title="PM SVANidhi (Micro-Credit for Street Vendors)",
        title_hi="पीएम स्वनिधि (स्ट्रीट वेंडर्स आत्मनिर्भर निधि)",
        ministry_or_org="Ministry of Housing and Urban Affairs (pmsvanidhi.mohua.gov.in)",
        category="street_vendor",
        description="Collateral-free working capital loan up to ₹50,000 (Tranche 1: ₹10K, Tranche 2: ₹20K, Tranche 3: ₹50K) with 7% interest subsidy directly credited quarterly for street vendors across urban and peri-urban India.",
        target_demographics=["Street Vendor", "Hawker", "Urban Poor", "Micro Retailer"],
        eligible_business_types=["Street Vending", "Fruit/Vegetable Trade", "Fast Food", "Artisanal Goods", "Mobile Kiosk"],
        max_funding_amount=Decimal("50000.00"),
        max_project_cost=Decimal("50000.00"),
        concessional_interest_rate=Decimal("4.5"),
        max_tenure_years=3,
        max_moratorium_months=1,
        subsidy_percentage=Decimal("7.00"),
        promoter_contribution_min=Decimal("0.00"),
        channel_finance_coverage=Decimal("100.00"),
        application_url="https://pmsvanidhi.mohua.gov.in",
        eligibility_criteria={
            "urban_vendor_id": True,
            "digital_incentive": "Up to ₹1,200 annual cash back",
            "channel_partners": ["PSB", "RRB", "NBFC-MFI", "Small Finance Bank"]
        },
        created_at=datetime.utcnow()
    ),
    # 6. NSTFDC AMSY - Ministry of Tribal Affairs (nstfdc.tribal.gov.in)
    SchemeResponse(
        id=UUID("a6666666-6666-6666-6666-666666666666"),
        title="Adivasi Mahila Sashaktikaran Yojana (AMSY - NSTFDC)",
        title_hi="आदिवासी महिला सशक्तिकरण योजना (एनएसटीएफडीसी)",
        ministry_or_org="NSTFDC / Ministry of Tribal Affairs (nstfdc.tribal.gov.in)",
        category="women_microfinance",
        description="Exclusive concessional credit for Scheduled Tribe (ST) women entrepreneurs up to ₹2.00 Lakhs at an ultra-low interest rate of 4% per annum. Term loan coverage up to 90% of project cost.",
        target_demographics=["ST", "Women", "SHG", "Tribal Entrepreneurs"],
        eligible_business_types=["Forest Produce", "Handicrafts", "Agriculture Allied", "Tailoring", "Dairy"],
        max_funding_amount=Decimal("200000.00"),
        max_project_cost=Decimal("200000.00"),
        concessional_interest_rate=Decimal("4.0"),
        max_tenure_years=5,
        max_moratorium_months=6,
        subsidy_percentage=Decimal("10.00"),
        promoter_contribution_min=Decimal("2.00"),
        channel_finance_coverage=Decimal("90.00"),
        application_url="https://nstfdc.tribal.gov.in",
        eligibility_criteria={
            "st_certificate_required": True,
            "gender_exclusive": "Female",
            "max_annual_family_income": 300000.00,
            "channel_partners": ["State Tribal Channelizing Agencies", "RRB", "PSB"]
        },
        created_at=datetime.utcnow()
    ),
    # 7. NBCFDC New Swarnima - Ministry of Social Justice (nbcfdc.gov.in)
    SchemeResponse(
        id=UUID("a7777777-7777-7777-7777-777777777777"),
        title="NBCFDC New Swarnima Scheme for Backward Classes Women",
        title_hi="नई स्वर्णिमा योजना (ओबीसी महिला उद्यमिता — एनबीसीएफडीसी)",
        ministry_or_org="NBCFDC / Ministry of Social Justice & Empowerment (nbcfdc.gov.in)",
        category="women_microfinance",
        description="Targeted concessional credit up to ₹2.00 Lakhs at 5% p.a. for women belonging to Other Backward Classes (OBCs) living below double poverty line to foster self-reliance.",
        target_demographics=["OBC", "Women", "Micro Enterprise"],
        eligible_business_types=["Service", "Small Business", "Dairy", "Garment", "Handicrafts"],
        max_funding_amount=Decimal("200000.00"),
        max_project_cost=Decimal("200000.00"),
        concessional_interest_rate=Decimal("5.0"),
        max_tenure_years=5,
        max_moratorium_months=6,
        subsidy_percentage=Decimal("5.00"),
        promoter_contribution_min=Decimal("5.00"),
        channel_finance_coverage=Decimal("95.00"),
        application_url="https://nbcfdc.gov.in",
        eligibility_criteria={
            "obc_certificate_required": True,
            "gender_exclusive": "Female",
            "max_annual_family_income": 300000.00,
            "channel_partners": ["State Backward Classes Finance Corporations", "PSB"]
        },
        created_at=datetime.utcnow()
    ),
    # 8. NMDFC Virasat Scheme - Ministry of Minority Affairs (nmdfc.org)
    SchemeResponse(
        id=UUID("a8888888-8888-8888-8888-888888888888"),
        title="NMDFC Virasat Scheme for Minority Craftspersons",
        title_hi="विरासत योजना (अल्पसंख्यक कारीगर एवं शिल्पकार — एनएमडीएफसी)",
        ministry_or_org="NMDFC / Ministry of Minority Affairs (nmdfc.org)",
        category="artisans",
        description="Concessional credit for craftspersons belonging to notified National Minorities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi). Loans up to ₹10 Lakhs at 5% p.a. (4% p.a. for female craftspersons).",
        target_demographics=["Minority", "Artisan", "Women", "Craftsperson"],
        eligible_business_types=["Handicrafts", "Zari Embroidery", "Woodcraft", "Metal Art", "Weaving", "Pottery"],
        max_funding_amount=Decimal("1000000.00"),
        max_project_cost=Decimal("1000000.00"),
        concessional_interest_rate=Decimal("4.5"),
        max_tenure_years=5,
        max_moratorium_months=6,
        subsidy_percentage=Decimal("5.00"),
        promoter_contribution_min=Decimal("5.00"),
        channel_finance_coverage=Decimal("90.00"),
        application_url="https://nmdfc.org",
        eligibility_criteria={
            "minority_community": True,
            "max_annual_family_income": 800000.00,
            "channel_partners": ["State Channelizing Agencies", "PSB"]
        },
        created_at=datetime.utcnow()
    ),
    # 9. NSFDC Mahila Samriddhi Yojana (nsfdc.nic.in)
    SchemeResponse(
        id=UUID("22222222-2222-2222-2222-222222222222"),
        title="Mahila Samriddhi Yojana (NSFDC Women Micro-Finance)",
        title_hi="महिला समृद्धि योजना (एनएसएफडीसी महिला लघु वित्त)",
        ministry_or_org="NSFDC / Ministry of Social Justice & Empowerment (nsfdc.nic.in)",
        category="women_microfinance",
        description="Exclusive concessional credit to Scheduled Caste (SC) women entrepreneurs, tailors, dairy operators, and Self-Help Groups (SHGs) at an ultra-concessional 4.0% interest rate with 6-month moratorium.",
        target_demographics=["SC", "Women", "SHG", "Micro Enterprise"],
        eligible_business_types=["Micro Enterprise", "Artisan", "Service", "Trading", "Dairy"],
        max_funding_amount=Decimal("140000.00"),
        max_project_cost=Decimal("140000.00"),
        concessional_interest_rate=Decimal("4.0"),
        max_tenure_years=4,
        max_moratorium_months=6,
        subsidy_percentage=Decimal("10.00"),
        promoter_contribution_min=Decimal("0.00"),
        channel_finance_coverage=Decimal("95.00"),
        application_url="https://nsfdc.nic.in/scheme",
        eligibility_criteria={
            "gender_exclusive": "Female",
            "social_category": "SC",
            "max_annual_family_income": 500000.00,
            "requires_caste_cert": True,
            "shg_eligible": True,
            "channel_partners": ["SCA", "NBFC-MFI", "RRB"]
        },
        created_at=datetime.utcnow()
    ),
    # 10. NSFDC Term Loan Scheme (nsfdc.nic.in)
    SchemeResponse(
        id=UUID("33333333-3333-3333-3333-333333333333"),
        title="NSFDC Term Loan Scheme for SC MSMEs",
        title_hi="एनएसएफडीसी सावधि ऋण योजना (लघु एवं मध्यम उद्यम)",
        ministry_or_org="NSFDC / Ministry of Social Justice & Empowerment (nsfdc.nic.in)",
        category="term_loan",
        description="Financing for viable manufacturing, transport, food processing, logistics, and service projects up to ₹50.00 Lakhs at 6.0%–8.0% concessional interest with up to 12 months moratorium for SC entrepreneurs.",
        target_demographics=["SC", "MSME", "Entrepreneur"],
        eligible_business_types=["Manufacturing", "Service", "Transport", "Food Processing", "Logistics"],
        max_funding_amount=Decimal("4500000.00"),
        max_project_cost=Decimal("5000000.00"),
        concessional_interest_rate=Decimal("8.0"),
        max_tenure_years=8,
        max_moratorium_months=12,
        subsidy_percentage=Decimal("0.00"),
        promoter_contribution_min=Decimal("10.00"),
        channel_finance_coverage=Decimal("90.00"),
        application_url="https://nsfdc.nic.in/scheme",
        eligibility_criteria={
            "social_category": "SC",
            "max_annual_family_income": 500000.00,
            "requires_dpr": True,
            "requires_caste_cert": True,
            "channel_partners": ["SCA", "PSB", "RRB"]
        },
        created_at=datetime.utcnow()
    ),
    # 11. CGTMSE Collateral Guarantee Scheme (cgtmse.in)
    SchemeResponse(
        id=UUID("a9999999-9999-9999-9999-999999999999"),
        title="Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)",
        title_hi="सूक्ष्म एवं लघु उद्यम क्रेडिट गारंटी योजना (सीजीटीएमएसई)",
        ministry_or_org="Ministry of MSME & SIDBI (cgtmse.in)",
        category="term_loan",
        description="Credit guarantee facility enabling collateral-free bank loans up to ₹5 Crore for new and existing Micro and Small Enterprises. Up to 85% guarantee coverage for women, SC/ST, and ZED-certified units across all commercial banks.",
        target_demographics=["All India", "MSME", "Women", "SC", "ST", "General", "OBC"],
        eligible_business_types=["Manufacturing", "Service", "IT/ITeS", "Retail Trade", "Education/Healthcare"],
        max_funding_amount=Decimal("50000000.00"),
        max_project_cost=Decimal("50000000.00"),
        concessional_interest_rate=Decimal("8.5"),
        max_tenure_years=10,
        max_moratorium_months=18,
        subsidy_percentage=Decimal("0.00"),
        promoter_contribution_min=Decimal("15.00"),
        channel_finance_coverage=Decimal("85.00"),
        application_url="https://www.cgtmse.in",
        eligibility_criteria={
            "udyam_registered": True,
            "collateral_required": False,
            "max_annual_family_income": 99999999.00,
            "channel_partners": ["All Scheduled Commercial Banks", "PSB", "RRB"]
        },
        created_at=datetime.utcnow()
    ),
    # 12. NSFDC Green Business Scheme (nsfdc.nic.in)
    SchemeResponse(
        id=UUID("66666666-6666-6666-6666-666666666666"),
        title="Green Business & Clean Energy Scheme (NSFDC)",
        title_hi="हरित व्यवसाय एवं स्वच्छ ऊर्जा योजना (एनएसएफडीसी)",
        ministry_or_org="NSFDC / Ministry of Social Justice & Empowerment (nsfdc.nic.in)",
        category="green_business",
        description="Eco-friendly concessional financing up to ₹30.00 Lakhs for battery-operated E-Rickshaws, commercial electric vehicles, solar rooftop units, and waste recycling at 6.5% interest with 6 months moratorium.",
        target_demographics=["SC", "Transport", "Green Business", "Clean Tech"],
        eligible_business_types=["Green Business/EV", "Transport", "Manufacturing", "Service", "Solar"],
        max_funding_amount=Decimal("2700000.00"),
        max_project_cost=Decimal("3000000.00"),
        concessional_interest_rate=Decimal("6.5"),
        max_tenure_years=7,
        max_moratorium_months=6,
        subsidy_percentage=Decimal("0.00"),
        promoter_contribution_min=Decimal("5.00"),
        channel_finance_coverage=Decimal("90.00"),
        application_url="https://nsfdc.nic.in/scheme",
        eligibility_criteria={
            "social_category": "SC",
            "max_annual_family_income": 500000.00,
            "requires_caste_cert": True,
            "channel_partners": ["SCA", "PSB", "RRB"]
        },
        created_at=datetime.utcnow()
    )
]

DEFAULT_SCHEMES = INDIA_WIDE_GOVERNMENT_SCHEMES


@router.get("", response_model=List[SchemeResponse], tags=["Schemes"])
async def list_schemes():
    """Retrieve all India-wide government schemes across multiple central portals."""
    return INDIA_WIDE_GOVERNMENT_SCHEMES


@router.get("/{scheme_id}", response_model=SchemeResponse, tags=["Schemes"])
async def get_scheme(scheme_id: UUID):
    """Retrieve details of a specific scheme by UUID."""
    for scheme in INDIA_WIDE_GOVERNMENT_SCHEMES:
        if scheme.id == scheme_id:
            return scheme
    raise HTTPException(status_code=404, detail="Scheme not found")
