from pydantic import BaseModel


class OnboardingRequest(BaseModel):
    programming: int
    data: int
    leadership: int
    design: int
    infrastructure: int