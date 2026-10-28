import uuid
from datetime import datetime, timezone
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from app.db.base import Base
from app.models.base import UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.institution import Institution
    from app.models.user import User
    from app.models.document import Document
    from app.models.compliance import Finding, RuleResult
    from app.models.review import ClarificationQuery, Escalation, SeniorDecision


class Application(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "applications"

    public_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)  # e.g. APP-2026-ENG-1042
    institution_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False
    )

    application_type: Mapped[str] = mapped_column(String(100), default="Extension of Approval (EoA)")
    academic_year: Mapped[str] = mapped_column(String(20), default="2026-27")
    stream: Mapped[str] = mapped_column(String(100), default="Engineering & Technology")

    current_status: Mapped[str] = mapped_column(String(50), default="Under Review", index=True)
    status_severity: Mapped[str] = mapped_column(String(20), default="info")
    priority: Mapped[str] = mapped_column(String(20), default="Normal")
    priority_severity: Mapped[str] = mapped_column(String(20), default="info")
    preliminary_outcome: Mapped[str] = mapped_column(String(100), default="In Scrutiny Queue")

    submission_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    deadline_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    assigned_officer_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    # Scrutiny Notes & Escalations
    officer_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    review_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    escalation_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    escalation_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Program & Intake specs from filing
    proposed_course: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    proposed_intake: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    institution: Mapped["Institution"] = relationship("Institution", back_populates="applications")
    assigned_officer: Mapped[Optional["User"]] = relationship("User", back_populates="assigned_applications", foreign_keys=[assigned_officer_id])
    timeline: Mapped[List["ApplicationTimeline"]] = relationship("ApplicationTimeline", back_populates="application", cascade="all, delete-orphan", order_by="ApplicationTimeline.created_at.desc()")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="application", cascade="all, delete-orphan")
    findings: Mapped[List["Finding"]] = relationship("Finding", back_populates="application", cascade="all, delete-orphan")
    rule_results: Mapped[List["RuleResult"]] = relationship("RuleResult", back_populates="application", cascade="all, delete-orphan")
    queries: Mapped[List["ClarificationQuery"]] = relationship("ClarificationQuery", back_populates="application", cascade="all, delete-orphan")
    escalations: Mapped[List["Escalation"]] = relationship("Escalation", back_populates="application", cascade="all, delete-orphan")
    senior_decisions: Mapped[List["SeniorDecision"]] = relationship("SeniorDecision", back_populates="application", cascade="all, delete-orphan")


class ApplicationTimeline(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "application_timeline"

    application_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False
    )
    actor_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    actor_name: Mapped[str] = mapped_column(String(255), nullable=False)
    stage: Mapped[str] = mapped_column(String(100), nullable=False)
    details: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    application: Mapped["Application"] = relationship("Application", back_populates="timeline")
