docker compose down
docker compose build --no-cache telegram_bot
docker compose up -d telegram_bot