from fastapi import APIRouter, HTTPException, Depends, status
from schemas.tasks import TaskCreate, TaskResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.users import User
from models.tasks import Task
from models.descriptions import Description
from routers.auth import get_current_auth_user
from datetime import datetime

import traceback

router = APIRouter(tags=['Основной функционал'])

@router.get("/tasks", summary="Получение всех задач пользователя")
def get_tasks(db: Session = Depends(get_db), user = Depends(get_current_auth_user)):
    try:
        tasks = db.query(Task)\
            .filter(Task.user_id == user.user_id)\
            .order_by(Task.remember_data)\
            .all()
        return [TaskResponse.model_validate(i,from_attributes=True) for i in tasks]
    except Exception as e:
        traceback.print_exception(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ошибка при получении задач")


@router.get("/tasks/inbox", summary="Получение всех задач пользователя, на которые не назначена дата")
def get_tasks_inbox(db: Session = Depends(get_db), user = Depends(get_current_auth_user)):
    try:
        tasks = db.query(Task)\
            .filter(Task.user_id == user.user_id, Task.remember_data == None)\
            .order_by(Task.remember_data)\
            .all()
        return [TaskResponse.model_validate(i,from_attributes=True) for i in tasks]
    except Exception as e:
        traceback.print_exception(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ошибка при получении задач")
    

@router.get("/tasks/today", summary="Получение всех задач, у которых дата выполнения сегодня")
def get_tasks_today(db: Session = Depends(get_db), user = Depends(get_current_auth_user)):
    try:
        current_date = datetime.now()
        tasks = db.query(Task)\
            .filter(Task.user_id == user.user_id, func.date(Task.remember_data) == current_date.date())\
            .order_by(Task.remember_data)\
            .all()
        return [TaskResponse.model_validate(i,from_attributes=True) for i in tasks]
    except Exception as e:
        traceback.print_exception(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ошибка при получении задач")
    

@router.get("/tasks/{id}", summary="Получение конкретной задачи пользователя")
def get_task_by_id():
    ...


@router.delete("/tasks/{id}", summary="Удаление задачи пользователя")
def delete_task_by_id():
    ...


@router.post("/tasks", summary="Добавление новой задачи для пользователя")
def post_task(task_data: TaskCreate, db: Session = Depends(get_db), user = Depends(get_current_auth_user)):
    try:
        # Создаем задачку
        new_task = Task(
            title=task_data.title,
            create_data=datetime.now(),
            remember_data=task_data.remember_data,
            user_id=user.user_id,
        )
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
    except Exception as e:
        traceback.print_exception(e)
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ошибка при создании задачи")
    # Создаем описание задачки
    try:
        if task_data.description is not None:
            description = Description(
                task_id=new_task.id,
                value=task_data.description,
            )
            db.add(description)
            db.commit()
    except Exception as e:
        traceback.print_exception(e)
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ошибка при создании задачи")
    return status.HTTP_201_CREATED


@router.put("/tasks/{id}", summary="Обновление задачи пользователя")
def put_task_by_id():
    ...


@router.post("/search", summary="Полнотекстовый поиск")
def search():
    ...