from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_profile_root():
    response = client.get("/")
    assert response.status_code == 200


def test_profile_health():
    response = client.get("/api/health")
    assert response.status_code == 200