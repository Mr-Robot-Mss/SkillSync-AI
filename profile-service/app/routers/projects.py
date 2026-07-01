from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

PROJECTS = [
    {
        "id": 1,
        "title": "SkillSync AI",
        "description": "Plataforma de empleabilidad con IA, onboarding, jobs y roadmap.",
        "technologies": ["React", "FastAPI", "Python", "Tailwind"],
        "type": "Fullstack",
    }
]


class ProjectRequest(BaseModel):
    title: str
    description: str
    technologies: list[str]
    type: str


@router.get("/")
def projects_root():
    return {"message": "Projects API funcionando"}


@router.get("/all")
def get_projects():
    return PROJECTS


@router.post("/")
def create_project(data: ProjectRequest):
    project = {
        "id": len(PROJECTS) + 1,
        **data.model_dump(),
    }

    PROJECTS.append(project)

    return {
        "message": "Proyecto creado correctamente",
        "project": project,
    }