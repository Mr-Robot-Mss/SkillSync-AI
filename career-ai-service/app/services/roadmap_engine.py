from app.data.career_store import CAREER_PROFILE
from app.core.supabase_client import supabase

ROADMAP_LIBRARY = {
    "QA Automation": {
        "target_role": "QA Automation Engineer",
        "current_compatibility": 74,
        "target_compatibility": 95,
        "focus": ["Testing Manual", "Postman", "SQL", "Playwright", "Python", "CI/CD"],
        "steps": [
            {
                "week": "Semana 1",
                "title": "Fundamentos de Testing",
                "description": "Reforzar tipos de pruebas, casos de prueba, evidencias y reporte de bugs.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://www.guru99.com/software-testing.html",
            },
            {
                "week": "Semana 2",
                "title": "SQL para QA",
                "description": "Practicar consultas SELECT, filtros, joins y validaciones de datos.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://www.w3schools.com/sql/",
            },
            {
                "week": "Semana 3",
                "title": "Postman y API Testing",
                "description": "Validar endpoints REST, status codes, payloads y pruebas negativas.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://learning.postman.com/",
            },
            {
                "week": "Semana 4",
                "title": "Automatización con Playwright",
                "description": "Crear pruebas end-to-end para login, formularios y flujos críticos.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://playwright.dev/docs/intro",
            },
            {
                "week": "Semana 5",
                "title": "Automatización con Python",
                "description": "Crear scripts de validación, lectura de datos y automatización básica.",
                "priority": 4,
                "status": "Pendiente",
                "resource": "https://docs.python.org/3/tutorial/",
            },
            {
                "week": "Semana 6",
                "title": "Git y control de versiones",
                "description": "Aplicar branching, commits limpios y manejo de Pull Requests.",
                "priority": 4,
                "status": "Pendiente",
                "resource": "https://git-scm.com/docs/gittutorial",
            },
            {
                "week": "Semana 7",
                "title": "CI/CD para QA",
                "description": "Entender pipelines, ejecución automática de pruebas y reportes.",
                "priority": 4,
                "status": "Pendiente",
                "resource": "https://docs.github.com/en/actions",
            },
            {
                "week": "Semana 8",
                "title": "Proyecto final QA Automation",
                "description": "Automatizar un flujo real, generar evidencias y documentar resultados.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://playwright.dev/",
            },
        ],
    },

    "Data Analyst": {
        "target_role": "Data Analyst",
        "current_compatibility": 70,
        "target_compatibility": 92,
        "focus": ["SQL", "Excel", "Power BI", "Python", "ETL", "Storytelling"],
        "steps": [
            {
                "week": "Semana 1",
                "title": "SQL para análisis de datos",
                "description": "Aprender consultas, agregaciones, joins y limpieza de datos.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://www.w3schools.com/sql/",
            },
            {
                "week": "Semana 2",
                "title": "Excel avanzado",
                "description": "Dominar tablas dinámicas, fórmulas, validaciones y dashboards.",
                "priority": 4,
                "status": "Pendiente",
                "resource": "https://support.microsoft.com/excel",
            },
            {
                "week": "Semana 3",
                "title": "Power BI",
                "description": "Construir dashboards, KPIs y visualizaciones ejecutivas.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://learn.microsoft.com/power-bi/",
            },
            {
                "week": "Semana 4",
                "title": "Python para datos",
                "description": "Usar pandas, limpieza de datos y análisis exploratorio.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://pandas.pydata.org/docs/",
            },
        ],
    },

    "Backend Developer": {
        "target_role": "Backend Developer",
        "current_compatibility": 68,
        "target_compatibility": 93,
        "focus": ["Python", "FastAPI", "SQL", "JWT", "Docker", "Microservicios"],
        "steps": [
            {
                "week": "Semana 1",
                "title": "APIs REST con FastAPI",
                "description": "Crear endpoints, schemas, validaciones y documentación Swagger.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://fastapi.tiangolo.com/",
            },
            {
                "week": "Semana 2",
                "title": "Base de datos y SQL",
                "description": "Diseñar tablas, consultas y persistencia de datos.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://www.postgresql.org/docs/",
            },
            {
                "week": "Semana 3",
                "title": "Autenticación JWT",
                "description": "Implementar login, tokens, protección de endpoints y roles.",
                "priority": 4,
                "status": "Pendiente",
                "resource": "https://jwt.io/introduction",
            },
            {
                "week": "Semana 4",
                "title": "Docker y microservicios",
                "description": "Contenerizar servicios y comunicar componentes independientes.",
                "priority": 5,
                "status": "Pendiente",
                "resource": "https://docs.docker.com/",
            },
        ],
    },
}

def get_user_plan(user_id: str = "demo-user"):
    response = (
        supabase
        .table("subscriptions")
        .select("*")
        .eq("user_id", user_id)
        .eq("status", "active")
        .limit(1)
        .execute()
    )

    if response.data:
        return response.data[0].get("plan", "free")

    return "free"

def build_default_roadmap(role: str):
    return ROADMAP_LIBRARY.get(role, ROADMAP_LIBRARY["Data Analyst"])


def generate_career_roadmap(user_id: str = "demo-user"):
    role = CAREER_PROFILE.get("primary_role", "QA Automation")
    plan = get_user_plan(user_id)
    base = build_default_roadmap(role)

    roadmap = {
        "user_id": user_id,
        "plan": plan,
        "is_premium": plan == "premium",
        "target_role": base["target_role"],
        "current_compatibility": base["current_compatibility"],
        "target_compatibility": base["target_compatibility"],
        "estimated_time": "8 a 12 semanas",
        "level": "Junior",
        "focus": base["focus"],
        "market_insight": build_market_insight(role),
        "steps": base["steps"],
        "premium_message": None,
    }

    if plan != "premium":
        roadmap["premium_message"] = (
            "Activa Premium por $2.500 para generar un roadmap personalizado "
            "según tu CV, ofertas guardadas y brechas ATS."
        )
    else:
        roadmap["premium_message"] = None
        roadmap["market_insight"] += (
            " Como usuario Premium, este roadmap puede ajustarse con análisis avanzado "
            "de CV, ATS y ofertas guardadas."
        )

    return roadmap


def build_market_insight(role: str):
    insights = {
        "QA Automation": (
            "El mercado QA está priorizando pruebas API, automatización E2E, "
            "Playwright, Selenium, SQL y evidencias claras de testing."
        ),
        "Data Analyst": (
            "Las ofertas de datos suelen pedir SQL, Power BI, Excel avanzado, "
            "Python y capacidad de explicar hallazgos de negocio."
        ),
        "Backend Developer": (
            "Las ofertas backend suelen pedir APIs REST, bases de datos, JWT, "
            "Docker y experiencia integrando servicios."
        ),
    }

    return insights.get(
        role,
        "El mercado tecnológico valora proyectos reales, habilidades técnicas y adaptación del CV a cada oferta.",
    )