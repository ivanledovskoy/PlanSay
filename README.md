### Frontend

Frontend реализован на React JS

Для запуска необходимо выполнить следующие команды:

Linux:
```
cd frontend
npm install
npm start
```

### Backend

Backend реализован на Python с использованием фреймфорка FastAPI

Для запуска необходимо выполнить следующие команды:

Linux:
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
fastapi dev src/main.py
```

Windows:
```
cd backend
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
fastapi dev src/main.py
```