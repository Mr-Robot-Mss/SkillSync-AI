from pydantic import BaseModel


class OnboardingRequest(BaseModel):
    programming: int
    data: int
    leadership: int
    design: int
    infrastructure: int


class AssistantRequest(BaseModel):
    user_id: str = "demo-user"
    message: str


class InterviewQuestionRequest(BaseModel):
    role: str | None = None


class InterviewEvaluationRequest(BaseModel):
    answer: str
    role: str | None = None


class CVAnalysisRequest(BaseModel):
    user_id: str = "demo-user"
    role: str
    cv_text: str = ""
    job_description: str = ""
    skills: list[str] = []
    projects: list[str] = []


class CVOptimizeRequest(BaseModel):
    user_id: str = "demo-user"
    role: str
    cv_text: str
    job_description: str