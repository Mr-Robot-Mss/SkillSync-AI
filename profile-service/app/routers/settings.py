from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

USER_SETTINGS = {
    "name": "Estudiante Demo",
    "email": "estudiante@duocuc.cl",
    "city": "Santiago, Chile",
    "career": "Analista Programador",
    "linkedin": "",
    "github": "",
    "theme": "light",
}


class SettingsUpdateRequest(BaseModel):
    name: str
    email: str
    city: str
    career: str
    linkedin: str = ""
    github: str = ""
    theme: str = "light"


@router.get("/")
def settings_root():
    return {"message": "Settings API funcionando"}


@router.get("/me")
def get_settings():
    return USER_SETTINGS


@router.put("/me")
def update_settings(data: SettingsUpdateRequest):
    USER_SETTINGS.update(data.model_dump())

    return {
        "message": "Configuración actualizada correctamente",
        "settings": USER_SETTINGS,
    }