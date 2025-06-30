import os
import shutil
import uuid

from fastapi import FastAPI, UploadFile
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from openai import OpenAI
from dotenv import load_dotenv
import whisper

# Загрузка переменных среды
load_dotenv()

# Инициализация FastAPI
app = FastAPI()

# CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Проверка и подключение папки static
if not os.path.exists("static"):
    os.makedirs("static")

app.mount("/static", StaticFiles(directory="static"), name="static")

# OpenRouter API клиент через OpenAI совместимый интерфейс
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
    default_headers={
        "HTTP-Referer": "http://localhost:8000/",  # обязательно для OpenRouter
        "X-Title": "SuhbatAI"
    },
)

# Загрузка Whisper модели
model = whisper.load_model("base")

# 🌐 Редирект с / на index.html
@app.get("/")
async def redirect_to_index():
    return RedirectResponse(url="/static/index.html")

# 🔊 Обработка интервью
@app.post("/interview")
async def interview(audio: UploadFile):
    file_id = str(uuid.uuid4())
    temp_path = f"static/{file_id}.mp3"

    # Сохраняем аудио
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(audio.file, f)

    # Распознавание речи
    result = model.transcribe(temp_path)
    prompt = result["text"]

    # Отправка в Claude через OpenRouter
    response = client.chat.completions.create(
        model="anthropic/claude-sonnet-4",
        messages=[
            {"role": "system", "content": "You are a helpful interviewer."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000
    )

    # Очистка
    os.remove(temp_path)

    return {"response": response.choices[0].message.content}
