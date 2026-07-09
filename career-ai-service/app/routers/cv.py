from fastapi import APIRouter

from app.schemas.career import CVAnalysisRequest, CVOptimizeRequest
from app.services.career_ai_service import analyze_cv_advanced, optimize_cv_for_job
from app.data.career_store import CAREER_PROFILE

router = APIRouter()


@router.get("/")
def cv_root():
    return {"message": "CV API funcionando"}


@router.post("/analyze")
def cv_analyze(data: CVAnalysisRequest):
    return analyze_cv_advanced(
        data.user_id,
        data.role,
        data.cv_text,
        data.job_description,
        data.skills,
        data.projects,
    )


@router.post("/optimize")
def cv_optimize(data: CVOptimizeRequest):
    return optimize_cv_for_job(
        data.user_id,
        data.role,
        data.cv_text,
        data.job_description,
    )


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