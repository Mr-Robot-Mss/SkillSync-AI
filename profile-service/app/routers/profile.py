from fastapi import APIRouter

from app.services.profile_service import get_profile

router = APIRouter()


@router.get("/")
def profile_root():
    return get_profile()