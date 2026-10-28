import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class RuleDefinitionOut(BaseModel):
    id: uuid.UUID
    rule_code: str
    version: str
    category: str
    description: str
    config_json: Dict[str, Any]
    severity: str
    is_enabled: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class RuleResultOut(BaseModel):
    id: uuid.UUID
    application_id: uuid.UUID
    document_id: Optional[uuid.UUID] = None
    rule_id: uuid.UUID
    rule_code: Optional[str] = None
    rule_category: Optional[str] = None
    result_status: str
    observed_value: Optional[Dict[str, Any]] = None
    expected_value: Optional[Dict[str, Any]] = None
    explanation: str
    created_at: datetime

    model_config = {"from_attributes": True}


class RuleEvaluationResponse(BaseModel):
    application_id: uuid.UUID
    public_id: str
    preliminary_outcome: str
    passed_rules_count: int
    failed_rules_count: int
    total_rules_count: int
    results: List[RuleResultOut]


class DeduplicationScanResponse(BaseModel):
    application_id: uuid.UUID
    status: str
    collision_count: int
    collisions: List[Dict[str, Any]] = []
    escalation_id: Optional[str] = None
    message: str
