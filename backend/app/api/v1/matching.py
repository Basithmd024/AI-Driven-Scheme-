from fastapi import APIRouter
from typing import List

from app.schemas.user import EntrepreneurProfileBase
from app.schemas.scheme import SchemeMatchResult
from app.api.v1.schemes import DEFAULT_SCHEMES
from app.services.ai_recommender import AISchemeRecommender

router = APIRouter()


@router.post("/recommend", response_model=List[SchemeMatchResult], tags=["AI Scheme Matching"])
async def match_schemes(profile: EntrepreneurProfileBase):
    """
    Evaluates entrepreneur profile demographics, caste, gender, turnover, 
    and sector against government scheme rules and returns prioritized matches 
    with AI-generated justification and document checklists.
    """
    recommendations = AISchemeRecommender.recommend(profile, DEFAULT_SCHEMES)
    return recommendations
