from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped
from database import Base, db
from datetime import datetime


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    create_data = Column(DateTime)
    remember_data = Column(DateTime)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    
    user: Mapped['User'] = relationship("User", back_populates="tasks")
    description: Mapped['Description'] = relationship("Description", back_populates="task")

    def __init__(self, title: str, create_data: datetime, remember_data: datetime,
                 user_id: int):
        self.title = title
        self.create_data = create_data
        self.remember_data = remember_data
        self.user_id = user_id
