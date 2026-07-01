from fastapi import APIRouter

from app.schemas.career import InterviewQuestionRequest, InterviewEvaluationRequest
from app.services.career_ai_service import generate_question, evaluate_answer

router = APIRouter()


@router.get("/")
def interview_root():
    return {"message": "Interview API funcionando"}


@router.post("/question")
def interview_question(data: InterviewQuestionRequest):
    return generate_question(data.role)


@router.post("/evaluate")
def interview_evaluate(data: InterviewEvaluationRequest):
    return evaluate_answer(data.answer, data.role)