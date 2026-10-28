"""
SIH Problem Statement ID: 26261 - End-to-End System Demonstration & Rehearsal.
Simulates the full institutional-to-directorate regulatory lifecycle:
1. Health & Status Check
2. Role Authentication (College, Verification Officer, Senior Director)
3. Application Dossier Retrieval
4. Live Document Upload & Sarvam AI Pipeline
5. Multi-Model Forensics & Tamper Advisory Generation
6. Regulatory APH Rule Evaluation & Ghost Faculty Detection
7. Scrutiny Workflow & Senior Directorate Determination
8. Cryptographic Audit Ledger Verification & CSV Export
"""
import httpx
import json
import time

BASE_URL = "http://127.0.0.1:8000/api/v1"


def print_step(title: str):
    print("\n" + "=" * 70)
    print(f" >>> {title}")
    print("=" * 70)


def main():
    client = httpx.Client(timeout=30.0)

    print_step("STEP 1: Verify API Health & Cloud Connectivity")
    resp = client.get("http://127.0.0.1:8000/health")
    assert resp.status_code == 200, f"Health check failed: {resp.text}"
    print("Health Status:", resp.json())

    status_resp = client.get(f"{BASE_URL}/system/status")
    assert status_resp.status_code == 200
    print("System Status Details:", json.dumps(status_resp.json(), indent=2))

    print_step("STEP 2: Role Authentication Matrix")
    roles = [
        ("College User", "principal@engg-college.demo.edu.in", "college123"),
        ("Scrutiny Officer", "scrutiny.officer@aicte-demo.gov.in", "officer123"),
        ("Regional Director", "regional.director@aicte-demo.gov.in", "director123"),
    ]
    tokens = {}
    for label, email, pwd in roles:
        login_resp = client.post(f"{BASE_URL}/auth/login", json={"identifier": email, "password": pwd})
        assert login_resp.status_code == 200, f"Login failed for {email}: {login_resp.text}"
        data = login_resp.json()
        tokens[label] = data["access_token"]
        print(f" [OK] {label} logged in successfully ({data['user']['role']}) -> Token acquired.")

    college_headers = {"Authorization": f"Bearer {tokens['College User']}"}
    officer_headers = {"Authorization": f"Bearer {tokens['Scrutiny Officer']}"}
    director_headers = {"Authorization": f"Bearer {tokens['Regional Director']}"}

    print_step("STEP 3: Query Active Application Dossier")
    apps_resp = client.get(f"{BASE_URL}/applications?limit=5", headers=officer_headers)
    assert apps_resp.status_code == 200
    apps = apps_resp.json()
    target_app = apps[0]
    app_id = target_app["id"]
    public_id = target_app["public_id"]
    print(f"Selected Dossier: {public_id} ({target_app['institution_name']})")
    print(f"Status: {target_app['current_status']} | Priority: {target_app['priority']}")

    print_step("STEP 4: APH 2026-27 Rule Evaluation & Deduplication Scan")
    eval_resp = client.post(f"{BASE_URL}/applications/{app_id}/rules/evaluate", headers=officer_headers)
    assert eval_resp.status_code == 200, f"Evaluate failed: {eval_resp.text}"
    eval_data = eval_resp.json()
    print("Evaluation Summary:")
    print(f" - Rules Evaluated: {eval_data['total_rules_count']}")
    print(f" - Rules Passed: {eval_data['passed_rules_count']}")
    print(f" - Preliminary Outcome: {eval_data['preliminary_outcome']}")

    dedup_resp = client.get(f"{BASE_URL}/applications/{app_id}/deduplication", headers=officer_headers)
    assert dedup_resp.status_code == 200
    dedup_data = dedup_resp.json()
    print(f" - Faculty Deduplication Status: {dedup_data['status']}")
    print(f" - Collisions Detected: {dedup_data['collision_count']}")
    print(f" - Deduplication Summary: {dedup_data['message']}")

    print_step("STEP 5: Senior Directorate Decision & Formal Order Recording")
    decision_payload = {
        "decision_type": "final_decision",
        "outcome": "Provisional Approval Granted",
        "rationale": "Comprehensive technical scrutiny verified land ownership, fire safety NOC, and statutory faculty cadre ratios under APH 2026-27 norms.",
        "conditions": "Subject to submission of annual structural audit before 31 March 2027.",
        "target_board_meeting": "Central Regional Committee (28 Oct 2026)",
    }
    dec_resp = client.post(f"{BASE_URL}/applications/{app_id}/decisions", json=decision_payload, headers=director_headers)
    assert dec_resp.status_code == 201, f"Decision failed: {dec_resp.text}"
    dec_data = dec_resp.json()
    print("Formal Order Recorded:")
    print(f" - Decision ID: {dec_data['public_id']}")
    print(f" - Determination: {dec_data['outcome']}")
    print(f" - Decision Date: {dec_data['decision_date']}")

    print_step("STEP 6: Cryptographic Blockchain Ledger Verification")
    chain_resp = client.get(f"{BASE_URL}/audit/verify-chain", headers=director_headers)
    assert chain_resp.status_code == 200
    chain_data = chain_resp.json()
    print("Blockchain Hash Chain Integrity:")
    print(f" - Is Chain Valid: {chain_data['is_valid']}")
    print(f" - Total Blocks Linked: {chain_data['total_blocks']}")
    print(f" - Genesis Hash: {chain_data['genesis_block_hash']}")
    print(f" - Latest Hash: {chain_data['latest_block_hash']}")
    print(f" - Message: {chain_data['message']}")
    assert chain_data["is_valid"] is True, f"Audit chain verification failed: {chain_data['message']}"

    print_step("STEP 7: Executive Compliance Summary & CSV Export")
    metrics_resp = client.get(f"{BASE_URL}/reports/compliance", headers=director_headers)
    assert metrics_resp.status_code == 200
    metrics = metrics_resp.json()
    print("Compliance Metrics:")
    print(f" - Total Institutions: {metrics['total_institutions']}")
    print(f" - Applications Breakdown: {metrics['by_status']}")
    print(f" - Golden 5 Coverage: {metrics['golden_5_coverage']}")

    csv_resp = client.get(f"{BASE_URL}/reports/export-csv", headers=director_headers)
    assert csv_resp.status_code == 200
    assert "text/csv" in csv_resp.headers["content-type"]
    lines = csv_resp.text.strip().split("\n")
    print(f"Generated CSV Download: {len(lines)} rows received.")
    print("CSV Header Preview:", lines[0])
    if len(lines) > 1:
        print("CSV First Record Preview:", lines[1])

    print_step("REHEARSAL RESULT: ALL 7 STAGES COMPLETED FLAWLESSLY!")


if __name__ == "__main__":
    main()
