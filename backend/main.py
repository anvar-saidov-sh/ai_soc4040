from fastapi import FastAPI
from pydantic import BaseModel
from apps.ai_engine.sessions import Session
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

app = FastAPI(title="SuhbatAI API")

# Initialize model once
session = Session()

class Prompt(BaseModel):
    text: str

@app.post("/generate")
async def generate(prompt: Prompt):
    """
    Receive a text prompt and return the model's generated response.
    """
    try:
        result = session.model.generate(prompt.text)
        return {"input": prompt.text, "output": result}
    except Exception as e:
        return {"error": str(e)}
