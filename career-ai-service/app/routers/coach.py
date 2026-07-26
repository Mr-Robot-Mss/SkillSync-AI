import logging

import requests
from fastapi import APIRouter, HTTPException, Query

from app.repositories.coach_history_repository import coach_history_repository
from app.schemas.coach import CoachSummaryRequest, CoachSummaryResponse
from app.services.coach_engine import build_coach_summary


logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/")
def coach_root():
    return {"message": "AI Career Coach API funcionando"}


@router.post("/summary", response_model=CoachSummaryResponse)
def coach_summary(payload: CoachSummaryRequest):
    summary = build_coach_summary(payload)

    try:
        coach_history_repository.save(summary)
    except (requests.RequestException, ValueError, TypeError) as error:
        # El cálculo principal no debe fallar si Supabase está temporalmente
        # indisponible. El error queda registrado para observabilidad.
        logger.warning("No fue posible guardar el historial del coach: %s", error)

    return summary


@router.get("/history")
def coach_history(
    user_id: str = Query(default="demo-user", min_length=1),
    limit: int = Query(default=12, ge=1, le=52),
):
    try:
        return {
            "user_id": user_id,
            "items": coach_history_repository.list_by_user(user_id, limit),
        }
    except requests.RequestException as error:
        raise HTTPException(
            status_code=503,
            detail="No fue posible consultar el historial del AI Career Coach",
        ) from error
