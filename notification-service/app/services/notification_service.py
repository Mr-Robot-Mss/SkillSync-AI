from app.data.notification_store import NOTIFICATIONS


def get_all_notifications():
    return NOTIFICATIONS


def get_unread_notifications():
    return [
        notification for notification in NOTIFICATIONS
        if not notification["read"]
    ]


def create_notification(data):
    notification = {
        "id": len(NOTIFICATIONS) + 1,
        "title": data["title"],
        "description": data["description"],
        "type": data.get("type", "general"),
        "read": False,
        "created_at": "Ahora",
    }

    NOTIFICATIONS.append(notification)

    return notification


def mark_as_read(notification_id: int):
    for notification in NOTIFICATIONS:
        if notification["id"] == notification_id:
            notification["read"] = True
            return notification

    return None


def delete_notification(notification_id: int):
    global NOTIFICATIONS

    NOTIFICATIONS = [
        notification for notification in NOTIFICATIONS
        if notification["id"] != notification_id
    ]

    return NOTIFICATIONS