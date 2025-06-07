import base64
import io
import secrets
from typing import Optional

import qrcode
from fastapi import Depends
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from pyotp import TOTP
from database import SessionLocal, get_db
from models.users import User

app = FastAPI()


class TwoFactorAuth:
    def __init__(self, email: str, secret_key: str):
        self._email = email
        self._secret_key = secret_key
        self._totp = TOTP(self._secret_key)
        self._qr_cache: Optional[bytes] = None

    @property
    def totp(self) -> TOTP:
        return self._totp

    @property
    def secret_key(self) -> str:
        return self._secret_key

    @staticmethod
    def _generate_secret_key() -> str:
        secret_bytes = secrets.token_bytes(20)
        secret_key = base64.b32encode(secret_bytes).decode('utf-8')
        return secret_key

    @staticmethod
    def get_or_create_secret_key(db, user_id: str) -> str:
        db_user = db.query(User).filter(User.user_id == user_id).first()
        if db_user:
            return db_user.secret_key
        secret_key = TwoFactorAuth._generate_secret_key()
        db.add(User(user_id=user_id, secret_key=secret_key))
        db.commit()
        return secret_key

    def _create_qr_code(self) -> bytes:
        uri = self.totp.provisioning_uri(
            name=self._email,
            issuer_name='PlanSay',
        )
        img = qrcode.make(uri)
        img_byte_array = io.BytesIO()
        img.save(img_byte_array, format='PNG')
        img_byte_array.seek(0)
        return img_byte_array.getvalue()

    @property
    def qr_code(self) -> bytes:
        if self._qr_cache is None:
            self._qr_cache = self._create_qr_code()
        return self._qr_cache

    def verify_totp_code(self, totp_code: str) -> bool:
        return self.totp.verify(totp_code)


def get_two_factor_auth(user_id: str, db=Depends(get_db)) -> TwoFactorAuth:
    secret_key = TwoFactorAuth.get_or_create_secret_key(db, user_id)
    return TwoFactorAuth(user_id, secret_key)