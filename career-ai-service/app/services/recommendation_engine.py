from app.schemas.coach import CoachProfile, CoachRecommendation, ScoreBreakdown


def _missing_skills(profile: CoachProfile) -> list[str]:
    current = {skill.strip().lower() for skill in profile.skills if skill.strip()}
    return [
        skill.strip()
        for skill in profile.required_skills
        if skill.strip() and skill.strip().lower() not in current
    ]


def generate_recommendations(
    profile: CoachProfile,
    breakdown: ScoreBreakdown,
) -> tuple[list[str], list[CoachRecommendation]]:
    missing_skills = _missing_skills(profile)
    recommendations: list[CoachRecommendation] = []

    if breakdown.profile < 80:
        recommendations.append(
            CoachRecommendation(
                id="complete-profile",
                title="Completa tu perfil profesional",
                description=(
                    "Agrega tu experiencia, enlaces profesionales y objetivo laboral "
                    "para mejorar la precisión de las recomendaciones."
                ),
                impact=8,
                priority="high",
                action_label="Completar perfil",
                action_path="/profile",
            )
        )

    if missing_skills:
        skill = missing_skills[0]
        recommendations.append(
            CoachRecommendation(
                id=f"learn-{skill.lower().replace(' ', '-')}",
                title=f"Prioriza {skill}",
                description=(
                    f"{skill} es una habilidad relevante para tu objetivo como "
                    f"{profile.target_role}. Inclúyela en tu próximo bloque de estudio."
                ),
                impact=10,
                priority="high",
                action_label="Ver roadmap",
                action_path="/career-roadmap",
            )
        )

    if breakdown.roadmap < 60:
        recommendations.append(
            CoachRecommendation(
                id="advance-roadmap",
                title="Avanza en tu roadmap",
                description=(
                    "Completa al menos un paso pendiente esta semana para mantener "
                    "un progreso profesional constante."
                ),
                impact=7,
                priority="medium",
                action_label="Continuar roadmap",
                action_path="/career-roadmap",
            )
        )

    if breakdown.cv < 75:
        recommendations.append(
            CoachRecommendation(
                id="improve-cv",
                title="Mejora tu CV para filtros ATS",
                description=(
                    "Optimiza palabras clave, logros medibles y estructura para aumentar "
                    "tu compatibilidad con las vacantes."
                ),
                impact=9,
                priority="high",
                action_label="Optimizar CV",
                action_path="/cv-builder",
            )
        )

    if breakdown.activity < 40:
        recommendations.append(
            CoachRecommendation(
                id="increase-activity",
                title="Activa tu búsqueda laboral",
                description=(
                    "Guarda ofertas relevantes, postula a oportunidades compatibles y "
                    "practica al menos una entrevista."
                ),
                impact=6,
                priority="medium",
                action_label="Ver oportunidades",
                action_path="/market",
            )
        )

    if not recommendations:
        recommendations.append(
            CoachRecommendation(
                id="maintain-momentum",
                title="Mantén tu ritmo",
                description=(
                    "Tu perfil está bien encaminado. Revisa nuevas ofertas y completa "
                    "el siguiente desafío de tu roadmap."
                ),
                impact=4,
                priority="low",
                action_label="Ver oportunidades",
                action_path="/market",
            )
        )

    priority_order = {"high": 0, "medium": 1, "low": 2}
    recommendations.sort(
        key=lambda item: (priority_order[item.priority], -item.impact)
    )

    return missing_skills, recommendations[:4]
