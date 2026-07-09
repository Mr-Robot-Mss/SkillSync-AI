from fastapi import APIRouter

from app.schemas.profile import SettingsUpdateRequest
from app.services.profile_service import (
    get_settings,
    update_settings,
)

router = APIRouter()


@router.get("/")
def settings_root():
    return {"message": "Settings API funcionando"}


@router.get("/me")
def settings_me():
    return get_settings()


@router.put("/me")
def settings_update(data: SettingsUpdateRequest):
    return {
        "message": "Configuración actualizada correctamente",
        "settings": update_settings(data.model_dump()),
    }