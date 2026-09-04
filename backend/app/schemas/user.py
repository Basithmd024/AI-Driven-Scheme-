from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal


class EntrepreneurProfileBase(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gender: Optional[str] = "Female"
    social_category: Optional[str] = "General"  # SC, ST, OBC, General, Minority
    is_differently_abled: bool = False
    business_name: Optional[str] = None
    business_type: Optional[str] = "Manufacturing"  # Manufacturing, Service, Trading, Artisan
    annual_turnover: Optional[Decimal] = Decimal("0.0")
    state: Optional[str] = None
    district: Optional[str] = None
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
