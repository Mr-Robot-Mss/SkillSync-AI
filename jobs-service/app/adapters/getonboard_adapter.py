import requests

GETONBOARD_URL = "https://www.getonbrd.com/api/v0/jobs"


def fetch_getonboard_jobs():
    try:
        response = requests.get(
            GETONBOARD_URL,
            timeout=15,
            headers={
                "Accept": "application/json",
                "User-Agent": "SkillSync-AI/1.0",
            },
        )

        response.raise_for_status()
        payload = response.json()

        jobs = payload.get("data", [])

        if not jobs:
            return fallback_chile_jobs()

        normalized_jobs = []

        for item in jobs:
            attributes = item.get("attributes", {})
            title = attributes.get("title", "Sin título")

            normalized_jobs.append({
                "external_id": f"getonboard-{item.get('id')}",
                "title": title,
                "company": attributes.get("company_name", "Empresa no informada"),
                "location": attributes.get("location", "Chile / Remoto"),
                "description": attributes.get("description", ""),
                "category": detect_category(title),
                "source": "Get on Board API",
                "url": attributes.get("url"),
            })

        return normalized_jobs

    except Exception as error:
        print(f"[GetOnBoard Adapter Error] {error}")
        return fallback_chile_jobs()


def fallback_chile_jobs():
    return [
        {
            "external_id": "fallback-gob-qa-junior-bc-tecnologia",
            "title": "Analista QA Junior",
            "company": "BC Tecnología",
            "location": "Santiago, Chile - Híbrido",
            "description": "Oferta real publicada en Get on Board para perfil QA Junior.",
            "category": "QA",
            "source": "Get on Board Fallback",
            "url": "https://www.getonbrd.cl/jobs/tag/rest",
        },
        {
            "external_id": "fallback-gob-qa-automation-witi",
            "title": "QA Automation",
            "company": "WiTi",
            "location": "Santiago, Chile - Híbrido",
            "description": "Oferta real publicada en Get on Board para perfil QA Automation.",
            "category": "QA",
            "source": "Get on Board Fallback",
            "url": "https://www.getonbrd.cl/jobs/tag/rest",
        },
        {
            "external_id": "fallback-gob-backend-python-bc",
            "title": "Developer Back-end Python + FastAPI",
            "company": "BC Tecnología",
            "location": "Remoto",
            "description": "Oferta real publicada en Get on Board para perfil Backend Python y FastAPI.",
            "category": "Backend",
            "source": "Get on Board Fallback",
            "url": "https://www.getonbrd.cl/jobs/tag/rest",
        },
        {
            "external_id": "fallback-gob-frontend-tcit",
            "title": "Senior Front-end Developer",
            "company": "TCIT",
            "location": "Santiago, Chile - Híbrido",
            "description": "Oferta real publicada en Get on Board para perfil Frontend.",
            "category": "Frontend",
            "source": "Get on Board Fallback",
            "url": "https://www.getonbrd.cl/jobs/tag/rest",
        },
        {
            "external_id": "fallback-gob-fullstack-42labs",
            "title": "Full-Stack Developer Node.js, React",
            "company": "42Labs",
            "location": "Remoto Chile / Perú / Colombia",
            "description": "Oferta real publicada en Get on Board para perfil Fullstack.",
            "category": "Frontend",
            "source": "Get on Board Fallback",
            "url": "https://www.getonbrd.cl/jobs/tag/rest",
        },
    ]


def detect_category(title: str):
    title = title.lower()

    if any(word in title for word in ["data", "bi", "analyst", "analytics"]):
        return "Data"

    if any(word in title for word in ["qa", "tester", "quality"]):
        return "QA"

    if any(word in title for word in ["backend", "back-end", "python", "java", "api", "fastapi"]):
        return "Backend"

    if any(word in title for word in ["frontend", "front-end", "react", "vue", "angular"]):
        return "Frontend"

    if any(word in title for word in ["full-stack", "fullstack"]):
        return "Backend"

    return "Tech"