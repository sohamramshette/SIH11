import pytest
import io
import uuid
import pymupdf
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.ai.sarvam_client import sarvam_client, GOLDEN_SCHEMAS, FIELD_LABELS
from app.models import Document, Application, User, ExtractedField, OCRResult, AuditLedger

client = TestClient(app)


def get_auth_headers(db_session, role="verification"):
    user = db_session.query(User).filter(User.role == role).first()
    if not user:
        user = db_session.query(User).first()
    token = create_access_token(subject=str(user.id), role=user.role, email=user.email)
    return {"Authorization": f"Bearer {token}"}


def create_sample_pdf(title: str, lines: list) -> bytes:
    doc = pymupdf.open()
    page = doc.new_page()
    page.insert_text((50, 70), title, fontsize=16)
    y = 110
    for line in lines:
        page.insert_text((50, y), line, fontsize=11)
        y += 24
    pdf_bytes = doc.write()
    doc.close()
    return pdf_bytes


def test_sarvam_client_configuration():
    assert sarvam_client.is_configured() is True
    assert sarvam_client.base_url == "https://api.sarvam.ai/doc-ai/v1"
    assert "api-subscription-key" in sarvam_client.headers


def test_golden_5_schemas_complete():
    required_categories = ["Land", "Fire Safety", "Faculty", "Building", "Affiliation"]
    for cat in required_categories:
        assert cat in GOLDEN_SCHEMAS
        assert "properties" in GOLDEN_SCHEMAS[cat]
        assert len(GOLDEN_SCHEMAS[cat]["properties"]) >= 5


def test_sarvam_fallback_heuristic_all_categories():
    categories = ["Land", "Fire Safety", "Faculty", "Building", "Affiliation"]
    pdf_bytes = create_sample_pdf("Sample Regulatory Dossier", ["AICTE Document Verification 2026-27"])

    for cat in categories:
        res = sarvam_client._local_fallback_extract(pdf_bytes, f"{cat.lower()}.pdf", cat)
        assert res["status"] == "completed"
        assert "result" in res
        assert len(res["result"]) > 0


@pytest.mark.asyncio
async def test_sarvam_live_api_processing():
    """Live call to api.sarvam.ai with Fire Safety NOC sample."""
    sample_text = [
        "Government of Madhya Pradesh - Directorate of Fire Services",
        "FIRE SAFETY CERTIFICATE / NO OBJECTION CERTIFICATE",
        "NOC Number: FS-2026-NOC-4481",
        "Issuing Authority: Municipal Fire Division Bhopal",
        "Valid until: 2027-03-31",
        "Building Height: 14.8 meters",
        "Status: Compliant with National Building Code Part IV",
    ]
    pdf_bytes = create_sample_pdf("FIRE SAFETY NOC", sample_text)

    ocr_record, fields = await sarvam_client.process_statutory_document(
        file_bytes=pdf_bytes,
        filename="fire_safety_noc.pdf",
        category="Fire Safety",
    )

    assert ocr_record["provider"] == "sarvam"
    assert ocr_record["status"] == "completed"
    assert len(fields) >= 3

    keys = [f["field_key"] for f in fields]
    assert "noc_number" in keys
    assert "valid_until" in keys


def test_e2e_document_upload_and_sarvam_extraction(db_session):
    """E2E test: upload document with sync_process=True, verify OCR and Extracted Fields endpoints."""
    headers = get_auth_headers(db_session, role="college")
    app_obj = db_session.query(Application).first()
    assert app_obj is not None

    sample_lines = [
        "Sub-Registrar Office Bhopal - Registered Deed of Title",
        "Registration Number: REG-2024-LD-8819",
        "Registered Holder: BITS Educational Foundation Society",
        "Total Land Area: 10.5 acres",
        "Khasra Survey Numbers: 42/1, 42/2, 43",
        "Land Contiguity: Single contiguous land parcel",
        "Encumbrance: Clear and unencumbered title",
    ]
    pdf_bytes = create_sample_pdf("LAND TITLE DEED", sample_lines)

    # 1. Upload with sync_process=True
    files = {"file": ("land_deed_sync.pdf", pdf_bytes, "application/pdf")}
    data = {"category": "Land", "title": "Main Campus Land Title Deed"}

    upload_res = client.post(
        f"/api/v1/applications/{app_obj.id}/documents/upload?sync_process=true",
        files=files,
        data=data,
        headers=headers,
    )
    assert upload_res.status_code == 201
    upload_data = upload_res.json()
    doc_id = upload_data["document_id"]
    assert upload_data["status"] == "completed"

    # 2. Check document status via GET /documents/{doc_id}
    doc_res = client.get(f"/api/v1/documents/{doc_id}", headers=headers)
    assert doc_res.status_code == 200
    doc_info = doc_res.json()
    assert doc_info["processing_status"] == "completed"
    assert len(doc_info["extracted_fields"]) >= 4

    # 3. Check OCR results via GET /documents/{doc_id}/ocr
    ocr_res = client.get(f"/api/v1/documents/{doc_id}/ocr", headers=headers)
    assert ocr_res.status_code == 200
    ocr_info = ocr_res.json()
    assert ocr_info["provider"] == "sarvam"
    assert len(ocr_info["extracted_text"]) > 10

    # 4. Check extracted fields via GET /documents/{doc_id}/fields
    fields_res = client.get(f"/api/v1/documents/{doc_id}/fields", headers=headers)
    assert fields_res.status_code == 200
    fields_list = fields_res.json()
    assert len(fields_list) >= 4

    keys = [f["field_key"] for f in fields_list]
    assert "land_area_acres" in keys

    # 5. Test manual field override by officer
    officer_headers = get_auth_headers(db_session, role="verification")
    target_field = next(f for f in fields_list if f["field_key"] == "land_area_acres")
    field_id = target_field["id"]

    override_payload = {
        "field_value": "10.50",
        "override_reason": "Verified boundary demarcation from revenue surveyor map.",
    }
    patch_res = client.patch(
        f"/api/v1/documents/{doc_id}/fields/{field_id}",
        json=override_payload,
        headers=officer_headers,
    )
    assert patch_res.status_code == 200
    patched_field = patch_res.json()
    assert patched_field["is_overridden"] is True
    assert patched_field["field_value"] == "10.50"
    assert patched_field["override_reason"] == override_payload["override_reason"]

    # 6. Verify Audit Ledger recorded this override
    audit = (
        db_session.query(AuditLedger)
        .filter(AuditLedger.action == "Field Override", AuditLedger.entity_id == str(field_id))
        .first()
    )
    assert audit is not None
    assert "Verified boundary demarcation" in audit.details

    # 7. Test Reprocess endpoint
    reproc_res = client.post(
        f"/api/v1/documents/{doc_id}/reprocess?sync_process=true",
        headers=officer_headers,
    )
    assert reproc_res.status_code == 200
    assert reproc_res.json()["status"] == "completed"
