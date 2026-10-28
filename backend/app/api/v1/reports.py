"""
Executive Compliance Reporting & Dynamic CSV Export API.
Streams regulatory audits, institutional statistics, and downloadable spreadsheets.
"""
import csv
import io
import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, Query, Response, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.models.institution import Institution
from app.models.application import Application, ApplicationTimeline
from app.models.document import Document
from app.models.compliance import Finding
from app.models.user import User
from app.core.permissions import get_current_user
from app.schemas.audit import ComplianceSummaryMetrics

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reports", tags=["Compliance Reports & Analytics"])


@router.get("/compliance", response_model=ComplianceSummaryMetrics)
async def get_compliance_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieve real-time regulatory compliance aggregates across all applications.
    """
    total_institutions = db.query(Institution).count()
    total_applications = db.query(Application).count()

    # Breakdown by current status
    status_rows = (
        db.query(Application.current_status, func.count(Application.id))
        .group_by(Application.current_status)
        .all()
    )
    by_status = {status: count for status, count in status_rows}

    # Breakdown by preliminary outcome
    outcome_rows = (
        db.query(Application.preliminary_outcome, func.count(Application.id))
        .group_by(Application.preliminary_outcome)
        .all()
    )
    by_outcome = {outcome: count for outcome, count in outcome_rows}

    # Breakdown by region (from Institution)
    region_rows = (
        db.query(Institution.region, func.count(Application.id))
        .join(Application, Institution.id == Application.institution_id)
        .group_by(Institution.region)
        .all()
    )
    by_region = {region: count for region, count in region_rows}

    # Golden 5 Coverage Breakdown
    doc_cat_rows = (
        db.query(Document.category, func.count(Document.id))
        .group_by(Document.category)
        .all()
    )
    golden_5_coverage = {cat: count for cat, count in doc_cat_rows}

    # Ghost faculty collisions (findings where finding_type='duplicate_faculty' or title contains 'faculty')
    ghost_collisions = (
        db.query(Finding)
        .filter((Finding.finding_type == "duplicate_faculty") | (Finding.title.ilike("%Faculty%")))
        .count()
    )

    # Total tamper findings
    tamper_count = (
        db.query(Finding)
        .filter(Finding.severity.in_(["danger", "warning", "high", "critical"]))
        .count()
    )

    return ComplianceSummaryMetrics(
        total_institutions=total_institutions,
        total_applications=total_applications,
        by_status=by_status,
        by_outcome=by_outcome,
        by_region=by_region,
        golden_5_coverage=golden_5_coverage,
        ghost_faculty_collisions=ghost_collisions,
        tamper_findings_count=tamper_count,
        generated_at=datetime.now(timezone.utc),
    )


@router.get("/export-csv")
async def export_compliance_csv(
    status_filter: Optional[str] = None,
    type_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Stream dynamically generated RFC 4180 compliant CSV of active application dossiers
    with regulatory scrutiny determinations, risk indicators, and officer notes.
    """
    query = db.query(Application).join(Institution, Application.institution_id == Institution.id)

    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(Application.current_status.ilike(f"%{status_filter}%"))
    if type_filter and type_filter.upper() != "ALL":
        query = query.filter(Application.application_type.ilike(f"%{type_filter}%"))

    applications = query.order_by(Application.created_at.desc()).all()

    # Generate CSV in-memory
    output = io.StringIO()
    writer = csv.writer(output, quoting=csv.QUOTE_MINIMAL)

    # Statutory CSV Header Row
    writer.writerow([
        "Application Public ID",
        "Institution Name",
        "AISHE Code",
        "Region",
        "Application Type",
        "Academic Year",
        "Current Status",
        "Priority",
        "Preliminary Scrutiny Outcome",
        "Documents Attached",
        "Flagged Findings Count",
        "Assigned Scrutiny Desk",
        "Submission Date",
    ])

    for app in applications:
        inst_name = app.institution.institution_name if app.institution else "Technical Institution"
        inst_region = app.institution.region if app.institution else "Central"
        aishe = app.institution.aishe_code if app.institution else "N/A"
        docs_count = len(app.documents) if app.documents else 0
        flags_count = (
            db.query(Finding)
            .join(Document, Finding.document_id == Document.id)
            .filter(Document.application_id == app.id)
            .count()
        )

        writer.writerow([
            app.public_id,
            inst_name,
            aishe,
            inst_region,
            app.application_type,
            app.academic_year,
            app.current_status,
            app.priority,
            app.preliminary_outcome,
            docs_count,
            flags_count,
            app.assigned_officer or "Central Scrutiny Desk",
            app.created_at.strftime("%Y-%m-%d %H:%M:%S UTC") if app.created_at else "N/A",
        ])

    csv_data = output.getvalue()
    output.close()

    filename = f"AICTE_VerifyAI_Compliance_Report_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"

    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache",
        },
    )
