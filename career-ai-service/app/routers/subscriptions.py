from fastapi import APIRouter
from app.core.supabase_client import supabase

router = APIRouter()


@router.get("/")
def subscriptions_root():
    return {"message": "Subscriptions API funcionando"}


@router.get("/my-plan")
def my_plan(user_id: str = "demo-user"):
    response = (
        supabase
        .table("subscriptions")
        .select("*")
        .eq("user_id", user_id)
        .eq("status", "active")
        .limit(1)
        .execute()
    )

    if not response.data:
        return {
            "user_id": user_id,
            "plan": "free",
            "status": "active",
            "price": 0,
            "is_premium": False,
        }

    subscription = response.data[0]

    return {
        **subscription,
        "is_premium": subscription.get("plan") == "premium",
    }


@router.post("/activate-premium")
def activate_premium(user_id: str = "demo-user"):
    existing = (
        supabase
        .table("subscriptions")
        .select("*")
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    payload = {
        "user_id": user_id,
        "plan": "premium",
        "status": "active",
        "price": 2500,
    }

    if existing.data:
        response = (
            supabase
            .table("subscriptions")
            .update(payload)
            .eq("user_id", user_id)
            .execute()
        )
    else:
        response = (
            supabase
            .table("subscriptions")
            .insert(payload)
            .execute()
        )

    return {
        "message": "Premium activado correctamente",
        "subscription": response.data[0],
    }


@router.post("/cancel-premium")
def cancel_premium(user_id: str = "demo-user"):
    response = (
        supabase
        .table("subscriptions")
        .update({
            "plan": "free",
            "status": "active",
            "price": 0,
        })
        .eq("user_id", user_id)
        .execute()
    )

    return {
        "message": "Plan cambiado a Free",
        "subscription": response.data,
    }