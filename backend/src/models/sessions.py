from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship, Mapped
from utils import handle_db_exception
from database import Base, db
from schemas.sessions import SessionCreate


class UserSession(Base):
    __tablename__ = 'sessions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'))
    session_id = Column(String)
    user: Mapped['User'] = relationship("User", back_populates="sessions")

    def __init__(self, user_id: int, session_id: str):
        self.user_id = user_id
        self.session_id = session_id
