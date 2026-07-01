from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import notifications

app = FastAPI(
    title="SkillSync Notification Service",
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
    notifications.router,
    prefix="/api/notifications",
    tags=["Notifications"],
)


@app.get("/")
def root():
    return {
        "service": "notification-service",
        "status": "OK",
    }


@app.get("/api/health")
def health():
    return {
        "status": "OK",
        "service": "notification-service",
    }