from typing import Literal

from pydantic import BaseModel, Field


class CoachActivity(BaseModel):
    saved_jobs: int = Field(default=0, ge=0)
    applications: int = Field(default=0, ge=0)
    interviews: int = Field(default=0, ge=0)
    completed_roadmap_steps: int = Field(default=0, ge=0)
    total_roadmap_steps: int = Field(default=0, ge=0)


class CoachProfile(BaseModel):
    completion_percentage: int = Field(default=0, ge=0, le=100)
    target_role: str = "Profesional TI"
    current_level: str = "Junior"
    skills: list[str] = Field(default_factory=list)
    required_skills: list[str] = Field(default_factory=list)
    cv_score: int = Field(default=0, ge=0, le=100)
    activity: CoachActivity = Field(default_factory=CoachActivity)


class CoachSummaryRequest(BaseModel):
    user_id: str = "demo-user"
    profile: CoachProfile = Field(default_factory=CoachProfile)


class ScoreBreakdown(BaseModel):
    profile: int
    skills: int
    roadmap: int
    cv: int
    activity: int


class CoachRecommendation(BaseModel):
    id: str
    title: str
    description: str
    impact: int = Field(ge=1, le=10)
    priority: Literal["high", "medium", "low"]
    action_label: str
    action_path: str


class CoachSummaryResponse(BaseModel):
    user_id: str
    career_score: int = Field(ge=0, le=100)
    score_breakdown: ScoreBreakdown
    goal: str
    current_level: str
    missing_skills: list[str]
    recommendations: list[CoachRecommendation]
    daily_insight: str
