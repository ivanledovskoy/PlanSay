from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import delete
from models.sessions import UserSession
from schemas.sessions import SessionCreate, SessionResponse
from utils import handle_db_exception
import logging

logging.basicConfig(level=logging.DEBUG, format='[%(levelname)s] - %(message)s')
logger = logging.getLogger(__name__)

def _session_create(db: Session, session_data: SessionCreate):
    with handle_db_exception(db):
        new_session = UserSession(
            user_id=session_data.user_id,
            session_id=session_data.session_id,
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)

def _session_is_active(db: Session, session_id: str) -> bool:
    with handle_db_exception(db):
        current_session = db.query(UserSession)\
            .filter(UserSession.session_id == session_id)\
            .first()
        return True if current_session else False


def _get_passive_sessions_by_user_id(db: Session, user_id: int, active_session: str):
    with handle_db_exception(db):
        sessions = db.query(UserSession)\
            .filter(UserSession.user_id == user_id, UserSession.session_id != active_session)\
            .all()
        return sessions


def _delete_session_by_user_id(db: Session, user_id: id, active_session: str):
    with handle_db_exception(db):
        sessions = _get_passive_sessions_by_user_id(db, user_id, active_session)
        for session in sessions:
            db.delete(session)
        db.commit()
        return status.HTTP_200_OK

