from fastapi import APIRouter, HTTPException, Depends, status
from schemas.tasks import TaskCreate, TaskResponse
from sqlalchemy.orm import Session
from database import get_db
from models.users import User
from models.tasks import Task
from models.descriptions import Description

import traceback

router = APIRouter(tags=['Основной функционал'])

@router.get("/tasks", summary="Получение всех задач пользователя")
def get_tasks(user_id: int, db: Session = Depends(get_db)):
    try:
        tasks = db.query(Task).filter(Task.user_id == user_id).all()
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
def post_task(task_data: TaskCreate, db: Session = Depends(get_db)):
    try:
        print(task_data)
        # Поиск пользователя
        user = db.query(User).filter(User.user_id == task_data.user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Плохой запрос")
        # Создаем задачку
        new_task = Task(
            title=task_data.title,
            create_data=task_data.create_data,
            remember_data=task_data.remember_data,
            user_id=task_data.user_id,
        )
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        # Создаем описание задачки
        if task_data.description is not None:
            description = Description(
                task_id=new_task.id,
                value=task_data.description,
            )
        db.add(description)
        db.commit()

        return status.HTTP_201_CREATED
    except Exception as e:
        traceback.print_exception(e)
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ошибка при создании задачи")


@router.put("/tasks/{id}", summary="Обновление задачи пользователя")
def put_task_by_id():
    ...


@router.post("/search", summary="Полнотекстовый поиск")
def search():
    ...