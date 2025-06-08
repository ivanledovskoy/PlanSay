import logging
import os
import json
from pathlib import Path
from typing import Dict

from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart, Command
from aiogram.types import Message
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from dotenv import load_dotenv
import asyncio
import httpx
import jwt
import sys

from stt import STT

from parser import extract_date_and_text

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

USERS_FILE = "users.json"
AUDIO_TEMP_DIR = "temp_audio"

os.makedirs(AUDIO_TEMP_DIR, exist_ok=True)

bot = Bot(token=TELEGRAM_TOKEN)
dp = Dispatcher()
stt = STT()

class Form(StatesGroup):
    waiting_for_token = State()
    waiting_for_voice = State()
    waiting_for_text = State()

try:
    with open(USERS_FILE, "r") as f:
        users: Dict[int, str] = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    users = {}

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    filename="bot.log",
)

# Настройка основного логгера
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Создаем обработчик для stdout
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
handler.setFormatter(formatter)

# Добавляем обработчик к логгеру
logger.addHandler(handler)

def save_users():
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

async def show_help(message: types.Message):
    help_text = (
        "Доступные команды:\n"
        "/start - Начать работу с PlanSay\n"
        "/help - Вывести список команд\n"
        "/voice_task - Записать задачу голосом\n"
        "/text_task - Записать задачу текстом"
    )
    await message.answer(help_text)

@dp.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext) -> None:
    user_id = message.from_user.id
    if user_id in users:
        await message.reply(
            f"С возвращением! Ваш user_id: {users[user_id]}\n"
            "Используйте /help для вывода списка команд."
        )
    else:
        await state.set_state(Form.waiting_for_token)
        await message.reply(
            "Привет! Это PlanSay бот.\n"
            "Пожалуйста, введите ваш JWT токен."
        )

def read_key():
    try:
        with open("jwt-public.pem", "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        logger.error(f"JWT public file not found: jwt-public.pem")
        raise
    except Exception as e:
        logger.error(f"Error reading JWT public: {e}")
        raise

@dp.message(Form.waiting_for_token)
async def process_token(message: Message, state: FSMContext):
    logger.info("process_token")
    user_id = message.from_user.id
    logger.info("user_id = message.from_user.id")
    token = message.text.strip()
    logger.info("token = message.text.strip()")
    try:
        key = read_key()
        logger.info("key = read_key()")
        logger.info(key)
        header = jwt.get_unverified_header(token)
        logger.info(f"Token header: {header}")
        payload = jwt.decode(token, key, algorithms=["RS256"])
        logger.info("payload = jwt.decode(token, key, algorithms=[RS256])")
        backend_user_id = payload.get("user_id")
        if not backend_user_id:
            raise ValueError("User ID not found in token")
        users[user_id] = str(backend_user_id)
        save_users()
        await state.clear()
        await message.reply(
            f"Авторизация успешна! Ваш user_id: {backend_user_id}\n"
            "Используйте /help для списка команд."
        )
    except jwt.ExpiredSignatureError:
        await message.reply("Срок действия токена истек. Пожалуйста, получите новый токен.")
    except jwt.InvalidTokenError:
        await message.reply("Неверный токен. Пожалуйста, проверьте и попробуйте снова.")
    except Exception as e:
        logger.error(f"Ошибка обработки токена: {e}")
        await message.reply("Произошла ошибка при обработке токена. Пожалуйста, попробуйте снова.")


@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    await show_help(message)


@dp.message(Command("test"))
async def cmd_test(message: types.Message):
    await message.answer("Test")


@dp.message(Command("voice_task"))
async def cmd_voice_task(message: types.Message, state: FSMContext):
    user_id = message.from_user.id

    if user_id not in users:
        await message.reply("Пожалуйста, сначала отправьте команду /start")
        return

    await state.set_state(Form.waiting_for_voice)
    await message.answer("Пожалуйста, отправьте голосовое сообщение для задачи.")


@dp.message(Command("text_task"))
async def cmd_text_task(message: types.Message, state: FSMContext):
    user_id = message.from_user.id

    if user_id not in users:
        await message.reply("Пожалуйста, сначала отправьте команду /start")
        return

    await state.set_state(Form.waiting_for_text)
    await message.answer("Пожалуйста, отправьте текст задачи.")


@dp.message(Form.waiting_for_text)
async def process_text_task(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    text = message.text.strip()

    if not text:
        await message.answer("Текст задачи не может быть пустым.")
        return

    await send_task_to_backend(user_id, text, message)
    await state.clear()


@dp.message(Form.waiting_for_voice)
async def process_voice_task(message: types.Message, state: FSMContext):
    user_id = message.from_user.id

    if message.content_type not in [
        types.ContentType.VOICE,
        types.ContentType.AUDIO,
        types.ContentType.DOCUMENT,
    ]:
        await message.reply("Пожалуйста, отправьте голосовое сообщение.")
        return

    if message.content_type == types.ContentType.VOICE:
        file_id = message.voice.file_id
    elif message.content_type == types.ContentType.AUDIO:
        file_id = message.audio.file_id
    elif message.content_type == types.ContentType.DOCUMENT:
        file_id = message.document.file_id

    try:
        file = await bot.get_file(file_id)
        file_path = file.file_path
        file_on_disk = Path(AUDIO_TEMP_DIR, f"{file_id}.tmp")

        await bot.download_file(file_path, destination=file_on_disk)
        await message.reply("Аудио получено, обрабатываю...")

        text = stt.audio_to_text(file_on_disk)
        print(text)
        if not text:
            text = "Не удалось распознать текст."

        await send_task_to_backend(user_id, text, message)

    except Exception as e:
        logger.error(f"Ошибка обработки аудио: {e}")
        await message.answer("Произошла ошибка при обработке аудио.")
    finally:
        if os.path.exists(file_on_disk):
            os.remove(file_on_disk)
    await state.clear()


@dp.message()
async def handle_other_messages(message: types.Message):
    await show_help(message)


async def send_task_to_backend(user_id: int, text: str, message: types.Message):
    backend_url = os.getenv("BACKEND_URL")
    if not backend_url:
        await message.answer("❌ Ошибка конфигурации: BACKEND_URL не указан")
        return

    # Извлекаем дату и текст из сообщения
    task_date, task_text = extract_date_and_text(text)

    task_data = {
        "user_id": users[user_id],
        "title": task_text,
        "remember_data": task_date.isoformat() if task_date else None
    }

    try:
        async with httpx.AsyncClient(verify=False) as client:
            response = await client.post(
                f"{backend_url}/telegram/tasks",
                json=task_data,
                timeout=30.0,
                headers={"Content-Type": "application/json"}
            )

            response.raise_for_status()
            await message.answer("✅ Задача успешно добавлена!" +
                               (f" На дату: {task_date.strftime('%d.%m.%Y %H:%M')}"
                                if task_date else ""))

    except httpx.ConnectError:
        await message.answer("❌ Не удалось подключиться к серверу.")
    except httpx.TimeoutException:
        await message.answer("❌ Сервер не ответил вовремя.")
    except httpx.HTTPStatusError as e:
        error_msg = e.response.json().get("detail", str(e))
        await message.answer(f"❌ Ошибка сервера: {error_msg}")
    except Exception as e:
        logger.exception(f"Ошибка: {e}")
        await message.answer("⚠️ Внутренняя ошибка.")

async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    logger.info("Запуск бота")
    asyncio.run(main())
