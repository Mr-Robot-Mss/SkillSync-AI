from fastapi import APIRouter

from app.schemas.career import OnboardingRequest
from app.services.career_ai_service import analyze_profile

router = APIRouter()


@router.get("/")
def onboarding_root():
    return {"message": "Onboarding API funcionando"}


@router.post("/analyze")
def onboarding_analyze(request: OnboardingRequest):
    return analyze_profile(request.model_dump())