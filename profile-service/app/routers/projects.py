from fastapi import APIRouter

from app.schemas.profile import ProjectRequest
from app.services.profile_service import (
    get_projects,
    create_project,
)

router = APIRouter()


@router.get("/")
def projects_root():
    return {"message": "Projects API funcionando"}


@router.get("/all")
def projects_all():
    return get_projects()


@router.post("/")
def projects_create(data: ProjectRequest):
    return {
        "message": "Proyecto creado correctamente",
        "project": create_project(data.model_dump()),
    }