from fastapi import APIRouter
from pydantic import BaseModel

from app.data.profile_store import PROFILE

router = APIRouter()

USER_SKILLS = ["SQL", "Python", "Power BI", "Postman", "Testing"]


class SkillRequest(BaseModel):
    skill: str


@router.get("/")
def skills_root():
    return {"message": "Skills API funcionando"}


@router.get("/me")
def get_my_skills():
    return {
        "primary_role": PROFILE.get("primary_role", "Data Analyst"),
        "skills": USER_SKILLS,
    }


@router.post("/")
def add_skill(data: SkillRequest):
    if data.skill not in USER_SKILLS:
        USER_SKILLS.append(data.skill)

    return {
        "message": "Skill agregada correctamente",
        "skills": USER_SKILLS,
    }


@router.delete("/{skill}")
def delete_skill(skill: str):
    if skill in USER_SKILLS:
        USER_SKILLS.remove(skill)

    return {
        "message": "Skill eliminada correctamente",
        "skills": USER_SKILLS,
    }