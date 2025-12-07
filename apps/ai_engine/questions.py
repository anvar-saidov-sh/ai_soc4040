import random

class QuestionManager:
    def __init__(self, questions):
        self.questions = questions

    def filter_questions(self, tags=None, difficulty=None):
        filtered = self.questions

        if tags:
            filtered = [q for q in filtered if q.get("Tag") in tags]

        if difficulty:
            filtered = [q for q in filtered if q.get("Difficulty") == difficulty]

        return filtered

    def get_random_questions(self, count=10, tags=None, difficulty=None):
        filtered = self.filter_questions(tags, difficulty)

        # fallback if too few questions
        if len(filtered) < count:
            print(f"[WARN] Only {len(filtered)} questions match filters, returning all.")
            count = len(filtered)

        return random.sample(filtered, count)
