from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field


class CoachGoalUpsertRequest(BaseModel):
    user_id: str = Field(min_length=1)
    title: str = Field(min_length=3, max_length=160)
    description: str | None = Field(default=None, max_length=1000)
    target_date: date | None = None
    progress: int = Field(default=0, ge=0, le=100)
    status: Literal["active", "completed", "paused"] = "active"


class CoachGoalResponse(CoachGoalUpsertRequest):
    id: str
    created_at: datetime
    updated_at: datetime
