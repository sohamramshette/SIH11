import uuid
from typing import Optional
from sqlalchemy import String, Text, BigInteger, Identity
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.db.base import Base
from app.models.base import UUIDMixin, TimestampMixin


class AuditLedger(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "audit_ledger"

    sequence_no: Mapped[int] = mapped_column(
        BigInteger, Identity(start=1, increment=1), index=True
    )
    application_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), index=True, nullable=True
    )
    actor_user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), nullable=True
    )
    actor_name: Mapped[str] = mapped_column(String(255), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_id: Mapped[str] = mapped_column(String(100), nullable=False)
    
    payload_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    previous_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    record_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    
    desk: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
