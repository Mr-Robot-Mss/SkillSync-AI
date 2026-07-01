import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    supabase_url: str = os.getenv("SUPABASE_URL")
    supabase_key: str = os.getenv("SUPABASE_KEY")
    secret_key: str = os.getenv("SECRET_KEY", "skillsync-secret-key")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )


settings = Settings()