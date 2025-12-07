from apps.ai_engine.data_loader import load_questions_dataset
from apps.ai_engine.questions import QuestionManager
from apps.ai_engine.sessions import CandidateSession


questions = load_questions_dataset()

manager = QuestionManager(questions)

# get 5 random questions
selected = manager.get_random_questions(count=5)

session = CandidateSession(selected)

# simulate answers (for now we use correct answers)
for q in selected:
    session.answer_question(q["Answer"])

session.finish()

report = session.get_report()

print(report)
