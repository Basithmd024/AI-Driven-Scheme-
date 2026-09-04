from sqlalchemy import Column, String, Boolean, Numeric, Text, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.core.database import Base


class EntrepreneurProfile(Base):
    __tablename__ = "entrepreneur_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    phone = Column(String(50), nullable=True)
    gender = Column(String(50), nullable=True)  # Female, Male, Non-Binary, Other
    social_category = Column(String(100), nullable=True)  # SC, ST, OBC, General, Minority
    is_differently_abled = Column(Boolean, default=False)
    
    business_name = Column(String(255), nullable=True)
    business_type = Column(String(100), nullable=True)  # Manufacturing, Service, Trading, Artisan
    annual_turnover = Column(Numeric(15, 2), default=0.00)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    is_udyam_registered = Column(Boolean, default=False)
    profile_summary = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
