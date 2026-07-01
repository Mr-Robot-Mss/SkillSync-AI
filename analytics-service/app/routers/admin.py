from fastapi import APIRouter

from app.services.analytics_service import (
    get_platform_stats
)

router = APIRouter()


@router.get("/")
def admin_root():
    return {
        "message": "Admin API funcionando"
    }


@router.get("/platform")
def admin_platform():
    return get_platform_stats()