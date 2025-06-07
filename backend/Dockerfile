FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY certificate.crt /usr/local/share/ca-certificates/certificate.crt

RUN update-ca-certificates

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY private.key .
COPY certificate.crt .

COPY src ./src

WORKDIR /app/src

EXPOSE 8000 443

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--ssl-keyfile", "../private.key", "--ssl-certfile", "../certificate.crt"]
