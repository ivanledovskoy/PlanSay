from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import admin_router, auth_router, general_router, files_router
from database import Base, engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(general_router)
app.include_router(files_router)
app.include_router(admin_router, prefix='/admin')

Base.metadata.create_all(bind=engine)