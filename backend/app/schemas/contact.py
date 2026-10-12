from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.common import SaPhone


class ContactIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")

    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    phone: SaPhone | None = None
    subject: str | None = Field(default=None, max_length=150)
    message: str = Field(min_length=5, max_length=5000)
