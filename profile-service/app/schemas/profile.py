from pydantic import BaseModel


class SkillRequest(BaseModel):
    skill: str


class ProjectRequest(BaseModel):
    title: str
    description: str
    technologies: list[str]
    type: str


class SettingsUpdateRequest(BaseModel):
    name: str
    email: str
    city: str
    career: str
    linkedin: str = ""
    github: str = ""
    theme: str = "light"