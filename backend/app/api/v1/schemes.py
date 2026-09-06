from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID
from decimal import Decimal
from datetime import datetime

from app.schemas.scheme import SchemeResponse

router = APIRouter()

# Official Concessional Channel Finance Schemes for Scheduled Caste (SC) Beneficiaries
CONCESSIONAL_SC_SCHEMES: List[SchemeResponse] = [
    SchemeResponse(
        id=UUID("11111111-1111-1111-1111-111111111111"),
        title="Micro Credit Scheme (MCS)",
        title_hi="माइक्रो क्रेडिट योजना (एमसीएस)",
        ministry_or_org="NSFDC / Ministry of Social Justice & Empowerment",
        category="microfinance",
        description="Targeted credit for small trades, vegetable vendors, artisans, repair workshops, and service providers. Fully routed via State Channelizing Agencies (SCAs) and Micro-Finance Institutions.",
        target_demographics=["SC", "Micro Enterprise", "Artisan", "Rural Trade"],
        eligible_business_types=["Micro Enterprise", "Artisan", "Trading", "Service"],
        max_funding_amount=Decimal("140000.00"),
        max_project_cost=Decimal("140000.00"),
        concessional_interest_rate=Decimal("6.5"),
        max_tenure_years=3,
        max_moratorium_months=3,
        subsidy_percentage=Decimal("0.00"),
        promoter_contribution_min=Decimal("0.00"),
        channel_finance_coverage=Decimal("90.00"),
        application_url="https://nsfdc.nic.in/scheme",
        eligibility_criteria={
            "max_annual_family_income": 500000.00,
            "requires_caste_cert": True,
            "collateral_required": False,
            "channel_partners": ["SCA", "RRB", "NBFC-MFI"]
        },
        created_at=datetime.utcnow()
    ),
    SchemeResponse(
        id=UUID("22222222-2222-2222-2222-222222222222"),
        title="Mahila Samriddhi Yojana (Women Micro-Finance)",
        title_hi="महिला समृद्धि योजना (महिला लघु वित्त)",
        ministry_or_org="NSFDC / Ministry of Social Justice & Empowerment",
        category="women_microfinance",
        description="Exclusive concessional credit to SC women entrepreneurs, tailors, dairy operators, and Self-Help Groups (SHGs) at an ultra-concessional 4.0% interest rate with 6-month moratorium.",
        target_demographics=["SC", "Women", "SHG", "Micro Enterprise"],
        eligible_business_types=["Micro Enterprise", "Artisan", "Service", "Trading"],
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
            "max_annual_family_income": 500000.00,
            "requires_caste_cert": True,
            "collateral_required": False,
            "shg_eligible": True,
            "channel_partners": ["SCA", "NBFC-MFI", "RRB"]
        },
        created_at=datetime.utcnow()
    ),
    SchemeResponse(
        id=UUID("33333333-3333-3333-3333-333333333333"),
        title="Term Loan Scheme (Small & Medium Enterprises)",
        title_hi="सावधि ऋण योजना (लघु एवं मध्यम उद्यम)",
        ministry_or_org="NSFDC / Ministry of Social Justice & Empowerment",
        category="term_loan",
        description="Financing for viable manufacturing, transport, food processing, logistics, and service projects up to ₹50.00 Lakhs at 8% concessional interest with up to 12 months moratorium.",
        target_demographics=["SC", "MSME", "Entrepreneur"],
        eligible_business_types=["Term Loan/Industry", "Manufacturing", "Service", "Transport"],
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
            "max_annual_family_income": 500000.00,
            "requires_dpr": True,
            "requires_caste_cert": True,
            "channel_partners": ["SCA", "PSB", "RRB"]
        },
        created_at=datetime.utcnow()
    ),
    SchemeResponse(
        id=UUID("44444444-4444-4444-4444-444444444444"),
        title="Educational Loan Scheme (Domestic Professional Studies)",
        title_hi="शिक्षा ऋण योजना (घरेलू उच्च अध्ययन)",
        ministry_or_org="NSFDC / Ministry of Social Justice & Empowerment",
        category="education",
        description="Concessional educational loans up to ₹20.00 Lakhs for full-time professional and technical courses in India (Engineering, Medical, Law, MBA) at 7.5% p.a. (0.5% rebate for girls). Moratorium covers entire course duration + 1 year.",
        target_demographics=["SC", "Student", "Youth"],
        eligible_business_types=["Education (Domestic)", "Education"],
        max_funding_amount=Decimal("1800000.00"),
        max_project_cost=Decimal("2000000.00"),
        concessional_interest_rate=Decimal("7.5"),
        max_tenure_years=10,
        max_moratorium_months=12,
        subsidy_percentage=Decimal("0.00"),
        promoter_contribution_min=Decimal("5.00"),
        channel_finance_coverage=Decimal("90.00"),
        application_url="https://nsfdc.nic.in/scheme",
        eligibility_criteria={
            "max_annual_family_income": 500000.00,
            "requires_admission_proof": True,
            "requires_caste_cert": True,
            "channel_partners": ["PSB", "SCA"]
        },
        created_at=datetime.utcnow()
    ),
    SchemeResponse(
        id=UUID("55555555-5555-5555-5555-555555555555"),
        title="Educational Loan Scheme (Overseas / Foreign Studies)",
        title_hi="शिक्षा ऋण योजना (विदेश अध्ययन)",
        ministry_or_org="NSFDC / Ministry of Social Justice & Empowerment",
        category="education",
        description="Concessional overseas education assistance up to ₹30.00 Lakhs for accredited Master's and doctoral degrees abroad at 8.0% p.a. Moratorium covers course duration + 1 year.",
        target_demographics=["SC", "Student", "Youth"],
        eligible_business_types=["Education (Overseas)", "Education"],
        max_funding_amount=Decimal("2700000.00"),
        max_project_cost=Decimal("3000000.00"),
        concessional_interest_rate=Decimal("8.0"),
        max_tenure_years=10,
        max_moratorium_months=12,
        subsidy_percentage=Decimal("0.00"),
        promoter_contribution_min=Decimal("10.00"),
        channel_finance_coverage=Decimal("90.00"),
        application_url="https://nsfdc.nic.in/scheme",
        eligibility_criteria={
            "max_annual_family_income": 500000.00,
            "requires_passport_visa": True,
            "requires_caste_cert": True,
            "channel_partners": ["PSB", "SCA"]
        },
        created_at=datetime.utcnow()
    ),
    SchemeResponse(
        id=UUID("66666666-6666-6666-6666-666666666666"),
        title="Green Business & Clean Energy Scheme",
        title_hi="हरित व्यवसाय एवं स्वच्छ ऊर्जा योजना",
        ministry_or_org="NSFDC / Ministry of Social Justice & Empowerment",
        category="green_business",
        description="Eco-friendly concessional financing up to ₹30.00 Lakhs for battery-operated E-Rickshaws, solar rooftop units, and waste management at 6.5% interest with 6 months moratorium.",
        target_demographics=["SC", "Transport", "Green Business"],
        eligible_business_types=["Green Business/EV", "Transport", "Manufacturing", "Service"],
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
            "max_annual_family_income": 500000.00,
            "requires_caste_cert": True,
            "channel_partners": ["SCA", "PSB", "RRB"]
        },
        created_at=datetime.utcnow()
    )
]

DEFAULT_SCHEMES = CONCESSIONAL_SC_SCHEMES


@router.get("", response_model=List[SchemeResponse], tags=["Schemes"])
async def list_schemes():
    """Retrieve all concessional SC channel finance schemes."""
    return CONCESSIONAL_SC_SCHEMES


@router.get("/{scheme_id}", response_model=SchemeResponse, tags=["Schemes"])
async def get_scheme(scheme_id: UUID):
    """Retrieve details of a specific scheme by UUID."""
    for scheme in CONCESSIONAL_SC_SCHEMES:
        if scheme.id == scheme_id:
            return scheme
    raise HTTPException(status_code=404, detail="Scheme not found")
