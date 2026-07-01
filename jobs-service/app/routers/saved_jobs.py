from fastapi import APIRouter

from app.schemas.jobs import SavedJobRequest
from app.services.jobs_service import (
    get_saved_jobs,
    save_job,
    delete_saved_job,
)

router = APIRouter()


@router.get("/")
def saved_jobs_root():
    return {"message": "Saved Jobs API funcionando"}


@router.get("/all")
def saved_jobs_all():
    return get_saved_jobs()


@router.post("/save")
def saved_jobs_save(job: SavedJobRequest):
    return {
        "message": "Oferta guardada correctamente",
        "saved_jobs": save_job(job.model_dump()),
    }


@router.delete("/{job_id}")
def saved_jobs_delete(job_id: int):
    return {
        "message": "Oferta eliminada correctamente",
        "saved_jobs": delete_saved_job(job_id),
    }