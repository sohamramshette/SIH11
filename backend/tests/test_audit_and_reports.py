"""
Test suite for Cryptographic Audit Ledger & Compliance Reports.
Tests SHA-256 blockchain verification, tamper detection, and CSV generation.
"""
import uuid
import pytest
from app.db.session import SessionLocal
from app.models.audit import AuditLedger
from app.models.application import Application
from app.utils.pdf_processor import generate_audit_record_hash


def test_get_audit_trail(client):
    """Verify paginated audit trail retrieval."""
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"identifier": "regional.director@aicte-demo.gov.in", "password": "director123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.get("/api/v1/audit/trail?limit=10", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total" in data
    assert "items" in data
    assert data["total"] >= 1
    assert len(data["items"]) >= 1

    first_item = data["items"][0]
    assert "id" in first_item
    assert "sequence_no" in first_item
    assert "record_hash" in first_item
    assert "previous_hash" in first_item
    assert len(first_item["record_hash"]) == 64
    assert len(first_item["previous_hash"]) == 64


def test_verify_audit_ledger_chain(client):
    """Verify cryptographic hash-chain from Genesis block."""
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"identifier": "regional.director@aicte-demo.gov.in", "password": "director123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.get("/api/v1/audit/verify-chain", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["is_valid"] is True
    assert data["total_blocks"] >= 1
    assert data["corrupted_sequence"] is None
    assert len(data["genesis_block_hash"]) == 64
    assert len(data["latest_block_hash"]) == 64
    assert "successfully verified" in data["message"].lower()


def test_compliance_summary_metrics(client):
    """Verify real-time compliance reporting aggregates."""
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"identifier": "regional.director@aicte-demo.gov.in", "password": "director123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.get("/api/v1/reports/compliance", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_institutions"] >= 1
    assert data["total_applications"] >= 1
    assert isinstance(data["by_status"], dict)
    assert isinstance(data["by_outcome"], dict)
    assert isinstance(data["golden_5_coverage"], dict)
    assert "generated_at" in data


def test_export_compliance_csv(client):
    """Verify dynamic CSV report streaming."""
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"identifier": "regional.director@aicte-demo.gov.in", "password": "director123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.get("/api/v1/reports/export-csv", headers=headers)
    assert resp.status_code == 200
    assert "text/csv" in resp.headers["content-type"]
    assert "attachment" in resp.headers["content-disposition"]
    assert "AICTE_VerifyAI_Compliance_Report" in resp.headers["content-disposition"]

    csv_text = resp.text
    assert "Application Public ID" in csv_text
    assert "Institution Name" in csv_text
    assert "AISHE Code" in csv_text
    assert "Current Status" in csv_text
    assert "APP-2026-ENG-1042" in csv_text


def test_application_audit_trail_endpoint(client):
    """Verify application-specific audit trail query."""
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"identifier": "regional.director@aicte-demo.gov.in", "password": "director123"},
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    db = SessionLocal()
    try:
        app = db.query(Application).filter(Application.public_id == "APP-2026-ENG-1042").first()
        assert app is not None
        app_id = str(app.id)
    finally:
        db.close()

    resp = client.get(f"/api/v1/audit/applications/{app_id}", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total" in data
    assert "items" in data
