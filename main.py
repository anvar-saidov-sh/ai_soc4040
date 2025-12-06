from apps.ai_engine.data_loader import load_questions_dataset
from apps.ai_engine.inference import evaluate_candidate

questions = load_questions_dataset()
dummy_answers = [
    q.get("Answer")
    or q.get("answer")
    or q.get("correct_answer")
    or q.get("CorrectAnswer")
    or ""   # fallback to empty string instead of None
    for q in questions
]

results = evaluate_candidate(questions, dummy_answers)

print("Score:", results["score"])
print("Correct answers:", len([s for s in results["scores_per_question"] if s > 50]))
print("Total questions:", len(questions))
