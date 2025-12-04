import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def score_answer(candidate_answer, correct_answer):
    """Compute similarity between candidate answer and correct answer."""
    vectorizer = CountVectorizer().fit([candidate_answer, correct_answer])
    vectors = vectorizer.transform([candidate_answer, correct_answer])
    sim = cosine_similarity(vectors)[0, 1]
    return sim * 100  # scale to 0-100

def evaluate_candidate(questions, candidate_answers):
    """
    Evaluate a list of candidate answers against the dataset questions.
    
    Returns:
        dict: {'score': average_score, 'scores_per_question': list_of_scores}
    """
    scores = []
    for q, ans in zip(questions, candidate_answers):
        correct_answer = q.get("Answer") or q.get("answer")  # handle key variations
        score = score_answer(ans, correct_answer)
        scores.append(score)

    avg_score = np.mean(scores) if scores else 0
    return {"score": avg_score, "scores_per_question": scores}
