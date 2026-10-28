import uuid
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from app.db.base import Base
from app.models.base import UUIDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.application import Application
    from app.models.document import Document


class RuleDefinition(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "rule_definitions"

    rule_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)  # e.g. APH-LAND-01
    version: Mapped[str] = mapped_column(String(20), default="2026-27")
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # Land, Built-up Area, SFR, Cadre, Safety
    description: Mapped[str] = mapped_column(Text, nullable=False)
    config_json: Mapped[dict] = mapped_column(JSONB, nullable=False)  # {"min_acres": 7.5, "metro_min": 2.5}
    severity: Mapped[str] = mapped_column(String(20), default="danger")  # info, warning, danger
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    results: Mapped[list["RuleResult"]] = relationship("RuleResult", back_populates="rule_definition", cascade="all, delete-orphan")


class RuleResult(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "rule_results"

    application_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False
    )
    document_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True
    )
    rule_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("rule_definitions.id", ondelete="CASCADE"), nullable=False
    )

    result_status: Mapped[str] = mapped_column(String(50), nullable=False)  # Passed, Review Required, Failed
    observed_value: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    expected_value: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)

    # Relationships
    application: Mapped["Application"] = relationship("Application", back_populates="rule_results")
    rule_definition: Mapped["RuleDefinition"] = relationship("RuleDefinition", back_populates="results")


class Finding(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "findings"

    application_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False
    )
    document_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True
    )
    page_number: Mapped[Optional[int]] = mapped_column(nullable=True)
    
    finding_type: Mapped[str] = mapped_column(String(100), nullable=False)  # discrepancy, tampering, ratio_violation, expired_doc
    severity: Mapped[str] = mapped_column(String(20), default="warning")  # info, warning, danger
    status: Mapped[str] = mapped_column(String(50), default="active")  # active, reviewed, resolved, dismissed
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)  # Bounding box, matched records, etc.
    
    rule_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("rule_definitions.id", ondelete="SET NULL"), nullable=True
    )
    reviewed_by: Mapped[Optional[uuid.UUID]] = mapped_column(PG_UUID(as_uuid=True), nullable=True)
    review_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    application: Mapped["Application"] = relationship("Application", back_populates="findings")
    document: Mapped[Optional["Document"]] = relationship("Document", back_populates="findings")
