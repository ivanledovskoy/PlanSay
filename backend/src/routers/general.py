from fastapi import APIRouter

router = APIRouter(tags=['Основной функционал'])

@router.get("/tasks", summary="Получение всех задач пользователя")
def get_tasks():
    ...


@router.get("/tasks/{id}", summary="Получение конкретной задачи пользователя")
def get_task_by_id():
    ...


@router.delete("/tasks/{id}", summary="Удаление задачи пользователя")
def delete_task_by_id():
    ...


@router.post("/tasks", summary="Добавление новой задачи для пользователя")
def post_task():
    ...


@router.put("/tasks/{id}", summary="Обновление задачи пользователя")
def put_task_by_id():
    ...


@router.post("/search", summary="Полнотекстовый поиск")
def search():
    ...