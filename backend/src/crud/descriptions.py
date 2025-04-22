from fastapi import HTTPException, status
from schemas.tasks import TaskCreate, TaskResponse
from sqlalchemy.orm import Session
from models.descriptions import Description
from utils import handle_db_exception
import logging

logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)


def _get_description_by_id(db: Session, task_id: int):
    try:
        description = db.query(Description)\
            .filter(Description.task_id == task_id)\
            .first()
        return description
    except Exception as e:
        logger.debug(f"Ошибка при получении описания задачи: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ошибка при получении описания задачи")


def _create_description(db: Session, task_id: int, description: str):
    with handle_db_exception(db):
        if description:
            new_description = Description(task_id=task_id, value=description)
            db.add(new_description)
            db.commit()
        return status.HTTP_200_OK


def _update_description(db: Session, task_id: int, value: str):
    with handle_db_exception(db):
        description = _get_description_by_id(db, task_id)
        if value is not None:
            if description is None:
                description = Description(task_id=task_id, value=value)
                db.add(description)
            else:
                description.value = value
        elif description:
            db.delete(description)
