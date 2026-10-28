import uuid
from typing import List, Optional
from pathlib import Path
from fastapi import APIRouter, Depends, UploadFile, File, Form, Query, HTTPException, status, BackgroundTasks
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import (
    Application,
    Document,
    DocumentPage,
    ProcessingJob,
    ApplicationTimeline,
    AuditLedger,
    User,
    OCRResult,
    ExtractedField,
    TamperAnalysis,
    YOLODetection,
    Finding,
)
from app.schemas.document import (
    DocumentOut,
    DocumentUploadResponse,
    DocumentPageOut,
    OCRResultOut,
    ExtractedFieldOut,
    FieldOverrideRequest,
    ReprocessResponse,
)
from app.schemas.forensics import (
    DocumentForensicsResponse,
    TamperAnalysisOut,
    YOLODetectionOut,
    FindingOut,
)
from app.core.permissions import get_current_user
from app.services.storage import storage_service
from app.utils.pdf_processor import (
    validate_file_upload,
    calculate_sha256,
    generate_audit_record_hash,
    render_pdf_to_images,
    create_thumbnail,
)
from app.services.audit import create_audit_ledger_entry
from app.workers.pipeline import run_document_pipeline

router = APIRouter(tags=["Document Ingestion & AI Pipeline"])


@router.post(
    "/applications/{app_id}/documents/upload",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    app_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    category: str = Form(...),
    title: str = Form(...),
    sync_process: bool = Query(False, description="Whether to execute Sarvam AI pipeline synchronously"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Ingest statutory PDF / image dossier:
    1. Validates MIME type and file binary magic bytes.
    2. Enforces 10MB file limit.
    3. Calculates SHA-256 cryptographic checksum.
    4. Renders pages into 180 DPI images for OCR and ML models.
    5. Saves original and page assets to private object storage.
    6. Triggers Sarvam Document AI pipeline (async or sync).
    7. Appends immutable event to AuditLedger.
    """
    # Verify application exists
    application = db.query(Application).filter(Application.id == app_id).first()
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Application with ID '{app_id}' not found.",
        )

    # Read file content
    content = await file.read()
    detected_type = validate_file_upload(content, file.filename, file.content_type)
    sha256_hash = calculate_sha256(content)

    doc_id = uuid.uuid4()
    job_id = uuid.uuid4()
    safe_filename = Path(file.filename).name.replace(" ", "_")
    storage_key = f"applications/{app_id}/documents/{doc_id}/{safe_filename}"

    # 1. Upload original document
    await storage_service.upload_file(
        storage_key=storage_key,
        content=content,
        content_type=file.content_type or "application/pdf",
    )

    # 2. Render pages to 180 DPI images
    is_pdf = detected_type == "pdf"
    rendered_pages = render_pdf_to_images(content, is_pdf=is_pdf, dpi=180)
    page_count = len(rendered_pages)

    # Create document record
    document = Document(
        id=doc_id,
        application_id=app_id,
        category=category,
        title=title,
        original_filename=safe_filename,
        mime_type=file.content_type or "application/pdf",
        size_bytes=len(content),
        storage_key=storage_key,
        sha256=sha256_hash,
        upload_status="Uploaded",
        processing_status="queued",
        check_status="Preliminary Check Passed",
        page_count=page_count,
        uploaded_by=current_user.id,
    )
    db.add(document)
    db.flush()

    # 3. Store rendered pages and thumbnails
    page_records = []
    for page_num, img_bytes, width, height in rendered_pages:
        page_img_key = f"applications/{app_id}/documents/{doc_id}/pages/page_{page_num}.png"
        thumb_img_key = f"applications/{app_id}/documents/{doc_id}/thumbnails/thumb_{page_num}.png"
        thumb_bytes = create_thumbnail(img_bytes)

        await storage_service.upload_file(page_img_key, img_bytes, "image/png")
        await storage_service.upload_file(thumb_img_key, thumb_bytes, "image/png")

        page_record = DocumentPage(
            id=uuid.uuid4(),
            document_id=doc_id,
            page_number=page_num,
            rendered_image_key=page_img_key,
            thumbnail_key=thumb_img_key,
            page_status="completed",
        )
        page_records.append(page_record)

    db.add_all(page_records)

    # 4. Create ProcessingJob entry
    job = ProcessingJob(
        id=job_id,
        document_id=doc_id,
        task_type="document_pipeline",
        status="queued",
        metrics={"page_count": page_count, "size_kb": len(content) // 1024},
    )
    db.add(job)

    # 5. Add milestone to ApplicationTimeline
    timeline_entry = ApplicationTimeline(
        id=uuid.uuid4(),
        application_id=app_id,
        actor_user_id=current_user.id,
        actor_name=current_user.full_name,
        stage="Document Uploaded",
        details=f"Uploaded '{title}' ({safe_filename}, {page_count} pages). SHA-256: {sha256_hash[:16]}...",
    )
    db.add(timeline_entry)

    # 6. Append to AuditLedger
    create_audit_ledger_entry(
        db=db,
        action="Document Ingestion",
        entity_type="document",
        entity_id=str(doc_id),
        payload_hash=sha256_hash,
        actor_name=current_user.full_name,
        actor_user_id=current_user.id,
        application_id=app_id,
        details=f"Document '{title}' ({safe_filename}) validated and stored with {page_count} rasterized pages.",
    )

    db.commit()

    # 7. Trigger AI Processing Pipeline
    if sync_process:
        await run_document_pipeline(doc_id, db_session=db)
        status_msg = "completed"
    else:
        background_tasks.add_task(run_document_pipeline, doc_id)
        status_msg = "queued"

    return DocumentUploadResponse(
        document_id=doc_id,
        application_id=app_id,
        job_id=job_id,
        title=title,
        category=category,
        filename=safe_filename,
        sha256=sha256_hash,
        page_count=page_count,
        status=status_msg,
        message=f"Document uploaded. Sarvam AI pipeline {status_msg}.",
    )


@router.get(
    "/applications/{app_id}/documents",
    response_model=List[DocumentOut],
)
async def list_application_documents(
    app_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all uploaded documents for an application with signed view URLs."""
    docs = db.query(Document).filter(Document.application_id == app_id).all()
    results = []

    for d in docs:
        file_url = await storage_service.get_signed_url(d.storage_key)
        page_outs = []
        for p in d.pages:
            img_url = await storage_service.get_signed_url(p.rendered_image_key) if p.rendered_image_key else None
            thumb_url = await storage_service.get_signed_url(p.thumbnail_key) if p.thumbnail_key else None
            page_outs.append(
                DocumentPageOut(
                    id=p.id,
                    page_number=p.page_number,
                    page_status=p.page_status,
                    image_url=img_url,
                    thumbnail_url=thumb_url,
                )
            )

        doc_dict = {
            "id": d.id,
            "application_id": d.application_id,
            "category": d.category,
            "title": d.title,
            "original_filename": d.original_filename,
            "mime_type": d.mime_type,
            "size_bytes": d.size_bytes,
            "sha256": d.sha256,
            "upload_status": d.upload_status,
            "processing_status": d.processing_status,
            "check_status": d.check_status,
            "page_count": d.page_count,
            "file_url": file_url,
            "pages": page_outs,
            "extracted_fields": d.extracted_fields,
            "created_at": d.created_at,
        }
        results.append(DocumentOut(**doc_dict))

    return results


@router.get("/documents/{doc_id}", response_model=DocumentOut)
async def get_document_details(
    doc_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch complete metadata, pages, and extracted regulatory fields for a document."""
    d = db.query(Document).filter(Document.id == doc_id).first()
    if not d:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{doc_id}' not found.",
        )

    file_url = await storage_service.get_signed_url(d.storage_key)
    page_outs = []
    for p in d.pages:
        img_url = await storage_service.get_signed_url(p.rendered_image_key) if p.rendered_image_key else None
        thumb_url = await storage_service.get_signed_url(p.thumbnail_key) if p.thumbnail_key else None
        page_outs.append(
            DocumentPageOut(
                id=p.id,
                page_number=p.page_number,
                page_status=p.page_status,
                image_url=img_url,
                thumbnail_url=thumb_url,
            )
        )

    doc_dict = {
        "id": d.id,
        "application_id": d.application_id,
        "category": d.category,
        "title": d.title,
        "original_filename": d.original_filename,
        "mime_type": d.mime_type,
        "size_bytes": d.size_bytes,
        "sha256": d.sha256,
        "upload_status": d.upload_status,
        "processing_status": d.processing_status,
        "check_status": d.check_status,
        "page_count": d.page_count,
        "file_url": file_url,
        "pages": page_outs,
        "extracted_fields": d.extracted_fields,
        "created_at": d.created_at,
    }
    return DocumentOut(**doc_dict)


@router.get("/documents/{doc_id}/ocr", response_model=OCRResultOut)
def get_document_ocr(
    doc_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve Sarvam Document AI OCR results (markdown text and layout JSON)."""
    ocr = db.query(OCRResult).filter(OCRResult.document_id == doc_id).first()
    if not ocr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"OCR result for document '{doc_id}' not found or still processing.",
        )
    return ocr


@router.get("/documents/{doc_id}/fields", response_model=List[ExtractedFieldOut])
def get_document_fields(
    doc_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all structured regulatory fields extracted by Sarvam AI."""
    fields = (
        db.query(ExtractedField)
        .filter(ExtractedField.document_id == doc_id)
        .order_by(ExtractedField.field_key.asc())
        .all()
    )
    return fields


@router.post("/documents/{doc_id}/reprocess", response_model=ReprocessResponse)
async def reprocess_document(
    doc_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    sync_process: bool = Query(False, description="Whether to execute Sarvam AI synchronously"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Re-trigger the Sarvam Document AI ingestion and field extraction pipeline."""
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{doc_id}' not found.",
        )

    if sync_process:
        await run_document_pipeline(doc_id, db_session=db)
        return ReprocessResponse(
            document_id=doc_id,
            status="completed",
            message="Document successfully reprocessed by Sarvam AI pipeline.",
        )
    else:
        background_tasks.add_task(run_document_pipeline, doc_id)
        return ReprocessResponse(
            document_id=doc_id,
            status="queued",
            message="Document queued for reprocessing by Sarvam AI pipeline.",
        )


@router.patch("/documents/{doc_id}/fields/{field_id}", response_model=ExtractedFieldOut)
def override_document_field(
    doc_id: uuid.UUID,
    field_id: uuid.UUID,
    payload: FieldOverrideRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Allow verification officer or admin to manually override an AI-extracted field.
    Audit ledger is automatically appended with officer ID and override justification.
    """
    field = (
        db.query(ExtractedField)
        .filter(ExtractedField.id == field_id, ExtractedField.document_id == doc_id)
        .first()
    )
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Field '{field_id}' for document '{doc_id}' not found.",
        )

    old_value = field.field_value
    field.field_value = payload.field_value
    field.is_overridden = True
    field.overridden_by = current_user.id
    field.override_reason = payload.override_reason

    # Add audit log
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if doc:
        payload_hash = calculate_sha256(payload.field_value.encode())
        create_audit_ledger_entry(
            db=db,
            action="Field Override",
            entity_type="extracted_field",
            entity_id=str(field.id),
            payload_hash=payload_hash,
            actor_name=current_user.full_name,
            actor_user_id=current_user.id,
            application_id=doc.application_id,
            details=f"Field '{field.field_label}' overridden: '{old_value}' -> '{payload.field_value}'. Reason: {payload.override_reason}",
        )

    db.commit()
    db.refresh(field)
    return field


@router.get("/documents/{doc_id}/forensics", response_model=DocumentForensicsResponse)
async def get_document_forensics(
    doc_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve full multi-model forensics evaluation:
    - ViT Error Level Analysis (ELA) scores and heatmaps.
    - DocTamper text-level alteration masks and bounding box overlays.
    - YOLO statutory region detections (stamps, signatures, QR codes, letterheads).
    - Regulatory triaging check status.
    """
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{doc_id}' not found.",
        )

    tamper_recs = db.query(TamperAnalysis).filter(TamperAnalysis.document_id == doc_id).all()
    yolo_recs = db.query(YOLODetection).filter(YOLODetection.document_id == doc_id).all()
    findings = db.query(Finding).filter(Finding.document_id == doc_id).all()

    tamper_outs = []
    for t in tamper_recs:
        mask_url = await storage_service.get_signed_url(t.mask_storage_key) if t.mask_storage_key else None
        overlay_url = await storage_service.get_signed_url(t.overlay_storage_key) if t.overlay_storage_key else None
        tamper_outs.append(
            TamperAnalysisOut(
                id=t.id,
                document_id=t.document_id,
                page_number=t.page_number,
                model_name=t.model_name,
                model_version=t.model_version,
                model_score=t.model_score,
                predicted_label=t.predicted_label,
                mask_url=mask_url,
                overlay_url=overlay_url,
                inference_status=t.inference_status,
                metadata_json=t.metadata_json,
                created_at=t.created_at,
            )
        )

    yolo_outs = []
    for y in yolo_recs:
        crop_url = await storage_service.get_signed_url(y.crop_storage_key) if y.crop_storage_key else None
        yolo_outs.append(
            YOLODetectionOut(
                id=y.id,
                document_id=y.document_id,
                page_number=y.page_number,
                model_version=y.model_version,
                class_id=y.class_id,
                class_name=y.class_name,
                confidence=y.confidence,
                bbox=y.bbox,
                crop_url=crop_url,
                created_at=y.created_at,
            )
        )

    finding_outs = [FindingOut.model_validate(f) for f in findings]

    return DocumentForensicsResponse(
        document_id=doc.id,
        check_status=doc.check_status,
        tamper_analyses=tamper_outs,
        yolo_detections=yolo_outs,
        findings=finding_outs,
    )


@router.get("/documents/{doc_id}/findings", response_model=List[FindingOut])
def get_document_findings(
    doc_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve all compliance and forensic findings for a document."""
    findings = db.query(Finding).filter(Finding.document_id == doc_id).all()
    return findings


@router.get("/documents/files/{path:path}")
def stream_document_file(path: str):
    """Internal secure file streaming endpoint for previewing stored files."""
    try:
        data = storage_service.read_file(path)
        media_type = "application/pdf" if path.endswith(".pdf") else "image/png"
        return Response(content=data, media_type=media_type)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Requested file not found in storage.")
