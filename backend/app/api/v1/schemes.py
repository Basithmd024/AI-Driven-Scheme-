from fastapi import APIRouter, HTTPException
from typing import List
from uuid import UUID, uuid4
from decimal import Decimal
from datetime import datetime

from app.schemas.scheme import SchemeResponse, SchemeCreate

router = APIRouter()

# Default curated schemes for marginalized entrepreneurs
DEFAULT_SCHEMES: List[SchemeResponse] = [
    SchemeResponse(
        id=UUID("11111111-1111-1111-1111-111111111111"),
        title="Stand-Up India Scheme",
        ministry_or_org="Ministry of Finance / SIDBI",
        description="Facilitates bank loans between 10 lakh and 1 crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
        target_demographics=["Women", "SC", "ST"],
        eligible_business_types=["Manufacturing", "Service", "Trading"],
        max_funding_amount=Decimal("10000000.00"),
        subsidy_percentage=Decimal("15.00"),
        application_url="https://www.standupmitra.in/",
        eligibility_criteria={"requires_udyam": True, "min_age": 18, "greenfield_only": True},
        created_at=datetime.utcnow()
    ),
    SchemeResponse(
        id=UUID("22222222-2222-2222-2222-222222222222"),
        title="Prime Minister's Employment Generation Programme (PMEGP)",
        ministry_or_org="Ministry of MSME / KVIC",
        description="Credit-linked subsidy scheme generating employment opportunities through establishment of micro-enterprises in rural and urban areas. Higher subsidy rate of up to 35% for Special Category beneficiaries (SC/ST/OBC/Minorities/Women/Differently-abled).",
        target_demographics=["Women", "SC", "ST", "OBC", "Minority", "Differently-Abled"],
        eligible_business_types=["Manufacturing", "Service", "Artisan"],
        max_funding_amount=Decimal("5000000.00"),
        subsidy_percentage=Decimal("35.00"),
        application_url="https://www.kviconline.gov.in/pmegpeportal/",
        eligibility_criteria={"requires_udyam": False, "min_age": 18, "education_min": "8th Pass for >10L Mfg"},
        created_at=datetime.utcnow()
    ),
    SchemeResponse(
        id=UUID("33333333-3333-3333-3333-333333333333"),
        title="Pradhan Mantri Mudra Yojana (PMMY) - Tarun & Kishore",
        ministry_or_org="Department of Financial Services",
        description="Provides collateral-free institutional credit up to 10 Lakhs to micro/small business units. Special focus on women entrepreneurs and minority-owned informal enterprises transitioning to the formal sector.",
        target_demographics=["Women", "Minority", "OBC", "SC", "ST"],
        eligible_business_types=["Manufacturing", "Service", "Trading", "Artisan"],
        max_funding_amount=Decimal("1000000.00"),
        subsidy_percentage=Decimal("0.00"),
        application_url="https://www.mudra.org.in/",
        eligibility_criteria={"requires_udyam": False, "collateral_free": True},
        created_at=datetime.utcnow()
    ),
    SchemeResponse(
        id=UUID("44444444-4444-4444-4444-444444444444"),
        title="Ambedkar Social Innovation and Incubation Mission (ASIIM)",
        ministry_or_org="Ministry of Social Justice and Empowerment",
        description="Promotes innovation and enterprise among SC youth with special preference to Divyangs (differently-abled) and women entrepreneurs by supporting innovative technology startups with equity funding up to 30 lakhs over 3 years.",
        target_demographics=["SC", "Differently-Abled", "Women"],
        eligible_business_types=["Manufacturing", "Service"],
        max_funding_amount=Decimal("3000000.00"),
        subsidy_percentage=Decimal("100.00"),
        application_url="https://vcfsc.in/asiim/",
        eligibility_criteria={"requires_udyam": True, "startup_focus": True},
        created_at=datetime.utcnow()
    )
]


@router.get("", response_model=List[SchemeResponse], tags=["Schemes"])
async def list_schemes():
    """Retrieve all available schemes in the database."""
    return DEFAULT_SCHEMES


@router.get("/{scheme_id}", response_model=SchemeResponse, tags=["Schemes"])
async def get_scheme(scheme_id: UUID):
    """Retrieve details of a specific scheme by UUID."""
    for scheme in DEFAULT_SCHEMES:
        if scheme.id == scheme_id:
            return scheme
    raise HTTPException(status_code=404, detail="Scheme not found")
