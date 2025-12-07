import random

class QuestionManager:
    def __init__(self, questions):
        self.questions = questions

    def get_random_questions(self, count=10, tags=None):
        filtered = self.questions

        # Filter by tag
        if tags:
            filtered = [q for q in self.questions if q.get("Tag") in tags]

        if count > len(filtered):
            count = len(filtered)

        return random.sample(filtered, count)
