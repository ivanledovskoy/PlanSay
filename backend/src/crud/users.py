from fastapi import status
from sqlalchemy.orm import Session
from utils import handle_db_exception
from schemas.users import UserUpdate
from models.users import User
import bcrypt


def get_all_users_info(db: Session):
    return db.query(User).with_entities(User.email, User.active, User.role).all()

def get_user_by_id(id: int, db: Session):
    return db.query(User).filter(User.user_id == id).first()

def get_user_info_by_id(id: int, db: Session):
    return db.query(User).with_entities(User.email, User.active, User.role)\
        .filter(User.user_id == id).first()

def update_user_info_by_id(id: int, update_user_data: UserUpdate, db: Session):
    with handle_db_exception(db):
        user = get_user_by_id(id, db)
        for attr, value in update_user_data.model_dump(exclude_unset=True).items():
            if attr == "password":
                salt = bcrypt.gensalt()
                pwd_bytes = value.encode()
                value = bcrypt.hashpw(pwd_bytes, salt)
            setattr(user, attr, value)
        db.commit()
        return status.HTTP_200_OK

def delete_user_by_id(id: int, db: Session):
    with handle_db_exception(db):
        user = get_user_by_id(id, db)
        if not user:
            return status.HTTP_204_NO_CONTENT
        db.delete(user)
        db.commit()
        return status.HTTP_200_OK