import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI
from pydantic import BaseModel
from apps.ai_engine.sessions import Session
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SuhbatAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

session = Session()

class ChatRequest(BaseModel):
    text: str

@app.post("/generate")
async def chat(req: ChatRequest):
    reply = await session.chat(req.text)
    return {"reply": reply}

@app.post("/reset")
async def reset():
    session.reset()
    return {"status": "ok"}
class EvaluationRequest(BaseModel):
    profession: str
    answers: list  # [{question, answer}]

@app.post("/evaluate")
async def evaluate(req: EvaluationRequest):
    results = []

    for item in req.answers:
        prompt = f"""
You are a senior technical interviewer.

Profession: {req.profession}

Question:
{item['question']}

Candidate Answer:
{item['answer']}

Evaluate the answer.
Return JSON ONLY with this format:
{{
  "score": number from 0 to 10,
  "feedback": short constructive feedback,
  "strength": short phrase,
  "weakness": short phrase
}}
"""

        evaluation = await session.chat(prompt)
        results.append(evaluation)

    return {"results": results}
class FinalEvaluationRequest(BaseModel):
    profession: str
    answers: list  # [{question, answer}]

@app.post("/final-evaluate")
async def final_evaluate(req: FinalEvaluationRequest):
    qa_text = "\n".join(
        [f"Q: {a['question']}\nA: {a['answer']}" for a in req.answers]
    )

    prompt = f"""
You are a senior technical interviewer.

Profession: {req.profession}

Below are all interview questions and answers:
{qa_text}

Evaluate the candidate OVERALL.

Return ONLY valid JSON:
{{
  "score": number from 0 to 100,
  "verdict": "Hire" | "Borderline" | "Reject",
  "summary": one short sentence
}}
"""

    result = await session.chat(prompt)
    return {"result": result}
