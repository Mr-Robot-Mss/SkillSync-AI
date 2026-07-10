from datetime import date

from app.core.supabase_client import supabase
from app.data.career_store import CAREER_PROFILE


DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001"

FREE_DAILY_LIMIT = 5
PREMIUM_DAILY_LIMIT = 100


ROLE_SKILLS = {
    "QA Automation": [
        "Postman",
        "SQL",
        "Playwright",
        "Selenium",
        "Python",
    ],
    "Data Analyst": [
        "SQL",
        "Power BI",
        "Excel",
        "Python",
        "ETL",
    ],
    "BI Analyst": [
        "Power BI",
        "SQL",
        "DAX",
        "KPIs",
        "Excel",
    ],
    "Software Developer": [
        "JavaScript",
        "React",
        "APIs",
        "Git",
        "SQL",
    ],
    "UX/UI Designer": [
        "Figma",
        "UX/UI",
        "Prototipado",
        "Diseño visual",
        "Frontend",
    ],
    "DevOps Engineer": [
        "Docker",
        "Linux",
        "CI/CD",
        "Cloud",
        "Git",
    ],
    "Product Manager": [
        "Comunicación",
        "KPIs",
        "Roadmap",
        "Producto",
        "Gestión",
    ],
}


ROLE_MAX_SCORES = {
    "QA Automation": 33,
    "Data Analyst": 33,
    "BI Analyst": 30,
    "Software Developer": 33,
    "UX/UI Designer": 30,
    "DevOps Engineer": 33,
    "Product Manager": 33,
}


def normalize_user_id(user_id: str) -> str:
    value = str(user_id or "").strip()

    if not value:
        raise ValueError("user_id es obligatorio")

    return value


def calculate_percentage(
    score: float,
    maximum_score: float,
) -> int:
    if maximum_score <= 0:
        return 0

    percentage = round(
        (score / maximum_score) * 100
    )

    return max(0, min(99, percentage))


