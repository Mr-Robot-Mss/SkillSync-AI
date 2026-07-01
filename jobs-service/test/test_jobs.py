from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_jobs_root():
    response = client.get("/")
    assert response.status_code == 200


def test_jobs_chile_tech():
    response = client.get("/api/jobs/chile-tech")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_jobs_recommended():
    response = client.get("/api/jobs/recommended?primary_role=Data Analyst")
    assert response.status_code == 200
    assert "jobs" in response.json()