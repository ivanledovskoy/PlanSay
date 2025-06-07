from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import admin_router, auth_router, general_router, files_router
from database import Base, engine
from prometheus_fastapi_instrumentator import Instrumentator
from prometheus_client import Counter, Gauge
from routers import auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Инициализация Instrumentator
instrumentator = Instrumentator()

# Инструментируем приложение
instrumentator.instrument(app).expose(app)

# Izmeritel' для отслеживания неудачных попыток входа
failed_login_attempts = Gauge(
    "failed_login_attempts", 
    "Количество неудачных попыток входа"
)

# Передаем izmeritel' в router
auth.failed_login_attempts = failed_login_attempts

# Включаем маршруты аутентификации
app.include_router(auth.router)

app.include_router(general_router)
app.include_router(files_router)
app.include_router(admin_router, prefix='/admin')

Base.metadata.create_all(bind=engine)