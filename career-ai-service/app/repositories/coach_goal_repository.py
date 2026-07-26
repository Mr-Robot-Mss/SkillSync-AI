from typing import Any

import requests

from app.core.config import settings
from app.schemas.coach_goal import CoachGoalUpsertRequest


class CoachGoalRepository:
    def __init__(self) -> None:
        self.base_url = f"{settings.supabase_url}/rest/v1/coach_goals"
        self.headers = {
            "apikey": settings.supabase_key,
            "Authorization": f"Bearer {settings.supabase_key}",
            "Content-Type": "application/json",
        }

    def get_active(self, user_id: str) -> dict[str, Any] | None:
        response = requests.get(
            self.base_url,
            headers=self.headers,
            params={
                "user_id": f"eq.{user_id}",
                "status": "eq.active",
                "select": "*",
                "order": "updated_at.desc",
                "limit": "1",
            },
            timeout=10,
        )
        response.raise_for_status()
        items = response.json()
        return items[0] if items else None

    def upsert(self, payload: CoachGoalUpsertRequest) -> dict[str, Any]:
        response = requests.post(
            self.base_url,
            headers={
                **self.headers,
                "Prefer": "resolution=merge-duplicates,return=representation",
            },
            params={"on_conflict": "user_id"},
            json={
                "user_id": payload.user_id,
                "title": payload.title,
                "description": payload.description,
                "target_date": payload.target_date.isoformat() if payload.target_date else None,
                "progress": payload.progress,
                "status": payload.status,
            },
            timeout=10,
        )
        response.raise_for_status()
        items = response.json()
        if not items:
            raise ValueError("Supabase no devolvió la meta guardada")
        return items[0]


coach_goal_repository = CoachGoalRepository()
