from fastapi import APIRouter

from app.schemas.profile import SkillRequest
from app.services.profile_service import (
    get_skills,
    add_skill,
    delete_skill,
)

router = APIRouter()


@router.get("/")
def skills_root():
    return {"message": "Skills API funcionando"}


@router.get("/me")
def get_my_skills():
    return get_skills()


@router.post("/")
def create_skill(data: SkillRequest):
    return {
        "message": "Skill agregada correctamente",
        "skills": add_skill(data.skill),
    }


@router.delete("/{skill}")
def remove_skill(skill: str):
    return {
        "message": "Skill eliminada correctamente",
        "skills": delete_skill(skill),
    }