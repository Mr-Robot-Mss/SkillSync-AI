from fastapi import APIRouter

from app.services.analytics_service import (
    get_dashboard_summary,
    get_insights
)

router = APIRouter()


@router.get("/")
def dashboard_root():
    return {
        "message": "Dashboard API funcionando"
    }


@router.get("/summary")
def dashboard_summary():
    return get_dashboard_summary()


@router.get("/insights")
def dashboard_insights():
    return get_insights()