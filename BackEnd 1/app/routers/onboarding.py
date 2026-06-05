from fastapi import APIRouter

from app.schemas.onboarding import OnboardingRequest
from app.services.onboarding_service import analyze_profile

router = APIRouter()


@router.get("/")
def onboarding_root():
    return {"message": "Onboarding API funcionando"}


@router.post("/analyze")
def analyze(request: OnboardingRequest):

    result = analyze_profile(
        {
            "programming": request.programming,
            "data": request.data,
            "leadership": request.leadership,
            "design": request.design,
            "infrastructure": request.infrastructure,
        }
    )

    return result