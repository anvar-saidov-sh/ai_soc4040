import time
from .inference import score_answer

class CandidateSession:
    def __init__(self, questions):
        self.questions = questions
        self.answers = []
        self.scores = []
        self.start_time = time.time()
        self.end_time = None

    def answer_question(self, answer):
        self.answers.append(answer)

    def finish(self):
        self.end_time = time.time()

        for q, ans in zip(self.questions, self.answers):
            correct = q.get("Answer") or q.get("answer") or ""
            s = score_answer(ans, correct)
            self.scores.append(s)

    def get_report(self):
        if not self.end_time:
            raise Exception("Session not finished")

        avg = sum(self.scores) / len(self.scores)
        correct_answers = sum(1 for s in self.scores if s >= 0.7)

        return {
            "total_questions": len(self.questions),
            "correct_answers": correct_answers,
            "score_percent": round(avg * 100, 2),
            "time_seconds": round(self.end_time - self.start_time, 2),
            "details": [
                {
                    "question": q["Question"],
                    "candidate_answer": ans,
                    "correct_answer": q["Answer"],
                    "score": round(s, 2)
                }
                for q, ans, s in zip(self.questions, self.answers, self.scores)
            ]
        }
