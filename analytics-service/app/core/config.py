from pydantic import BaseModel


class Settings(BaseModel):
    frontend_url: str = "http://localhost:5173"


settings = Settings()