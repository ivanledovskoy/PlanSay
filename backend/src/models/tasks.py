from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship, Mapped
from database import Base, db
from datetime import datetime


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    create_data = Column(DateTime)
    remember_data = Column(DateTime)
    is_completed = Column(Boolean)
    user_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'))
    
    user: Mapped['User'] = relationship("User", back_populates="tasks")
    description: Mapped['Description'] = relationship("Description", uselist=False, back_populates="task", cascade="all, delete-orphan")
    uploaded_files: Mapped[list['UploadedFile']] = relationship("UploadedFile", back_populates="task", cascade="all, delete-orphan")

    def __init__(self, title: str, create_data: datetime, remember_data: datetime, is_completed: bool,
                 user_id: int):
        self.title = title
        self.create_data = create_data
        self.remember_data = remember_data
        self.is_completed = is_completed
        self.user_id = user_id

    def __str__(self):
        return (
            f"Task(title='{self.title}', "
            f"create_data={self.create_data}, "
            f"remember_data={self.remember_data}, "
            f"is_completed={self.is_completed}, "
            f"user_id={self.user_id})"
        )

    def __repr__(self):
        return str(self)