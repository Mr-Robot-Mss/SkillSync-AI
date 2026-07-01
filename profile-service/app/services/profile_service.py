from app.core.supabase_client import supabase


DEFAULT_USER_ID = "demo-user"


def get_profile():
    profile_response = (
        supabase
        .table("perfiles")
        .select("*")
        .eq("user_id", DEFAULT_USER_ID)
        .limit(1)
        .execute()
    )

    profile = profile_response.data[0] if profile_response.data else {}

    skills_response = (
        supabase
        .table("habilidades")
        .select("*")
        .eq("user_id", DEFAULT_USER_ID)
        .execute()
    )

    projects_response = (
        supabase
        .table("proyectos")
        .select("*")
        .eq("user_id", DEFAULT_USER_ID)
        .execute()
    )

    return {
        **profile,
        "skills": skills_response.data,
        "projects": projects_response.data,
        "settings": profile,
    }


def get_skills():
    response = (
        supabase
        .table("habilidades")
        .select("*")
        .eq("user_id", DEFAULT_USER_ID)
        .execute()
    )

    return {
        "primary_role": "Desarrollador Fullstack",
        "skills": response.data,
    }


def add_skill(skill: str):
    data = {
        "user_id": DEFAULT_USER_ID,
        "name": skill,
    }

    response = (
        supabase
        .table("habilidades")
        .insert(data)
        .execute()
    )

    return response.data


def delete_skill(skill: str):
    response = (
        supabase
        .table("habilidades")
        .delete()
        .eq("user_id", DEFAULT_USER_ID)
        .eq("name", skill)
        .execute()
    )

    return response.data


def get_projects():
    response = (
        supabase
        .table("proyectos")
        .select("*")
        .eq("user_id", DEFAULT_USER_ID)
        .execute()
    )

    return response.data


def create_project(data):
    project = {
        "user_id": DEFAULT_USER_ID,
        **data,
    }

    response = (
        supabase
        .table("proyectos")
        .insert(project)
        .execute()
    )

    return response.data[0] if response.data else project


def get_settings():
    response = (
        supabase
        .table("perfiles")
        .select("*")
        .eq("user_id", DEFAULT_USER_ID)
        .limit(1)
        .execute()
    )

    return response.data[0] if response.data else {}


def update_settings(data):
    existing = (
        supabase
        .table("perfiles")
        .select("*")
        .eq("user_id", DEFAULT_USER_ID)
        .limit(1)
        .execute()
    )

    payload = {
        "user_id": DEFAULT_USER_ID,
        **data,
    }

    if existing.data:
        response = (
            supabase
            .table("perfiles")
            .update(payload)
            .eq("user_id", DEFAULT_USER_ID)
            .execute()
        )
    else:
        response = (
            supabase
            .table("perfiles")
            .insert(payload)
            .execute()
        )

    return response.data[0] if response.data else payload