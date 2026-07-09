from fastapi import APIRouter

from app.schemas.career import AssistantRequest
from app.services.career_ai_service import ask_assistant

router = APIRouter()


@router.get("/")
def ai_root():
    return {"message": "AI Assistant API funcionando"}


@router.post("/assistant")
def assistant(data: AssistantRequest):
    return ask_assistant(data.user_id, data.message)


@router.get("/skill-gap")
def skill_gap():
    return {
        "compatibility": 73,
        "current_skills": ["Python", "SQL", "Power BI", "Postman", "Testing"],
        "missing_skills": ["Docker", "AWS", "React", "Selenium"],
        "recommendation": "Aprender Docker, React y Selenium aumentará tu compatibilidad laboral.",
    }