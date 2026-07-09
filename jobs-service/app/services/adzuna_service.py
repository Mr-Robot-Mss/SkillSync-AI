import os
import httpx
from typing import List, Dict, Any

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")

BASE_URL = "https://api.adzuna.com/v1/api/jobs/cl/search/1"


async def search_chile_jobs(query: str = "python developer", results_per_page: int = 10) -> List[Dict[str, Any]]:
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "what": query,
        "where": "Chile",
        "results_per_page": results_per_page,
        "content-type": "application/json",
    }

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()

    jobs = []

    for item in data.get("results", []):
        jobs.append({
            "external_id": item.get("id"),
            "title": item.get("title"),
            "company": item.get("company", {}).get("display_name"),
            "location": item.get("location", {}).get("display_name"),
            "description": item.get("description"),
            "salary_min": item.get("salary_min"),
            "salary_max": item.get("salary_max"),
            "url": item.get("redirect_url"),
            "source": "Adzuna",
        })

    return jobs