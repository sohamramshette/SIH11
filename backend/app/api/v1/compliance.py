"""
Regulatory Compliance & Deduplication API Endpoints.
Exposes evaluation of AICTE Approval Process Handbook (APH 2026-27) rules,
cross-institutional faculty deduplication scans, and statutory rule definitions.
"""
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import (
    Application,
    RuleDefinition,
    RuleResult,
    User,
)
from app.schemas.compliance import (
    RuleDefinitionOut,
    RuleResultOut,
    RuleEvaluationResponse,
    DeduplicationScanResponse,
)
from app.core.permissions import get_current_user
from app.compliance.rule_engine import compliance_rule_engine
from app.compliance.deduplication_engine import deduplication_engine

router = APIRouter(tags=["Compliance & Regulatory Rules"])


@router.get("/rules", response_model=List[RuleDefinitionOut])
def list_rule_definitions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all statutory AICTE APH 2026-27 rule definitions and threshold parameters."""
    rules = (
        db.query(RuleDefinition)
        .order_by(RuleDefinition.rule_code.asc())
        .all()
    )
    return rules


@router.get("/applications/{app_id}/rules", response_model=List[RuleResultOut])
def get_application_rule_results(
    app_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve evaluated APH 2026-27 compliance rule results for a specific application."""
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID '{app_id}' not found.",
        )

    results = (
        db.query(RuleResult)
        .filter(RuleResult.application_id == app_id)
        .order_by(RuleResult.created_at.asc())
        .all()
    )

    # Attach rule_code and category for UI consumption
    outs = []
    for r in results:
        outs.append(
            RuleResultOut(
                id=r.id,
                application_id=r.application_id,
                document_id=r.document_id,
                rule_id=r.rule_id,
                rule_code=r.rule_definition.rule_code if r.rule_definition else None,
                rule_category=r.rule_definition.category if r.rule_definition else None,
                result_status=r.result_status,
                observed_value=r.observed_value,
                expected_value=r.expected_value,
                explanation=r.explanation,
                created_at=r.created_at,
            )
        )
    return outs


@router.post("/applications/{app_id}/rules/evaluate", response_model=RuleEvaluationResponse)
def evaluate_application_rules(
    app_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Triggers on-demand evaluation of all statutory APH 2026-27 rules and
    cross-institutional faculty deduplication for an application.
    """
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID '{app_id}' not found.",
        )

    results = compliance_rule_engine.evaluate_application(db, app_id)

    passed_count = sum(1 for r in results if r.result_status == "Passed")
    failed_count = sum(1 for r in results if r.result_status in ("Failed", "Review Required"))

    outs = []
    for r in results:
        outs.append(
            RuleResultOut(
                id=r.id,
                application_id=r.application_id,
                document_id=r.document_id,
                rule_id=r.rule_id,
                rule_code=r.rule_definition.rule_code if r.rule_definition else None,
                rule_category=r.rule_definition.category if r.rule_definition else None,
                result_status=r.result_status,
                observed_value=r.observed_value,
                expected_value=r.expected_value,
                explanation=r.explanation,
                created_at=r.created_at,
            )
        )

    return RuleEvaluationResponse(
        application_id=app_obj.id,
        public_id=app_obj.public_id,
        preliminary_outcome=app_obj.preliminary_outcome,
        passed_rules_count=passed_count,
        failed_rules_count=failed_count,
        total_rules_count=len(results),
        results=outs,
    )


@router.get("/applications/{app_id}/deduplication", response_model=DeduplicationScanResponse)
def get_deduplication_scan(
    app_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Performs a live cross-institutional faculty deduplication scan.
    Identifies shared PAN or Aadhaar identities across institutions.
    """
    app_obj = db.query(Application).filter(Application.id == app_id).first()
    if not app_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID '{app_id}' not found.",
        )

    scan_res = deduplication_engine.scan_application_faculty(db, app_obj)

    return DeduplicationScanResponse(
        application_id=app_obj.id,
        status=scan_res["status"],
        collision_count=scan_res["collision_count"],
        collisions=scan_res["collisions"],
        escalation_id=scan_res.get("escalation_id"),
        message=scan_res["message"],
    )
