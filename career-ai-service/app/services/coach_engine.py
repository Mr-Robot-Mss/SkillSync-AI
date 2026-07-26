from app.schemas.coach import CoachSummaryRequest, CoachSummaryResponse
from app.services.recommendation_engine import generate_recommendations
from app.services.scoring_engine import (
    calculate_career_score,
    calculate_score_breakdown,
)


def _build_daily_insight(
    request: CoachSummaryRequest,
    career_score: int,
    missing_skills: list[str],
) -> str:
    role = request.profile.target_role

    if request.profile.completion_percentage < 80:
        return (
            f"Tu perfil para {role} aún puede mejorar. Completar la información "
            "profesional aumentará la precisión de tu Career Score."
        )

    if missing_skills:
        return (
            f"Tu siguiente mejor paso para acercarte a {role} es fortalecer "
            f"{missing_skills[0]}."
        )

    if request.profile.cv_score < 75:
        return (
            f"Tu Career Score es {career_score}%. Optimizar tu CV puede aumentar "
            "tu visibilidad frente a reclutadores y filtros ATS."
        )

    if career_score >= 85:
        return (
            f"Tu perfil está bien posicionado para oportunidades de {role}. "
            "Mantén el avance y revisa nuevas vacantes compatibles."
        )

    return (
        f"Tu Career Score actual es {career_score}%. Completar una acción esta semana "
        "te ayudará a mantener un progreso constante."
    )


def build_coach_summary(request: CoachSummaryRequest) -> CoachSummaryResponse:
    breakdown = calculate_score_breakdown(request.profile)
    career_score = calculate_career_score(breakdown)
    missing_skills, recommendations = generate_recommendations(
        request.profile,
        breakdown,
    )

    return CoachSummaryResponse(
        user_id=request.user_id,
        career_score=career_score,
        score_breakdown=breakdown,
        goal=request.profile.target_role,
        current_level=request.profile.current_level,
        missing_skills=missing_skills,
        recommendations=recommendations,
        daily_insight=_build_daily_insight(
            request,
            career_score,
            missing_skills,
        ),
    )
