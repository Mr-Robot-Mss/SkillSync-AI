from app.schemas.coach import CoachActivity, CoachProfile, CoachSummaryRequest
from app.services.coach_engine import build_coach_summary


def test_build_coach_summary_with_incomplete_profile():
    payload = CoachSummaryRequest(
        user_id="user-1",
        profile=CoachProfile(
            completion_percentage=60,
            target_role="QA Automation Engineer",
            current_level="Junior",
            skills=["Python", "Git"],
            required_skills=["Python", "Git", "Playwright", "Docker"],
            cv_score=55,
            activity=CoachActivity(
                saved_jobs=1,
                applications=0,
                interviews=0,
                completed_roadmap_steps=1,
                total_roadmap_steps=5,
            ),
        ),
    )

    result = build_coach_summary(payload)

    assert result.user_id == "user-1"
    assert 0 <= result.career_score <= 100
    assert result.missing_skills == ["Playwright", "Docker"]
    assert result.recommendations[0].priority == "high"
    assert any(item.id == "complete-profile" for item in result.recommendations)
    assert "perfil" in result.daily_insight.lower()


def test_build_coach_summary_for_strong_profile():
    payload = CoachSummaryRequest(
        user_id="user-2",
        profile=CoachProfile(
            completion_percentage=100,
            target_role="Backend Developer",
            current_level="Junior",
            skills=["Python", "FastAPI", "Docker"],
            required_skills=["Python", "FastAPI", "Docker"],
            cv_score=90,
            activity=CoachActivity(
                saved_jobs=4,
                applications=5,
                interviews=3,
                completed_roadmap_steps=5,
                total_roadmap_steps=5,
            ),
        ),
    )

    result = build_coach_summary(payload)

    assert result.career_score >= 85
    assert result.missing_skills == []
    assert result.recommendations[0].id == "maintain-momentum"
    assert "bien posicionado" in result.daily_insight.lower()
