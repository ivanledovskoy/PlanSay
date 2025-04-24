from pydantic import BaseModel, Field
from typing import Optional

class UserUpdate(BaseModel):
    password: str | None = None
    role: str | None = None
    active: bool | None = None


class UserCredential(BaseModel):
    password: str = Field(min_length=8, max_length=30)


class UserResponse(BaseModel):
    user_id: int
    email: str
    role: str
    active: bool