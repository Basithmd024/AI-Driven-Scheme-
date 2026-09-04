from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from decimal import Decimal


class SchemeBase(BaseModel):
    title: str
    ministry_or_org: str
    description: str
    target_demographics: List[str] = []
    eligible_business_types: List[str] = []
    max_funding_amount: Optional[Decimal] = None
    subsidy_percentage: Optional[Decimal] = None
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
    eligibility_status: str  # "Highly Eligible", "Eligible", "Partially Eligible"
    ai_reasoning: str
    key_benefits: List[str]
    required_documents: List[str]
