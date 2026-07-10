from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.career_ai_service import analyze_profile


router = APIRouter()


class OnboardingAnswers(BaseModel):
    development: int = Field(ge=1, le=3)
    data: int = Field(ge=1, le=3)
    qa: int = Field(ge=1, le=3)
    automation: int = Field(ge=1, le=3)
    design: int = Field(ge=1, le=3)
    database: int = Field(ge=1, le=3)
    problem: int = Field(ge=1, le=3)
    communication: int = Field(ge=1, le=3)
    ai: int = Field(ge=1, le=3)
    learning: int = Field(ge=1, le=3)


class OnboardingRequest(BaseModel):
    user_id: str = Field(min_length=1)
    answers: OnboardingAnswers


@router.get("/")
def onboarding_root():
    return {
        "message": "Onboarding API funcionando",
        "status": "OK",
    }


@router.post("/analyze")
def onboarding_analyze(request: OnboardingRequest):
    try:
        return analyze_profile(request.model_dump())

    except HTTPException:
        raise

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"No se pudo analizar el onboarding: {error}",
        ) from error