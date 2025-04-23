from sqlalchemy import Column, String, Boolean, Integer, LargeBinary
from sqlalchemy.orm import relationship, Mapped
from database import Base, db
from auth.utils import hash_password
import bcrypt
import secrets
import base64


class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    email = Column(String)
    password = Column(LargeBinary)
    totp_secret_key = Column(String)
    active = Column(Boolean, default=True)
    role = Column(String)
    tasks: Mapped[list['Task']] = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    sessions: Mapped[list['UserSession']] = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")

    def __init__(self, email: str, password: str, role: str = "user"):
        self.email = email
        self.role = role
        secret_key = self._generate_secret_key()
        self.totp_secret_key = secret_key
        self.password = hash_password(password)

    def getSecretKey(self):
        return self.totp_secret_key

    def _generate_secret_key(self) -> str:
        secret_bytes = secrets.token_bytes(20)
        secret_key = base64.b32encode(secret_bytes).decode('utf-8')
        return secret_key

    def addToDatabase(self):
        db.add(self)
        db.commit()

    def getUserByEmail(email: str):
        db_user = db.query(User).filter(User.email == email).first()
        return db_user
    
    def verifyPassword(self, password: str):
        return bcrypt.checkpw(password=password.encode(), hashed_password=self.password)

    def verify_totp_code(self, totp_code: str) -> bool:
        return self.totp.verify(totp_code)
