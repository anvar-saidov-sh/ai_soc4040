import json
from pathlib import Path

# Automatically detect project root (ai_soc4040_master)
BASE_DIR = Path(__file__).resolve().parents[2]

# Correct folder name: datasets
DATASETS_DIR = BASE_DIR / "datasets"

def load_questions_dataset():
    """
    Load all JSON question files from the datasets directory.
    Returns:
        list[dict]: A list of question objects aggregated from all JSON files.
    """
    questions = []

    if not DATASETS_DIR.exists():
        raise FileNotFoundError(f"Datasets directory not found: {DATASETS_DIR}")

    for file in DATASETS_DIR.glob("*.json"):
        try:
            with file.open("r", encoding="utf-8") as f:
                data = json.load(f)

                # Normalize data
                if isinstance(data, dict):
                    questions.append(data)
                elif isinstance(data, list):
                    questions.extend(data)
                else:
                    print(f"Skipping file {file}: unsupported JSON structure")

        except json.JSONDecodeError as e:
            print(f"Failed to parse {file}: {e}")

    return questions
