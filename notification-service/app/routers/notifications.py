from fastapi import APIRouter, HTTPException

from app.schemas.notification import NotificationCreateRequest
from app.services.notification_service import (
    get_all_notifications,
    get_unread_notifications,
    create_notification,
    mark_as_read,
    delete_notification,
)

router = APIRouter()


@router.get("/")
def notifications_root():
    return {"message": "Notifications API funcionando"}


@router.get("/all")
def notifications_all():
    return get_all_notifications()


@router.get("/unread")
def notifications_unread():
    return get_unread_notifications()


@router.post("/")
def notifications_create(data: NotificationCreateRequest):
    notification = create_notification(data.model_dump())

    return {
        "message": "Notificación creada correctamente",
        "notification": notification,
    }


@router.patch("/{notification_id}/read")
def notifications_read(notification_id: int):
    notification = mark_as_read(notification_id)

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notificación no encontrada",
        )

    return {
        "message": "Notificación marcada como leída",
        "notification": notification,
    }


@router.delete("/{notification_id}")
def notifications_delete(notification_id: int):
    return {
        "message": "Notificación eliminada correctamente",
        "notifications": delete_notification(notification_id),
    }