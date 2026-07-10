import os

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    frontend_url: str = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173",
    )

    supabase_url: str = os.getenv("SUPABASE_URL", "")

    supabase_service_role_key: str = os.getenv(
        "SUPABASE_SERVICE_ROLE_KEY",
        "",
    )

    jwt_secret: str = os.getenv(
        "JWT_SECRET",
        "skillsync-development-secret", 
    )

    jwt_algorithm: str = os.getenv(
        "JWT_ALGORITHM",
        "HS256",
    )

    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )


settings = Settings()