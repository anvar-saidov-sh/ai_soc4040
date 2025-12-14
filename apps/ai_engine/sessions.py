from .inference import SuhbatAI
import asyncio
import re

class Session:
    def __init__(self):
        self.model = None
        self.asked_questions = set()
        self.question_count = 0
        self.max_questions = 6
        self._loading_task = asyncio.create_task(self._load_model())

    async def _load_model(self):
        print("[INFO] Loading SuhbatAI model...")
        self.model = await asyncio.to_thread(SuhbatAI)
        print("[INFO] Model loaded!")

    async def chat(self, user_answer: str) -> str:
        if self.question_count >= self.max_questions:
            return "Interview complete."

        prompt = self._build_prompt(user_answer)

        for _ in range(3):  # retry model up to 3 times
            raw = await asyncio.to_thread(self.model.generate, prompt)
            question = self._extract_question(raw)

            if question and question not in self.asked_questions:
                self.asked_questions.add(question)
                self.question_count += 1
                return question

        # forced fallback (never repeats)
        fallback = self._forced_question()
        self.asked_questions.add(fallback)
        self.question_count += 1
        return fallback

    # ---------------- HELPERS ----------------

    def _build_prompt(self, user_answer: str) -> str:
        return f"""
You are a backend technical interviewer.
Ask ONE clear backend interview question.
DO NOT explain anything.
DO NOT greet.
ONLY output a question.

Candidate answer:
{user_answer}

Question:
""".strip()

    def _extract_question(self, text: str) -> str | None:
        if not text:
            return None

        # remove explanations before question
        match = re.search(r"([A-Z].*?\?)", text)
        if not match:
            return None

        question = match.group(1).strip()

        # basic sanity checks
        if len(question.split()) < 4:
            return None

        return question

    def _forced_question(self) -> str:
        forced = [
            "How do you structure a FastAPI project?",
            "How do you handle database connections in FastAPI?",
            "How do you manage authentication and authorization?",
            "How do you handle async performance issues?",
            "How do you deploy FastAPI in production?",
            "What is the most challenging backend problem you solved?"
        ]

        for q in forced:
            if q not in self.asked_questions:
                return q

        return "What backend skill do you want to improve next?"

    def reset(self):
        self.asked_questions.clear()
        self.question_count = 0
