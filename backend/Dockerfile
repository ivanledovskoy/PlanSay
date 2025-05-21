FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY nginx-selfsigned2.key .
COPY nginx-selfsigned2.crt .

COPY src ./src

WORKDIR /app/src

EXPOSE 8000 443

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--ssl-keyfile", "../nginx-selfsigned2.key", "--ssl-certfile", "../nginx-selfsigned2.crt"]
