import pytest
import uuid
from fastapi.testclient import TestClient

from app.main import app
from app.core.security import create_access_token
from app.models import User, Application, ClarificationQuery, Escalation, SeniorDecision, AuditLedger

client = TestClient(app)


def get_auth_headers(db_session, role="verification"):
    user = db_session.query(User).filter(User.role == role).first()
    if not user:
        user = db_session.query(User).first()
    token = create_access_token(subject=str(user.id), role=user.role, email=user.email)
    return {"Authorization": f"Bearer {token}"}


def test_list_applications(db_session):
    headers = get_auth_headers(db_session, role="verification")
    res = client.get("/api/v1/applications", headers=headers)
    assert res.status_code == 200
    apps = res.json()
    assert len(apps) >= 1

    app0 = apps[0]
    assert "public_id" in app0
    assert "institution_name" in app0
    assert "current_status" in app0


def test_get_application_details(db_session):
    headers = get_auth_headers(db_session, role="verification")
    app_obj = db_session.query(Application).first()
    assert app_obj is not None

    res = client.get(f"/api/v1/applications/{app_obj.id}", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == str(app_obj.id)
    assert data["public_id"] == app_obj.public_id


def test_create_application_and_timeline(db_session):
    headers = get_auth_headers(db_session, role="college")
    payload = {
        "application_type": "New Technical Program",
        "academic_year": "2026-27",
        "stream": "Engineering & Technology",
        "proposed_course": "B.Tech Artificial Intelligence & Data Science",
        "proposed_intake": 120,
    }
    res = client.post("/api/v1/applications", json=payload, headers=headers)
    assert res.status_code == 201
    created_app = res.json()
    assert created_app["proposed_course"] == payload["proposed_course"]
    app_id = created_app["id"]

    # Verify timeline event was added
    timeline_res = client.get(f"/api/v1/applications/{app_id}/timeline", headers=headers)
    assert timeline_res.status_code == 200
    events = timeline_res.json()
    assert len(events) >= 1
    assert "Application Submitted" in events[0]["stage"]


def test_clarification_query_and_response_lifecycle(db_session):
    officer_headers = get_auth_headers(db_session, role="verification")
    college_headers = get_auth_headers(db_session, role="college")
    app_obj = db_session.query(Application).first()
    assert app_obj is not None

    # 1. Officer issues clarification query
    query_payload = {
        "category": "Fire Safety",
        "subject": "Fire NOC Renewal Verification",
        "description": "Please provide the municipal endorsement counter-foil for recent fire clearance.",
        "response_required": "Scanned municipal seal receipt",
        "due_days": 7,
    }
    q_res = client.post(
        f"/api/v1/applications/{app_obj.id}/queries",
        json=query_payload,
        headers=officer_headers,
    )
    assert q_res.status_code == 201
    q_data = q_res.json()
    query_id = q_data["id"]
    assert q_data["status"] == "Pending College Response"

    # 2. College submits clarification response
    resp_payload = {
        "response_text": "Counter-foil municipal endorsement receipt uploaded and verified by local municipal commissioner.",
    }
    r_res = client.post(
        f"/api/v1/queries/{query_id}/respond",
        json=resp_payload,
        headers=college_headers,
    )
    assert r_res.status_code == 200
    r_data = r_res.json()
    assert query_id in str(r_data["query_id"])

    # 3. List queries for application
    list_res = client.get(f"/api/v1/applications/{app_obj.id}/queries", headers=officer_headers)
    assert list_res.status_code == 200
    queries = list_res.json()
    matching_q = next(q for q in queries if q["id"] == query_id)
    assert matching_q["status"] == "Response Submitted"
    assert len(matching_q["responses"]) >= 1


def test_senior_escalation_lifecycle(db_session):
    officer_headers = get_auth_headers(db_session, role="verification")
    app_obj = db_session.query(Application).first()
    assert app_obj is not None

    esc_payload = {
        "reason": "Suspected Boundary Discrepancy on Revenue Surveyor Map",
        "evidence_summary": "Extracted land parcel borders deviate from sub-registrar registration volume 42.",
        "recommended_next_step": "Direct physical inspection by state revenue squad before grant of EoA.",
        "senior_authority": "Regional Director (Central Region)",
    }
    res = client.post(
        f"/api/v1/applications/{app_obj.id}/escalate",
        json=esc_payload,
        headers=officer_headers,
    )
    assert res.status_code == 201
    esc_data = res.json()
    assert "ESC-" in esc_data["public_id"]
    assert esc_data["status"] == "Escalated to Regional Director"

    # List escalations
    list_res = client.get(f"/api/v1/applications/{app_obj.id}/escalations", headers=officer_headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1


def test_senior_decision_lifecycle(db_session):
    director_headers = get_auth_headers(db_session, role="senior-officer")
    app_obj = db_session.query(Application).first()
    assert app_obj is not None

    decision_payload = {
        "decision_type": "final_decision",
        "outcome": "Provisional Approval",
        "rationale": "Recommended for grant of provisional approval subject to submission of updated fire endorsement by June 2026.",
        "conditions": "Formal compliance affidavit to be submitted within 30 days.",
        "target_board_meeting": "44th Central Regional Scrutiny Board Meeting",
    }
    res = client.post(
        f"/api/v1/applications/{app_obj.id}/decisions",
        json=decision_payload,
        headers=director_headers,
    )
    assert res.status_code == 201
    dec_data = res.json()
    assert "DEC-" in dec_data["public_id"]
    assert dec_data["outcome"] == "Provisional Approval"

    # List decisions
    list_res = client.get(f"/api/v1/applications/{app_obj.id}/decisions", headers=director_headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1
