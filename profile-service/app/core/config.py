import os

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    frontend_url: str = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173",
    )

    supabase_url: str = os.getenv(
        "SUPABASE_URL",
        "",
    )

    supabase_service_role_key: str = os.getenv(
        "SUPABASE_SERVICE_ROLE_KEY",
        "",
    )

    avatars_bucket: str = os.getenv(
        "AVATARS_BUCKET",
        "avatars",
    )


settings = Settings()