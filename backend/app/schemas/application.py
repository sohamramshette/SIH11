import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ApplicationCreate(BaseModel):
    application_type: str = Field("Extension of Approval (EoA)", description="EoA, New Course, Intake Variation")
    academic_year: str = Field("2026-27", description="Academic Year")
    stream: str = Field("Engineering & Technology", description="Discipline")
    proposed_course: Optional[str] = Field(None, description="Course name (e.g., B.Tech Artificial Intelligence)")
    proposed_intake: Optional[int] = Field(240, description="Proposed student intake capacity")
    metadata_json: Optional[Dict[str, Any]] = None


class ApplicationSummaryOut(BaseModel):
    id: uuid.UUID
    public_id: str
    institution_id: uuid.UUID
    institution_name: str
    application_type: str
    academic_year: str
    stream: str
    current_status: str
    status_severity: str
    priority: str
    priority_severity: str
    preliminary_outcome: str
    proposed_course: Optional[str] = None
    proposed_intake: Optional[int] = None
    submission_date: datetime
    documents_count: int = 0
    findings_count: int = 0

    model_config = {"from_attributes": True}


class TimelineOut(BaseModel):
    id: uuid.UUID
    application_id: uuid.UUID
    actor_name: str
    stage: str
    details: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ClarificationResponseOut(BaseModel):
    id: uuid.UUID
    query_id: uuid.UUID
    response_text: str
    submitted_by_name: Optional[str] = None
    attachment_document_id: Optional[uuid.UUID] = None
    submitted_at: datetime

    model_config = {"from_attributes": True}


class ClarificationQueryOut(BaseModel):
    id: uuid.UUID
    public_id: str
    application_id: uuid.UUID
    category: str
    subject: str
    description: str
    response_required: str
    status: str
    issued_by_name: Optional[str] = None
    due_at: Optional[datetime] = None
    created_at: datetime
    responses: List[ClarificationResponseOut] = []

    model_config = {"from_attributes": True}


class ClarificationQueryCreate(BaseModel):
    category: str = Field(..., description="Document / Rule category")
    subject: str = Field(..., min_length=3, description="Query subject line")
    description: str = Field(..., min_length=10, description="Deficiency description")
    response_required: str = Field(..., min_length=5, description="Expected rectification from college")
    due_days: int = Field(7, ge=1, le=30, description="Days to respond")


class ClarificationResponseCreate(BaseModel):
    response_text: str = Field(..., min_length=5, description="Rebuttal explanation from college")
    attachment_document_id: Optional[uuid.UUID] = None


class EscalationCreate(BaseModel):
    reason: str = Field(..., min_length=5, description="Grounds for senior escalation")
    evidence_summary: str = Field(..., min_length=10, description="Summary of forensic/rule evidence")
    recommended_next_step: str = Field(..., min_length=5, description="Recommended statutory direction")
    senior_authority: str = Field("Regional Director (Central Region)", description="Designated Directorate desk")


class EscalationOut(BaseModel):
    id: uuid.UUID
    public_id: str
    application_id: uuid.UUID
    reason: str
    evidence_summary: str
    recommended_next_step: str
    senior_authority: str
    status: str
    created_by_name: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class SeniorDecisionCreate(BaseModel):
    decision_type: str = Field("final_decision", description="final_decision, recommendation, return_review")
    outcome: str = Field(..., description="Approved, Provisional Approval, Rejected, Returned")
    rationale: str = Field(..., min_length=10, description="Statutory justification and board basis")
    conditions: Optional[str] = None
    target_board_meeting: Optional[str] = Field("Next Central Regional Committee Meeting")


class SeniorDecisionOut(BaseModel):
    id: uuid.UUID
    public_id: str
    application_id: uuid.UUID
    decision_type: str
    outcome: str
    rationale: str
    conditions: Optional[str] = None
    target_board_meeting: Optional[str] = None
    senior_officer_name: Optional[str] = None
    decision_date: datetime

    model_config = {"from_attributes": True}
