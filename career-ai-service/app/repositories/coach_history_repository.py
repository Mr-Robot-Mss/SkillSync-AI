from typing import Any

import requests

from app.core.config import settings
from app.schemas.coach import CoachSummaryResponse


class CoachHistoryRepository:
    def __init__(self) -> None:
        self.base_url = f"{settings.supabase_url}/rest/v1/coach_history"
        self.headers = {
            "apikey": settings.supabase_key,
            "Authorization": f"Bearer {settings.supabase_key}",
            "Content-Type": "application/json",
        }

    def save(self, summary: CoachSummaryResponse) -> None:
        payload = {
            "user_id": summary.user_id,
            "career_score": summary.career_score,
            "goal": summary.goal,
            "current_level": summary.current_level,
            "score_breakdown": summary.score_breakdown.model_dump(),
            "recommendations": [item.model_dump() for item in summary.recommendations],
            "daily_insight": summary.daily_insight,
        }

        response = requests.post(
            self.base_url,
            headers={**self.headers, "Prefer": "return=minimal"},
            json=payload,
            timeout=10,
        )
        response.raise_for_status()

    def list_by_user(self, user_id: str, limit: int = 12) -> list[dict[str, Any]]:
        response = requests.get(
            self.base_url,
            headers=self.headers,
            params={
                "user_id": f"eq.{user_id}",
                "select": "career_score,goal,current_level,score_breakdown,daily_insight,created_at",
                "order": "created_at.desc",
                "limit": str(limit),
            },
            timeout=10,
        )
        response.raise_for_status()
        return response.json()


coach_history_repository = CoachHistoryRepository()
