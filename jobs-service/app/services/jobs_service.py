from app.core.supabase_client import supabase
from app.adapters.getonboard_adapter import fetch_getonboard_jobs

DEFAULT_USER_ID = "demo-user"
JOBS_TABLE = "resultados_de_carrera"
SAVED_JOBS_TABLE = "trabajos_guardados"


def sync_external_jobs():
    external_jobs = fetch_getonboard_jobs()

    if not external_jobs:
        return {
            "message": "No se obtuvieron ofertas externas. Se mantiene caché actual.",
            "synced": 0,
            "source": "Get on Board",
        }

    synced = 0
    skipped = 0
    errors = []

    for job in external_jobs:
        external_id = job.get("external_id")

        if not external_id:
            skipped += 1
            continue

        try:
            exists = (
                supabase
                .table(JOBS_TABLE)
                .select("id")
                .eq("external_id", external_id)
                .limit(1)
                .execute()
            )

            if exists.data:
                skipped += 1
                continue

            supabase.table(JOBS_TABLE).insert(job).execute()
            synced += 1

        except Exception as error:
            errors.append({
                "external_id": external_id,
                "error": str(error),
            })

    return {
        "message": "Sincronización finalizada",
        "source": "Get on Board",
        "synced": synced,
        "skipped": skipped,
        "errors": errors,
    }


def get_all_jobs():
    response = (
        supabase
        .table(JOBS_TABLE)
        .select("*")
        .execute()
    )

    return [add_default_match(job) for job in response.data]


def get_job_detail(job_id: int):
    response = (
        supabase
        .table(JOBS_TABLE)
        .select("*")
        .eq("id", job_id)
        .limit(1)
        .execute()
    )

    if not response.data:
        return None

    return add_default_match(response.data[0])


def get_recommended_jobs(primary_role: str = "Data Analyst"):
    response = (
        supabase
        .table(JOBS_TABLE)
        .select("*")
        .execute()
    )

    recommended = []

    for job in response.data:
        match = calculate_match(primary_role, job)
        recommended.append({**job, "match": match})

    recommended.sort(key=lambda item: item["match"], reverse=True)

    return {
        "profile_role": primary_role,
        "total": len(recommended),
        "jobs": recommended,
    }


def save_job(job):
    payload = {
        "user_id": DEFAULT_USER_ID,
        "job_id": job.get("id"),
        "title": job.get("title"),
        "company": job.get("company"),
        "location": job.get("location"),
        "description": job.get("description"),
        "category": job.get("category"),
        "match": job.get("match", 75),
    }

    exists = (
        supabase
        .table(SAVED_JOBS_TABLE)
        .select("id")
        .eq("user_id", DEFAULT_USER_ID)
        .eq("job_id", payload["job_id"])
        .limit(1)
        .execute()
    )

    if exists.data:
        return exists.data

    response = (
        supabase
        .table(SAVED_JOBS_TABLE)
        .insert(payload)
        .execute()
    )

    return response.data


def get_saved_jobs():
    response = (
        supabase
        .table(SAVED_JOBS_TABLE)
        .select("*")
        .eq("user_id", DEFAULT_USER_ID)
        .execute()
    )

    return response.data


def delete_saved_job(job_id: int):
    response = (
        supabase
        .table(SAVED_JOBS_TABLE)
        .delete()
        .eq("user_id", DEFAULT_USER_ID)
        .eq("job_id", job_id)
        .execute()
    )

    return response.data


def add_default_match(job):
    return {
        **job,
        "match": job.get("match", 75),
    }


def calculate_match(primary_role, job):
    category = job.get("category", "")
    title = job.get("title", "")

    role_rules = {
        "Data Analyst": ["Data", "BI"],
        "BI Analyst": ["Data", "BI"],
        "Data Engineer": ["Data", "Backend"],
        "QA Automation": ["QA"],
        "Backend Developer": ["Backend"],
        "Frontend Developer": ["Frontend"],
        "Fullstack Developer": ["Frontend", "Backend"],
        "DevOps Engineer": ["Backend"],
        "Product Manager": ["Data", "Frontend"],
        "UX/UI Designer": ["Frontend"],
    }

    valid_categories = role_rules.get(primary_role, [])

    if category in valid_categories or any(word in title for word in valid_categories):
        return 94

    if category in ["Data", "QA", "Backend", "Frontend"]:
        return 78

    return 65