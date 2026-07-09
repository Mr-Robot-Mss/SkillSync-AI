from app.data.career_store import CAREER_PROFILE
from app.core.supabase_client import supabase


DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001"


def analyze_profile(data):
    scores = {
        "Data Analyst": data["data"] * 4 + data["programming"] * 2 + data["infrastructure"],
        "BI Analyst": data["data"] * 5 + data["leadership"] * 2 + data["design"],
        "Data Engineer": data["data"] * 3 + data["infrastructure"] * 4 + data["programming"] * 2,
        "QA Automation": data["programming"] * 3 + data["data"] * 2 + data["infrastructure"] * 2,
        "Backend Developer": data["programming"] * 5 + data["infrastructure"] * 2 + data["data"],
        "Frontend Developer": data["programming"] * 4 + data["design"] * 3,
        "Fullstack Developer": data["programming"] * 5 + data["design"] * 2 + data["infrastructure"] * 2,
        "DevOps Engineer": data["infrastructure"] * 5 + data["programming"] * 2,
        "Product Manager": data["leadership"] * 5 + data["data"] * 2 + data["design"],
        "UX/UI Designer": data["design"] * 5 + data["leadership"] * 2,
    }

    ranking = sorted(scores.items(), key=lambda item: item[1], reverse=True)

    result = {
        "primary_role": ranking[0][0],
        "secondary_role": ranking[1][0],
        "third_role": ranking[2][0],
        "compatibility": min(round((ranking[0][1] / 30) * 100), 99),
        "ranking": [
            {
                "role": role,
                "score": score,
                "percentage": min(round((score / 30) * 100), 99),
            }
            for role, score in ranking[:5]
        ],
        "recommendation": build_recommendation(ranking[0][0]),
    }

    CAREER_PROFILE.clear()
    CAREER_PROFILE.update(result)

    supabase.table("career_results").insert({
        "user_id": DEFAULT_USER_ID,
        "primary_role": result["primary_role"],
        "secondary_role": result["secondary_role"],
        "third_role": result["third_role"],
        "compatibility": result["compatibility"],
        "ranking": result["ranking"],
        "recommendation": result["recommendation"],
    }).execute()

    return result


def build_recommendation(role):
    recommendations = {
        "Data Analyst": "Tu perfil muestra alta afinidad con análisis de datos. Refuerza SQL, Power BI, Python y storytelling con datos.",
        "BI Analyst": "Tu perfil calza con inteligencia de negocios. Refuerza Power BI, KPIs, modelamiento de datos y análisis comercial.",
        "Data Engineer": "Tu perfil apunta a ingeniería de datos. Aprende pipelines ETL, Python, SQL avanzado, Docker y cloud.",
        "QA Automation": "Tu perfil tiene afinidad con QA Automation. Refuerza Selenium, Playwright, Postman, SQL y automatización con Python.",
        "Backend Developer": "Tu perfil apunta a backend. Refuerza APIs, FastAPI, bases de datos, autenticación y arquitectura de servicios.",
        "Frontend Developer": "Tu perfil muestra afinidad con frontend. Refuerza React, JavaScript, Tailwind y consumo de APIs.",
        "Fullstack Developer": "Tu perfil tiene potencial fullstack. Combina React, FastAPI, SQL, autenticación, Docker y despliegue.",
        "DevOps Engineer": "Tu perfil apunta a infraestructura. Aprende Docker, CI/CD, Linux, cloud y monitoreo.",
        "Product Manager": "Tu perfil apunta a gestión de producto. Refuerza usuarios, KPIs, roadmap, comunicación y estrategia.",
        "UX/UI Designer": "Tu perfil tiene afinidad con diseño UX/UI. Aprende Figma, research, prototipado y diseño de interfaces.",
    }

    return recommendations.get(role, "Tu perfil tiene buena base tecnológica.")


FREE_DAILY_LIMIT = 5
PREMIUM_DAILY_LIMIT = 100


def get_user_plan(user_id: str):
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


def get_today_usage(user_id: str):
    from datetime import date

    today = str(date.today())

    response = (
        supabase
        .table("ai_usage")
        .select("*")
        .eq("user_id", user_id)
        .eq("usage_date", today)
        .limit(1)
        .execute()
    )

    if response.data:
        return response.data[0]

    created = (
        supabase
        .table("ai_usage")
        .insert({
            "user_id": user_id,
            "usage_date": today,
            "questions_count": 0,
        })
        .execute()
    )

    return created.data[0]


def increment_usage(usage_id: int, current_count: int):
    supabase.table("ai_usage").update({
        "questions_count": current_count + 1
    }).eq("id", usage_id).execute()


