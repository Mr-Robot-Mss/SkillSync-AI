from app.data.analytics_store import (
    PLATFORM_STATS,
    DASHBOARD_SUMMARY
)


def get_dashboard_summary():
    return DASHBOARD_SUMMARY


def get_platform_stats():
    return PLATFORM_STATS


def get_insights():
    return [
        "Docker aumenta la empleabilidad en perfiles técnicos.",
        "Power BI sigue siendo una habilidad altamente demandada.",
        "QA Automation muestra crecimiento sostenido.",
        "Los perfiles Data Analyst poseen mayor cantidad de ofertas activas.",
    ]


def get_reports():
    return {
        "career_reports": 124,
        "cv_reports": 57,
        "roadmaps_generated": 96,
        "interviews_completed": 42,
    }