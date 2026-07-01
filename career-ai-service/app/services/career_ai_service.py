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


def ask_assistant(message: str):
    text = message.lower()

    if "docker" in text:
        response = "Docker es recomendable para QA Automation, Backend, Data Engineering y DevOps."
    elif "qa" in text:
        response = "Para QA Automation enfócate en Selenium, Playwright, Postman, SQL y evidencias."
    elif "datos" in text or "data" in text:
        response = "Para Data Analyst fortalece SQL, Power BI, Python, Excel y ETL."
    elif "cv" in text:
        response = "Tu CV debería destacar proyectos reales, tecnologías, métricas de impacto y experiencia práctica."
    else:
        role = CAREER_PROFILE.get("primary_role", "Data Analyst")
        response = f"Según tu perfil actual ({role}), te recomiendo fortalecer habilidades técnicas y crear proyectos demostrables."

    supabase.table("assistant_messages").insert({
        "user_id": DEFAULT_USER_ID,
        "message": message,
        "response": response,
    }).execute()

    return response


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