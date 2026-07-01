from fastapi import APIRouter

from app.schemas.career import CVAnalysisRequest
from app.services.career_ai_service import analyze_cv
from app.data.career_store import CAREER_PROFILE

router = APIRouter()


@router.get("/")
def cv_root():
    return {"message": "CV API funcionando"}


@router.post("/analyze")
def cv_analyze(data: CVAnalysisRequest):
    return analyze_cv(data.role, data.skills, data.projects)


@router.get("/template")
def cv_template():
    role = CAREER_PROFILE.get("primary_role", "QA Automation")

    return {
        "role": role,
        "sections": [
            "Perfil profesional",
            "Habilidades técnicas",
            "Proyectos destacados",
            "Experiencia",
            "Educación",
            "Certificaciones",
        ],
        "tips": [
            "Usa palabras clave del rol objetivo.",
            "Agrega métricas o resultados medibles.",
            "Incluye proyectos técnicos reales.",
            "Mantén una estructura clara y profesional.",
        ],
    }