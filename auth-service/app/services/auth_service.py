from app.core.supabase_client import supabase
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)


INSTITUTIONAL_DOMAIN = "@duocuc.cl"


def is_institutional_email(email: str) -> bool:
    return email.strip().lower().endswith(INSTITUTIONAL_DOMAIN)


def build_default_name(email: str) -> str:
    username = email.split("@")[0]
    parts = username.replace(".", " ").replace("_", " ").split()

    if not parts:
        return "Estudiante Duoc UC"

    return " ".join(part.capitalize() for part in parts)


def login_user(email: str, password: str):
    email = email.strip().lower()

    if not is_institutional_email(email):
        return {
            "error": "Solo se permiten correos institucionales @duocuc.cl",
            "status_code": 403,
        }

    if len(password) < 6:
        return {
            "error": "La contraseña debe tener al menos 6 caracteres",
            "status_code": 400,
        }

    result = (
        supabase
        .table("users")
        .select("*")
        .eq("email", email)
        .limit(1)
        .execute()
    )

    first_login = not bool(result.data)

    # Primer inicio: crea automáticamente el usuario
    if first_login:
        created = (
            supabase
            .table("users")
            .insert({
                "name": build_default_name(email),
                "email": email,
                "password_hash": hash_password(password),
                "role": "student",
            })
            .execute()
        )

        if not created.data:
            return {
                "error": "No se pudo crear el usuario",
                "status_code": 500,
            }

        user = created.data[0]

    else:
        user = result.data[0]

        if not verify_password(password, user["password_hash"]):
            return {
                "error": "Contraseña incorrecta",
                "status_code": 401,
            }

    token = create_access_token({
        "sub": user["email"],
        "user_id": user["id"],
        "role": user.get("role", "student"),
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "first_login": first_login,
        "user": {
            "id": user["id"],
            "name": user.get("name") or build_default_name(email),
            "email": user["email"],
            "role": user.get("role", "student"),
        },
    }

def change_password(
    email: str,
    current_password: str,
    new_password: str,
):
    email = email.strip().lower()

    if not is_institutional_email(email):
        return {
            "error": "Solo se permiten correos institucionales @duocuc.cl",
            "status_code": 403,
        }

    if len(new_password) < 6:
        return {
            "error": "La nueva contraseña debe tener al menos 6 caracteres",
            "status_code": 400,
        }

    result = (
        supabase
        .table("users")
        .select("*")
        .eq("email", email)
        .limit(1)
        .execute()
    )

    if not result.data:
        return {
            "error": "Usuario no encontrado",
            "status_code": 404,
        }

    user = result.data[0]

    if not verify_password(
        current_password,
        user["password_hash"],
    ):
        return {
            "error": "La contraseña actual es incorrecta",
            "status_code": 401,
        }

    response = (
        supabase
        .table("users")
        .update({
            "password_hash": hash_password(new_password),
        })
        .eq("email", email)
        .execute()
    )

    return {
        "message": "Contraseña actualizada correctamente",
        "user": {
            "id": user["id"],
            "email": user["email"],
        },
        "updated": bool(response.data),
    }