from sqlalchemy import Column, String, Numeric, Text, DateTime, JSON, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from datetime import datetime
import uuid

from app.core.database import Base


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    ministry_or_org = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    
    # Eligibility & Filters
    target_demographics = Column(ARRAY(String), default=list)  # ["Women", "SC", "ST", "Minority", "Differently-Abled"]
    eligible_business_types = Column(ARRAY(String), default=list)  # ["Manufacturing", "Service", "Trading", "Artisan"]
    max_funding_amount = Column(Numeric(15, 2), nullable=True)
    subsidy_percentage = Column(Numeric(5, 2), nullable=True)
    application_url = Column(Text, nullable=True)
    eligibility_criteria = Column(JSON, default=dict)
    
    # Vector embedding for AI semantic matching (1536-dim)
    embedding = Column(Vector(1536), nullable=True)

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
