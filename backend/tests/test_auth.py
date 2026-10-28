import pytest


def test_login_success_all_roles(client):
    credentials = [
        ("admin.sih@aicte-demo.gov.in", "admin123", "admin"),
        ("principal@engg-college.demo.edu.in", "college123", "college"),
        ("scrutiny.officer@aicte-demo.gov.in", "officer123", "verification"),
        ("regional.director@aicte-demo.gov.in", "director123", "senior-officer"),
    ]

    for email, password, expected_role in credentials:
        response = client.post(
            "/api/v1/auth/login",
            json={"identifier": email, "password": password},
        )
        assert response.status_code == 200, f"Failed for {email}: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == email
        assert data["user"]["role"] == expected_role


def test_login_by_official_id(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"identifier": "AICTE-ADM-001", "password": "admin123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "admin"
    assert data["user"]["official_id"] == "AICTE-ADM-001"


def test_login_wrong_password(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"identifier": "admin.sih@aicte-demo.gov.in", "password": "wrongpassword999"},
    )
    assert response.status_code == 401
    assert "Invalid email / User ID or password" in response.json()["detail"]


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"identifier": "ghost@nonexistent.gov.in", "password": "somepassword"},
    )
    assert response.status_code == 401


def test_auth_me_endpoint(client):
    # Log in first
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"identifier": "principal@engg-college.demo.edu.in", "password": "college123"},
    )
    token = login_resp.json()["access_token"]

    # Call /auth/me with Bearer token
    me_resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_resp.status_code == 200
    user_data = me_resp.json()
    assert user_data["email"] == "principal@engg-college.demo.edu.in"
    assert user_data["role"] == "college"
    assert user_data["institution"] is not None
    assert user_data["institution"]["aishe_code"] == "C-49210"


def test_auth_me_without_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_auth_me_invalid_token(client):
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid.token.payload"},
    )
    assert response.status_code == 401


def test_logout_endpoint(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"identifier": "admin.sih@aicte-demo.gov.in", "password": "admin123"},
    )
    token = login_resp.json()["access_token"]

    logout_resp = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert logout_resp.status_code == 200
    assert logout_resp.json()["status"] == "success"
