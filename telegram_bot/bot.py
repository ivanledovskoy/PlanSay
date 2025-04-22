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

from stt import STT

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

# Файл для хранения пользователей
USERS_FILE = "users.json"
AUDIO_TEMP_DIR = "temp_audio"

# Создаем директории если их нет
os.makedirs(AUDIO_TEMP_DIR, exist_ok=True)

bot = Bot(token=TELEGRAM_TOKEN)
dp = Dispatcher()
stt = STT()

# Состояния бота
class Form(StatesGroup):
    waiting_for_voice = State()
    waiting_for_text = State()
    waiting_for_email = State()

# Загружаем данные пользователей
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
            f"С возвращением! Ваш email: {users[user_id]}\n"
            "Используйте /help для вывода списка команд."
        )
    else:
        await state.set_state(Form.waiting_for_email)
        await message.reply(
            "Привет! Это PlanSay бот.\n"
            "Пожалуйста, введите ваш email."
        )

@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    await show_help(message)

@dp.message(Form.waiting_for_email)
async def process_email(message: Message, state: FSMContext):
    user_id = message.from_user.id
    email = message.text.strip()

    if "@" not in email or "." not in email:
        await message.reply("Пожалуйста, введите корректный email.")
        return

    users[user_id] = email
    save_users()
    await state.clear()

    await message.reply(
        f"Спасибо! Ваш email {email} сохранен.\n"
        "Используйте /help для списка команд."
    )

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
    task_data = {
        "email": users[user_id],
        "title": text
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{backend_url}/telegram/tasks",
                json=task_data,
                timeout=10.0
            )

            if response.status_code == 200:
                await message.answer("✅ Задача успешно добавлена!")
            else:
                error_msg = response.json().get("detail", "Неизвестная ошибка.")
                await message.answer(f"❌ {error_msg}")
    except Exception as e:
        logger.error(f"Ошибка соединения с бэкендом: {e}")
        await message.answer("⚠️ Не удалось соединиться с сервером.")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    print("Запуск бота")
    asyncio.run(main())