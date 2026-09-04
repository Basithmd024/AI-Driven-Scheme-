from fastapi import APIRouter
from uuid import uuid4
from datetime import datetime

from app.schemas.user import EntrepreneurProfileCreate, EntrepreneurProfileResponse

router = APIRouter()


@router.post("/profile", response_model=EntrepreneurProfileResponse, tags=["Entrepreneurs"])
async def create_or_update_profile(profile: EntrepreneurProfileCreate):
    """
    Save or validate an entrepreneur profile for scheme eligibility evaluations.
    """
    return EntrepreneurProfileResponse(
        id=uuid4(),
        full_name=profile.full_name,
        email=profile.email,
        phone=profile.phone,
        gender=profile.gender,
        social_category=profile.social_category,
        is_differently_abled=profile.is_differently_abled,
        business_name=profile.business_name,
        business_type=profile.business_type,
        annual_turnover=profile.annual_turnover,
        state=profile.state,
        district=profile.district,
        is_udyam_registered=profile.is_udyam_registered,
        profile_summary=profile.profile_summary,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
