import uuid
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base import Base
from app.models.base import UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.application import Application


class Institution(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "institutions"

    institution_name: Mapped[str] = mapped_column(String(255), nullable=False)
    short_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    aishe_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    permanent_institute_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    institution_type: Mapped[str] = mapped_column(String(150), default="Technical Higher Education Institution")
    
    region: Mapped[str] = mapped_column(String(150), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    pin_code: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    campus_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    land_area_acres: Mapped[float] = mapped_column(Float, default=0.0)
    built_up_area_sqm: Mapped[float] = mapped_column(Float, default=0.0)
    affiliation_details: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    users: Mapped[List["User"]] = relationship("User", back_populates="institution", cascade="all, delete-orphan")
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="institution", cascade="all, delete-orphan")
