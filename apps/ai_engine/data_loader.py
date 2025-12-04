import json
from pathlib import Path

# Automatically detect project root (ai_soc4040_master)
BASE_DIR = Path(__file__).resolve().parents[2]

# Correct folder name: datasets
DATASET_DIR = BASE_DIR / "datasets"

def load_questions_dataset():
    """
    Load all JSON question files from the dataset directory and normalize keys.
    Returns:
        list[dict]: A list of question objects with consistent keys: 'Question' and 'Answer'.
    """
    questions = []
    if not DATASET_DIR.exists():
        raise FileNotFoundError(f"Dataset directory not found: {DATASET_DIR}")

    for file in DATASET_DIR.glob("*.json"):
        try:
            with open(file, "r", encoding="utf-8") as f:
                data = json.load(f)

                # Convert single object to list
                if isinstance(data, dict):
                    data = [data]

                for q in data:
                    # Normalize keys: map 'tag' → 'Answer'
                    answer = q.get("Answer") or q.get("tag") or ""
                    question_text = q.get("Question") or q.get("question") or ""
                    questions.append({
                        "Question": question_text,
                        "Answer": answer
                    })

        except json.JSONDecodeError as e:
            print(f"Failed to parse {file}: {e}")

    return questions
