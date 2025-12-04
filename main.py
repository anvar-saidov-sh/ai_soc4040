from apps.ai_engine.data_loader import load_questions_dataset
from apps.ai_engine.inference import evaluate_candidate

# Load questions
questions = load_questions_dataset()

# Optional: prepare dummy answers for testing
dummy_answers = [q["Answer"] for q in questions]

# Evaluate the candidate
results = evaluate_candidate(questions, dummy_answers)

# Show results
print("Score:", results["score"])
print("Correct answers:", results.get("correct_answers", 0))
print("Total questions:", results.get("total_questions", len(questions)))
