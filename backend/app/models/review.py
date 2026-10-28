import uuid
from datetime import datetime, timezone
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.db.base import Base
from app.models.base import UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.application import Application
    from app.models.document import Document
    from app.models.user import User


class ClarificationQuery(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "clarification_queries"

    public_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)  # e.g. CQ-104
    application_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False
    )
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    response_required: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Pending College Response", index=True)

    issued_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    due_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    application: Mapped["Application"] = relationship("Application", back_populates="queries")
    issued_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[issued_by_id])
    responses: Mapped[List["ClarificationResponse"]] = relationship("ClarificationResponse", back_populates="query", cascade="all, delete-orphan")


class ClarificationResponse(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "clarification_responses"

    query_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("clarification_queries.id", ondelete="CASCADE"), nullable=False
    )
    response_text: Mapped[str] = mapped_column(Text, nullable=False)
    submitted_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    attachment_document_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True
    )
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    query: Mapped["ClarificationQuery"] = relationship("ClarificationQuery", back_populates="responses")
    submitted_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[submitted_by_id])
    attachment: Mapped[Optional["Document"]] = relationship("Document", foreign_keys=[attachment_document_id])


class Escalation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "escalations"

    public_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)  # e.g. ESC-401
    application_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False
    )
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    evidence_summary: Mapped[str] = mapped_column(Text, nullable=False)
    recommended_next_step: Mapped[str] = mapped_column(Text, nullable=False)
    senior_authority: Mapped[str] = mapped_column(String(150), default="Regional Director (Central Region)")
    status: Mapped[str] = mapped_column(String(50), default="Escalated to Regional Director", index=True)

    created_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    assigned_to_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    application: Mapped["Application"] = relationship("Application", back_populates="escalations")
    created_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[created_by_id])
    assigned_to: Mapped[Optional["User"]] = relationship("User", foreign_keys=[assigned_to_id])


class SeniorDecision(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "senior_decisions"

    public_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)  # e.g. DEC-2026-105
    application_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False
    )
    decision_type: Mapped[str] = mapped_column(String(100), nullable=False)  # final_decision, recommendation, return_review
    outcome: Mapped[str] = mapped_column(String(100), nullable=False)  # Approved, Provisional Approval, Rejected, Returned
    rationale: Mapped[str] = mapped_column(Text, nullable=False)
    conditions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    target_board_meeting: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)

    senior_officer_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    decision_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    application: Mapped["Application"] = relationship("Application", back_populates="senior_decisions")
    senior_officer: Mapped[Optional["User"]] = relationship("User", foreign_keys=[senior_officer_id])
