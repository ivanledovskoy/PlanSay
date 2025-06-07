from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from utils import handle_db_exception
from routers.auth import get_current_active_auth_user, check_active_session
from models.users import User
from crud.users import get_all_users_info, get_user_by_id, get_user_info_by_id, update_user_info_by_id, delete_user_by_id
from crud.sessions import _delete_session_by_user_id
from crud.tasks import delete_files
from schemas.users import UserResponse, UserUpdate
import os


router = APIRouter(tags=['Администрирование'])

@router.get("/ping", summary="Проверка доступности сервиса")
def ping():
    return {"message": "pong"}

@router.get("/users", summary="Получение списка пользователей")
def get_users(db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    if user.role == 'user':
        return status.HTTP_403_FORBIDDEN
    users_data = get_all_users_info(db)
    return [UserResponse.model_validate(i, from_attributes=True) for i in users_data]


@router.get("/user/{id}", summary="Получение информации о конкретном пользователе")
def get_user_by_id(id: int, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    if user.role == 'user':
        return status.HTTP_403_FORBIDDEN
    user_data = get_user_info_by_id(id, db)
    return UserResponse.model_validate(user_data, from_attributes=True)


@router.put("/user/{id}", summary="Обновление информации о конкретном пользователе")
def put_user_by_id(id: int, update_data: UserUpdate, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    target_user = get_user_info_by_id(id, db)
    if user.role == 'user' or target_user.role == 'root':
        return status.HTTP_403_FORBIDDEN
    return update_user_info_by_id(id, update_data, db)


@router.put("/block-user/{id}", summary="Блокировка пользователя")
def block_user_by_id(id: int, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    target_user = get_user_info_by_id(id, db)
    if user.role == 'user' or target_user.role == 'root':
        return status.HTTP_403_FORBIDDEN
    deactive = UserUpdate(active=False)
    return update_user_info_by_id(id, deactive, db)


@router.delete("/deactivate-sessions/{id}", summary="Деактивация сессий по id пользователя")
def deactivate_sessions_by_user_id(id: int, db: Session = Depends(get_db),
                                   user = Depends(get_current_active_auth_user),
                                   payload: dict = Depends(check_active_session)):
    target_user = get_user_info_by_id(id, db)
    if user.role == 'user' or target_user.role == 'root':
        return status.HTTP_403_FORBIDDEN
    return _delete_session_by_user_id(db, id, payload.get("session_id"))


@router.delete("/user/{id}", summary="Удаление пользователя")
def api_delete_user_by_id(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_active_auth_user)):
    target_user: User = get_user_by_id(id, db)
    if user.role == 'user' or target_user.role == 'root':
        return status.HTTP_403_FORBIDDEN
    for task in target_user.tasks:
        delete_files(task)
    return delete_user_by_id(id, db)
