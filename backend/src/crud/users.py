from fastapi import status
from sqlalchemy.orm import Session
from utils import handle_db_exception
from schemas.users import UserUpdate
from models.users import User
from auth.utils import hash_password


def get_all_users_info(db: Session):
    return db.query(User).with_entities(User.user_id, User.email, User.active, User.role, User.password_reset_required).all()

def get_user_by_id(id: int, db: Session):
    return db.query(User).filter(User.user_id == id).first()

def get_user_info_by_id(id: int, db: Session):
    return db.query(User).with_entities(User.user_id, User.email, User.active, User.role, User.password_reset_required)\
        .filter(User.user_id == id).first()

def update_user_info_by_id(id: int, update_user_data: UserUpdate, db: Session):
    with handle_db_exception(db):
        user = get_user_by_id(id, db)
        for attr, value in update_user_data.model_dump(exclude_unset=True).items():
            if attr == "password":
                value = hash_password(value)
                setattr(user, "password_reset_required", False)
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