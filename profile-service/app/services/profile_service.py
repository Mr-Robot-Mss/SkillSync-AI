from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from app.core.config import settings
from app.core.supabase_client import supabase


PROFILE_TABLE = "profiles"
SKILLS_TABLE = "skills"
PROJECTS_TABLE = "projects"

ALLOWED_AVATAR_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_AVATAR_SIZE = 5 * 1024 * 1024


def current_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_user_id(user_id: str) -> str:
    value = str(user_id or "").strip()

    if not value:
        raise HTTPException(
            status_code=400,
            detail="user_id es obligatorio",
        )

    return value


def normalize_text(value) -> str:
    return str(value or "").strip()


def normalize_public_url(public_url) -> str:
    """
    Compatibilidad con distintas versiones de supabase-py.

    get_public_url puede devolver:
    - un string;
    - un diccionario con publicUrl;
    - un objeto con public_url.
    """

    if isinstance(public_url, str):
        return public_url.strip()

    if isinstance(public_url, dict):
        return normalize_text(
            public_url.get("publicUrl")
            or public_url.get("public_url")
            or public_url.get("signedURL")
            or public_url.get("signed_url")
        )

    possible_url = (
        getattr(public_url, "public_url", None)
        or getattr(public_url, "publicUrl", None)
        or getattr(public_url, "signed_url", None)
        or getattr(public_url, "signedURL", None)
    )

    return normalize_text(possible_url)


def empty_profile(user_id: str) -> dict:
    return {
        "user_id": user_id,
        "name": "",
        "email": "",
        "city": "",
        "career": "",
        "about_me": "",
        "avatar_url": "",
        "linkedin": "",
        "github": "",
        "target_role": "",
        "skills": [],
        "projects": [],
    }


def find_profile(user_id: str):
    return (
        supabase
        .table(PROFILE_TABLE)
        .select("*")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )


def get_profile(user_id: str):
    user_id = normalize_user_id(user_id)

    profile_response = find_profile(user_id)

    profile = (
        profile_response.data[0]
        if profile_response.data
        else empty_profile(user_id)
    )

    skills_response = (
        supabase
        .table(SKILLS_TABLE)
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    projects_response = (
        supabase
        .table(PROJECTS_TABLE)
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    return {
        **profile,
        "skills": skills_response.data or [],
        "projects": projects_response.data or [],
    }


def update_profile(user_id: str, data: dict):
    user_id = normalize_user_id(user_id)

    payload = {
        "user_id": user_id,
        "name": normalize_text(data.get("name")),
        "email": normalize_text(data.get("email")).lower(),
        "city": normalize_text(data.get("city")),
        "career": normalize_text(data.get("career")),
        "about_me": normalize_text(data.get("about_me")),
        "linkedin": normalize_text(data.get("linkedin")),
        "github": normalize_text(data.get("github")),
        "target_role": normalize_text(data.get("target_role")),
        "updated_at": current_timestamp(),
    }

    existing = find_profile(user_id)

    if existing.data:
        response = (
            supabase
            .table(PROFILE_TABLE)
            .update(payload)
            .eq("user_id", user_id)
            .execute()
        )
    else:
        response = (
            supabase
            .table(PROFILE_TABLE)
            .insert(payload)
            .execute()
        )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="No se pudo guardar el perfil",
        )

    return response.data[0]


def update_about_me(user_id: str, about_me: str):
    user_id = normalize_user_id(user_id)

    payload = {
        "user_id": user_id,
        "about_me": normalize_text(about_me),
        "updated_at": current_timestamp(),
    }

    existing = find_profile(user_id)

    if existing.data:
        response = (
            supabase
            .table(PROFILE_TABLE)
            .update(payload)
            .eq("user_id", user_id)
            .execute()
        )
    else:
        response = (
            supabase
            .table(PROFILE_TABLE)
            .insert(payload)
            .execute()
        )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="No se pudo actualizar Sobre mí",
        )

    return response.data[0]


