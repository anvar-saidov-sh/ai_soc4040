# ai_engine/questions.py
from .data_loader import load_builtin_questions

def get_questions():
    """Return the active dataset for SuhbatAI."""
    # In future you switch between JSON, CSV, DB, etc.
    return load_builtin_questions()