def analyze_profile(data: dict):
    user_id = normalize_user_id(
        data.get("user_id")
    )

    answers = data.get("answers") or {}

    required_answers = [
        "development",
        "data",
        "qa",
        "automation",
        "design",
        "database",
        "problem",
        "communication",
        "ai",
        "learning",
    ]

    missing_answers = [
        field
        for field in required_answers
        if field not in answers
    ]

    if missing_answers:
        raise ValueError(
            "Faltan respuestas del onboarding: "
            + ", ".join(missing_answers)
        )

    normalized_answers = {}

    for field in required_answers:
        value = int(answers[field])

        if value < 1 or value > 3:
            raise ValueError(
                f"La respuesta {field} debe estar entre 1 y 3"
            )

        normalized_answers[field] = value

    development = normalized_answers["development"]
    data_interest = normalized_answers["data"]
    qa = normalized_answers["qa"]
    automation = normalized_answers["automation"]
    design = normalized_answers["design"]
    database = normalized_answers["database"]
    problem = normalized_answers["problem"]
    communication = normalized_answers["communication"]
    ai = normalized_answers["ai"]
    learning = normalized_answers["learning"]

    scores = {
        "QA Automation": (
            qa * 3
            + automation * 3
            + problem * 2
            + database
            + communication
            + learning
        ),
        "Data Analyst": (
            data_interest * 3
            + database * 3
            + problem * 2
            + communication
            + ai
            + learning
        ),
        "BI Analyst": (
            data_interest * 3
            + database * 2
            + communication * 2
            + design
            + problem
            + learning
        ),
        "Software Developer": (
            development * 3
            + problem * 3
            + database * 2
            + automation
            + ai
            + learning
        ),
        "UX/UI Designer": (
            design * 4
            + development * 2
            + communication * 2
            + problem
            + learning
        ),
        "DevOps Engineer": (
            automation * 3
            + database * 2
            + problem * 3
            + development
            + learning
            + ai
        ),
        "Product Manager": (
            communication * 4
            + problem * 2
            + data_interest * 2
            + design
            + learning
            + ai
        ),
    }

    ranking = sorted(
        scores.items(),
        key=lambda item: item[1],
        reverse=True,
    )

    ranking_result = [
        {
            "role": role,
            "score": score,
            "percentage": calculate_percentage(
                score,
                ROLE_MAX_SCORES[role],
            ),
        }
        for role, score in ranking
    ]

    primary_role = ranking[0][0]
    secondary_role = ranking[1][0]
    third_role = ranking[2][0]

    result = {
        "user_id": user_id,
        "primary_role": primary_role,
        "secondary_role": secondary_role,
        "third_role": third_role,
        "compatibility": ranking_result[0][
            "percentage"
        ],
        "secondary_compatibility": ranking_result[1][
            "percentage"
        ],
        "recommended_skills": ROLE_SKILLS.get(
            primary_role,
            [],
        ),
        "ranking": ranking_result[:5],
        "recommendation": build_recommendation(
            primary_role
        ),
        "answers": normalized_answers,
        "status": "completed",
    }

    CAREER_PROFILE.clear()
    CAREER_PROFILE.update(result)

    existing = (
        supabase
        .table("career_results")
        .select("id")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    database_payload = {
        "user_id": user_id,
        "primary_role": primary_role,
        "secondary_role": secondary_role,
        "third_role": third_role,
        "compatibility": result["compatibility"],
        "ranking": result["ranking"],
        "recommendation": result["recommendation"],
    }

    if existing.data:
        (
            supabase
            .table("career_results")
            .update(database_payload)
            .eq("user_id", user_id)
            .execute()
        )
    else:
        (
            supabase
            .table("career_results")
            .insert(database_payload)
            .execute()
        )

    return result


def build_recommendation(role: str) -> str:
    recommendations = {
        "Data Analyst": (
            "Tu perfil muestra alta afinidad con análisis "
            "de datos. Refuerza SQL, Power BI, Python y "
            "storytelling con datos."
        ),
        "BI Analyst": (
            "Tu perfil calza con inteligencia de negocios. "
            "Refuerza Power BI, KPIs, modelamiento de datos "
            "y análisis comercial."
        ),
        "QA Automation": (
            "Tu perfil tiene afinidad con QA Automation. "
            "Refuerza Selenium, Playwright, Postman, SQL "
            "y automatización con Python."
        ),
        "Software Developer": (
            "Tu perfil muestra afinidad con desarrollo de "
            "software. Refuerza programación, APIs, Git, "
            "bases de datos y construcción de proyectos."
        ),
        "DevOps Engineer": (
            "Tu perfil apunta a infraestructura y "
            "automatización. Aprende Docker, CI/CD, Linux, "
            "cloud y monitoreo."
        ),
        "Product Manager": (
            "Tu perfil apunta a gestión de producto. "
            "Refuerza análisis de usuarios, KPIs, roadmap, "
            "comunicación y estrategia."
        ),
        "UX/UI Designer": (
            "Tu perfil tiene afinidad con diseño UX/UI. "
            "Aprende Figma, investigación de usuarios, "
            "prototipado y diseño de interfaces."
        ),
    }

    return recommendations.get(
        role,
        "Tu perfil tiene una buena base tecnológica.",
    )


def get_user_plan(user_id: str):
    user_id = normalize_user_id(user_id)

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
        return response.data[0].get(
            "plan",
            "free",
        )

    return "free"


def get_today_usage(user_id: str):
    user_id = normalize_user_id(user_id)
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
        .insert(
            {
                "user_id": user_id,
                "usage_date": today,
                "questions_count": 0,
            }
        )
        .execute()
    )

    if not created.data:
        raise RuntimeError(
            "No se pudo crear el registro de uso IA"
        )

    return created.data[0]


def increment_usage(
    usage_id: int,
    current_count: int,
):
    (
        supabase
        .table("ai_usage")
        .update(
            {
                "questions_count": (
                    current_count + 1
                )
            }
        )
        .eq("id", usage_id)
        .execute()
    )


