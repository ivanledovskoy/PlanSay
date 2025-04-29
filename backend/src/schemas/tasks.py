from datetime import datetime
from pydantic import BaseModel, Field
from .description import DescriptionResponse
from .uploaded_file import UploadedFileResponse

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    remember_data: datetime | None = None
    is_completed: bool | None = False
    description: str | None =  None

class TaskUpdate(BaseModel):
    title: str | None = None
    remember_data: datetime | None = None
    is_completed: bool | None = None
    description: str | None =  None

class TaskResponse(BaseModel):
    id: int
    title: str
    create_data: datetime
    remember_data: datetime | None = None
    is_completed: bool
    user_id: int
    description: DescriptionResponse | None = None
    uploaded_files: list[UploadedFileResponse] | None = None
