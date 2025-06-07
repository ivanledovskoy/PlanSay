from datetime import datetime
from fastapi import APIRouter, Depends, status, HTTPException
from schemas.tasks import TaskCreate, TaskUpdate
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.tasks import Task
from models.users import User
from routers.auth import get_current_auth_user
from models.descriptions import Description
from routers.auth import get_current_active_auth_user
from crud.tasks import _get_task_by_id, _get_tasks_with_filter, _create_task, _delete_task
from crud.descriptions import _create_description, _update_description
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


@router.post("/telegram/tasks", summary="Добавление задачи от Telegram бота")
def create_task_from_telegram(
        task_data: dict,
        db: Session = Depends(get_db)
):
    try:
        user_id = task_data.get("user_id")
        title = task_data.get("title")
        remember_data_str = task_data.get("remember_data")

        logger.info(f"Получены данные: user_id={user_id}, title={title}, remember_data={remember_data_str}")

        if not user_id or not title:
            logger.error("Отсутствует user_id или title")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User_id и заголовок задачи обязательны"
            )

        # Конвертация даты
        remember_data = None
        if remember_data_str:
            try:
                if isinstance(remember_data_str, str):
                    remember_data = datetime.fromisoformat(remember_data_str)
                else:
                    remember_data = remember_data_str
                logger.info(f"Конвертирована дата: {remember_data}")
            except ValueError as e:
                logger.warning(f"Ошибка конвертации даты: {e}")
                remember_data = None

        user = User.getUserByUser_id(user_id)
        if not user:
            logger.error(f"Пользователь {user_id} не найден")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Пользователь не найден"
            )

        task_create = TaskCreate(
            title=title,
            description=None,
            remember_data=remember_data,
            is_completed=False
        )

        logger.info(f"Создаем задачу: {task_create}")
        new_task = _create_task(db, task_create, user_id)
        logger.info(f"Создана задача ID: {new_task.id}")

        return {"status": "success", "task_id": new_task.id}

    except Exception as e:
        logger.error(f"Ошибка при создании задачи: {str(e)}", exc_info=True)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при создании задачи: {str(e)}"
        )