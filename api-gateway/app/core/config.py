import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()


class Settings(BaseModel):
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    auth_service_url: str = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
    jobs_service_url: str = os.getenv("JOBS_SERVICE_URL", "http://localhost:8002")
    profile_service_url: str = os.getenv("PROFILE_SERVICE_URL", "http://localhost:8003")
    career_ai_service_url: str = os.getenv("CAREER_AI_SERVICE_URL", "http://localhost:8004")


settings = Settings()