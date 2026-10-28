import pytest
import uuid
from fastapi.testclient import TestClient

from app.main import app
from app.core.security import create_access_token
from app.models import User, Application, RuleDefinition, RuleResult, Escalation, Finding
from app.compliance.deduplication_engine import deduplication_engine
from app.compliance.rule_engine import compliance_rule_engine

client = TestClient(app)


def get_auth_headers(db_session, role="verification"):
    user = db_session.query(User).filter(User.role == role).first()
    if not user:
        user = db_session.query(User).first()
    token = create_access_token(subject=str(user.id), role=user.role, email=user.email)
    return {"Authorization": f"Bearer {token}"}


def test_list_regulatory_rule_definitions(db_session):
    headers = get_auth_headers(db_session, role="verification")
    res = client.get("/api/v1/rules", headers=headers)
    assert res.status_code == 200
    rules = res.json()
    assert len(rules) >= 5

    rule_codes = [r["rule_code"] for r in rules]
    assert "APH-LAND-01" in rule_codes
    assert "APH-FIRE-01" in rule_codes
    assert "APH-SFR-01" in rule_codes
    assert "APH-CADRE-01" in rule_codes
    assert "APH-DEDUP-01" in rule_codes


def test_evaluate_application_rules(db_session):
    headers = get_auth_headers(db_session, role="verification")
    app_obj = db_session.query(Application).first()
    assert app_obj is not None

    res = client.post(f"/api/v1/applications/{app_obj.id}/rules/evaluate", headers=headers)
    assert res.status_code == 200
    data = res.json()

    assert data["application_id"] == str(app_obj.id)
    assert data["total_rules_count"] >= 5
    assert data["passed_rules_count"] >= 1
    assert "results" in data

    codes = [r["rule_code"] for r in data["results"]]
    assert "APH-LAND-01" in codes
    assert "APH-FIRE-01" in codes


def test_get_application_rule_results(db_session):
    headers = get_auth_headers(db_session, role="college")
    app_obj = db_session.query(Application).first()
    assert app_obj is not None

    # First evaluate
    compliance_rule_engine.evaluate_application(db_session, app_obj.id)

    res = client.get(f"/api/v1/applications/{app_obj.id}/rules", headers=headers)
    assert res.status_code == 200
    results = res.json()
    assert len(results) >= 5

    for r in results:
        assert r["result_status"] in ("Passed", "Review Required", "Failed")
        assert len(r["explanation"]) > 5
        assert r["rule_code"] is not None


def test_faculty_deduplication_clean_scan(db_session):
    headers = get_auth_headers(db_session, role="verification")
    app_obj = db_session.query(Application).first()
    assert app_obj is not None

    res = client.get(f"/api/v1/applications/{app_obj.id}/deduplication", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["application_id"] == str(app_obj.id)
    assert data["status"] in ("clean", "collision_detected")


def test_faculty_deduplication_fraud_collision_and_escalation(db_session):
    """
    Test ghost faculty fraud scenario:
    Simulates Vidyapeeth College concurrently claiming Dr. Rajesh K. Sharma (who is registered at BITS Bhopal).
    Verifies automatic escalation, danger finding, and priority elevation.
    """
    # Find or use the second application (or Vidyapeeth)
    app_obj = (
        db_session.query(Application)
        .order_by(Application.created_at.desc())
        .first()
    )
    assert app_obj is not None

    fraud_roster = [
        {
            "faculty_name": "Dr. Rajesh K. Sharma",
            "pan": "ABCPS1234F",
            "department": "Computer Science & Engineering",
            "designation": "Professor (Ghost Claim)",
        }
    ]

    # Run deduplication scan with fraud roster
    scan_result = deduplication_engine.scan_application_faculty(
        db=db_session,
        application=app_obj,
        faculty_roster=fraud_roster,
    )

    assert scan_result["status"] == "collision_detected"
    assert scan_result["collision_count"] >= 1
    assert scan_result["escalation_id"] is not None

    # Verify Escalation record in database
    esc = (
        db_session.query(Escalation)
        .filter(Escalation.application_id == app_obj.id)
        .order_by(Escalation.created_at.desc())
        .first()
    )
    assert esc is not None
    assert "Faculty Sharing Collision" in esc.reason
    assert "Regional Director" in esc.senior_authority
    assert esc.status == "Escalated to Regional Director"

    # Verify Danger Finding was recorded
    finding = (
        db_session.query(Finding)
        .filter(Finding.application_id == app_obj.id, Finding.finding_type == "faculty_duplicate")
        .first()
    )
    assert finding is not None
    assert finding.severity == "danger"
    assert "Rajesh K. Sharma" in finding.description

    # Verify Application priority and status elevated
    db_session.refresh(app_obj)
    assert app_obj.priority == "High"
    assert app_obj.current_status == "Escalated"
