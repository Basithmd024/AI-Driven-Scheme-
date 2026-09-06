from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal


class EntrepreneurProfileBase(BaseModel):
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = "Female"
    social_category: Optional[str] = "SC"  # SC, ST, OBC, General, Minority
    annual_family_income: Optional[Decimal] = Decimal("250000.00")  # Check against ₹5.00 Lakhs ceiling
    is_differently_abled: bool = False
    business_name: Optional[str] = None
    project_type: Optional[str] = "Micro Enterprise"  # Micro Enterprise, Term Loan/Industry, Education (Domestic), Education (Overseas), Green Business/EV
    education_status: Optional[str] = "Graduate"  # 10th Pass, 12th Pass, Graduate, Post Graduate, Professional/Technical (Engg/Medical)
    estimated_project_cost: Optional[Decimal] = Decimal("140000.00")  # e.g., ₹1.40L for micro, up to ₹50L for term
    state: Optional[str] = "Telangana"
    district: Optional[str] = "Hyderabad"
    is_shg_member: bool = False
    is_udyam_registered: bool = False
    profile_summary: Optional[str] = None


class EntrepreneurProfileCreate(EntrepreneurProfileBase):
    pass


class EntrepreneurProfileResponse(EntrepreneurProfileBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
