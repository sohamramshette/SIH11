"""
Document Processing & AI Pipeline Worker.
Orchestrates Sarvam Document AI digitisation, structured field extraction,
and multi-model Document Forensics (ViT ELA, DocTamper DTD, YOLO statutory regions),
updating database records, timeline events, and audit ledgers.
"""
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models import (
    Document,
    ProcessingJob,
    OCRResult,
    ExtractedField,
    ApplicationTimeline,
    AuditLedger,
)
from app.services.storage import storage_service
from app.ai.sarvam_client import sarvam_client
from app.ai.forensics_orchestrator import forensics_orchestrator
from app.compliance.rule_engine import compliance_rule_engine
from app.utils.pdf_processor import calculate_sha256, generate_audit_record_hash
from app.services.audit import create_audit_ledger_entry

logger = logging.getLogger(__name__)


async def run_document_pipeline(document_id: uuid.UUID, db_session: Optional[Session] = None) -> bool:
    """
    Executes end-to-end Sarvam Document AI and Document Forensics pipeline:
    1. Updates processing status to 'processing'.
    2. Reads document binary bytes from storage.
    3. Calls Sarvam Document AI to digitise full text and extract schema fields.
    4. Persists OCRResult and ExtractedField rows to database.
    5. Runs Document Forensics (ViT-ELA, DocTamper-DTD, YOLO statutory regions).
    6. Persists TamperAnalysis, YOLODetection, and Finding records.
    7. Evaluates regulatory triaging policy and sets check_status.
    8. Updates document and job status to 'completed'.
    9. Appends audit records.
    """
    close_db_on_finish = False
    db = db_session
    if db is None:
        db = SessionLocal()
        close_db_on_finish = True

    try:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            logger.error(f"Cannot run pipeline: Document {document_id} not found.")
            return False

        job = (
            db.query(ProcessingJob)
            .filter(ProcessingJob.document_id == document_id)
            .order_by(ProcessingJob.created_at.desc())
            .first()
        )

        # Mark in-progress
        doc.processing_status = "processing"
        if job:
            job.status = "processing"
            job.started_at = datetime.now(timezone.utc)
        db.commit()

        # Read file bytes from storage
        file_bytes = storage_service.read_file(doc.storage_key)

        # 1. Execute Sarvam Document AI processing
        ocr_record, extracted_fields_list = await sarvam_client.process_statutory_document(
            file_bytes=file_bytes,
            filename=doc.original_filename,
            category=doc.category,
        )

        # Delete any previous OCR / Extracted fields for clean re-processing
        db.query(OCRResult).filter(OCRResult.document_id == document_id).delete()
        db.query(ExtractedField).filter(ExtractedField.document_id == document_id).delete()

        # Create OCRResult
        ocr_obj = OCRResult(
            id=uuid.uuid4(),
            document_id=doc.id,
            page_number=1,
            provider=ocr_record.get("provider", "sarvam"),
            provider_job_id=ocr_record.get("provider_job_id"),
            extracted_text=ocr_record.get("extracted_text"),
            layout_json=ocr_record.get("layout_json"),
            status="completed",
        )
        db.add(ocr_obj)

        # Create ExtractedField records
        field_records = []
        for f in extracted_fields_list:
            field_obj = ExtractedField(
                id=uuid.uuid4(),
                document_id=doc.id,
                page_number=f.get("page_number", 1),
                field_key=f["field_key"],
                field_label=f["field_label"],
                field_value=f["field_value"],
                normalized_value=f.get("normalized_value"),
                confidence=f.get("confidence", 0.95),
                source_bbox=f.get("source_bbox"),
            )
            field_records.append(field_obj)

        db.add_all(field_records)
        db.flush()

        # 2. Execute Document Forensics Pipeline (ViT ELA, DocTamper DTD, YOLO statutory marks)
        check_status, tamper_recs, yolo_recs, findings_recs = await forensics_orchestrator.analyze_document_pages(
            db=db,
            document=doc,
        )

        # 3. Automatically Re-Evaluate APH 2026-27 Compliance Rules & Deduplication
        try:
            compliance_rule_engine.evaluate_application(db, doc.application_id)
        except Exception as rule_err:
            logger.warning(f"Compliance rule evaluation encountered non-fatal error: {rule_err}")

        # Update Document and ProcessingJob
        doc.processing_status = "completed"
        doc.upload_status = "Verified"
        doc.check_status = check_status

        if job:
            job.status = "completed"
            job.finished_at = datetime.now(timezone.utc)
            metrics = job.metrics or {}
            metrics["fields_extracted"] = len(extracted_fields_list)
            metrics["provider"] = "sarvam"
            metrics["forensics"] = {
                "tamper_analyses": len(tamper_recs),
                "yolo_detections": len(yolo_recs),
                "findings": len(findings_recs),
                "check_status": check_status,
            }
            job.metrics = metrics

        # Application Timeline Event for AI Analysis
        timeline_entry = ApplicationTimeline(
            id=uuid.uuid4(),
            application_id=doc.application_id,
            actor_user_id=doc.uploaded_by,
            actor_name="AI Pipeline (Sarvam AI & Forensics)",
            stage="AI Analysis Completed",
            details=(
                f"Extracted {len(extracted_fields_list)} regulatory fields from '{doc.title}'. "
                f"Forensics evaluated ({len(tamper_recs)} models, {len(yolo_recs)} official marks). "
                f"Advisory check status: '{check_status}'."
            ),
        )
        db.add(timeline_entry)

        # Audit Ledger Record
        create_audit_ledger_entry(
            db=db,
            action="OCR & Forensic Analysis",
            entity_type="document",
            entity_id=str(doc.id),
            payload_hash=doc.sha256,
            actor_name="Sarvam & Forensics Pipeline",
            actor_user_id=doc.uploaded_by,
            application_id=doc.application_id,
            details=f"Document '{doc.title}' analyzed: {len(extracted_fields_list)} fields extracted, check status: '{check_status}'.",
        )

        db.commit()
        logger.info(f"Successfully processed document {document_id} with Sarvam AI and Forensics.")
        return True

    except Exception as e:
        logger.error(f"Error in document pipeline for {document_id}: {e}", exc_info=True)
        try:
            doc = db.query(Document).filter(Document.id == document_id).first()
            if doc:
                doc.processing_status = "failed"
            job = (
                db.query(ProcessingJob)
                .filter(ProcessingJob.document_id == document_id)
                .order_by(ProcessingJob.created_at.desc())
                .first()
            )
            if job:
                job.status = "failed"
                job.error_message = str(e)
                job.finished_at = datetime.now(timezone.utc)
            db.commit()
        except Exception as rollback_err:
            logger.error(f"Failed to record pipeline failure state: {rollback_err}")
            db.rollback()
        return False

    finally:
        if close_db_on_finish:
            db.close()
