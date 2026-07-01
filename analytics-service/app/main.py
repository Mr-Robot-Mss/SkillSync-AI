from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from app.routers import (
    analytics,
    dashboard,
    reports,
    admin,
)

app = FastAPI(
    title="SkillSync Analytics Service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    analytics.router,
    prefix="/api/analytics",
    tags=["Analytics"],
)

app.include_router(
    dashboard.router,
    prefix="/api/dashboard",
    tags=["Dashboard"],
)

app.include_router(
    reports.router,
    prefix="/api/reports",
    tags=["Reports"],
)

app.include_router(
    admin.router,
    prefix="/api/admin",
    tags=["Admin"],
)


@app.get("/")
def root():
    return {
        "service": "analytics-service",
        "status": "OK",
    }


@app.get("/api/health")
def health():
    return {
        "status": "OK",
        "service": "analytics-service",
    }