from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from routers import admin_router, auth_router, general_router, files_router
from database import Base, engine
from prometheus_fastapi_instrumentator import Instrumentator
from prometheus_client import Counter, Gauge
from routers import auth


class CSPMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers['Content-Security-Policy'] = (
            "default-src 'self'; "
            "img-src 'self' data: https://fastapi.tiangolo.com/img/favicon.png; "
            "script-src 'self' 'unsafe-inline' https://158.160.123.223:8000/ https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js; "
            "style-src 'self' https://158.160.123.223:8000/ https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css; "
            "frame-ancestors 'self';"
        )
        return response


class HSTSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        # Установка заголовка Strict-Transport-Security
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        return response


class AddHeadersXContent(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        return response


app = FastAPI()

app.add_middleware(CSPMiddleware)
app.add_middleware(HSTSMiddleware)
app.add_middleware(AddHeadersXContent)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://158.160.123.223:3000"],
    allow_credentials=True,
    allow_methods=["GET", "PUT", "DELETE", "POST"],
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
