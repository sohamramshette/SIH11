def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "AICTE VerifyAI" in data["message"]
    assert data["problem_statement"] == "SIH26261"
    assert "docs" in data


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "AICTE VerifyAI"


def test_api_v1_system_health(client):
    response = client.get("/api/v1/system/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "1.0.0"


def test_api_v1_system_status(client):
    response = client.get("/api/v1/system/status")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "AICTE VerifyAI"
    assert data["status"] in ["healthy", "degraded"]
    assert data["database"]["status"] == "connected"
    assert "sarvam_ai" in data["services"]
    assert "supabase_storage" in data["services"]
    assert "auth_jwt" in data["services"]


def test_cors_headers(client):
    # Test preflight OPTIONS request from frontend origin
    response = client.options(
        "/api/v1/system/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        }
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
