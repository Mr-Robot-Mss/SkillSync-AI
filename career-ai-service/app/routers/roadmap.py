from fastapi import APIRouter, Query

from app.services.roadmap_engine import generate_career_roadmap

router = APIRouter()


@router.get("/")
def roadmap_root():
    return {"message": "Roadmap API funcionando"}


@router.get("/my-roadmap")
def my_roadmap(user_id: str = Query(default="demo-user")):
    return generate_career_roadmap(user_id)