from sqlalchemy import Column
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, Mapped
from database import Base


class Description(Base):
    __tablename__ = 'descriptions'

    id = Column(Integer, primary_key=True) 
    task_id = Column(Integer, ForeignKey('tasks.id', ondelete='CASCADE'))
    value = Column(String)
    task: Mapped['Task'] = relationship("Task", back_populates="description")

    def __init__(self, value: str, task_id: int):
        self.value = value
        self.task_id = task_id
