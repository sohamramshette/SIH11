"""
Application Lifecycle & Scrutiny Workflow API Router.
Handles application filing, timeline milestones, officer clarification queries,
senior escalations, and statutory board decisions under AICTE Act 1987.
"""
import uuid
import random
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import (
    Application,
    ApplicationTimeline,
    ClarificationQuery,
    ClarificationResponse,
    Escalation,
    SeniorDecision,
    AuditLedger,
    User,
    Institution,
)
from app.schemas.application import (
    ApplicationCreate,
    ApplicationSummaryOut,
    TimelineOut,
    ClarificationQueryCreate,
    ClarificationQueryOut,
    ClarificationResponseCreate,
    ClarificationResponseOut,
    EscalationCreate,
    EscalationOut,
    SeniorDecisionCreate,
    SeniorDecisionOut,
)
from app.core.permissions import get_current_user
from app.utils.pdf_processor import calculate_sha256, generate_audit_record_hash
from app.services.audit import create_audit_ledger_entry

router = APIRouter(tags=["Application Management & Review Workflow"])


def _to_summary_out(app: Application) -> ApplicationSummaryOut:
    return ApplicationSummaryOut(
        id=app.id,
        public_id=app.public_id,
        institution_id=app.institution_id,
        institution_name=app.institution.institution_name if app.institution else "Technical Institute",
        application_type=app.application_type,
        academic_year=app.academic_year,
        stream=app.stream,
        current_status=app.current_status,
        status_severity=app.status_severity,
        priority=app.priority,
        priority_severity=app.priority_severity,
        preliminary_outcome=app.preliminary_outcome,
        proposed_course=app.proposed_course,
        proposed_intake=app.proposed_intake,
        submission_date=app.submission_date,
        documents_count=len(app.documents) if app.documents else 0,
        findings_count=len(app.findings) if app.findings else 0,
    )


