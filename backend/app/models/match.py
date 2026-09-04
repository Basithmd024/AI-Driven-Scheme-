from sqlalchemy import Column, String, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.core.database import Base


class SchemeMatch(Base):
    __tablename__ = "scheme_matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entrepreneur_id = Column(UUID(as_uuid=True), ForeignKey("entrepreneur_profiles.id"), nullable=False)
    scheme_id = Column(UUID(as_uuid=True), ForeignKey("schemes.id"), nullable=False)
    
    match_score = Column(Numeric(5, 2), nullable=False)  # 0.0 to 100.0%
    eligibility_status = Column(String(50), default="Eligible")  # Eligible, High Probability, Needs Documents
    ai_reasoning = Column(Text, nullable=True)
    status = Column(String(50), default="Recommended")  # Recommended, Saved, Applied, Approved

    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
