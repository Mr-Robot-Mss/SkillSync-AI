from urllib.parse import quote

import requests
from fastapi import (
    APIRouter,
    File,
    HTTPException,
    Request,
    UploadFile,
)

from app.core.config import settings


router = APIRouter()


# ======================================================
# UTILIDAD PARA REENVIAR PETICIONES
# ======================================================

def forward_request(
    method: str,
    url: str,
    body=None,
    params=None,
    files=None,
    timeout: int = 30,
):
    try:
        response = requests.request(
            method=method,
            url=url,
            json=body if files is None else None,
            params=params,
            files=files,
            timeout=timeout,
        )

        try:
            data = response.json()
        except ValueError:
            data = response.text

        if response.status_code >= 400:
            if isinstance(data, dict):
                detail = data.get("detail", data)
            else:
                detail = data or "Error en el microservicio"

            raise HTTPException(
                status_code=response.status_code,
                detail=detail,
            )

        return data

    except HTTPException:
        raise

    except requests.exceptions.Timeout as error:
        raise HTTPException(
            status_code=504,
            detail=f"Tiempo de espera agotado al consultar el microservicio: {error}",
        ) from error

    except requests.exceptions.RequestException as error:
        raise HTTPException(
            status_code=503,
            detail=f"No se pudo conectar con el microservicio: {error}",
        ) from error


# ======================================================
# API GATEWAY
# ======================================================

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


# ======================================================
# AUTH SERVICE
# ======================================================

@router.post("/auth/login")
async def auth_login(request: Request):
    body = await request.json()

    return forward_request(
        method="POST",
        url=f"{settings.auth_service_url}/api/auth/login",
        body=body,
    )


@router.post("/auth/register")
async def auth_register(request: Request):
    body = await request.json()

    return forward_request(
        method="POST",
        url=f"{settings.auth_service_url}/api/auth/register",
        body=body,
    )


@router.put("/auth/change-password")
async def auth_change_password(request: Request):
    body = await request.json()

    return forward_request(
        method="PUT",
        url=f"{settings.auth_service_url}/api/auth/change-password",
        body=body,
    )


# ======================================================
# PROFILE SERVICE
# ======================================================

@router.get("/profile/{user_id}")
def get_user_profile(user_id: str):
    return forward_request(
        method="GET",
        url=f"{settings.profile_service_url}/api/profile/{user_id}",
    )


@router.put("/profile/{user_id}")
async def update_user_profile(
    user_id: str,
    request: Request,
):
    body = await request.json()

    return forward_request(
        method="PUT",
        url=f"{settings.profile_service_url}/api/profile/{user_id}",
        body=body,
    )


@router.put("/profile/{user_id}/about")
async def update_user_about(
    user_id: str,
    request: Request,
):
    body = await request.json()

    return forward_request(
        method="PUT",
        url=(
            f"{settings.profile_service_url}"
            f"/api/profile/{user_id}/about"
        ),
        body=body,
    )


@router.post("/profile/{user_id}/avatar")
async def upload_user_avatar(
    user_id: str,
    file: UploadFile = File(...),
):
    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="El archivo está vacío",
        )

    files = {
        "file": (
            file.filename or "avatar",
            content,
            file.content_type or "application/octet-stream",
        )
    }

    return forward_request(
        method="POST",
        url=(
            f"{settings.profile_service_url}"
            f"/api/profile/{user_id}/avatar"
        ),
        files=files,
        timeout=60,
    )


# ======================================================
# PROFILE SKILLS
# ======================================================

@router.get("/profile/{user_id}/skills")
def get_user_skills(user_id: str):
    return forward_request(
        method="GET",
        url=f"{settings.profile_service_url}/api/skills/{user_id}",
    )


@router.post("/profile/{user_id}/skills")
async def add_user_skill(
    user_id: str,
    request: Request,
):
    body = await request.json()

    return forward_request(
        method="POST",
        url=f"{settings.profile_service_url}/api/skills/{user_id}",
        body=body,
    )


@router.delete("/profile/{user_id}/skills/{skill}")
def remove_user_skill(
    user_id: str,
    skill: str,
):
    encoded_skill = quote(skill, safe="")

    return forward_request(
        method="DELETE",
        url=(
            f"{settings.profile_service_url}"
            f"/api/skills/{user_id}/{encoded_skill}"
        ),
    )


# ======================================================
# PROFILE PROJECTS
# ======================================================

@router.get("/profile/{user_id}/projects")
def get_user_projects(user_id: str):
    return forward_request(
        method="GET",
        url=f"{settings.profile_service_url}/api/projects/{user_id}",
    )


