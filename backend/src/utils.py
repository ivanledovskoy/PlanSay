from contextlib import contextmanager
from typing import Generator
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import logging

logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)

@contextmanager
def handle_db_exception(db: Session):
    try:
        yield
    except Exception as e:
        db.rollback()
        logger.debug(f"{e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Ошибка при выполнении запроса")
