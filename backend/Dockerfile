FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && apt-get install -y awscli && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /root/.aws

COPY config /root/.aws/config
COPY credentials /root/.aws/credentials

RUN chmod 600 /root/.aws/credentials && \
    chmod 644 /root/.aws/config

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY nginx-selfsigned2.key .
COPY nginx-selfsigned2.crt .

COPY src ./src

WORKDIR /app/src

EXPOSE 8000 443

RUN rm -f /app/src/2fa.db
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--ssl-keyfile", "../nginx-selfsigned2.key", "--ssl-certfile", "../nginx-selfsigned2.crt", "--proxy-headers", "--forwarded-allow-ips", "*"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--ssl-keyfile", "../nginx-selfsigned2.key", "--ssl-certfile", "../nginx-selfsigned2.crt", "--proxy-headers", "--forwarded-allow-ips", "*", "--no-server-header", "--header", "Server: None"]