@router.post("/profile/{user_id}/projects")
async def create_user_project(
    user_id: str,
    request: Request,
):
    body = await request.json()

    return forward_request(
        method="POST",
        url=f"{settings.profile_service_url}/api/projects/{user_id}",
        body=body,
    )


# ======================================================
# PROFILE SETTINGS
# ======================================================

@router.get("/profile/{user_id}/settings")
def get_user_settings(user_id: str):
    return forward_request(
        method="GET",
        url=f"{settings.profile_service_url}/api/settings/{user_id}",
    )


@router.put("/profile/{user_id}/settings")
async def update_user_settings(
    user_id: str,
    request: Request,
):
    body = await request.json()

    return forward_request(
        method="PUT",
        url=f"{settings.profile_service_url}/api/settings/{user_id}",
        body=body,
    )


# ======================================================
# JOBS SERVICE
# ======================================================

@router.get("/jobs/chile-tech")
def get_jobs():
    return forward_request(
        method="GET",
        url=f"{settings.jobs_service_url}/api/jobs/chile-tech",
    )


@router.get("/jobs/recommended")
def get_recommended_jobs(
    primary_role: str = "Data Analyst",
):
    return forward_request(
        method="GET",
        url=f"{settings.jobs_service_url}/api/jobs/recommended",
        params={
            "primary_role": primary_role,
        },
    )


@router.get("/jobs/{job_id}")
def get_job_detail(job_id: int):
    return forward_request(
        method="GET",
        url=f"{settings.jobs_service_url}/api/jobs/{job_id}",
    )


@router.post("/jobs/sync")
def sync_jobs():
    return forward_request(
        method="POST",
        url=f"{settings.jobs_service_url}/api/jobs/sync",
        timeout=60,
    )


# ======================================================
# SAVED JOBS
# ======================================================

@router.get("/saved-jobs/all")
def get_saved_jobs():
    return forward_request(
        method="GET",
        url=f"{settings.jobs_service_url}/api/saved-jobs/all",
    )


@router.post("/saved-jobs/save")
async def save_job(request: Request):
    body = await request.json()

    return forward_request(
        method="POST",
        url=f"{settings.jobs_service_url}/api/saved-jobs/save",
        body=body,
    )


@router.delete("/saved-jobs/{job_id}")
def delete_saved_job(job_id: int):
    return forward_request(
        method="DELETE",
        url=f"{settings.jobs_service_url}/api/saved-jobs/{job_id}",
    )


# ======================================================
# CAREER AI - ONBOARDING
# ======================================================

@router.post("/onboarding/analyze")
async def onboarding_analyze(request: Request):
    body = await request.json()

    return forward_request(
        method="POST",
        url=f"{settings.career_ai_service_url}/api/onboarding/analyze",
        body=body,
    )


# ======================================================
# CAREER AI - ASSISTANT
# ======================================================

@router.post("/ai/assistant")
async def ai_assistant(request: Request):
    body = await request.json()

    return forward_request(
        method="POST",
        url=f"{settings.career_ai_service_url}/api/ai/assistant",
        body=body,
    )


@router.get("/ai/skill-gap")
def skill_gap():
    return forward_request(
        method="GET",
        url=f"{settings.career_ai_service_url}/api/ai/skill-gap",
    )


# ======================================================
# CAREER AI - ROADMAP
# ======================================================

@router.get("/roadmap/my-roadmap")
def my_roadmap(user_id: str = "demo-user"):
    return forward_request(
        method="GET",
        url=(
            f"{settings.career_ai_service_url}"
            f"/api/roadmap/my-roadmap"
        ),
        params={
            "user_id": user_id,
        },
    )


# ======================================================
# CAREER AI - INTERVIEW
# ======================================================

@router.post("/interview/question")
async def interview_question(request: Request):
    body = await request.json()

    return forward_request(
        method="POST",
        url=(
            f"{settings.career_ai_service_url}"
            f"/api/interview/question"
        ),
        body=body,
    )


@router.post("/interview/evaluate")
async def interview_evaluate(request: Request):
    body = await request.json()

    return forward_request(
        method="POST",
        url=(
            f"{settings.career_ai_service_url}"
            f"/api/interview/evaluate"
        ),
        body=body,
    )


# ======================================================
# CAREER AI - CV
# ======================================================

@router.post("/cv/analyze")
async def cv_analyze(request: Request):
    body = await request.json()

    return forward_request(
        method="POST",
        url=f"{settings.career_ai_service_url}/api/cv/analyze",
        body=body,
    )


