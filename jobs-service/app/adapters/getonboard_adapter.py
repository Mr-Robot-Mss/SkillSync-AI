import requests


GETONBOARD_URL = "https://www.getonbrd.com/api/v0/jobs"


def fetch_getonboard_jobs():
    try:
        response = requests.get(GETONBOARD_URL, timeout=10)
        response.raise_for_status()
        payload = response.json()

        jobs = payload.get("data", [])

        normalized_jobs = []

        for item in jobs:
            attributes = item.get("attributes", {})

            normalized_jobs.append({
                "external_id": item.get("id"),
                "title": attributes.get("title", "Sin título"),
                "company": attributes.get("company_name", "Empresa no informada"),
                "location": attributes.get("location", "Remoto / Chile"),
                "description": attributes.get("description", ""),
                "category": detect_category(attributes.get("title", "")),
                "source": "Get on Board",
                "url": attributes.get("url"),
            })

        return normalized_jobs

    except Exception:
        return []


def detect_category(title: str):
    title = title.lower()

    if any(word in title for word in ["data", "bi", "analyst", "analytics"]):
        return "Data"

    if any(word in title for word in ["qa", "tester", "quality"]):
        return "QA"

    if any(word in title for word in ["backend", "python", "java", "api"]):
        return "Backend"

    if any(word in title for word in ["frontend", "react", "vue", "angular"]):
        return "Frontend"

    return "Tech"