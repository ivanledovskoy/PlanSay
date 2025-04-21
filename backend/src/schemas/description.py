from pydantic import BaseModel, Field

class DescriptionResponse(BaseModel):
    value: str
