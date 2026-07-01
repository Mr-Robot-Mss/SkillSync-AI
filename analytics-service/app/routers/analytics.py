from fastapi import APIRouter

from app.services.analytics_service import (
    get_platform_stats
)

router = APIRouter()


@router.get("/")
def analytics_root():
    return {
        "message": "Analytics API funcionando"
    }


@router.get("/stats")
def analytics_stats():
    return get_platform_stats()