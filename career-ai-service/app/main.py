from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import onboarding, ai, roadmap, interview, cv

app = FastAPI(
    title="SkillSync Career AI Service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(onboarding.router, prefix="/api/onboarding", tags=["Onboarding"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Assistant"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["Roadmap"])
app.include_router(interview.router, prefix="/api/interview", tags=["Interview"])
app.include_router(cv.router, prefix="/api/cv", tags=["CV Builder"])


@app.get("/")
def root():
    return {"service": "career-ai-service", "status": "OK"}


@app.get("/api/health")
def health():
    return {"status": "OK", "service": "career-ai-service"}