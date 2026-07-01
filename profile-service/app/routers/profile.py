from fastapi import APIRouter

from app.data.profile_store import PROFILE

router = APIRouter()


@router.get("/")
def profile_root():
    return {"message": "Profile API funcionando"}


@router.get("/me")
def get_profile():
    if not PROFILE:
        return {
            "message": "Usuario sin onboarding",
            "profile_completed": False,
            "name": "Estudiante Demo",
            "email": "estudiante@duocuc.cl",
            "city": "Santiago, Chile",
            "career": "Analista Programador",
            "primary_role": None,
            "secondary_role": None,
            "third_role": None,
            "compatibility": 0,
            "skills": [],
            "missing_skills": [],
            "recommendation": "Completa el onboarding IA para generar tu perfil profesional.",
        }

    return {
        "profile_completed": True,
        "name": "Estudiante Demo",
        "email": "estudiante@duocuc.cl",
        "city": "Santiago, Chile",
        "career": "Analista Programador",
        "primary_role": PROFILE.get("primary_role"),
        "secondary_role": PROFILE.get("secondary_role"),
        "third_role": PROFILE.get("third_role"),
        "compatibility": PROFILE.get("compatibility"),
        "ranking": PROFILE.get("ranking", []),
        "recommendation": PROFILE.get("recommendation"),
        "skills": get_skills_by_role(PROFILE.get("primary_role")),
        "missing_skills": get_missing_skills_by_role(PROFILE.get("primary_role")),
    }


def get_skills_by_role(role):
    skills_map = {
        "Data Analyst": ["SQL", "Power BI", "Python", "Excel", "ETL"],
        "BI Analyst": ["Power BI", "SQL", "KPIs", "Excel", "Modelamiento de datos"],
        "Data Engineer": ["Python", "SQL", "ETL", "Docker", "Airflow"],
        "QA Automation": ["Postman", "SQL", "Selenium", "Playwright", "Python"],
        "Backend Developer": ["FastAPI", "SQL", "APIs REST", "Docker", "Git"],
        "Frontend Developer": ["React", "JavaScript", "Tailwind", "HTML", "CSS"],
        "Fullstack Developer": ["React", "FastAPI", "SQL", "Docker", "Git"],
        "DevOps Engineer": ["Docker", "Linux", "CI/CD", "AWS", "Monitoreo"],
        "Product Manager": ["Roadmap", "KPIs", "Gestión", "Comunicación", "Producto"],
        "UX/UI Designer": ["Figma", "UX Research", "Prototipado", "Diseño UI", "Accesibilidad"],
    }

    return skills_map.get(role, [])


def get_missing_skills_by_role(role):
    missing_map = {
        "Data Analyst": ["Machine Learning", "Storytelling", "Estadística avanzada"],
        "BI Analyst": ["DAX avanzado", "Power Query", "Data Warehouse"],
        "Data Engineer": ["Airflow", "Cloud", "Big Data"],
        "QA Automation": ["Playwright", "CI/CD Testing", "Docker"],
        "Backend Developer": ["JWT", "Arquitectura limpia", "Testing API"],
        "Frontend Developer": ["TypeScript", "Testing Frontend", "UX avanzado"],
        "Fullstack Developer": ["Docker", "JWT", "Deploy cloud"],
        "DevOps Engineer": ["Kubernetes", "Terraform", "Cloud avanzado"],
        "Product Manager": ["Product Discovery", "Métricas SaaS", "Roadmapping"],
        "UX/UI Designer": ["Design System", "Research avanzado", "Testing UX"],
    }

    return missing_map.get(role, [])