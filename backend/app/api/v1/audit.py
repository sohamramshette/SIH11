"""
Cryptographic Audit Ledger API Endpoints.
Provides immutable audit trail queries and cryptographic hash-chain verification.
"""
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc

from app.db.session import get_db
from app.models.audit import AuditLedger
from app.models.user import User
from app.core.permissions import get_current_user
from app.schemas.audit import (
    AuditBlockResponse,
    AuditTrailResponse,
    AuditChainVerificationResponse,
)
from app.utils.pdf_processor import generate_audit_record_hash

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/audit", tags=["Cryptographic Audit Ledger"])


@router.get("/trail", response_model=AuditTrailResponse)
async def get_audit_trail(
    application_id: Optional[uuid.UUID] = None,
    action: Optional[str] = None,
    limit: int = Query(default=50, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve paginated audit ledger events ordered chronologically.
    Any authenticated user can inspect ledger events.
    """
    query = db.query(AuditLedger)

    if application_id:
        query = query.filter(AuditLedger.application_id == application_id)
    if action:
        query = query.filter(AuditLedger.action.ilike(f"%{action}%"))

    total = query.count()
    items = (
        query.order_by(desc(AuditLedger.created_at), desc(AuditLedger.sequence_no))
        .offset(offset)
        .limit(limit)
        .all()
    )

    return AuditTrailResponse(total=total, items=items)


@router.get("/applications/{app_id}", response_model=AuditTrailResponse)
async def get_application_audit_trail(
    app_id: uuid.UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve audit trail specific to an application dossier.
    """
    query = db.query(AuditLedger).filter(AuditLedger.application_id == app_id)
    total = query.count()
    items = (
        query.order_by(asc(AuditLedger.sequence_no))
        .offset(offset)
        .limit(limit)
        .all()
    )
    return AuditTrailResponse(total=total, items=items)


@router.get("/verify-chain", response_model=AuditChainVerificationResponse)
async def verify_audit_ledger_chain(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Cryptographically verifies the entire Audit Ledger hash chain from the Genesis block to the head.
    Proves that no audit blocks have been inserted, modified, or truncated.
    """
    blocks = db.query(AuditLedger).order_by(asc(AuditLedger.sequence_no)).all()

    if not blocks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No audit blocks found in ledger.",
        )

    prev_record_hash = "0000000000000000000000000000000000000000000000000000000000000000"

    for idx, block in enumerate(blocks):
        # 1. Verify chaining to previous block
        if block.previous_hash != prev_record_hash:
            logger.error(
                f"Ledger Chain Broken at block #{block.sequence_no} (id={block.id}). "
                f"Expected previous_hash={prev_record_hash}, found={block.previous_hash}"
            )
            return AuditChainVerificationResponse(
                is_valid=False,
                total_blocks=len(blocks),
                genesis_block_hash=blocks[0].record_hash,
                latest_block_hash=blocks[-1].record_hash,
                verified_at=datetime.now(timezone.utc),
                corrupted_sequence=block.sequence_no,
                corrupted_id=str(block.id),
                message=(
                    f"Cryptographic chain broken at sequence #{block.sequence_no}. "
                    f"Previous hash mismatch."
                ),
            )

        # 2. Verify self record_hash computation
        expected_hash = generate_audit_record_hash(
            audit_id=block.id,
            action=block.action,
            entity_id=block.entity_id,
            payload_hash=block.payload_hash,
            previous_hash=block.previous_hash,
        )

        if block.record_hash != expected_hash:
            logger.error(
                f"Ledger Integrity Compromised at block #{block.sequence_no} (id={block.id}). "
                f"Expected record_hash={expected_hash}, stored={block.record_hash}"
            )
            return AuditChainVerificationResponse(
                is_valid=False,
                total_blocks=len(blocks),
                genesis_block_hash=blocks[0].record_hash,
                latest_block_hash=blocks[-1].record_hash,
                verified_at=datetime.now(timezone.utc),
                corrupted_sequence=block.sequence_no,
                corrupted_id=str(block.id),
                message=(
                    f"Record integrity violated at sequence #{block.sequence_no}. "
                    f"Payload or metadata altered."
                ),
            )

        prev_record_hash = block.record_hash

    return AuditChainVerificationResponse(
        is_valid=True,
        total_blocks=len(blocks),
        genesis_block_hash=blocks[0].record_hash,
        latest_block_hash=blocks[-1].record_hash,
        verified_at=datetime.now(timezone.utc),
        corrupted_sequence=None,
        corrupted_id=None,
        message=f"All {len(blocks)} cryptographic audit ledger blocks successfully verified from Genesis.",
    )
