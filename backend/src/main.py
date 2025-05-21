from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers import admin_router, auth_router, general_router

#import uvicorn


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
app.include_router(admin_router, prefix='/admin')


# uvicorn.run("main:app", host="192.168.152.138", port=8000, \
#                 ssl_keyfile="/etc/nginx/ssl/nginx-selfsigned.key", ssl_certfile="/etc/nginx/ssl/nginx-selfsigned.crt")
