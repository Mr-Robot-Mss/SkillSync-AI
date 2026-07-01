from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import jobs, saved_jobs
from app.core.supabase_client import supabase

app = FastAPI(
    title="SkillSync Jobs Service",
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

app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(saved_jobs.router, prefix="/api/saved-jobs", tags=["Saved Jobs"])


@app.get("/")
def root():
    return {"service": "jobs-service", "status": "OK"}


@app.get("/api/health")
def health():
    return {"status": "OK", "service": "jobs-service"}

@app.get("/test-supabase")
def test_supabase():
    response = supabase.table("resultados_de_carrera").select("*").limit(5).execute()
    return response.data