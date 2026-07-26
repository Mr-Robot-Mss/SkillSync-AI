import requests
from fastapi import APIRouter, HTTPException, Query, Request

from app.core.config import settings


router = APIRouter()


def _parse_response(response: requests.Response):
    try:
        data = response.json()
    except ValueError:
        data = response.text

    if response.status_code >= 400:
        detail = data.get("detail", data) if isinstance(data, dict) else data
        raise HTTPException(
            status_code=response.status_code,
            detail=detail or "Error en AI Career Coach",
        )

    return data


@router.post("/summary")
async def coach_summary(request: Request):
    body = await request.json()

    try:
        response = requests.post(
            f"{settings.career_ai_service_url}/api/coach/summary",
            json=body,
            timeout=30,
        )
    except requests.exceptions.Timeout as error:
        raise HTTPException(
            status_code=504,
            detail="Tiempo de espera agotado al consultar AI Career Coach",
        ) from error
    except requests.exceptions.RequestException as error:
        raise HTTPException(
            status_code=503,
            detail=f"No se pudo conectar con AI Career Coach: {error}",
        ) from error

    return _parse_response(response)


@router.get("/history")
def coach_history(
    user_id: str = Query(default="demo-user", min_length=1),
    limit: int = Query(default=12, ge=1, le=52),
):
    try:
        response = requests.get(
            f"{settings.career_ai_service_url}/api/coach/history",
            params={"user_id": user_id, "limit": limit},
            timeout=30,
        )
    except requests.exceptions.Timeout as error:
        raise HTTPException(
            status_code=504,
            detail="Tiempo de espera agotado al consultar el historial del coach",
        ) from error
    except requests.exceptions.RequestException as error:
        raise HTTPException(
            status_code=503,
            detail=f"No se pudo conectar con AI Career Coach: {error}",
        ) from error

    return _parse_response(response)
