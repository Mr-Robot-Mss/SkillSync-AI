from fastapi import APIRouter, HTTPException

from app.schemas.auth import LoginRequest, ChangePasswordRequest
from app.services.auth_service import login_user, change_password

router = APIRouter()


@router.get("/")
def auth_root():
    return {
        "message": "Auth API funcionando",
        "mode": "institutional-first-login",
    }


@router.post("/login")
def login(data: LoginRequest):
    result = login_user(data.email, data.password)

    if result.get("error"):
        raise HTTPException(
            status_code=result.get("status_code", 401),
            detail=result["error"],
        )

    return result


@router.put("/change-password")
def update_password(data: ChangePasswordRequest):
    result = change_password(
        data.email,
        data.current_password,
        data.new_password,
    )

    if not result:
        raise HTTPException(
            status_code=401,
            detail="Correo o contraseña actual incorrecta",
        )

    if result.get("error"):
        raise HTTPException(
            status_code=result.get("status_code", 400),
            detail=result["error"],
        )

    return result