from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from schemas.tasks import TaskCreate
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.tasks import Task
from models.users import User
from routers.auth import get_current_auth_user
from crud.tasks import _get_tasks_with_filter, _create_task, _create_description
import logging

logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)

router = APIRouter(tags=['Основной функционал'])


@router.get("/tasks/assigned", summary="Получение всех задач пользователя, у которых назначена дата выполнения")
def get_tasks_assigned(db: Session = Depends(get_db), user = Depends(get_current_auth_user)):
    return _get_tasks_with_filter(db, user.user_id, [Task.remember_data != None])


@router.get("/tasks/inbox", summary="Получение всех задач пользователя, на которые не назначена дата")
def get_tasks_inbox(db: Session = Depends(get_db), user = Depends(get_current_auth_user)):
    return _get_tasks_with_filter(db, user.user_id, [Task.remember_data == None])
    

@router.get("/tasks/today", summary="Получение всех задач, у которых дата выполнения сегодня")
def get_tasks_today(db: Session = Depends(get_db), user = Depends(get_current_auth_user)):
    current_date = datetime.now()
    return _get_tasks_with_filter(db, user.user_id, [func.date(Task.remember_data) == current_date.date()])


@router.get("/tasks/{id}", summary="Получение конкретной задачи пользователя")
def get_task_by_id():
    ...


@router.delete("/tasks/{id}", summary="Удаление задачи пользователя")
def delete_task_by_id():
    ...


@router.post("/tasks", summary="Добавление новой задачи для пользователя")
def post_task(task_data: TaskCreate, db: Session = Depends(get_db), user = Depends(get_current_auth_user)):
    try:
        new_task = _create_task(db, task_data, user.user_id)
        _create_description(db, new_task.id, task_data.description )
    except Exception as e:
        logger.debug(f"{e}")
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ошибка при создании задачи")
    return status.HTTP_201_CREATED


@router.put("/tasks/{id}", summary="Обновление задачи пользователя")
def put_task_by_id():
    ...

@router.post("/telegram/tasks", summary="Добавление задачи от Telegram бота")
def create_task_from_telegram(
    task_data: dict, 
    db: Session = Depends(get_db)
):
    try:
        user_id = task_data.get("user_id")
        print(user_id)
        title = task_data.get("title")
        print(title)
        
        if not user_id or not title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User_id и заголовок задачи обязательны"
            )

        user = User.getUserByUser_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь с таким user_id не найден"
            )

        task_create = TaskCreate(
            title=title,
            description=None,
            remember_data=None
        )

        new_task = _create_task(db, task_create, user_id)
        
        return {"status": "success", "task_id": new_task.id}

    except Exception as e:
        logger.error(f"Ошибка при создании задачи из Telegram: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ошибка при создании задачи"
        )