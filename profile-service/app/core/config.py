import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class Settings(BaseModel):
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    supabase_url: str = os.getenv("SUPABASE_URL")
    supabase_key: str = os.getenv("SUPABASE_KEY")

settings = Settings()