from fastapi import APIRouter

from app.schemas.profile import ProjectRequest
from app.services.profile_service import (
    create_project,
    get_projects,
)


router = APIRouter()


@router.get("/{user_id}")
def user_projects(user_id: str):
    return get_projects(user_id)


@router.post("/{user_id}")
def create_user_project(
    user_id: str,
    data: ProjectRequest,
):
    return {
        "message": "Proyecto creado correctamente",
        "project": create_project(
            user_id,
            data.model_dump(),
        ),
    }