@router.post("/cv/optimize")
async def cv_optimize(request: Request):
    body = await request.json()

    return forward_request(
        method="POST",
        url=f"{settings.career_ai_service_url}/api/cv/optimize",
        body=body,
    )


# ======================================================
# SUBSCRIPTIONS
# ======================================================

@router.get("/subscriptions/my-plan")
def my_plan(user_id: str = "demo-user"):
    return forward_request(
        method="GET",
        url=(
            f"{settings.career_ai_service_url}"
            f"/api/subscriptions/my-plan"
        ),
        params={
            "user_id": user_id,
        },
    )


@router.post("/subscriptions/activate-premium")
def activate_premium(user_id: str = "demo-user"):
    return forward_request(
        method="POST",
        url=(
            f"{settings.career_ai_service_url}"
            f"/api/subscriptions/activate-premium"
        ),
        params={
            "user_id": user_id,
        },
    )


@router.post("/subscriptions/cancel-premium")
def cancel_premium(user_id: str = "demo-user"):
    return forward_request(
        method="POST",
        url=(
            f"{settings.career_ai_service_url}"
            f"/api/subscriptions/cancel-premium"
        ),
        params={
            "user_id": user_id,
        },
    )


# ======================================================
# DASHBOARD AGGREGATOR
# ======================================================

@router.get("/dashboard/summary")
def dashboard_summary(user_id: str = "demo-user"):
    jobs = forward_request(
        method="GET",
        url=f"{settings.jobs_service_url}/api/jobs/chile-tech",
    )

    saved_jobs = forward_request(
        method="GET",
        url=f"{settings.jobs_service_url}/api/saved-jobs/all",
    )

    roadmap = forward_request(
        method="GET",
        url=(
            f"{settings.career_ai_service_url}"
            f"/api/roadmap/my-roadmap"
        ),
        params={
            "user_id": user_id,
        },
    )

    plan = forward_request(
        method="GET",
        url=(
            f"{settings.career_ai_service_url}"
            f"/api/subscriptions/my-plan"
        ),
        params={
            "user_id": user_id,
        },
    )

    profile = forward_request(
        method="GET",
        url=(
            f"{settings.profile_service_url}"
            f"/api/profile/{user_id}"
        ),
    )

    jobs = jobs if isinstance(jobs, list) else []
    saved_jobs = saved_jobs if isinstance(saved_jobs, list) else []
    roadmap = roadmap if isinstance(roadmap, dict) else {}
    plan = plan if isinstance(plan, dict) else {}
    profile = profile if isinstance(profile, dict) else {}

    current_compatibility = roadmap.get(
        "current_compatibility",
        75,
    )

    target_compatibility = roadmap.get(
        "target_compatibility",
        90,
    )

    return {
        "user_id": user_id,
        "name": profile.get("name") or "Estudiante SkillSync",
        "email": profile.get("email", ""),
        "avatar_url": profile.get("avatar_url", ""),
        "institution": "Duoc UC",
        "recommended_role": (
            profile.get("target_role")
            or roadmap.get("target_role")
            or "QA Automation"
        ),
        "career_score": target_compatibility,
        "employability": current_compatibility,
        "roadmap_progress": 40,
        "jobs_match": len(jobs),
        "saved_jobs": len(saved_jobs),
        "ats_score": 81,
        "plan": plan.get("plan", "free"),
        "is_premium": plan.get("is_premium", False),
        "remaining_questions": (
            5
            if plan.get("plan", "free") == "free"
            else 100
        ),
        "skills": (
            profile.get("skills")
            or roadmap.get("focus", [])
        ),
        "roadmap_steps": roadmap.get("steps", [])[:4],
        "market_insight": roadmap.get("market_insight", ""),
        "opportunities": jobs[:3],
        "chart": [
            {
                "month": "Ene",
                "match": 62,
            },
            {
                "month": "Feb",
                "match": 68,
            },
            {
                "month": "Mar",
                "match": 71,
            },
            {
                "month": "Abr",
                "match": 77,
            },
            {
                "month": "May",
                "match": current_compatibility,
            },
            {
                "month": "Jun",
                "match": target_compatibility,
            },
        ],
    }

@router.post("/onboarding/analyze")
async def onboarding_analyze(request: Request):
    body = await request.json()

    return forward_request(
        method="POST",
        url=(
            f"{settings.career_ai_service_url}"
            f"/api/onboarding/analyze"
        ),
        body=body,
    )