def build_assistant_response(message: str):
    text = str(message or "").lower()

    if "cv" in text or "curriculum" in text:
        return (
            "Para mejorar tu CV debes adaptarlo a cada "
            "oferta laboral. Incluye palabras clave del "
            "cargo, herramientas técnicas, proyectos "
            "reales y resultados medibles."
        )

    if (
        "ats" in text
        or "bot" in text
        or "filtro" in text
    ):
        return (
            "Los sistemas ATS comparan palabras clave, "
            "experiencia, tecnologías y estructura del "
            "documento. Usa títulos claros y evita diseños "
            "demasiado complejos."
        )

    if "qa" in text:
        return (
            "Para QA conviene destacar pruebas "
            "funcionales, regresión, smoke testing, "
            "Postman, SQL, Selenium, Playwright y "
            "documentación de defectos."
        )

    if "python" in text:
        return (
            "Python es útil para automatización, análisis "
            "de datos, backend con FastAPI y testing."
        )

    if (
        "datos" in text
        or "data" in text
        or "bi" in text
    ):
        return (
            "Para perfiles de datos destaca SQL, Power BI, "
            "Excel avanzado, Python, ETL, dashboards y KPIs."
        )

    if "frontend" in text or "react" in text:
        return (
            "Para frontend destaca React, JavaScript, "
            "consumo de APIs, Tailwind y componentes "
            "reutilizables."
        )

    if "backend" in text or "api" in text:
        return (
            "Para backend destaca FastAPI, bases de datos, "
            "JWT, arquitectura REST, validaciones y manejo "
            "de errores."
        )

    role = CAREER_PROFILE.get(
        "primary_role",
        "Data Analyst",
    )

    return (
        f"Según tu perfil orientado a {role}, te recomiendo "
        "fortalecer habilidades técnicas, crear proyectos "
        "demostrables y adaptar tu CV a cada oferta."
    )


def ask_assistant(
    user_id: str,
    message: str,
):
    user_id = normalize_user_id(user_id)

    plan = get_user_plan(user_id)

    limit = (
        PREMIUM_DAILY_LIMIT
        if plan == "premium"
        else FREE_DAILY_LIMIT
    )

    usage = get_today_usage(user_id)

    current_count = usage.get(
        "questions_count",
        0,
    )

    if current_count >= limit:
        return {
            "blocked": True,
            "plan": plan,
            "limit": limit,
            "remaining_questions": 0,
            "answer": (
                "Alcanzaste el límite diario de preguntas. "
                "Activa Premium por $2.500 para acceder a "
                "más consultas IA."
            ),
        }

    response = build_assistant_response(
        message
    )

    increment_usage(
        usage["id"],
        current_count,
    )

    (
        supabase
        .table("assistant_messages")
        .insert(
            {
                "user_id": user_id,
                "message": message,
                "response": response,
            }
        )
        .execute()
    )

    return {
        "blocked": False,
        "plan": plan,
        "limit": limit,
        "remaining_questions": (
            limit - current_count - 1
        ),
        "answer": response,
    }


