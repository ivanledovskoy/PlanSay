from pydantic import BaseModel, Field

class DescriptionResponse(BaseModel):
    task_id: int
    value: str
