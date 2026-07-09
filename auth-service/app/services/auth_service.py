from app.core.supabase_client import supabase
from app.core.security import hash_password, verify_password, create_access_token

INSTITUTIONAL_DOMAIN = "@duocuc.cl"


def is_institutional_email(email: str) -> bool:
    return email.lower().endswith(INSTITUTIONAL_DOMAIN)


def register_user(data: dict):
    email = data["email"].lower()

    if not is_institutional_email(email):
        return {
            "error": "Solo se permiten correos institucionales @duocuc.cl"
        }

    existing = (
        supabase.table("users")
        .select("*")
        .eq("email", email)
        .execute()
    )

    if existing.data:
        return None

    user_payload = {
        "name": data["name"],
        "email": email,
        "password_hash": hash_password(data["password"]),
        "role": "student",
    }

    result = (
        supabase.table("users")
        .insert(user_payload)
        .execute()
    )

    user = result.data[0]

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
    }


def login_user(email: str, password: str):
    email = email.lower()

    if not is_institutional_email(email):
        return None

    result = (
        supabase.table("users")
        .select("*")
        .eq("email", email)
        .execute()
    )

    if not result.data:
        return None

    user = result.data[0]

    if not verify_password(password, user["password_hash"]):
        return None

    token = create_access_token(
        {
            "sub": user["email"],
            "user_id": user["id"],
            "role": user["role"],
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        },
    }


def change_password(email: str, current_password: str, new_password: str):
    email = email.lower()

    if not is_institutional_email(email):
        return {
            "error": "Solo se permiten correos institucionales @duocuc.cl"
        }

    result = (
        supabase.table("users")
        .select("*")
        .eq("email", email)
        .execute()
    )

    if not result.data:
        return None

    user = result.data[0]

    if not verify_password(current_password, user["password_hash"]):
        return None

    supabase.table("users").update({
        "password_hash": hash_password(new_password)
    }).eq("email", email).execute()

    return {
        "message": "Contraseña actualizada correctamente",
        "email": email,
    }


def get_users():
    result = (
        supabase.table("users")
        .select("id,name,email,role,created_at")
        .execute()
    )

    return result.data