from fastapi import (
    APIRouter,
    File,
    UploadFile,
)

from app.schemas.profile import (
    AboutMeUpdateRequest,
    ProfileUpdateRequest,
)
from app.services.profile_service import (
    get_profile,
    update_about_me,
    update_profile,
    upload_avatar,
)


router = APIRouter()


@router.get("/{user_id}")
def profile_detail(user_id: str):
    return get_profile(user_id)


@router.put("/{user_id}")
def profile_update(
    user_id: str,
    data: ProfileUpdateRequest,
):
    return {
        "message": "Perfil actualizado correctamente",
        "profile": update_profile(
            user_id,
            data.model_dump(),
        ),
    }


@router.put("/{user_id}/about")
def profile_about_update(
    user_id: str,
    data: AboutMeUpdateRequest,
):
    return {
        "message": "Sobre mí actualizado correctamente",
        "profile": update_about_me(
            user_id,
            data.about_me,
        ),
    }


@router.post("/{user_id}/avatar")
async def profile_avatar_upload(
    user_id: str,
    file: UploadFile = File(...),
):
    return await upload_avatar(
        user_id,
        file,
    )