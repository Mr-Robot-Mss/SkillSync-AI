from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.supabase_client import supabase

from app.core.config import settings
from app.routers import auth

app = FastAPI(
    title="SkillSync Auth Service",
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

@app.get("/test-supabase")
def test_supabase():
    response = supabase.table("users").select("*").limit(5).execute()
    return response.data