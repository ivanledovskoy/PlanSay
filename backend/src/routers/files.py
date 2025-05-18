from fastapi import APIRouter, Depends, status, UploadFile
from fastapi.responses import StreamingResponse
from schemas.uploaded_file import UploadedFileCreate
from sqlalchemy.orm import Session
from database import get_db
from models.tasks import Task
from routers.auth import get_current_active_auth_user
from crud.tasks import _get_tasks_with_filter
from crud.uploaded_file import _create_upload_file, _get_fileinfo_by_id, _delete_file_and_get_path
import os
import secrets
import logging
from s3 import s3


logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)

router = APIRouter(tags=['Работа с файлами'])

def save_file(uploaded_file: UploadFile, user_id: int):
    salt = secrets.token_hex(8)
    file_name = uploaded_file.filename
    path_to_file = os.path.join(str(user_id), salt + file_name)
    s3.upload_fileobj(uploaded_file.file, "plansay", path_to_file)
    return file_name, path_to_file


@router.post("/files", summary="Загрузка файла на сервер")
def post_upload_files(task_id: int, uploaded_file: UploadFile, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    task = _get_tasks_with_filter(db, user.user_id, [Task.id == task_id])
    if not task:
        return status.HTTP_404_NOT_FOUND
    
    file_name, path_to_file = save_file(uploaded_file, user.user_id)
    content_type = uploaded_file.content_type
    new_uploaded_file = UploadedFileCreate(task_id=task_id, path_to_file=path_to_file, name=file_name, content_type=content_type)
    return _create_upload_file(db, new_uploaded_file)


@router.get("/files/{file_id}", summary="Выгрузка файла с сервера по id")
def get_upload_file_by_id(file_id: int, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    file_info = _get_fileinfo_by_id(db, file_id, user.user_id)
    if not file_info:
        return status.HTTP_403_FORBIDDEN
    result = s3.get_object(Bucket="plansay", Key=file_info.path_to_file)
    return StreamingResponse(content=result["Body"].iter_chunks(), media_type=file_info.content_type)


@router.delete("/files/{file_id}", summary="Удалить файл с сервера по id")
def delete_upload_file_by_id(file_id: int, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    path_to_file = _delete_file_and_get_path(db, file_id, user.user_id)
    if path_to_file and os.path.exists(path_to_file):
        os.remove(path_to_file)
        return status.HTTP_200_OK
    return status.HTTP_400_BAD_REQUEST