from pydantic import BaseModel, Field

class UserUpdate(BaseModel):
    password: str | None = Field(min_length=8, max_length=30)
    role: str | None = None
    active: bool | None = None


class UserCredential(BaseModel):
    password: str = Field(min_length=8, max_length=30)


class UserResponse(BaseModel):
    email: str | None = None
    role: str | None = None
    active: bool | None = None