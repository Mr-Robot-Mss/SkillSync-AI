from app.schemas.coach import CoachProfile, ScoreBreakdown


WEIGHTS = {
    "profile": 25,
    "skills": 25,
    "roadmap": 20,
    "cv": 15,
    "activity": 15,
}


def _percentage(part: int, total: int) -> int:
    if total <= 0:
        return 0
    return min(100, round((part / total) * 100))


def calculate_score_breakdown(profile: CoachProfile) -> ScoreBreakdown:
    required = {skill.strip().lower() for skill in profile.required_skills if skill.strip()}
    current = {skill.strip().lower() for skill in profile.skills if skill.strip()}

    skills_score = 100 if not required and current else _percentage(len(required & current), len(required))
    roadmap_score = _percentage(
        profile.activity.completed_roadmap_steps,
        profile.activity.total_roadmap_steps,
    )

    activity_events = (
        profile.activity.saved_jobs
        + profile.activity.applications * 2
        + profile.activity.interviews * 3
    )
    activity_score = min(100, activity_events * 10)

    return ScoreBreakdown(
        profile=profile.completion_percentage,
        skills=skills_score,
        roadmap=roadmap_score,
        cv=profile.cv_score,
        activity=activity_score,
    )


def calculate_career_score(breakdown: ScoreBreakdown) -> int:
    weighted_score = sum(
        getattr(breakdown, category) * weight
        for category, weight in WEIGHTS.items()
    ) / 100
    return max(0, min(100, round(weighted_score)))
