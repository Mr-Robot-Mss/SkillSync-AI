from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_auth():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "OK"


def test_root_auth():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "auth-service"