from fastapi import APIRouter, HTTPException, Query

from app.services.jobs_service import (
    get_all_jobs,
    get_job_detail,
    get_recommended_jobs,
    sync_external_jobs,
)

router = APIRouter()


@router.get("/")
def jobs_root():
    return {"message": "Jobs API funcionando"}


@router.get("/chile-tech")
def chile_tech_jobs():
    return get_all_jobs()


@router.get("/recommended")
def recommended_jobs(primary_role: str = Query(default="Data Analyst")):
    return get_recommended_jobs(primary_role)


@router.post("/sync")
def sync_jobs():
    return sync_external_jobs()


@router.get("/external")
def external_jobs():
    sync_result = sync_external_jobs()
    jobs = get_all_jobs()

    return {
        "message": "Ofertas laborales reales cargadas",
        "sync": sync_result,
        "total": len(jobs),
        "jobs": jobs,
    }


# SIEMPRE AL FINAL
@router.get("/{job_id}")
def job_detail(job_id: int):
    job = get_job_detail(job_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Oferta no encontrada",
        )

    return job