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
        if not self.scores:   # <-- prevents zero division
            return {
            "avg_score": 0.0,
            "correct": 0,
            "total": 0
            }
    
        avg = sum(self.scores) / len(self.scores)
        correct = sum(1 for x in self.scores if x == 1.0)

        return {
            "avg_score": avg,
            "correct": correct,
            "total": len(self.scores)
        }
