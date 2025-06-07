import base64
from fastapi import Depends, HTTPException, status, APIRouter
from auth.totp import TwoFactorAuth
from auth.utils import encode_jwt, decode_jwt
from models.users import User
from models.sessions import UserSession
from pydantic import BaseModel, EmailStr, Field
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session
from database import get_db
from crud.users import update_user_info_by_id
from crud.sessions import _session_is_active, _delete_session_by_user_id, _session_create
from schemas.users import UserUpdate, UserCredential
from schemas.sessions import SessionCreate
import secrets
from fastapi.responses import PlainTextResponse


class TokenInfo(BaseModel):
    access_token: str
    token_type: str


class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=30)


class UserLoginSchema(UserRegisterSchema):
    secondFactor: str


def reg_user(creds: UserRegisterSchema):
    dbUser = User.getUserByEmail(creds.email)
    if dbUser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Пользователь с такой почтой уже существует!"
        )
    dbUser = User(creds.email, creds.password)
    dbUser.addToDatabase()

    secret_key = dbUser.getSecretKey()
    return TwoFactorAuth(dbUser.email, secret_key)

http_bearer = HTTPBearer()

def get_current_token_payload(
        credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
) -> UserLoginSchema:
    token = credentials.credentials
    try:
        payload = decode_jwt(token=token)
    except InvalidTokenError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token error: {e}")
    return payload

def check_active_session(payload: dict = Depends(get_current_token_payload), db: Session = Depends(get_db)):
    if _session_is_active(db, payload.get("session_id")):
        print("ACTIVE!!!")
        return payload
    print("NOT ACTIVE!!!")
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Сессия не активна")

def get_current_auth_user(
        payload: dict = Depends(check_active_session),
) -> UserLoginSchema:
    email: EmailStr | None = payload.get("sub")
    if user := User.getUserByEmail(email):
        return user
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalid (User not found)")


def get_current_active_auth_user(
        dbUser: UserLoginSchema = Depends(get_current_auth_user),
):
    if dbUser.active:
        return dbUser
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is not active")


router = APIRouter(tags=['Авторизация'])

# Определяем izmeritel' из main.py
failed_login_attempts = None  # Инициализируем переменную


@router.post('/register', summary="Регистрация пользователей")
def generate_qr(two_factor_auth: TwoFactorAuth = Depends(reg_user)):
    qr_code = two_factor_auth.qr_code
    if qr_code is None:
        raise HTTPException(status_code=404, detail="Такого пользователя не существует")
    return base64.b64encode(qr_code)


@router.post("/login", summary="Вход под УЗ пользователя")
def login_user(creds: UserLoginSchema, db: Session = Depends(get_db)):
    dbUser = User.getUserByEmail(creds.email)
    if dbUser is None or not dbUser.verifyPassword(creds.password):
        # Увеличиваем izmeritel' при неудачной попытке
        failed_login_attempts.inc()
        print("failed_login_attempts: ", failed_login_attempts._value.get())
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Неправильный логин или пароль!"
        )
    if not dbUser.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Сессия деактивирована"
        )

    secret_key = dbUser.getSecretKey()
    two_factor_auth = TwoFactorAuth(dbUser.email, secret_key)

    #is_valid = two_factor_auth.verify_totp_code(creds.secondFactor)
    is_valid = 1
    if not is_valid:
        raise HTTPException(status_code=400, detail="Код двухфакторной аутентификации неверный")
    
    failed_login_attempts.set(0)
    
    session_id = secrets.token_hex()
    _session_create(db, SessionCreate(user_id=dbUser.user_id, session_id=session_id))
    jwt_payload = {
        "sub": dbUser.email,
        "user_id": dbUser.user_id,
        "session_id": session_id
    }
    token = encode_jwt(jwt_payload)
    return {"token_info": TokenInfo(access_token=token, token_type="Bearer"),
            "is_admin": dbUser.role != 'user',
            "password_reset_required": dbUser.password_reset_required}


@router.post("/password-change", summary="Смена пароля")
def password_change(new_creds: UserCredential, db: Session = Depends(get_db), user = Depends(get_current_active_auth_user)):
    return update_user_info_by_id(user.user_id, UserUpdate(password=new_creds.password), db)

http_bearer = HTTPBearer()

def get_current_token_payload(
        credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
) -> UserLoginSchema:
    token = credentials.credentials
    try:
        payload = decode_jwt(token=token)
    except InvalidTokenError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Некорректный токен: {e}")
    return payload

def get_current_auth_user(
        payload: dict = Depends(check_active_session),
) -> UserLoginSchema:
    email: EmailStr | None = payload.get("sub")
    if user := User.getUserByEmail(email):
        return user
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Некорректный токен")

@router.delete("/deactivate-session", summary="Деактивация сессий пользователя")
def deactivate_session(db: Session = Depends(get_db), payload: dict = Depends(check_active_session)):
    return _delete_session_by_user_id(db, payload.get("user_id"), payload.get("session_id"))

def get_current_active_auth_user(
        dbUser: UserLoginSchema = Depends(get_current_auth_user),
):
    if dbUser.active:
        return dbUser
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Сессия деактивирована")

@router.get("/users/me")
def auth_user_check_self_info(
    dbUser: UserLoginSchema = Depends(get_current_active_auth_user),
):
    return{
        "sub": dbUser.email,
        "user_id": dbUser.user_id
    }

@router.get("/metrics", response_class=PlainTextResponse)
async def metrics():
    # Получаем текущее значение счетчика
    current_failed_logins = failed_login_attempts._value.get()

    # Формируем строку в формате, ожидаемом Prometheus
    metrics_data = f"# TYPE failed_login_attempts counter\n"
    metrics_data += f"failed_login_attempts {current_failed_logins}\n"

    return metrics_data
