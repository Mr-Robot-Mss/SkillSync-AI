from fastapi import APIRouter

from app.schemas.profile import SkillRequest
from app.services.profile_service import (
    add_skill,
    delete_skill,
    get_skills,
)


router = APIRouter()


@router.get("/{user_id}")
def user_skills(user_id: str):
    return get_skills(user_id)


@router.post("/{user_id}")
def create_user_skill(
    user_id: str,
    data: SkillRequest,
):
    return {
        "message": "Habilidad agregada correctamente",
        "skills": add_skill(
            user_id,
            data.skill,
            data.level,
        ),
    }


@router.delete("/{user_id}/{skill}")
def remove_user_skill(
    user_id: str,
    skill: str,
):
    return {
        "message": "Habilidad eliminada correctamente",
        "skills": delete_skill(
            user_id,
            skill,
        ),
    }