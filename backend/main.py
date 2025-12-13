import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI
from pydantic import BaseModel
from apps.ai_engine.sessions import Session

app = FastAPI(title="SuhbatAI API")

session = Session(memory_size=4)

class Prompt(BaseModel):
    text: str

@app.post("/generate")
async def generate(prompt: Prompt):
    try:
        result = await session.run([{"text": prompt.text}])
        output = result[0]["output"]
        
        # Check if the model is still loading
        if "Model is still loading" in output:
            return {"status": "loading", "input": prompt.text, "output": output}

        return {"status": "success", "input": prompt.text, "output": output}

    except Exception as e:
        return {"status": "error", "input": prompt.text, "output": str(e)}

@app.post("/reset")
async def reset_memory():
    try:
        session.reset()
        return {"status": "success", "message": "memory cleared"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
