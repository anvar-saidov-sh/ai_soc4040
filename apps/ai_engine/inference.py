import random

def evaluate_candidate(questions, candidate_answers=None):
    """
    Simple MVP evaluator.
    - Takes loaded questions from dataset
    - Optionally uses candidate answers
    - Returns a dummy score and selected questions

    Args:
        questions (list[dict]): Loaded question dataset
        candidate_answers (dict): Optional answers candidate provided

    Returns:
        dict: Evaluation summary
    """

    if not questions:
        return {"error": "No questions available"}

    # For MVP, assign a random score
    score = round(random.uniform(40, 95), 2)

    # Select 5 random questions for the interview
    sample_questions = random.sample(questions, min(5, len(questions)))

    return {
        "score": score,
        "questions_used": sample_questions,
        "total_questions": len(questions)
    }
