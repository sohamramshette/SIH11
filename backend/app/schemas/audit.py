"""
Pydantic schemas for Cryptographic Audit Ledger & Executive Compliance Reports.
"""
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class AuditBlockResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    sequence_no: int
    application_id: Optional[uuid.UUID] = None
    actor_user_id: Optional[uuid.UUID] = None
    actor_name: str
    action: str
    entity_type: str
    entity_id: str
    payload_hash: str
    previous_hash: str
    record_hash: str
    desk: Optional[str] = None
    details: Optional[str] = None
    created_at: datetime


class AuditTrailResponse(BaseModel):
    total: int
    items: List[AuditBlockResponse]


class AuditChainVerificationResponse(BaseModel):
    is_valid: bool
    total_blocks: int
    genesis_block_hash: str
    latest_block_hash: str
    verified_at: datetime
    corrupted_sequence: Optional[int] = None
    corrupted_id: Optional[str] = None
    message: str


class ComplianceSummaryMetrics(BaseModel):
    total_institutions: int
    total_applications: int
    by_status: Dict[str, int]
    by_outcome: Dict[str, int]
    by_region: Dict[str, int]
    golden_5_coverage: Dict[str, int]
    ghost_faculty_collisions: int
    tamper_findings_count: int
    generated_at: datetime
