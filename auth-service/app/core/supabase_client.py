from supabase import create_client

from app.core.config import settings


if not settings.supabase_url:
    raise RuntimeError(
        "Falta SUPABASE_URL en auth-service/.env"
    )

if not settings.supabase_service_role_key:
    raise RuntimeError(
        "Falta SUPABASE_SERVICE_ROLE_KEY en auth-service/.env"
    )


supabase = create_client(
    settings.supabase_url,
    settings.supabase_service_role_key,
)