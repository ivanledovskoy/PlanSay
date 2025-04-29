from pydantic import BaseModel, Field

class UploadedFileCreate(BaseModel):
    task_id: int
    path_to_file: str
    name: str
    content_type: str

class UploadedFileResponse(BaseModel):
    name: str
    content_type: str