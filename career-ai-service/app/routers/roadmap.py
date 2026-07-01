from fastapi import APIRouter

from app.services.career_ai_service import get_roadmap

router = APIRouter()


@router.get("/")
def roadmap_root():
    return {"message": "Roadmap API funcionando"}


@router.get("/my-roadmap")
def my_roadmap():
    return get_roadmap()