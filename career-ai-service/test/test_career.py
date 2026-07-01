from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_career_health():
    response = client.get("/api/health")
    assert response.status_code == 200


def test_onboarding_analyze():
    payload = {
        "programming": 5,
        "data": 5,
        "infrastructure": 3,
        "design": 2,
        "leadership": 3
    }

    response = client.post("/api/onboarding/analyze", json=payload)
    assert response.status_code == 200
    assert "primary_role" in response.json()


def test_roadmap():
    response = client.get("/api/roadmap/my-roadmap")
    assert response.status_code == 200
    assert "steps" in response.json()