from pydantic import BaseModel

class SessionCreate(BaseModel):
    session_id: str
    user_id: int

class SessionResponse(SessionCreate):
    id: int