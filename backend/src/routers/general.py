from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from schemas.tasks import TaskCreate, TaskUpdate
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.tasks import Task
from models.descriptions import Description
from routers.auth import get_current_active_auth_user
from crud.tasks import _get_task_by_id, _get_tasks_with_filter, _create_task, _delete_task
from crud.descriptions import _create_description, _get_description_by_id, _update_description
from utils import handle_db_exception
import logging

logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)

router = APIRouter(tags=['Основной функционал'])

@router.get("/tasks/assigned", summary="Получение всех задач пользователя, у которых назначена дата выполнения")
def get_tasks_assigned(db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    return _get_tasks_with_filter(db, user.user_id, [Task.remember_data != None, Task.is_completed == False])


@router.get("/tasks/inbox", summary="Получение всех задач пользователя, на которые не назначена дата")
def get_tasks_inbox(db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    return _get_tasks_with_filter(db, user.user_id, [Task.remember_data == None, Task.is_completed == False])
    

@router.get("/tasks/today", summary="Получение всех задач, у которых дата выполнения сегодня")
def get_tasks_today(db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    current_date = datetime.now()
    return _get_tasks_with_filter(db, user.user_id, [func.date(Task.remember_data) == current_date.date()])


@router.get("/tasks/{id}", summary="Получение конкретной задачи пользователя")
def get_task_by_id(id: int, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    return _get_tasks_with_filter(db, user.user_id, [Task.id == id])


@router.delete("/tasks/{id}", summary="Удаление задачи пользователя")
def delete_task_by_id(id: int, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    with handle_db_exception(db):
       return _delete_task(db, user.user_id, id)


@router.post("/tasks", summary="Добавление новой задачи для пользователя")
def post_task(task_data: TaskCreate, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    with handle_db_exception(db):
        new_task = _create_task(db, task_data, user.user_id)
        return _create_description(db, new_task.id, task_data.description )


@router.put("/tasks/{id}", summary="Обновление задачи пользователя")
def put_task_by_id(id: int, task_data: TaskUpdate, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    with handle_db_exception(db):
        task = _get_task_by_id(db, user.user_id, id)
        for attr, value in task_data.model_dump(exclude_unset=True).items():
            if attr == "description":
                _update_description(db, id, value)
            else:
                setattr(task, attr, value)
        db.commit()
        db.refresh(task)
        return status.HTTP_200_OK
