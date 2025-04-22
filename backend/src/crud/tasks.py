from fastapi import HTTPException, status
from schemas.tasks import TaskCreate, TaskResponse
from sqlalchemy.orm import Session
from models.tasks import Task
from models.descriptions import Description
from datetime import datetime
import logging

logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)


def _get_tasks_with_filter(db: Session, user_id, filter_criteria):
    try:
        tasks = db.query(Task)\
            .filter(Task.user_id == user_id, *filter_criteria)\
            .order_by(Task.remember_data)\
            .all()
        return [TaskResponse.model_validate(i, from_attributes=True) for i in tasks]
    except Exception as e:
        logger.debug(f"Ошибка при получении задач: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ошибка при получении задач")
   
def _create_task(db: Session, task_data: TaskCreate, user_id):
    new_task = Task(
        title=task_data.title,
        create_data=datetime.now(),
        remember_data=task_data.remember_data,
        user_id=user_id,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


def _create_description(db: Session, task_id: int, description: str):
    if description:
        new_description = Description(task_id=task_id, value=description)
        db.add(new_description)
        db.commit()