@router.get("/applications", response_model=List[ApplicationSummaryOut])
def list_applications(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority_filter: Optional[str] = Query(None, alias="priority"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List applications according to user role and optional status/priority filters."""
    query = db.query(Application)

    # College users only see their own institution's applications
    if current_user.role == "college" and current_user.institution_id:
        query = query.filter(Application.institution_id == current_user.institution_id)

    if status_filter:
        query = query.filter(Application.current_status.ilike(f"%{status_filter}%"))
    if priority_filter:
        query = query.filter(Application.priority.ilike(f"%{priority_filter}%"))

    apps = query.order_by(Application.created_at.desc()).all()
    return [_to_summary_out(a) for a in apps]


@router.get("/applications/{app_id}", response_model=ApplicationSummaryOut)
def get_application_details(
    app_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve summary metadata and counts for a specific application."""
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID '{app_id}' not found.",
        )
    return _to_summary_out(app_obj)


@router.post("/applications", response_model=ApplicationSummaryOut, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a new institutional application dossier."""
    inst_id = current_user.institution_id
    if not inst_id:
        # Fall back to first institution for admin or test filing
        inst = db.query(Institution).first()
        inst_id = inst.id if inst else uuid.uuid4()

    app_id = uuid.uuid4()
    rand_code = random.randint(1000, 9999)
    public_id = f"APP-2026-ENG-{rand_code}"

    app_obj = Application(
        id=app_id,
        public_id=public_id,
        institution_id=inst_id,
        application_type=payload.application_type,
        academic_year=payload.academic_year,
        stream=payload.stream,
        proposed_course=payload.proposed_course,
        proposed_intake=payload.proposed_intake,
        metadata_json=payload.metadata_json,
        current_status="Under Review",
        status_severity="info",
        priority="Normal",
        priority_severity="info",
        preliminary_outcome="In Scrutiny Queue",
        submission_date=datetime.now(timezone.utc),
    )
    db.add(app_obj)

    # Initial timeline entry
    timeline_entry = ApplicationTimeline(
        id=uuid.uuid4(),
        application_id=app_id,
        actor_user_id=current_user.id,
        actor_name=current_user.full_name,
        stage="Application Submitted",
        details=f"Dossier filed for '{payload.application_type}' ({payload.academic_year}). Intake: {payload.proposed_intake}.",
    )
    db.add(timeline_entry)

    # Immutable Audit Block
    payload_hash = calculate_sha256(f"{public_id}:{payload.application_type}:{current_user.id}".encode())
    create_audit_ledger_entry(
        db=db,
        action="Application Filing",
        entity_type="application",
        entity_id=public_id,
        payload_hash=payload_hash,
        actor_name=current_user.full_name,
        actor_user_id=current_user.id,
        application_id=app_id,
        details=f"Application {public_id} submitted by {current_user.full_name}.",
    )

    db.commit()
    db.refresh(app_obj)
    return _to_summary_out(app_obj)


@router.get("/applications/{app_id}/timeline", response_model=List[TimelineOut])
def get_application_timeline(
    app_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve chronological audit trail of scrutiny milestones for an application."""
    events = (
        db.query(ApplicationTimeline)
        .filter(ApplicationTimeline.application_id == app_id)
        .order_by(ApplicationTimeline.created_at.desc())
        .all()
    )
    return events


# -------------------------------------------------------------
# Clarification Queries & Responses
# -------------------------------------------------------------

@router.post("/applications/{app_id}/queries", response_model=ClarificationQueryOut, status_code=status.HTTP_201_CREATED)
def issue_clarification_query(
    app_id: uuid.UUID,
    payload: ClarificationQueryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Officer issues a statutory clarification query to the institution."""
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found.")

    query_id = uuid.uuid4()
    public_id = f"CQ-{random.randint(100, 999)}"
    due_at = datetime.now(timezone.utc) + timedelta(days=payload.due_days)

    query_obj = ClarificationQuery(
        id=query_id,
        public_id=public_id,
        application_id=app_id,
        category=payload.category,
        subject=payload.subject,
        description=payload.description,
        response_required=payload.response_required,
        status="Pending College Response",
        issued_by_id=current_user.id,
        due_at=due_at,
    )
    db.add(query_obj)

    app_obj.current_status = "Clarification Pending"
    app_obj.status_severity = "warning"

    timeline_entry = ApplicationTimeline(
        id=uuid.uuid4(),
        application_id=app_id,
        actor_user_id=current_user.id,
        actor_name=current_user.full_name,
        stage="Clarification Query Issued",
        details=f"Query {public_id}: '{payload.subject}'. Due by {due_at.strftime('%Y-%m-%d')}.",
    )
    db.add(timeline_entry)

    payload_hash = calculate_sha256(f"{public_id}:{payload.subject}".encode())
    create_audit_ledger_entry(
        db=db,
        action="Clarification Query Issued",
        entity_type="clarification_query",
        entity_id=public_id,
        payload_hash=payload_hash,
        actor_name=current_user.full_name,
        actor_user_id=current_user.id,
        application_id=app_id,
        details=f"Officer {current_user.full_name} issued query {public_id}.",
    )

    db.commit()
    db.refresh(query_obj)

    return ClarificationQueryOut(
        id=query_obj.id,
        public_id=query_obj.public_id,
        application_id=query_obj.application_id,
        category=query_obj.category,
        subject=query_obj.subject,
        description=query_obj.description,
        response_required=query_obj.response_required,
        status=query_obj.status,
        issued_by_name=current_user.full_name,
        due_at=query_obj.due_at,
        created_at=query_obj.created_at,
        responses=[],
    )


@router.get("/applications/{app_id}/queries", response_model=List[ClarificationQueryOut])
def list_application_queries(
    app_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all queries and college responses for an application."""
    queries = (
        db.query(ClarificationQuery)
        .filter(ClarificationQuery.application_id == app_id)
        .order_by(ClarificationQuery.created_at.desc())
        .all()
    )
    outs = []
    for q in queries:
        resp_outs = []
        for r in q.responses:
            resp_outs.append(
                ClarificationResponseOut(
                    id=r.id,
                    query_id=r.query_id,
                    response_text=r.response_text,
                    submitted_by_name=r.submitted_by.full_name if r.submitted_by else "College Representative",
                    attachment_document_id=r.attachment_document_id,
                    submitted_at=r.submitted_at,
                )
            )
        outs.append(
            ClarificationQueryOut(
                id=q.id,
                public_id=q.public_id,
                application_id=q.application_id,
                category=q.category,
                subject=q.subject,
                description=q.description,
                response_required=q.response_required,
                status=q.status,
                issued_by_name=q.issued_by.full_name if q.issued_by else "Scrutiny Officer",
                due_at=q.due_at,
                created_at=q.created_at,
                responses=resp_outs,
            )
        )
    return outs


@router.post("/queries/{query_id}/respond", response_model=ClarificationResponseOut)
def respond_to_clarification_query(
    query_id: uuid.UUID,
    payload: ClarificationResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """College representative submits formal clarification rebuttal."""
    query_obj = db.query(ClarificationQuery).filter(ClarificationQuery.id == query_id).first()
    if not query_obj:
        raise HTTPException(status_code=404, detail="Query not found.")

    resp_id = uuid.uuid4()
    resp_obj = ClarificationResponse(
        id=resp_id,
        query_id=query_id,
        response_text=payload.response_text,
        submitted_by_id=current_user.id,
        attachment_document_id=payload.attachment_document_id,
        submitted_at=datetime.now(timezone.utc),
    )
    db.add(resp_obj)

    query_obj.status = "Response Submitted"
    app_obj = query_obj.application
    if app_obj:
        app_obj.current_status = "Under Review"
        app_obj.status_severity = "info"

        timeline_entry = ApplicationTimeline(
            id=uuid.uuid4(),
            application_id=app_obj.id,
            actor_user_id=current_user.id,
            actor_name=current_user.full_name,
            stage="Clarification Response Submitted",
            details=f"College responded to query {query_obj.public_id}: '{payload.response_text[:80]}...'",
        )
        db.add(timeline_entry)

    db.commit()
    db.refresh(resp_obj)

    return ClarificationResponseOut(
        id=resp_obj.id,
        query_id=resp_obj.query_id,
        response_text=resp_obj.response_text,
        submitted_by_name=current_user.full_name,
        attachment_document_id=resp_obj.attachment_document_id,
        submitted_at=resp_obj.submitted_at,
    )


# -------------------------------------------------------------
# Senior Escalations & Decisions
# -------------------------------------------------------------

@router.post("/applications/{app_id}/escalate", response_model=EscalationOut, status_code=status.HTTP_201_CREATED)
def escalate_application(
    app_id: uuid.UUID,
    payload: EscalationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Officer escalates case to Senior Regional Director."""
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found.")

    esc_id = uuid.uuid4()
    public_id = f"ESC-{datetime.now().year}-{random.randint(100, 999)}"

    esc_obj = Escalation(
        id=esc_id,
        public_id=public_id,
        application_id=app_id,
        reason=payload.reason,
        evidence_summary=payload.evidence_summary,
        recommended_next_step=payload.recommended_next_step,
        senior_authority=payload.senior_authority,
        status="Escalated to Regional Director",
        created_by_id=current_user.id,
    )
    db.add(esc_obj)

    app_obj.current_status = "Escalated"
    app_obj.status_severity = "danger"
    app_obj.priority = "High"
    app_obj.priority_severity = "danger"

    timeline_entry = ApplicationTimeline(
        id=uuid.uuid4(),
        application_id=app_id,
        actor_user_id=current_user.id,
        actor_name=current_user.full_name,
        stage="Statutory Escalation",
        details=f"Case escalated to {payload.senior_authority} ({public_id}): '{payload.reason}'.",
    )
    db.add(timeline_entry)

    payload_hash = calculate_sha256(f"{public_id}:{payload.reason}".encode())
    create_audit_ledger_entry(
        db=db,
        action="Senior Escalation",
        entity_type="escalation",
        entity_id=public_id,
        payload_hash=payload_hash,
        actor_name=current_user.full_name,
        actor_user_id=current_user.id,
        application_id=app_id,
        details=f"Escalated {public_id} by {current_user.full_name}.",
    )

    db.commit()
    db.refresh(esc_obj)

    return EscalationOut(
        id=esc_obj.id,
        public_id=esc_obj.public_id,
        application_id=esc_obj.application_id,
        reason=esc_obj.reason,
        evidence_summary=esc_obj.evidence_summary,
        recommended_next_step=esc_obj.recommended_next_step,
        senior_authority=esc_obj.senior_authority,
        status=esc_obj.status,
        created_by_name=current_user.full_name,
        created_at=esc_obj.created_at,
    )


@router.get("/applications/{app_id}/escalations", response_model=List[EscalationOut])
def list_application_escalations(
    app_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all escalations recorded for an application."""
    escalations = (
        db.query(Escalation)
        .filter(Escalation.application_id == app_id)
        .order_by(Escalation.created_at.desc())
        .all()
    )
    outs = []
    for e in escalations:
        outs.append(
            EscalationOut(
                id=e.id,
                public_id=e.public_id,
                application_id=e.application_id,
                reason=e.reason,
                evidence_summary=e.evidence_summary,
                recommended_next_step=e.recommended_next_step,
                senior_authority=e.senior_authority,
                status=e.status,
                created_by_name=e.created_by.full_name if e.created_by else "Verification Officer",
                created_at=e.created_at,
            )
        )
    return outs


@router.post("/applications/{app_id}/decisions", response_model=SeniorDecisionOut, status_code=status.HTTP_201_CREATED)
def record_senior_decision(
    app_id: uuid.UUID,
    payload: SeniorDecisionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Senior Regional Director records official statutory determination."""
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found.")

    dec_id = uuid.uuid4()
    public_id = f"DEC-{datetime.now().year}-{random.randint(100, 999)}"

    dec_obj = SeniorDecision(
        id=dec_id,
        public_id=public_id,
        application_id=app_id,
        decision_type=payload.decision_type,
        outcome=payload.outcome,
        rationale=payload.rationale,
        conditions=payload.conditions,
        target_board_meeting=payload.target_board_meeting,
        senior_officer_id=current_user.id,
        decision_date=datetime.now(timezone.utc),
    )
    db.add(dec_obj)

    # Update application status based on statutory determination
    app_obj.current_status = payload.outcome
    if payload.outcome == "Approved":
        app_obj.status_severity = "success"
        app_obj.preliminary_outcome = "Statutory Approval Granted"
    elif payload.outcome == "Provisional Approval":
        app_obj.status_severity = "warning"
        app_obj.preliminary_outcome = "Provisional Clearance with Conditions"
    elif payload.outcome == "Rejected":
        app_obj.status_severity = "danger"
        app_obj.preliminary_outcome = "Application Disapproved"
    elif payload.outcome == "Returned":
        app_obj.status_severity = "warning"
        app_obj.preliminary_outcome = "Returned for Rescrutiny"

    timeline_entry = ApplicationTimeline(
        id=uuid.uuid4(),
        application_id=app_id,
        actor_user_id=current_user.id,
        actor_name=current_user.full_name,
        stage=f"Statutory Determination: {payload.outcome}",
        details=f"Decision {public_id}: {payload.outcome}. Rationale: '{payload.rationale[:80]}...'",
    )
    db.add(timeline_entry)

    payload_hash = calculate_sha256(f"{public_id}:{payload.outcome}:{payload.rationale}".encode())
    create_audit_ledger_entry(
        db=db,
        action="Senior Determination",
        entity_type="senior_decision",
        entity_id=public_id,
        payload_hash=payload_hash,
        actor_name=current_user.full_name,
        actor_user_id=current_user.id,
        application_id=app_id,
        details=f"Director {current_user.full_name} recorded {payload.outcome} for application {app_obj.public_id}.",
    )

    db.commit()
    db.refresh(dec_obj)

    return SeniorDecisionOut(
        id=dec_obj.id,
        public_id=dec_obj.public_id,
        application_id=dec_obj.application_id,
        decision_type=dec_obj.decision_type,
        outcome=dec_obj.outcome,
        rationale=dec_obj.rationale,
        conditions=dec_obj.conditions,
        target_board_meeting=dec_obj.target_board_meeting,
        senior_officer_name=current_user.full_name,
        decision_date=dec_obj.decision_date,
    )


@router.get("/applications/{app_id}/decisions", response_model=List[SeniorDecisionOut])
def list_application_decisions(
    app_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all statutory decisions recorded for an application."""
    decisions = (
        db.query(SeniorDecision)
        .filter(SeniorDecision.application_id == app_id)
        .order_by(SeniorDecision.created_at.desc())
        .all()
    )
    outs = []
    for d in decisions:
        outs.append(
            SeniorDecisionOut(
                id=d.id,
                public_id=d.public_id,
                application_id=d.application_id,
                decision_type=d.decision_type,
                outcome=d.outcome,
                rationale=d.rationale,
                conditions=d.conditions,
                target_board_meeting=d.target_board_meeting,
                senior_officer_name=d.senior_officer.full_name if d.senior_officer else "Regional Director",
                decision_date=d.decision_date,
            )
        )
    return outs
