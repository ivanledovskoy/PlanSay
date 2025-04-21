from fastapi import FastAPI, Depends, Form, HTTPException, status
from database import User
from auth.utils import validate_password, encode_jwt
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from auth.totp import TwoFactorAuth
import base64
import io


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TokenInfo(BaseModel):
    access_token: str
    token_type: str

# @app.post("/login/", response_model=TokenInfo)
# def auth_user_issue_jwt(
#     user: User = Depends(validate_auth_user)
# ):
    # jwt_payload = {
    #     "sub": user.user_id,
    #     "username": user.username
    # }
    # token = encode_jwt(jwt_payload)
    # return TokenInfo(
    #     access_token=token,
    #     token_type="Bearer"
    # )


class UserLoginSchema(BaseModel):
    email: str
    password: str
    secondFactor: str

class UserRegisterSchema(BaseModel):
    email: str
    password: str

def regUser(creds: UserRegisterSchema):
    dbUser = User.getUserByEmail(creds.email)
    if dbUser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User with this email already exists!"
        )
    dbUser = User(creds.email, creds.password)
    dbUser.addToDatabase()

    secret_key = dbUser.getSecretKey()
    return TwoFactorAuth(dbUser.email, secret_key)

@app.post('/register')
def generate_qr(two_factor_auth: TwoFactorAuth = Depends(regUser)):
    qr_code = two_factor_auth.qr_code
    if qr_code is None:
        raise HTTPException(status_code=404, detail='User not found')
    return base64.b64encode(qr_code)

@app.post("/login/")
def reg_user(creds: UserLoginSchema):
    dbUser = User.getUserByEmail(creds.email)
    if dbUser is None or not dbUser.verifyPassword(creds.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Wrond email or password!"
        )
    
    if not dbUser.active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User inactive"
        )
    

    secret_key = dbUser.getSecretKey()
    two_factor_auth = TwoFactorAuth(dbUser.email, secret_key)

    is_valid = two_factor_auth.verify_totp_code(creds.secondFactor)
    if not is_valid:
        raise HTTPException(status_code=400, detail='Code invalid')
    
    jwt_payload = {
        "sub": dbUser.user_id,
        "email": dbUser.email
    }
    token = encode_jwt(jwt_payload)
    return TokenInfo(
        access_token=token,
        token_type="Bearer"
    )