from app.core.supabase_client import supabase
from app.core.security import hash_password, verify_password, create_access_token


def register_user(data: dict):
    existing = (
        supabase.table("users")
        .select("*")
        .eq("email", data["email"])
        .execute()
    )

    if existing.data:
        return None

    user_payload = {
        "name": data["name"],
        "email": data["email"],
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


def get_users():
    result = (
        supabase.table("users")
        .select("id,name,email,role,created_at")
        .execute()
    )

    return result.data