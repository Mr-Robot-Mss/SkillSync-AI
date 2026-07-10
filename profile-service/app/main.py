from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import (
    profile,
    projects,
    settings as settings_router,
    skills,
)


app = FastAPI(
    title="SkillSync Profile Service",
    version="2.0.0",
)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if settings.frontend_url:
    frontend_origin = settings.frontend_url.rstrip("/")

    if frontend_origin not in allowed_origins:
        allowed_origins.append(frontend_origin)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    profile.router,
    prefix="/api/profile",
    tags=["Profile"],
)

app.include_router(
    skills.router,
    prefix="/api/skills",
    tags=["Skills"],
)

app.include_router(
    projects.router,
    prefix="/api/projects",
    tags=["Projects"],
)

app.include_router(
    settings_router.router,
    prefix="/api/settings",
    tags=["Settings"],
)


@app.get("/")
def root():
    return {
        "service": "profile-service",
        "status": "OK",
        "version": "2.0.0",
    }


@app.get("/api/health")
def health():
    return {
        "status": "OK",
        "service": "profile-service",
    }