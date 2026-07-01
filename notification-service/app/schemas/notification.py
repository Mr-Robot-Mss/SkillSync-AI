from pydantic import BaseModel


class NotificationCreateRequest(BaseModel):
    title: str
    description: str
    type: str = "general"