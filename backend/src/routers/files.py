from fastapi import APIRouter, Depends, status, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from schemas.uploaded_file import UploadedFileCreate
from sqlalchemy.orm import Session
from database import get_db
from models.tasks import Task
from routers.auth import get_current_active_auth_user
from crud.tasks import _get_tasks_with_filter
from crud.uploaded_file import _create_upload_file, _get_fileinfo_by_id, _delete_file_and_get_path, _get_file_by_link
import os
import secrets
import logging
from hashlib import md5
from s3 import s3
from boto3.s3.transfer import TransferConfig, TransferManager


logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)

router = APIRouter(tags=['Работа с файлами'])


def save_file(uploaded_file: UploadFile, user_id: int):
    salt = secrets.token_hex(8)
    file_name = uploaded_file.filename
    path_to_file = f"{user_id}/{salt}_{file_name}"

    try:
        transfer_config = TransferConfig(multipart_threshold=1024 ** 3)
        s3.upload_fileobj(
            uploaded_file.file, 
            "plansay", 
            path_to_file, 
            Config=transfer_config
        )
    except Exception as e:
        logger.exception(e)
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
    return StreamingResponse(
        content=result["Body"].iter_chunks(), 
        media_type=file_info.content_type,
        headers={
            "Content-Disposition": f"inline; filename=\"{file_info.name}\"",
            "filename": file_info.name}
        )


@router.post("/files/{file_id}", summary="Добавление временной ссылки на файл")
def update_info_upload_file(file_id: int, is_shared: bool, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    file_info = _get_fileinfo_by_id(db, file_id, user.user_id)
    if not file_info:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Недостаточно прав для изменения этого файла",
        )
    file_info.shared = is_shared
    if is_shared:
        file_info.link = md5(str(str(file_info.id) + file_info.name).encode()).hexdigest()
    else:
        file_info.link = None
    db.commit()
    db.refresh(file_info)
    if is_shared:
        return file_info.link
    else:
        return "Общий доступ к файлу отключен"


@router.get("/files/hash/{link}", summary="Доступ к файлу по временной ссылке")
def get_file_by_link(link: str, db: Session = Depends(get_db)):
    file_info = _get_file_by_link(link, db)
    if not file_info or not file_info.shared:
        return status.HTTP_403_FORBIDDEN
    result = s3.get_object(Bucket="plansay", Key=file_info.path_to_file)
    return StreamingResponse(content=result["Body"].iter_chunks(), media_type=file_info.content_type)


@router.delete("/files/{file_id}", summary="Удалить файл с сервера по id")
def delete_upload_file_by_id(file_id: int, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    path_to_file = _delete_file_and_get_path(db, file_id, user.user_id)
    if path_to_file:
        s3.delete_object(Bucket="plansay", Key=path_to_file)
        return status.HTTP_200_OK
    return status.HTTP_400_BAD_REQUEST