def build_assistant_response(message: str):
    text = message.lower()

    if "cv" in text or "curriculum" in text:
        return (
            "Para mejorar tu CV debes adaptarlo a cada oferta laboral. "
            "Incluye palabras clave del cargo, herramientas técnicas, proyectos reales, "
            "resultados medibles y una sección clara de habilidades. "
            "Los sistemas ATS suelen buscar coincidencias entre el CV y la descripción del trabajo."
        )

    if "ats" in text or "bot" in text or "filtro" in text:
        return (
            "Muchas empresas usan sistemas ATS para filtrar CV. "
            "Estos sistemas comparan palabras clave, experiencia, tecnologías y estructura del documento. "
            "Evita diseños demasiado complejos, usa títulos claros y agrega tecnologías exactas de la oferta."
        )

    if "qa" in text:
        return (
            "Para QA te conviene destacar pruebas funcionales, regresión, smoke testing, Postman, SQL, "
            "automatización con Selenium o Playwright, evidencias y documentación de bugs."
        )

    if "python" in text:
        return (
            "Python es muy útil para automatización, análisis de datos, backend con FastAPI y testing. "
            "Puedes destacarlo en proyectos reales, scripts, APIs o automatización de procesos."
        )

    if "datos" in text or "data" in text or "bi" in text:
        return (
            "Para perfiles de datos destaca SQL, Power BI, Excel avanzado, Python, ETL, dashboards, KPIs "
            "y análisis orientado a decisiones de negocio."
        )

    if "frontend" in text or "react" in text:
        return (
            "Para frontend destaca React, JavaScript, consumo de APIs, Tailwind, componentes reutilizables "
            "y proyectos con buena experiencia de usuario."
        )

    if "backend" in text or "api" in text:
        return (
            "Para backend destaca FastAPI, bases de datos, autenticación JWT, arquitectura REST, validaciones, "
            "manejo de errores y conexión con microservicios."
        )

    role = CAREER_PROFILE.get("primary_role", "Data Analyst")

    return (
        f"Según tu perfil actual orientado a {role}, te recomiendo fortalecer habilidades técnicas, "
        "crear proyectos demostrables y adaptar tu CV a cada oferta laboral usando palabras clave específicas."
    )


def ask_assistant(user_id: str, message: str):
    plan = get_user_plan(user_id)
    limit = PREMIUM_DAILY_LIMIT if plan == "premium" else FREE_DAILY_LIMIT

    usage = get_today_usage(user_id)
    current_count = usage.get("questions_count", 0)

    if current_count >= limit:
        return {
            "blocked": True,
            "plan": plan,
            "limit": limit,
            "remaining_questions": 0,
            "answer": "Alcanzaste el límite diario de preguntas. Activa Premium por $2.500 para acceder a más consultas IA.",
        }

    response = build_assistant_response(message)

    increment_usage(usage["id"], current_count)

    supabase.table("assistant_messages").insert({
        "user_id": user_id,
        "message": message,
        "response": response,
    }).execute()

    return {
        "blocked": False,
        "plan": plan,
        "limit": limit,
        "remaining_questions": limit - current_count - 1,
        "answer": response,
    }


def get_roadmap():
    role = CAREER_PROFILE.get("primary_role", "Data Analyst")

    roadmaps = {
        "Data Analyst": ["SQL intermedio", "Power BI", "Python para datos", "ETL básico", "Storytelling con datos"],
        "BI Analyst": ["Power BI avanzado", "DAX", "Modelamiento de datos", "KPIs de negocio", "Data Warehouse"],
        "QA Automation": ["Testing funcional", "Postman", "Selenium", "Playwright", "CI/CD Testing"],
        "Backend Developer": ["FastAPI", "Bases de datos", "JWT", "Arquitectura REST", "Docker"],
        "Frontend Developer": ["React", "JavaScript", "Tailwind", "Consumo de APIs", "Testing Frontend"],
        "Data Engineer": ["Python avanzado", "ETL", "Airflow", "Docker", "Cloud"],
    }

    result = {
        "primary_role": role,
        "estimated_time": "3 a 6 meses",
        "level": "Junior",
        "steps": roadmaps.get(role, roadmaps["Data Analyst"]),
        "recommendation": CAREER_PROFILE.get("recommendation"),
    }

    supabase.table("career_roadmaps").insert({
        "user_id": DEFAULT_USER_ID,
        **result,
    }).execute()

    return result


def generate_question(role: str | None):
    selected_role = role or CAREER_PROFILE.get("primary_role", "QA Automation")

    questions = {
        "QA Automation": "¿Cómo automatizarías una prueba de login en una aplicación web?",
        "Data Analyst": "¿Cómo construirías un dashboard para analizar ventas mensuales?",
        "BI Analyst": "¿Cómo definirías los KPIs principales para un dashboard ejecutivo?",
        "Frontend Developer": "¿Cómo consumirías una API REST desde React?",
        "Backend Developer": "¿Cómo diseñarías una API REST para gestionar usuarios?",
    }

    return {
        "role": selected_role,
        "question": questions.get(
            selected_role,
            "Cuéntame cómo resolverías un problema técnico complejo."
        ),
    }


