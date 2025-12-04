
from typing import List, Dict

def evaluate_candidate(questions: List[Dict], candidate_answers: List[str] = None) -> Dict:
    """
    Evaluate a candidate's answers against the questions dataset.

    Args:
        questions (list[dict]): List of question objects, each containing "Question" and "Answer".
        candidate_answers (list[str], optional): List of candidate answers corresponding to each question.
            If None, will generate dummy answers (for testing).

    Returns:
        dict: Dictionary with score, total questions, and number of correct answers.
    """
    if not questions:
        return {"score": 0, "total_questions": 0, "correct_answers": 0, "error": "No questions found"}

    total_questions = len(questions)

    # For MVP testing: generate dummy answers if not provided
    if candidate_answers is None:
        candidate_answers = [q["Answer"] for q in questions]  # assume candidate knows everything

    correct = 0

    for q, ans in zip(questions, candidate_answers):
        correct_answer = q.get("Answer", "").strip().lower()
        candidate_answer = ans.strip().lower()
        if candidate_answer == correct_answer:
            correct += 1

    score = (correct / total_questions) * 100

    return {
        "score": round(score, 2),
        "correct_answers": correct,
        "total_questions": total_questions
    }
