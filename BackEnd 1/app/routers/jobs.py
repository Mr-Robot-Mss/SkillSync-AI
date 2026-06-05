from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def jobs_root():
    return {"message": "Jobs API funcionando"}