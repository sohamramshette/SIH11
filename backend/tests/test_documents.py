import io
import pytest
import fitz
from app.utils.pdf_processor import (
    calculate_sha256,
    validate_file_upload,
    render_pdf_to_images,
    create_thumbnail,
)
from app.db.session import SessionLocal
from app.models import Application


def create_sample_pdf(num_pages: int = 2) -> bytes:
    """Create an authentic in-memory PDF dossier with text using PyMuPDF."""
    doc = fitz.open()
    for i in range(num_pages):
        page = doc.new_page(width=595, height=842)  # A4 size
        page.insert_text(
            (50, 72),
            f"AICTE APPROVAL DOSSIER - PAGE {i + 1}\nInstitutional Document Scrutiny AY 2026-27",
            fontsize=14,
        )
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def test_pdf_processor_unit():
    pdf_bytes = create_sample_pdf(num_pages=2)

    # 1. SHA-256 test
    digest = calculate_sha256(pdf_bytes)
    assert len(digest) == 64
    assert isinstance(digest, str)

    # 2. Validation test
    detected = validate_file_upload(pdf_bytes, "title_deed.pdf", "application/pdf")
    assert detected == "pdf"

    # 3. Render pages test
    pages = render_pdf_to_images(pdf_bytes, is_pdf=True, dpi=150)
    assert len(pages) == 2
    page1_num, page1_png, w, h = pages[0]
    assert page1_num == 1
    assert w > 0 and h > 0
    assert page1_png.startswith(b"\x89PNG")

    # 4. Thumbnail test
    thumb = create_thumbnail(page1_png, (100, 140))
    assert thumb.startswith(b"\x89PNG")


def test_upload_invalid_extension(client):
    # Try uploading a .txt file
    response = client.post(
        "/api/v1/applications/00000000-0000-0000-0000-000000000000/documents/upload",
        files={"file": ("malicious.exe", b"MZDummyExecutableBytes", "application/octet-stream")},
        data={"category": "Land", "title": "Invalid File"},
        headers={"Authorization": "Bearer dummy_token"},
    )
    # Either 401 or 415 depending on order of validation
    assert response.status_code in [401, 415]


def test_document_upload_and_retrieval_flow(client):
    # 1. Log in as college user
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"identifier": "principal@engg-college.demo.edu.in", "password": "college123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get target application ID
    db = SessionLocal()
    try:
        app = db.query(Application).filter(Application.public_id == "APP-2026-ENG-1042").first()
        assert app is not None
        app_id = str(app.id)
    finally:
        db.close()

    # 3. Upload genuine 2-page PDF
    pdf_bytes = create_sample_pdf(num_pages=2)
    upload_resp = client.post(
        f"/api/v1/applications/{app_id}/documents/upload",
        files={"file": ("Land_Title_Deed_7_5_Acres.pdf", pdf_bytes, "application/pdf")},
        data={"category": "Land Ownership", "title": "Registered Land Title Deed"},
        headers=headers,
    )
    assert upload_resp.status_code == 201, f"Upload failed: {upload_resp.text}"
    upload_data = upload_resp.json()
    assert upload_data["page_count"] == 2
    assert upload_data["status"] == "queued"
    assert upload_data["sha256"] == calculate_sha256(pdf_bytes)
    doc_id = upload_data["document_id"]

    # 4. List documents for application
    list_resp = client.get(
        f"/api/v1/applications/{app_id}/documents",
        headers=headers,
    )
    assert list_resp.status_code == 200
    docs = list_resp.json()
    assert len(docs) >= 1
    found_doc = next((d for d in docs if d["id"] == doc_id), None)
    assert found_doc is not None
    assert found_doc["page_count"] == 2
    assert len(found_doc["pages"]) == 2
    assert found_doc["pages"][0]["image_url"] is not None

    # 5. Fetch single document details
    detail_resp = client.get(
        f"/api/v1/documents/{doc_id}",
        headers=headers,
    )
    assert detail_resp.status_code == 200
    detail = detail_resp.json()
    assert detail["title"] == "Registered Land Title Deed"
    assert len(detail["pages"]) == 2
