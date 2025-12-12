import json
from pathlib import Path
from datasets import Dataset

def load_json_dataset(dataset_dir: str):
    dataset_dir = Path(dataset_dir)
    samples = []

    # Iterate over all JSON files
    for file in dataset_dir.glob("*.json"):
        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Case 1: Intent-based structure (computer_science.json)
        if isinstance(data, dict) and "intents" in data:
            for intent in data["intents"]:
                questions = intent.get("Question", [])
                answers = intent.get("Answer", [])

                # safe handling: convert to list if string
                if isinstance(questions, str):
                    questions = [questions]
                if isinstance(answers, str):
                    answers = [answers]

                # normally only one answer per intent
                answer_text = answers[0] if answers else ""

                for q in questions:
                    samples.append({
                        "text": f"Question: {q}\nAnswer: {answer_text}"
                    })

        # Case 2: Simple Q/A list (data_science.json)
        elif isinstance(data, list):
            for item in data:
                q = item.get("Question", "")
                a = item.get("Answer", "")
                samples.append({
                    "text": f"Question: {q}\nAnswer: {a}"
                })

        # Case 3: Single Q/A object
        elif isinstance(data, dict) and "Question" in data:
            samples.append({
                "text": f"Question: {data['Question']}\nAnswer: {data['Answer']}"
            })

    return Dataset.from_list(samples)
