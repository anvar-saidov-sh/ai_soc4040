import re
from sentence_transformers import SentenceTransformer, util
from sklearn.feature_extraction.text import CountVectorizer
import numpy as np

# Load semantic model once
semantic_model = SentenceTransformer("all-MiniLM-L6-v2")


# ---------------------------------------------
# Utility: clean text
# ---------------------------------------------
def clean(text):
    if text is None:
        return ""
    return re.sub(r"[^a-zA-Z0-9 ]+", "", text.lower()).strip()


# ---------------------------------------------
# 1) Keyword Score (0–1 range)
# ---------------------------------------------
def keyword_score(candidate_answer, correct_answer):
    cand = clean(candidate_answer).split()
    corr = clean(correct_answer).split()

    if not corr or not cand:
        return 0.0

    cand_set = set(cand)
    corr_set = set(corr)

    overlap = len(cand_set.intersection(corr_set))
    return overlap / len(corr_set) if corr_set else 0.0


# ---------------------------------------------
# 2) Semantic Score (0–1 range)
# ---------------------------------------------
def semantic_score(candidate_answer, correct_answer):
    if not candidate_answer or not correct_answer:
        return 0.0

    emb1 = semantic_model.encode(candidate_answer, convert_to_tensor=True)
    emb2 = semantic_model.encode(correct_answer, convert_to_tensor=True)

    sim = util.cos_sim(emb1, emb2).item()  # range [-1, 1]
    sim = (sim + 1) / 2                     # normalize to [0, 1]

    return sim


# ---------------------------------------------
# 3) Hybrid Score
# ---------------------------------------------
def score_answer(candidate_answer, correct_answer):
    kw = keyword_score(candidate_answer, correct_answer)
    sem = semantic_score(candidate_answer, correct_answer)

    final = 0.5 * kw + 0.5 * sem  # weighted combination
    return final


# ---------------------------------------------
# Main evaluation entry point
# ---------------------------------------------
def evaluate_candidate(questions, candidate_answers):
    total = len(questions)
    correct_count = 0
    total_score = 0.0

    for q, ans in zip(questions, candidate_answers):
        correct = q.get("Answer") or q.get("answer") or ""
        if not correct:
            continue

        s = score_answer(ans, correct)
        total_score += s

        if s >= 0.7:  # threshold for "correct"
            correct_count += 1

    average_score = (total_score / total) * 100

    return {
        "score": round(average_score, 2),
        "correct_count": correct_count,
        "total_questions": total,
    }
