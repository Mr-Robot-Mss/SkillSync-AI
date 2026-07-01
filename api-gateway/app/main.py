from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import gateway


app = FastAPI(
    title="SkillSync API Gateway",
    version="1.0.0",
    description="BFF encargado de centralizar la comunicación entre el frontend y los microservicios.",
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
    gateway.router,
    prefix="/api",
    tags=["API Gateway"],
)


@app.get("/")
def root():
    return {
        "service": "api-gateway",
        "status": "OK",
        "description": "BFF centralizado para SkillSync-AI",
    }


@app.get("/api/health")
def health():
    return {
        "status": "OK",
        "service": "api-gateway",
        "microservices": {
            "auth": settings.auth_service_url,
            "profile": settings.profile_service_url,
            "jobs": settings.jobs_service_url,
            "career_ai": settings.career_ai_service_url,
        },
    }