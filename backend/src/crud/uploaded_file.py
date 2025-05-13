from fastapi import HTTPException, status
from schemas.uploaded_file import UploadedFileCreate
from sqlalchemy.orm import Session, joinedload
from models.uploaded_file import UploadedFile
from models.tasks import Task
from utils import handle_db_exception
import logging

logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)


def _create_upload_file(db: Session, upload_file: UploadedFileCreate):
    with handle_db_exception(db):
        new_upload_file = UploadedFile(**upload_file.model_dump())
        db.add(new_upload_file)
        db.commit()
        return status.HTTP_200_OK


def _get_fileinfo_by_id(db: Session, file_id: int, user_id: int):
    file = db.query(UploadedFile)\
        .join(Task)\
        .filter(UploadedFile.id == file_id, Task.user_id == user_id)\
        .first()
    return file


def _delete_file_and_get_path(db: Session, file_id: int, user_id: int):
    with handle_db_exception(db):
        file = db.query(UploadedFile)\
            .join(Task)\
            .filter(UploadedFile.id == file_id, Task.user_id == user_id, UploadedFile.id == file_id)\
            .first()
        if file:
            path = file.path_to_file
            db.delete(file)
            db.commit()
            return path
        else:
            return None