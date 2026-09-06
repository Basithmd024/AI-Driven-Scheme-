from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from decimal import Decimal


class SchemeBase(BaseModel):
    title: str
    title_hi: Optional[str] = None
    ministry_or_org: str
    category: str  # microfinance, term_loan, education, women_microfinance, green_business
    description: str
    target_demographics: List[str] = []
    eligible_business_types: List[str] = []
    max_funding_amount: Optional[Decimal] = None
    max_project_cost: Optional[Decimal] = None
    concessional_interest_rate: Decimal = Decimal("6.5")  # e.g., 6.5% - 8.0%
    max_tenure_years: int = 5
    max_moratorium_months: int = 6
    subsidy_percentage: Optional[Decimal] = None
    promoter_contribution_min: Decimal = Decimal("10.0")  # Minimum 5-10% promoter share
    channel_finance_coverage: Decimal = Decimal("90.0")  # Covers up to 90%
    application_url: Optional[str] = None
    eligibility_criteria: Optional[Dict[str, Any]] = {}


class SchemeCreate(SchemeBase):
    pass


class SchemeResponse(SchemeBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SchemeMatchResult(BaseModel):
    scheme: SchemeResponse
    match_score: float  # e.g., 95.0%
    eligibility_status: str  # "Highly Eligible", "Eligible", "Partially Eligible", "Income Exceeded"
    ai_reasoning: str
    key_benefits: List[str]
    required_documents: List[str]
    channel_guidelines: Dict[str, Any]
