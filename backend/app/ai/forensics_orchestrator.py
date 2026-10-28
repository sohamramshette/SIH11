"""
Forensics Orchestrator & Multi-Model Triaging Engine.
Executes ViT-ELA document forgery detection, DocTamper text-level localization,
and YOLO statutory region verification across document pages, synthesizing findings
and automated triage statuses according to AICTE regulatory policies.
"""
import uuid
import logging
from typing import Dict, Any, List, Tuple
from sqlalchemy.orm import Session

from app.models import Document, TamperAnalysis, YOLODetection, Finding
from app.services.storage import storage_service
from app.ai.vit_detector import vit_ela_detector
from app.ai.doctamper_adapter import doctamper_adapter
from app.ai.yolo_detector import yolo_detector

logger = logging.getLogger(__name__)


class ForensicsOrchestrator:
    """Orchestrates multi-model forensic analysis and regulatory triaging."""

    async def analyze_document_pages(
        self,
        db: Session,
        document: Document,
    ) -> Tuple[str, List[TamperAnalysis], List[YOLODetection], List[Finding]]:
        """
        Runs complete forensics pipeline for all pages of a document:
        1. Reads rendered page images from storage.
        2. Executes ViT-ELA, DocTamper, and YOLO detectors.
        3. Persists generated mask/overlay/crop assets to object storage.
        4. Saves database records for TamperAnalysis and YOLODetection.
        5. Synthesizes Findings based on the forensic triaging policy.
        6. Updates Document.check_status.
        """
        app_id = document.application_id
        doc_id = document.id

        # Clean existing forensic records for clean re-analysis
        db.query(TamperAnalysis).filter(TamperAnalysis.document_id == doc_id).delete()
        db.query(YOLODetection).filter(YOLODetection.document_id == doc_id).delete()
        db.query(Finding).filter(Finding.document_id == doc_id, Finding.finding_type == "tampering").delete()

        tamper_records: List[TamperAnalysis] = []
        yolo_records: List[YOLODetection] = []
        findings_records: List[Finding] = []

        total_pages = len(document.pages)
        highest_vit_score = 0.0
        highest_tamper_score = 0.0
        has_official_seal = False
        has_signature = False
        all_tamper_boxes = []

        for page in document.pages:
            page_num = page.page_number
            if not page.rendered_image_key:
                continue

            try:
                page_img_bytes = storage_service.read_file(page.rendered_image_key)
            except Exception as e:
                logger.warning(f"Could not read page {page_num} image: {e}")
                continue

            # 1. ViT-ELA Analysis
            vit_res = vit_ela_detector.analyze_image(page_img_bytes)
            vit_score = vit_res["model_score"]
            highest_vit_score = max(highest_vit_score, vit_score)

            # Store ViT ELA overlay
            ela_key = f"applications/{app_id}/documents/{doc_id}/forensics/page_{page_num}_ela_overlay.png"
            await storage_service.upload_file(ela_key, vit_res["overlay_bytes"], "image/png")

            tamper_records.append(
                TamperAnalysis(
                    id=uuid.uuid4(),
                    document_id=doc_id,
                    page_number=page_num,
                    model_name="ViT-ELA",
                    model_version=vit_res["model_version"],
                    model_score=vit_score,
                    predicted_label=vit_res["predicted_label"],
                    overlay_storage_key=ela_key,
                    inference_status="completed",
                    metadata_json=vit_res["metadata"],
                )
            )

            # 2. DocTamper DTD Text-Level Localization
            dt_res = doctamper_adapter.analyze_page(page_img_bytes)
            dt_score = dt_res["model_score"]
            highest_tamper_score = max(highest_tamper_score, dt_score)
            boxes = dt_res.get("tamper_boxes", [])
            all_tamper_boxes.extend(boxes)

            # Store DocTamper Mask and Overlay
            dt_mask_key = f"applications/{app_id}/documents/{doc_id}/forensics/page_{page_num}_tamper_mask.png"
            dt_overlay_key = f"applications/{app_id}/documents/{doc_id}/forensics/page_{page_num}_tamper_overlay.png"
            await storage_service.upload_file(dt_mask_key, dt_res["mask_bytes"], "image/png")
            await storage_service.upload_file(dt_overlay_key, dt_res["overlay_bytes"], "image/png")

            tamper_records.append(
                TamperAnalysis(
                    id=uuid.uuid4(),
                    document_id=doc_id,
                    page_number=page_num,
                    model_name="DocTamper-DTD",
                    model_version=dt_res["model_version"],
                    model_score=dt_score,
                    predicted_label=dt_res["predicted_label"],
                    mask_storage_key=dt_mask_key,
                    overlay_storage_key=dt_overlay_key,
                    inference_status="completed",
                    metadata_json=dt_res["metadata"],
                )
            )

            # 3. YOLO Statutory Region Detection
            yolo_results = yolo_detector.detect_regions(page_img_bytes)
            for idx, item in enumerate(yolo_results):
                class_name = item["class_name"]
                if class_name == "stamp":
                    has_official_seal = True
                elif class_name == "signature":
                    has_signature = True

                crop_key = None
                if item.get("crop_bytes"):
                    crop_key = f"applications/{app_id}/documents/{doc_id}/forensics/page_{page_num}_{class_name}_{idx}.png"
                    await storage_service.upload_file(crop_key, item["crop_bytes"], "image/png")

                yolo_records.append(
                    YOLODetection(
                        id=uuid.uuid4(),
                        document_id=doc_id,
                        page_number=page_num,
                        model_version="yolov8-doc-statutory",
                        class_id=item["class_id"],
                        class_name=class_name,
                        confidence=item["confidence"],
                        bbox=item["bbox"],
                        crop_storage_key=crop_key,
                    )
                )

        # 4. Forensic Triaging Policy Matrix Evaluation
        # High concern if ViT ELA >= 0.65 or DocTamper score >= 0.50
        is_vit_concerning = highest_vit_score >= 0.60
        has_tampered_regions = highest_tamper_score >= 0.40 or len(all_tamper_boxes) > 0

        if not is_vit_concerning and not has_tampered_regions and has_official_seal:
            check_status = "Preliminary Check Passed"
        elif not is_vit_concerning and has_tampered_regions:
            check_status = "Review Required"
        elif is_vit_concerning and not has_official_seal:
            check_status = "Possible Inconsistency"
        elif is_vit_concerning and has_tampered_regions:
            check_status = "Possible Inconsistency"
        else:
            check_status = "Preliminary Check Passed"

        # 5. Synthesize Forensic Findings
        if has_tampered_regions:
            severity = "danger" if highest_tamper_score >= 0.65 else "warning"
            findings_records.append(
                Finding(
                    id=uuid.uuid4(),
                    application_id=app_id,
                    document_id=doc_id,
                    page_number=1,
                    finding_type="tampering",
                    severity=severity,
                    status="active",
                    title="Potential Localized Text Alteration Flagged",
                    description=(
                        f"DocTamper model identified {len(all_tamper_boxes)} region(s) with anomalous high-frequency "
                        f"compression and gradient artifacts (tamper score: {highest_tamper_score:.2f})."
                    ),
                    evidence={"boxes": all_tamper_boxes[:5], "model_score": highest_tamper_score},
                )
            )

        if not has_official_seal and document.category in ("Land", "Fire Safety", "Building"):
            findings_records.append(
                Finding(
                    id=uuid.uuid4(),
                    application_id=app_id,
                    document_id=doc_id,
                    page_number=1,
                    finding_type="discrepancy",
                    severity="warning",
                    status="active",
                    title="Missing Competent Authority Seal / Stamp",
                    description=(
                        f"Statutory document ({document.category}) appears to lack a detected official municipal, "
                        f"fire department, or registrar ink stamp."
                    ),
                    evidence={"has_seal": False, "category": document.category},
                )
            )

        # Persist all forensic records
        db.add_all(tamper_records)
        db.add_all(yolo_records)
        db.add_all(findings_records)

        document.check_status = check_status
        db.commit()

        logger.info(
            f"Forensics completed for {doc_id}: check_status='{check_status}', "
            f"{len(tamper_records)} tamper analyses, {len(yolo_records)} YOLO detections, "
            f"{len(findings_records)} findings."
        )

        return check_status, tamper_records, yolo_records, findings_records


# Singleton instance
forensics_orchestrator = ForensicsOrchestrator()
