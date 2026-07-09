from fastapi import APIRouter, HTTPException

from app.schemas.auth import RegisterRequest, LoginRequest, ChangePasswordRequest
from app.services.auth_service import (
    register_user,
    login_user,
    get_users,
    change_password,
)

router = APIRouter()


@router.get("/")
def auth_root():
    return {"message": "Auth API funcionando con Supabase"}


@router.post("/register")
def register(data: RegisterRequest):
    user = register_user(data.model_dump())

    if user and user.get("error"):
        raise HTTPException(status_code=403, detail=user["error"])

    if not user:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    return {
        "message": "Usuario creado correctamente",
        "user": user,
    }


@router.post("/login")
def login(data: LoginRequest):
    result = login_user(data.email, data.password)

    if not result:
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas o correo institucional no autorizado",
        )

    return result


@router.put("/change-password")
def update_password(data: ChangePasswordRequest):
    result = change_password(
        data.email,
        data.current_password,
        data.new_password,
    )

    if result and result.get("error"):
        raise HTTPException(status_code=403, detail=result["error"])

    if not result:
        raise HTTPException(
            status_code=401,
            detail="Correo o contraseña actual inválida",
        )

    return result


@router.get("/users")
def users():
    return get_users()