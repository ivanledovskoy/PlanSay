from fastapi import APIRouter

router = APIRouter(tags=['Администрирование'])

@router.get("/users", summary="Получение списка пользователей")
def get_users():
    ...


@router.get("/user/{id}", summary="Получение информации о конкретном пользователе")
def get_user_by_id():
    ...


@router.put("/user/{id}", summary="Обновление информации о конкретном пользователе")
def put_user_by_id():
    ...


@router.put("/block-user/{id}", summary="Блокировка пользователя")
def block_user_by_id():
    ...


@router.delete("/user/{id}", summary="Удаление пользователя")
def delete_user_by_id():
    ...
