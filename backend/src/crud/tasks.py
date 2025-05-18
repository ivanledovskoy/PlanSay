from fastapi import HTTPException, status
from schemas.tasks import TaskCreate, TaskResponse
from sqlalchemy.orm import Session
from models.tasks import Task
from models.descriptions import Description
from datetime import datetime
from s3 import s3
import logging

logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)


def _get_task_by_id(db: Session, user_id: int, task_id: int):
    try:
        task = db.query(Task)\
            .filter(Task.user_id == user_id, Task.id == task_id)\
            .first()
        return task
    except Exception as e:
        logger.debug(f"Ошибка при получении задачи: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ошибка при получении задачи")


def _get_tasks_with_filter(db: Session, user_id: int, filter_criteria):
    try:
        tasks = db.query(Task)\
            .filter(Task.user_id == user_id, *filter_criteria)\
            .order_by(Task.remember_data)\
            .all()
        return [TaskResponse.model_validate(i, from_attributes=True) for i in tasks]
    except Exception as e:
        logger.debug(f"Ошибка при получении задач: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ошибка при получении задач")


def _create_task(db: Session, task_data: TaskCreate, user_id: int):
    new_task = Task(
        title=task_data.title,
        create_data=datetime.now(),
        remember_data=task_data.remember_data,
        is_completed=task_data.is_completed,
        user_id=user_id,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


def _delete_task(db: Session, user_id: int, task_id: int):
    task = _get_task_by_id(db, user_id, task_id)
    if not task:
        return status.HTTP_204_NO_CONTENT
    delete_files(task)
    db.delete(task)
    db.commit()
    return status.HTTP_200_OK


def delete_files(task):
    files = [f.path_to_file for f in task.uploaded_files]
    for file in files:
        s3.delete_object(Bucket="plansay", Key=file)
    return status.HTTP_200_OK
