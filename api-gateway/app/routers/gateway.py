import requests

from fastapi import APIRouter, HTTPException, Request
from app.core.config import settings


router = APIRouter()


def forward_request(method: str, url: str, body=None, params=None):
    try:
        response = requests.request(
            method=method,
            url=url,
            json=body,
            params=params,
            timeout=15,
        )

        try:
            data = response.json()
        except Exception:
            data = response.text

        return data

    except requests.exceptions.RequestException as error:
        raise HTTPException(
            status_code=503,
            detail=f"No se pudo conectar con el microservicio: {str(error)}",
        )


@router.get("/gateway")
def gateway_root():
    return {
        "message": "API Gateway funcionando correctamente",
        "services": {
            "auth": settings.auth_service_url,
            "profile": settings.profile_service_url,
            "jobs": settings.jobs_service_url,
            "career_ai": settings.career_ai_service_url,
        },
    }


# AUTH SERVICE
@router.post("/auth/login")
async def auth_login(request: Request):
    body = await request.json()
    return forward_request(
        "POST",
        f"{settings.auth_service_url}/api/auth/login",
        body=body,
    )


@router.post("/auth/register")
async def auth_register(request: Request):
    body = await request.json()
    return forward_request(
        "POST",
        f"{settings.auth_service_url}/api/auth/register",
        body=body,
    )


# PROFILE SERVICE
@router.get("/profile")
def get_profile():
    return forward_request(
        "GET",
        f"{settings.profile_service_url}/api/profile",
    )


@router.get("/profile/skills")
def get_profile_skills():
    return forward_request(
        "GET",
        f"{settings.profile_service_url}/api/profile/skills",
    )


@router.post("/profile/skills")
async def add_profile_skill(request: Request):
    body = await request.json()
    return forward_request(
        "POST",
        f"{settings.profile_service_url}/api/profile/skills",
        body=body,
    )


@router.get("/profile/projects")
def get_profile_projects():
    return forward_request(
        "GET",
        f"{settings.profile_service_url}/api/profile/projects",
    )


@router.post("/profile/projects")
async def create_profile_project(request: Request):
    body = await request.json()
    return forward_request(
        "POST",
        f"{settings.profile_service_url}/api/profile/projects",
        body=body,
    )


@router.get("/profile/settings")
def get_profile_settings():
    return forward_request(
        "GET",
        f"{settings.profile_service_url}/api/profile/settings",
    )


@router.put("/profile/settings")
async def update_profile_settings(request: Request):
    body = await request.json()
    return forward_request(
        "PUT",
        f"{settings.profile_service_url}/api/profile/settings",
        body=body,
    )


# JOBS SERVICE
@router.get("/jobs/chile-tech")
def get_jobs():
    return forward_request(
        "GET",
        f"{settings.jobs_service_url}/api/jobs/chile-tech",
    )


@router.get("/jobs/recommended")
def get_recommended_jobs(primary_role: str = "Data Analyst"):
    return forward_request(
        "GET",
        f"{settings.jobs_service_url}/api/jobs/recommended",
        params={"primary_role": primary_role},
    )


@router.post("/jobs/sync")
def sync_jobs():
    return forward_request(
        "POST",
        f"{settings.jobs_service_url}/api/jobs/sync",
    )


@router.get("/saved-jobs/all")
def get_saved_jobs():
    return forward_request(
        "GET",
        f"{settings.jobs_service_url}/api/saved-jobs/all",
    )


@router.post("/saved-jobs/save")
async def save_job(request: Request):
    body = await request.json()
    return forward_request(
        "POST",
        f"{settings.jobs_service_url}/api/saved-jobs/save",
        body=body,
    )


@router.delete("/saved-jobs/{job_id}")
def delete_saved_job(job_id: int):
    return forward_request(
        "DELETE",
        f"{settings.jobs_service_url}/api/saved-jobs/{job_id}",
    )


# CAREER AI SERVICE
@router.post("/onboarding/analyze")
async def onboarding_analyze(request: Request):
    body = await request.json()
    return forward_request(
        "POST",
        f"{settings.career_ai_service_url}/api/onboarding/analyze",
        body=body,
    )


@router.post("/ai/assistant")
async def ai_assistant(request: Request):
    body = await request.json()
    return forward_request(
        "POST",
        f"{settings.career_ai_service_url}/api/ai/assistant",
        body=body,
    )


@router.get("/ai/skill-gap")
def skill_gap():
    return forward_request(
        "GET",
        f"{settings.career_ai_service_url}/api/ai/skill-gap",
    )


@router.get("/roadmap/my-roadmap")
def my_roadmap():
    return forward_request(
        "GET",
        f"{settings.career_ai_service_url}/api/roadmap/my-roadmap",
    )


@router.post("/interview/question")
async def interview_question(request: Request):
    body = await request.json()
    return forward_request(
        "POST",
        f"{settings.career_ai_service_url}/api/interview/question",
        body=body,
    )


@router.post("/interview/evaluate")
async def interview_evaluate(request: Request):
    body = await request.json()
    return forward_request(
        "POST",
        f"{settings.career_ai_service_url}/api/interview/evaluate",
        body=body,
    )


@router.post("/cv/analyze")
async def cv_analyze(request: Request):
    body = await request.json()
    return forward_request(
        "POST",
        f"{settings.career_ai_service_url}/api/cv/analyze",
        body=body,
    )