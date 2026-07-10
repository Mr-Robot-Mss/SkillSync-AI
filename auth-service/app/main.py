from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth


app = FastAPI(
    title="SkillSync Auth Service",
    version="1.0.0",
    description="Autenticación institucional para SkillSync-AI.",
)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if settings.frontend_url:
    origin = settings.frontend_url.rstrip("/")

    if origin not in allowed_origins:
        allowed_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Auth"],
)


@app.get("/")
def root():
    return {
        "service": "auth-service",
        "status": "OK",
    }


@app.get("/api/health")
def health():
    return {
        "status": "OK",
        "service": "auth-service",
    }