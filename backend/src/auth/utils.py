import jwt
import bcrypt
from datetime import datetime, timedelta, timezone
from .config import Settings

def encode_jwt(
    payload: dict, 
    key: str = Settings.auth_jwt.private_key_path.read_bytes(), 
    algorithm: str = Settings.auth_jwt.algorithm,
    expire_minutes: int = Settings.auth_jwt.access_token_expire_minutes
):
    to_encode = payload.copy()
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=expire_minutes)
    to_encode.update(
        exp=expire,
        iat=now
    )
    encoded = jwt.encode(payload, key, algorithm=algorithm)
    return encoded


def decode_jwt(
    token: str | bytes,
    public_key: str = Settings.auth_jwt.public_key_path.read_bytes(),
    algorithm: str = Settings.auth_jwt.algorithm
):
    decoded = jwt.decode(token, public_key, algorithms=[algorithm]) 
    return decoded


def hash_password(
    password: str
) -> bytes:
    salt = bcrypt.gensalt()
    pwd_bytes: bytes = password.encode()
    return bcrypt.hashpw(pwd_bytes, salt)


def validate_password(
    password: str,
    hashed_password: bytes
) -> bool:
    return bcrypt.checkpw(
        password.encode(),
        hashed_password
    )