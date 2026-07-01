from fastapi import APIRouter

from app.services.analytics_service import (
    get_reports
)

router = APIRouter()


@router.get("/")
def reports_root():
    return {
        "message": "Reports API funcionando"
    }


@router.get("/summary")
def reports_summary():
    return get_reports()