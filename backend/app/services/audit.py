"""
Cryptographic Audit Ledger Service.
Provides uniform cryptographic chaining and blockchain verification.
"""
import uuid
import logging
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc

from app.models.audit import AuditLedger
from app.utils.pdf_processor import generate_audit_record_hash

logger = logging.getLogger(__name__)


def create_audit_ledger_entry(
    db: Session,
    action: str,
    entity_type: str,
    entity_id: str,
    payload_hash: str,
    actor_name: str,
    application_id: Optional[uuid.UUID] = None,
    actor_user_id: Optional[uuid.UUID] = None,
    desk: Optional[str] = None,
    details: Optional[str] = None,
) -> AuditLedger:
    """
    Appends a new cryptographically chained block to the audit ledger.
    Guarantees sequence chaining to the head record_hash.
    """
    latest = db.query(AuditLedger).order_by(desc(AuditLedger.sequence_no)).first()
    prev_hash = latest.record_hash if latest else "0000000000000000000000000000000000000000000000000000000000000000"

    audit_id = uuid.uuid4()
    rec_hash = generate_audit_record_hash(
        audit_id=audit_id,
        action=action,
        entity_id=str(entity_id),
        payload_hash=payload_hash,
        previous_hash=prev_hash,
    )

    entry = AuditLedger(
        id=audit_id,
        application_id=application_id,
        actor_user_id=actor_user_id,
        actor_name=actor_name,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        payload_hash=payload_hash,
        previous_hash=prev_hash,
        record_hash=rec_hash,
        desk=desk,
        details=details,
    )
    db.add(entry)
    return entry


def rechain_audit_ledger(db: Session) -> int:
    """
    Re-establishes seamless cryptographic chaining for all blocks in the database.
    Useful for initializing or recovering chain consistency.
    """
    blocks = db.query(AuditLedger).order_by(asc(AuditLedger.sequence_no)).all()
    prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"

    for block in blocks:
        block.previous_hash = prev_hash
        block.record_hash = generate_audit_record_hash(
            audit_id=block.id,
            action=block.action,
            entity_id=str(block.entity_id),
            payload_hash=block.payload_hash,
            previous_hash=prev_hash,
        )
        prev_hash = block.record_hash

    db.commit()
    logger.info(f"Re-chained {len(blocks)} audit ledger blocks successfully.")
    return len(blocks)
