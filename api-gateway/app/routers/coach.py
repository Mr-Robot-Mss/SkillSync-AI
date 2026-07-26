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


def _request(method: str, path: str, **kwargs):
    try:
        response = requests.request(
            method=method,
            url=f"{settings.career_ai_service_url}/api/coach/{path}",
            timeout=30,
            **kwargs,
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


@router.post("/summary")
async def coach_summary(request: Request):
    return _request("POST", "summary", json=await request.json())


@router.get("/history")
def coach_history(
    user_id: str = Query(default="demo-user", min_length=1),
    limit: int = Query(default=12, ge=1, le=52),
):
    return _request(
        "GET",
        "history",
        params={"user_id": user_id, "limit": limit},
    )


@router.get("/goal")
def get_coach_goal(user_id: str = Query(default="demo-user", min_length=1)):
    return _request("GET", "goal", params={"user_id": user_id})


@router.put("/goal")
async def save_coach_goal(request: Request):
    return _request("PUT", "goal", json=await request.json())
