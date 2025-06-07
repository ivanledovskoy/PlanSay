from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship, Mapped
from database import Base, db
from datetime import datetime


class UploadedFile(Base):
    __tablename__ = 'uploaded_files'

    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey('tasks.id', ondelete='CASCADE'))
    path_to_file = Column(String)
    name = Column(String)
    content_type = Column(String)
    shared = Column(Boolean)
    link = Column(String)
    task: Mapped['Task'] = relationship("Task", back_populates="uploaded_files")

    def __init__(self, task_id: int, path_to_file: str, name: str, content_type: str):
        self.task_id = task_id
        self.path_to_file = path_to_file
        self.name = name
        self.content_type = content_type
        self.shared = False
        self.link = None