def evaluate_answer(answer: str, role: str | None):
    selected_role = role or CAREER_PROFILE.get("primary_role", "QA Automation")
    score = 60

    if len(answer) > 80:
        score += 15
    if len(answer) > 150:
        score += 10

    keywords = ["sql", "api", "python", "react", "testing", "postman", "docker", "power bi"]
    matched_keywords = [
        keyword for keyword in keywords
        if keyword in answer.lower()
    ]

    score += len(matched_keywords) * 4
    score = min(score, 100)

    return {
        "role": selected_role,
        "score": score,
        "feedback": "Buena respuesta. Puedes mejorar agregando ejemplos concretos, herramientas y resultados medibles.",
        "matched_keywords": matched_keywords,
        "recommendation": "Estructura tu respuesta en contexto, pasos técnicos, herramientas y resultado esperado.",
    }


def analyze_cv(role: str, skills: list[str], projects: list[str]):
    base_score = 65
    all_text = " ".join(skills + projects).lower()

    keywords = {
        "QA Automation": ["selenium", "playwright", "postman", "sql", "python", "testing"],
        "Data Analyst": ["sql", "power bi", "python", "excel", "etl", "dashboard"],
        "BI Analyst": ["power bi", "sql", "dax", "kpi", "dashboard", "excel"],
        "Frontend Developer": ["react", "javascript", "tailwind", "html", "css", "api"],
        "Backend Developer": ["fastapi", "python", "sql", "api", "docker", "jwt"],
    }.get(role, ["sql", "python", "api"])

    matched = [keyword for keyword in keywords if keyword in all_text]
    score = min(base_score + len(matched) * 6 + len(projects) * 4, 100)

    return {
        "role": role,
        "ats_score": score,
        "matched_keywords": matched,
        "missing_keywords": [keyword for keyword in keywords if keyword not in matched],
        "recommendation": "Agrega métricas de impacto, herramientas técnicas y proyectos reales relacionados al rol.",
    }

def extract_keywords_by_role(role: str):
    return {
        "QA Automation": ["selenium", "playwright", "postman", "sql", "python", "testing", "api", "automatización"],
        "Data Analyst": ["sql", "power bi", "python", "excel", "etl", "dashboard", "kpi", "datos"],
        "BI Analyst": ["power bi", "sql", "dax", "kpi", "dashboard", "excel"],
        "Frontend Developer": ["react", "javascript", "tailwind", "html", "css", "api"],
        "Backend Developer": ["fastapi", "python", "sql", "api", "docker", "jwt", "microservicios"],
    }.get(role, ["sql", "python", "api", "excel"])


def analyze_cv_advanced(user_id: str, role: str, cv_text: str, job_description: str, skills: list[str], projects: list[str]):
    text = " ".join([cv_text, " ".join(skills), " ".join(projects)]).lower()
    offer_text = job_description.lower()

    role_keywords = extract_keywords_by_role(role)
    offer_keywords = [kw for kw in role_keywords if kw in offer_text]
    keywords = offer_keywords if offer_keywords else role_keywords

    matched = [kw for kw in keywords if kw in text]
    missing = [kw for kw in keywords if kw not in matched]

    score = min(55 + len(matched) * 8 + len(projects) * 3, 100)

    return {
        "user_id": user_id,
        "role": role,
        "ats_score": score,
        "compatibility": score,
        "matched_keywords": matched,
        "missing_keywords": missing,
        "recommendations": [
            "Agrega palabras clave exactas de la oferta laboral.",
            "Incluye herramientas técnicas en una sección visible de habilidades.",
            "Describe proyectos con resultados medibles.",
            "Evita formatos complejos que puedan fallar en sistemas ATS.",
        ],
        "premium_available": True,
        "premium_message": "Con Premium por $2.500 puedes generar una versión optimizada del CV para esta oferta.",
    }


def optimize_cv_for_job(user_id: str, role: str, cv_text: str, job_description: str):
    plan = get_user_plan(user_id)

    if plan != "premium":
        return {
            "blocked": True,
            "plan": plan,
            "message": "Esta función requiere Premium por $2.500.",
        }

    keywords = extract_keywords_by_role(role)
    offer_text = job_description.lower()
    relevant = [kw for kw in keywords if kw in offer_text] or keywords[:5]

    return {
        "blocked": False,
        "plan": plan,
        "optimized_profile": (
            f"Profesional orientado a {role}, con experiencia en {', '.join(relevant[:4])}. "
            "Capaz de aportar en equipos tecnológicos mediante análisis, ejecución técnica y mejora continua."
        ),
        "optimized_skills": relevant,
        "ats_tips": [
            "Usa las mismas palabras clave de la oferta.",
            "Incluye tecnologías en formato simple, sin tablas complejas.",
            "Agrega logros medibles por proyecto.",
            "Ordena el CV en perfil, habilidades, experiencia, proyectos y educación.",
        ],
    }