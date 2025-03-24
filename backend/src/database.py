from sqlalchemy import Column
from sqlalchemy import create_engine
from sqlalchemy import String, Boolean, Integer, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import bcrypt
import secrets
import base64


engine = create_engine('sqlite:///./2fa.db')
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()


class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    email = Column(String)
    password = Column(LargeBinary)
    totp_secret_key = Column(String)
    active = Column(Boolean, default=True)

    def __init__(self, email: str, password: str):
        self.email = email
        secret_key = self._generate_secret_key()
        self.totp_secret_key = secret_key

        salt = bcrypt.gensalt()
        pwd_bytes = password.encode()
        self.password = bcrypt.hashpw(pwd_bytes, salt)

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

Base.metadata.create_all(bind=engine)