import pytest
import io
import uuid
import cv2
import numpy as np
from PIL import Image
import pymupdf
from fastapi.testclient import TestClient

from app.main import app
from app.core.security import create_access_token
from app.ai.vit_detector import vit_ela_detector
from app.ai.doctamper_adapter import doctamper_adapter
from app.ai.yolo_detector import yolo_detector
from app.models import User, Application, Document, TamperAnalysis, YOLODetection, Finding

client = TestClient(app)


def get_auth_headers(db_session, role="verification"):
    user = db_session.query(User).filter(User.role == role).first()
    if not user:
        user = db_session.query(User).first()
    token = create_access_token(subject=str(user.id), role=user.role, email=user.email)
    return {"Authorization": f"Bearer {token}"}


def create_sample_page_image(add_stamp: bool = True, add_alteration: bool = False) -> bytes:
    """Generate authentic-looking document page with optional stamp and alteration."""
    # Create white canvas (800 x 1100)
    img = np.full((1100, 800, 3), 255, dtype=np.uint8)

    # Add header text
    cv2.putText(img, "GOVERNMENT OF INDIA - AICTE STATUTORY DOSSIER", (50, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (20, 20, 20), 2)
    cv2.putText(img, "Fire Safety and Structural Stability Clearance 2026-27", (50, 130), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (50, 50, 50), 1)

    # Add body lines
    y = 200
    for line in [
        "Certificate Reference: FS-2026-NOC-4481",
        "Institution: BITS Educational Foundation Society",
        "Campus Area: 10.50 Acres (Contiguous Parcel)",
        "Building Height: 14.80 Meters (Approved G+3)",
        "Compliance: Fully compliant with Part IV National Building Code",
    ]:
        cv2.putText(img, line, (60, y), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (30, 30, 30), 1)
        y += 50

    # Add blue municipal stamp if requested
    if add_stamp:
        # Draw circular blue ink stamp
        center = (620, 850)
        cv2.circle(img, center, 65, (180, 50, 30), 3)  # BGR blue ink
        cv2.circle(img, center, 55, (180, 50, 30), 1)
        cv2.putText(img, "FIRE DEPT", (575, 840), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (180, 50, 30), 1)
        cv2.putText(img, "APPROVED", (580, 865), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (180, 50, 30), 1)

    # Add cursive signature in lower area
    cv2.line(img, (150, 920), (320, 905), (120, 40, 20), 2)
    cv2.putText(img, "Authorized Signatory", (150, 950), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (70, 70, 70), 1)

    # If requested, inject synthetic high-frequency pasted alteration block
    if add_alteration:
        patch = np.random.randint(180, 240, (40, 120, 3), dtype=np.uint8)
        img[330:370, 250:370] = patch

    # Encode to PNG
    pil_img = Image.fromarray(img)
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    return buf.getvalue()


def test_vit_ela_detector_unit():
    img_bytes = create_sample_page_image(add_stamp=True)
    res = vit_ela_detector.analyze_image(img_bytes)

    assert res["model_name"] == "ViT-ELA"
    assert 0.0 <= res["model_score"] <= 1.0
    assert res["predicted_label"] in ("authentic", "suspicious", "tampered")
    assert len(res["overlay_bytes"]) > 100
    assert "std_error" in res


def test_doctamper_adapter_unit():
    img_bytes = create_sample_page_image(add_stamp=True, add_alteration=True)
    res = doctamper_adapter.analyze_page(img_bytes)

    assert res["model_name"] == "DocTamper-DTD"
    assert res["model_version"] == "1.2.0"
    assert 0.0 <= res["model_score"] <= 1.0
    assert len(res["mask_bytes"]) > 100
    assert len(res["overlay_bytes"]) > 100
    assert isinstance(res["tamper_boxes"], list)


def test_yolo_detector_unit():
    img_bytes = create_sample_page_image(add_stamp=True)
    detections = yolo_detector.detect_regions(img_bytes)

    assert len(detections) >= 1
    class_names = [d["class_name"] for d in detections]
    assert "stamp" in class_names or "signature" in class_names or "letterhead" in class_names

    for d in detections:
        assert "class_id" in d
        assert "confidence" in d
        assert "bbox" in d
        assert len(d["crop_bytes"]) > 0


def test_e2e_document_upload_and_forensics(db_session):
    """End-to-end integration test: Upload PDF -> AI pipeline -> Sarvam OCR + Forensics -> check endpoints."""
    headers = get_auth_headers(db_session, role="college")
    app_obj = db_session.query(Application).first()
    assert app_obj is not None

    # Create real 1-page PDF using PyMuPDF
    doc = pymupdf.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((50, 70), "GOVERNMENT FIRE SAFETY CLEARANCE CERTIFICATE", fontsize=14)
    page.insert_text((50, 110), "NOC Number: FS-2026-NOC-4481\nValid until: 2027-03-31\nBuilding Height: 14.8m", fontsize=11)
    page.draw_circle((450, 700), 40, color=(0.8, 0.2, 0.1), fill=None, width=2)
    page.insert_text((425, 705), "APPROVED", fontsize=9, color=(0.8, 0.2, 0.1))
    pdf_bytes = doc.write()
    doc.close()

    # Upload with sync_process=True
    files = {"file": ("fire_forensic_test.pdf", pdf_bytes, "application/pdf")}
    data = {"category": "Fire Safety", "title": "Fire NOC with Statutory Seal"}

    upload_res = client.post(
        f"/api/v1/applications/{app_obj.id}/documents/upload?sync_process=true",
        files=files,
        data=data,
        headers=headers,
    )
    assert upload_res.status_code == 201
    doc_id = upload_res.json()["document_id"]

    # 1. Verify forensics endpoint GET /documents/{doc_id}/forensics
    officer_headers = get_auth_headers(db_session, role="verification")
    forensics_res = client.get(f"/api/v1/documents/{doc_id}/forensics", headers=officer_headers)
    assert forensics_res.status_code == 200
    fdata = forensics_res.json()

    assert fdata["document_id"] == doc_id
    assert fdata["check_status"] in ("Preliminary Check Passed", "Review Required", "Possible Inconsistency")
    assert len(fdata["tamper_analyses"]) >= 2  # ViT-ELA and DocTamper-DTD
    assert len(fdata["yolo_detections"]) >= 1

    model_names = [t["model_name"] for t in fdata["tamper_analyses"]]
    assert "ViT-ELA" in model_names
    assert "DocTamper-DTD" in model_names

    # Check overlays have signed URLs
    vit_analysis = next(t for t in fdata["tamper_analyses"] if t["model_name"] == "ViT-ELA")
    assert vit_analysis["overlay_url"] is not None

    # 2. Verify findings endpoint GET /documents/{doc_id}/findings
    findings_res = client.get(f"/api/v1/documents/{doc_id}/findings", headers=officer_headers)
    assert findings_res.status_code == 200
    assert isinstance(findings_res.json(), list)