def get_roadmap(
    user_id: str = DEFAULT_USER_ID,
):
    user_id = normalize_user_id(user_id)

    career_response = (
        supabase
        .table("career_results")
        .select("*")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    career_result = (
        career_response.data[0]
        if career_response.data
        else {}
    )

    role = (
        career_result.get("primary_role")
        or CAREER_PROFILE.get("primary_role")
        or "Data Analyst"
    )

    roadmaps = {
        "Data Analyst": [
            "SQL intermedio",
            "Power BI",
            "Python para datos",
            "ETL básico",
            "Storytelling con datos",
        ],
        "BI Analyst": [
            "Power BI avanzado",
            "DAX",
            "Modelamiento de datos",
            "KPIs de negocio",
            "Data Warehouse",
        ],
        "QA Automation": [
            "Testing funcional",
            "Postman",
            "Selenium",
            "Playwright",
            "CI/CD Testing",
        ],
        "Software Developer": [
            "JavaScript",
            "React",
            "APIs REST",
            "Bases de datos",
            "Docker",
        ],
        "UX/UI Designer": [
            "Figma",
            "UX Research",
            "Prototipado",
            "Design System",
            "Frontend básico",
        ],
        "DevOps Engineer": [
            "Docker",
            "Linux",
            "CI/CD",
            "Cloud",
            "Monitoreo",
        ],
        "Product Manager": [
            "Product Discovery",
            "KPIs",
            "Roadmap",
            "Investigación de usuarios",
            "Gestión ágil",
        ],
    }

    result = {
        "user_id": user_id,
        "primary_role": role,
        "target_role": role,
        "estimated_time": "3 a 6 meses",
        "level": "Junior",
        "steps": roadmaps.get(
            role,
            roadmaps["Data Analyst"],
        ),
        "recommendation": (
            career_result.get("recommendation")
            or CAREER_PROFILE.get(
                "recommendation",
                "",
            )
        ),
        "current_compatibility": (
            career_result.get(
                "compatibility",
                70,
            )
        ),
        "target_compatibility": 92,
        "focus": ROLE_SKILLS.get(
            role,
            [],
        ),
    }

    return result


def generate_question(role: str | None):
    selected_role = (
        role
        or CAREER_PROFILE.get(
            "primary_role",
            "QA Automation",
        )
    )

    questions = {
        "QA Automation": (
            "¿Cómo automatizarías una prueba de login "
            "en una aplicación web?"
        ),
        "Data Analyst": (
            "¿Cómo construirías un dashboard para "
            "analizar ventas mensuales?"
        ),
        "BI Analyst": (
            "¿Cómo definirías los principales KPIs "
            "para un dashboard ejecutivo?"
        ),
        "Software Developer": (
            "¿Cómo diseñarías e implementarías una "
            "funcionalidad completa?"
        ),
        "UX/UI Designer": (
            "¿Cómo validarías que una interfaz sea "
            "comprensible para sus usuarios?"
        ),
        "DevOps Engineer": (
            "¿Cómo desplegarías una aplicación con "
            "Docker y un pipeline CI/CD?"
        ),
        "Product Manager": (
            "¿Cómo priorizarías funcionalidades para "
            "un MVP?"
        ),
    }

    return {
        "role": selected_role,
        "question": questions.get(
            selected_role,
            (
                "Cuéntame cómo resolverías un "
                "problema técnico complejo."
            ),
        ),
    }


def evaluate_answer(
    answer: str,
    role: str | None,
):
    selected_role = (
        role
        or CAREER_PROFILE.get(
            "primary_role",
            "QA Automation",
        )
    )

    answer_text = str(answer or "")
    score = 60

    if len(answer_text) > 80:
        score += 15

    if len(answer_text) > 150:
        score += 10

    keywords = [
        "sql",
        "api",
        "python",
        "react",
        "testing",
        "postman",
        "docker",
        "power bi",
    ]

    matched_keywords = [
        keyword
        for keyword in keywords
        if keyword in answer_text.lower()
    ]

    score += len(matched_keywords) * 4
    score = min(score, 100)

    return {
        "role": selected_role,
        "score": score,
        "feedback": (
            "Buena respuesta. Puedes mejorar agregando "
            "ejemplos concretos, herramientas y resultados "
            "medibles."
        ),
        "matched_keywords": matched_keywords,
        "recommendation": (
            "Estructura tu respuesta en contexto, pasos "
            "técnicos, herramientas y resultado esperado."
        ),
    }


def analyze_cv(
    role: str,
    skills: list[str],
    projects: list[str],
):
    base_score = 65

    all_text = " ".join(
        skills + projects
    ).lower()

    keywords = {
        "QA Automation": [
            "selenium",
            "playwright",
            "postman",
            "sql",
            "python",
            "testing",
        ],
        "Data Analyst": [
            "sql",
            "power bi",
            "python",
            "excel",
            "etl",
            "dashboard",
        ],
        "BI Analyst": [
            "power bi",
            "sql",
            "dax",
            "kpi",
            "dashboard",
            "excel",
        ],
        "Software Developer": [
            "react",
            "javascript",
            "python",
            "api",
            "git",
            "sql",
        ],
        "UX/UI Designer": [
            "figma",
            "ux",
            "ui",
            "prototipo",
            "research",
        ],
        "DevOps Engineer": [
            "docker",
            "linux",
            "ci/cd",
            "cloud",
            "git",
        ],
    }.get(
        role,
        [
            "sql",
            "python",
            "api",
        ],
    )

    matched = [
        keyword
        for keyword in keywords
        if keyword in all_text
    ]

    score = min(
        base_score
        + len(matched) * 6
        + len(projects) * 4,
        100,
    )

    return {
        "role": role,
        "ats_score": score,
        "matched_keywords": matched,
        "missing_keywords": [
            keyword
            for keyword in keywords
            if keyword not in matched
        ],
        "recommendation": (
            "Agrega métricas de impacto, herramientas "
            "técnicas y proyectos relacionados al rol."
        ),
    }


def extract_keywords_by_role(
    role: str,
):
    return {
        "QA Automation": [
            "selenium",
            "playwright",
            "postman",
            "sql",
            "python",
            "testing",
            "api",
            "automatización",
        ],
        "Data Analyst": [
            "sql",
            "power bi",
            "python",
            "excel",
            "etl",
            "dashboard",
            "kpi",
            "datos",
        ],
        "BI Analyst": [
            "power bi",
            "sql",
            "dax",
            "kpi",
            "dashboard",
            "excel",
        ],
        "Software Developer": [
            "javascript",
            "react",
            "python",
            "api",
            "sql",
            "git",
        ],
        "UX/UI Designer": [
            "figma",
            "ux",
            "ui",
            "research",
            "prototipado",
        ],
        "DevOps Engineer": [
            "docker",
            "linux",
            "ci/cd",
            "cloud",
            "git",
            "monitoreo",
        ],
    }.get(
        role,
        [
            "sql",
            "python",
            "api",
            "excel",
        ],
    )


def analyze_cv_advanced(
    user_id: str,
    role: str,
    cv_text: str,
    job_description: str,
    skills: list[str],
    projects: list[str],
):
    user_id = normalize_user_id(user_id)

    text = " ".join(
        [
            cv_text,
            " ".join(skills),
            " ".join(projects),
        ]
    ).lower()

    offer_text = str(
        job_description or ""
    ).lower()

    role_keywords = extract_keywords_by_role(
        role
    )

    offer_keywords = [
        keyword
        for keyword in role_keywords
        if keyword in offer_text
    ]

    keywords = (
        offer_keywords
        if offer_keywords
        else role_keywords
    )

    matched = [
        keyword
        for keyword in keywords
        if keyword in text
    ]

    missing = [
        keyword
        for keyword in keywords
        if keyword not in matched
    ]

    score = min(
        55
        + len(matched) * 8
        + len(projects) * 3,
        100,
    )

    return {
        "user_id": user_id,
        "role": role,
        "ats_score": score,
        "compatibility": score,
        "matched_keywords": matched,
        "missing_keywords": missing,
        "recommendations": [
            (
                "Agrega palabras clave exactas de la "
                "oferta laboral."
            ),
            (
                "Incluye herramientas técnicas en una "
                "sección visible de habilidades."
            ),
            (
                "Describe proyectos con resultados "
                "medibles."
            ),
            (
                "Evita formatos complejos que puedan "
                "fallar en sistemas ATS."
            ),
        ],
        "premium_available": True,
        "premium_message": (
            "Con Premium por $2.500 puedes generar una "
            "versión optimizada del CV para esta oferta."
        ),
    }


def optimize_cv_for_job(
    user_id: str,
    role: str,
    cv_text: str,
    job_description: str,
):
    user_id = normalize_user_id(user_id)

    plan = get_user_plan(user_id)

    if plan != "premium":
        return {
            "blocked": True,
            "plan": plan,
            "message": (
                "Esta función requiere Premium "
                "por $2.500."
            ),
        }

    keywords = extract_keywords_by_role(
        role
    )

    offer_text = str(
        job_description or ""
    ).lower()

    relevant = [
        keyword
        for keyword in keywords
        if keyword in offer_text
    ] or keywords[:5]

    return {
        "blocked": False,
        "plan": plan,
        "optimized_profile": (
            f"Profesional orientado a {role}, con "
            f"experiencia en {', '.join(relevant[:4])}. "
            "Capaz de aportar en equipos tecnológicos "
            "mediante análisis, ejecución técnica y "
            "mejora continua."
        ),
        "optimized_skills": relevant,
        "ats_tips": [
            (
                "Usa las mismas palabras clave de "
                "la oferta."
            ),
            (
                "Incluye tecnologías en formato simple, "
                "sin tablas complejas."
            ),
            (
                "Agrega logros medibles por proyecto."
            ),
            (
                "Ordena el CV en perfil, habilidades, "
                "experiencia, proyectos y educación."
            ),
        ],
    }