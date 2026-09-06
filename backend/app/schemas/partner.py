from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal


class ChannelPartnerBase(BaseModel):
    id: str
    name: str
    category: str  # SCA (State Channelizing Agency), PSB (Public Sector Bank), RRB (Regional Rural Bank), NBFC-MFI
    state: str
    district: str
    city: str
    address: str
    phone: str
    email: str
    contact_person: str
    latitude: float
    longitude: float
    fund_utilization_rate: float  # e.g., 94.2%
    npa_rate: float  # Non-Performing Asset / Overdue %
    status: str  # active, review, suspended
    status_message: str
    supported_schemes: List[str]
    avg_disbursement_days: int


class ChannelPartnerFilter(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    category: Optional[str] = None
    scheme_id: Optional[str] = None
    active_only: bool = True  # Automatically filters out suspended / high-NPA branches
    user_lat: Optional[float] = None
    user_lng: Optional[float] = None
    max_distance_km: Optional[float] = None


class ChannelPartnerWithDistance(ChannelPartnerBase):
    distance_km: Optional[float] = None
    routing_recommendation: str
