from pydantic import BaseModel


class SavedJobRequest(BaseModel):
    id: int
    title: str
    company: str
    location: str
    match: int = 75
    source: str = "SkillSync"