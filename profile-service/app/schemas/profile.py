from pydantic import BaseModel, EmailStr, Field


class ProfileUpdateRequest(BaseModel):
    name: str = Field(default="", max_length=120)
    email: EmailStr
    city: str = Field(default="", max_length=120)
    career: str = Field(default="", max_length=160)
    about_me: str = Field(default="", max_length=2000)
    linkedin: str = Field(default="", max_length=500)
    github: str = Field(default="", max_length=500)
    target_role: str = Field(default="", max_length=160)


class AboutMeUpdateRequest(BaseModel):
    about_me: str = Field(
        default="",
        max_length=2000,
    )


class SkillRequest(BaseModel):
    skill: str = Field(min_length=1, max_length=120)
    level: int = Field(default=50, ge=0, le=100)


class ProjectRequest(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    description: str = Field(default="", max_length=3000)
    technologies: list[str] = []
    type: str = Field(default="", max_length=120)


class SettingsUpdateRequest(BaseModel):
    name: str = ""
    email: EmailStr
    city: str = ""
    career: str = ""
    linkedin: str = ""
    github: str = ""
    theme: str = "light"