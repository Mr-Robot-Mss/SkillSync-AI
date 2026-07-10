from fastapi import APIRouter

from app.schemas.profile import SettingsUpdateRequest
from app.services.profile_service import (
    get_settings,
    update_settings,
)


router = APIRouter()


@router.get("/{user_id}")
def user_settings(user_id: str):
    return get_settings(user_id)


@router.put("/{user_id}")
def update_user_settings(
    user_id: str,
    data: SettingsUpdateRequest,
):
    return {
        "message": "Configuración actualizada correctamente",
        "settings": update_settings(
            user_id,
            data.model_dump(),
        ),
    }