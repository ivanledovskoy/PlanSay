### Frontend

Frontend реализован на React JS

Для запуска необходимо выполнить следующие команды:

Linux:
```
cd frontend
npm install
HTTPS=true npm start
```

### Backend

Backend реализован на Python с использованием фреймфорка FastAPI

Для запуска необходимо выполнить следующие команды:

Linux:
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
uvicorn main:app --host 127.0.0.1 --ssl-keyfile=../nginx-selfsigned2.key --ssl-certfile=../nginx-selfsigned2.crt
```

Windows:
```
cd backend
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn src.main:app --host <ip-адрес машины с сервером> --ssl-keyfile=nginx-selfsigned2.key --ssl-certfile=nginx-selfsigned2.crt
```