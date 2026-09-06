from fastapi import APIRouter, Query
from typing import List, Optional
from app.schemas.partner import ChannelPartnerWithDistance, ChannelPartnerFilter, ChannelPartnerBase
from app.services.channel_partner_service import ChannelPartnerService, DATABASE_PARTNERS

router = APIRouter()


@router.get("", response_model=List[ChannelPartnerBase], tags=["Channel Partners"])
async def list_all_partners():
    """Retrieve all registered channel financing partners across SCAs, PSBs, RRBs, and NBFC-MFIs."""
    return DATABASE_PARTNERS


@router.post("/locate", response_model=List[ChannelPartnerWithDistance], tags=["Channel Partners"])
async def locate_and_route_partners(filters: ChannelPartnerFilter):
    """
    Geo-Spatial Partner Locator & Router:
    - Filters by state, district, partner category (SCA, PSB, RRB, NBFC-MFI), and scheme
    - Enforces Fund Utilization & NPA Health Filtering (active_only=True excludes high-overdue/suspended partners)
    - Computes distance from beneficiary's GPS coordinates using Haversine formula
    - Provides specific routing recommendations
    """
    return ChannelPartnerService.filter_and_route_partners(filters)


@router.get("/health-check/{partner_id}", tags=["Channel Partners"])
async def check_partner_health(partner_id: str):
    """Check NPA and fund-utilization health for a specific channel partner branch."""
    for p in DATABASE_PARTNERS:
        if p.id == partner_id:
            return {
                "id": p.id,
                "name": p.name,
                "status": p.status,
                "fund_utilization_rate": p.fund_utilization_rate,
                "npa_rate": p.npa_rate,
                "is_eligible_for_routing": p.status == "active",
                "status_message": p.status_message
            }
    return {"error": "Partner not found"}
