from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.supabase_client import supabase
from app.routers import jobs, saved_jobs
from app.services.adzuna_service import search_chile_jobs

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

# Routers internos
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(saved_jobs.router, prefix="/api/saved-jobs", tags=["Saved Jobs"])


@app.get("/")
def root():
    return {
        "service": "jobs-service",
        "status": "OK"
    }


@app.get("/api/health")
def health():
    return {
        "status": "OK",
        "service": "jobs-service"
    }


@app.get("/test-supabase")
def test_supabase():
    response = supabase.table("resultados_de_carrera").select("*").limit(5).execute()
    return response.data


# ==============================
# API EXTERNA - EMPLEOS CHILE
# ==============================

@app.get("/api/jobs/external", tags=["External Jobs"])
async def get_external_jobs(
    query: str = Query(default="developer"),
    limit: int = Query(default=10, ge=1, le=50)
):
    jobs = await search_chile_jobs(
        query=query,
        results_per_page=limit
    )

    return {
        "country": "Chile",
        "source": "Adzuna",
        "total": len(jobs),
        "results": jobs
    }