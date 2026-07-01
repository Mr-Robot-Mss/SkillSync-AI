from pydantic import BaseModel


class OnboardingRequest(BaseModel):
    programming: int
    data: int
    leadership: int
    design: int
    infrastructure: int


class AssistantRequest(BaseModel):
    message: str


class InterviewQuestionRequest(BaseModel):
    role: str | None = None


class InterviewEvaluationRequest(BaseModel):
    answer: str
    role: str | None = None


class CVAnalysisRequest(BaseModel):
    role: str
    skills: list[str] = []
    projects: list[str] = []