async def upload_avatar(
    user_id: str,
    file: UploadFile,
):
    user_id = normalize_user_id(user_id)

    content_type = normalize_text(file.content_type).lower()

    if content_type not in ALLOWED_AVATAR_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Formato no permitido. Usa JPG, PNG o WEBP.",
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="El archivo está vacío",
        )

    if len(content) > MAX_AVATAR_SIZE:
        raise HTTPException(
            status_code=400,
            detail="La imagen no puede superar 5 MB",
        )

    extension = ALLOWED_AVATAR_TYPES[content_type]

    storage_path = (
        f"{user_id}/avatar-{uuid4().hex}{extension}"
    )

    try:
        bucket = supabase.storage.from_(
            settings.avatars_bucket
        )

        bucket.upload(
            path=storage_path,
            file=content,
            file_options={
                "content-type": content_type,
                "upsert": "true",
            },
        )

        generated_url = bucket.get_public_url(
            storage_path
        )

        avatar_url = normalize_public_url(
            generated_url
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"No se pudo subir el avatar: {error}",
        ) from error

    if not avatar_url:
        raise HTTPException(
            status_code=500,
            detail=(
                "El archivo se subió, pero Supabase "
                "no devolvió una URL pública válida."
            ),
        )

    payload = {
        "user_id": user_id,
        "avatar_url": avatar_url,
        "updated_at": current_timestamp(),
    }

    existing = find_profile(user_id)

    if existing.data:
        response = (
            supabase
            .table(PROFILE_TABLE)
            .update(payload)
            .eq("user_id", user_id)
            .execute()
        )
    else:
        response = (
            supabase
            .table(PROFILE_TABLE)
            .insert(payload)
            .execute()
        )

    if not response.data:
        raise HTTPException(
            status_code=500,
            detail=(
                "El avatar se subió, pero no se pudo "
                "guardar su URL en el perfil."
            ),
        )

    return {
        "message": "Avatar actualizado correctamente",
        "avatar_url": avatar_url,
        "storage_path": storage_path,
        "profile": response.data[0],
    }


def get_skills(user_id: str):
    user_id = normalize_user_id(user_id)

    response = (
        supabase
        .table(SKILLS_TABLE)
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    return {
        "skills": response.data or [],
    }


def add_skill(
    user_id: str,
    skill: str,
    level: int = 50,
):
    user_id = normalize_user_id(user_id)

    skill_name = normalize_text(skill)

    if not skill_name:
        raise HTTPException(
            status_code=400,
            detail="La habilidad es obligatoria",
        )

    payload = {
        "user_id": user_id,
        "name": skill_name,
        "level": level,
    }

    response = (
        supabase
        .table(SKILLS_TABLE)
        .insert(payload)
        .execute()
    )

    return response.data or []


def delete_skill(
    user_id: str,
    skill: str,
):
    user_id = normalize_user_id(user_id)

    response = (
        supabase
        .table(SKILLS_TABLE)
        .delete()
        .eq("user_id", user_id)
        .eq("name", normalize_text(skill))
        .execute()
    )

    return response.data or []


def get_projects(user_id: str):
    user_id = normalize_user_id(user_id)

    response = (
        supabase
        .table(PROJECTS_TABLE)
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    return response.data or []


def create_project(
    user_id: str,
    data: dict,
):
    user_id = normalize_user_id(user_id)

    title = normalize_text(data.get("title"))

    if not title:
        raise HTTPException(
            status_code=400,
            detail="El título del proyecto es obligatorio",
        )

    payload = {
        "user_id": user_id,
        "title": title,
        "description": normalize_text(
            data.get("description")
        ),
        "technologies": data.get(
            "technologies",
            [],
        ),
        "type": normalize_text(
            data.get("type")
        ),
    }

    response = (
        supabase
        .table(PROJECTS_TABLE)
        .insert(payload)
        .execute()
    )

    return (
        response.data[0]
        if response.data
        else payload
    )


def get_settings(user_id: str):
    return get_profile(user_id)


def update_settings(
    user_id: str,
    data: dict,
):
    current = get_profile(user_id)

    payload = {
        "name": data.get(
            "name",
            current.get("name", ""),
        ),
        "email": data.get(
            "email",
            current.get("email", ""),
        ),
        "city": data.get(
            "city",
            current.get("city", ""),
        ),
        "career": data.get(
            "career",
            current.get("career", ""),
        ),
        "about_me": current.get(
            "about_me",
            "",
        ),
        "linkedin": data.get(
            "linkedin",
            current.get("linkedin", ""),
        ),
        "github": data.get(
            "github",
            current.get("github", ""),
        ),
        "target_role": current.get(
            "target_role",
            "",
        ),
    }

    return update_profile(
        user_id,
        payload,
    )