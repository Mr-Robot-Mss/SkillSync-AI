from fastapi import APIRouter

from app.schemas.coach import CoachSummaryRequest, CoachSummaryResponse
from app.services.coach_engine import build_coach_summary


router = APIRouter()


@router.get("/")
def coach_root():
    return {"message": "AI Career Coach API funcionando"}


@router.post("/summary", response_model=CoachSummaryResponse)
def coach_summary(payload: CoachSummaryRequest):
    return build_coach_summary(payload)
