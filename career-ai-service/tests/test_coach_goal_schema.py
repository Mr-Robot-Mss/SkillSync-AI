import pytest
from pydantic import ValidationError

from app.schemas.coach_goal import CoachGoalUpsertRequest


def test_goal_accepts_valid_progress_and_status():
    goal = CoachGoalUpsertRequest(
        user_id="demo-user",
        title="Conseguir empleo como QA Automation Engineer",
        progress=35,
        status="active",
    )

    assert goal.progress == 35
    assert goal.status == "active"


def test_goal_rejects_progress_above_one_hundred():
    with pytest.raises(ValidationError):
        CoachGoalUpsertRequest(
            user_id="demo-user",
            title="Mejorar perfil profesional",
            progress=101,
        )
