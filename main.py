from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

# Загрузка переменных окружения
load_dotenv()

# OpenRouter клиент (всё через один ключ)
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")

# Память для вакансии и истории чата
job_description = ""
chat_history = []

# Модели данных
class JobDescription(BaseModel):
    description: str

class Message(BaseModel):
    message: str

# Установка описания вакансии и первый вопрос
@app.post("/set_job_description")
async def set_job_description(data: JobDescription):
    global job_description, chat_history
    job_description = data.description
    system_prompt = (
        f"Ты опытный AI-интервьюер. Проводишь собеседование по вакансии ниже.\n\n"
        f"{job_description}\n\n"
        f"Задавай по одному вопросу, не выдумывай факты, не отвечай от имени кандидата. "
        f"Говори кратко и по делу."
    )
    chat_history = [{"role": "system", "content": system_prompt}]
    try:
        response = client.chat.completions.create(
            model="anthropic/claude-3-haiku",  # 💡 Claude 3 Haiku
            messages=chat_history + [{"role": "user", "content": "Начни интервью."}],
            max_tokens=500
        )
        reply = response.choices[0].message.content
        chat_history.append({"role": "assistant", "content": reply})
        return {"message": reply}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# Продолжение интервью
@app.post("/interview")
async def interview(data: Message):
    global chat_history
    chat_history.append({"role": "user", "content": data.message})
    try:
        response = client.chat.completions.create(
            model="anthropic/claude-3-haiku",
            messages=chat_history,
            max_tokens=500
        )
        reply = response.choices[0].message.content
        chat_history.append({"role": "assistant", "content": reply})
        return {"answer": reply}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
