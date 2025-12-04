import json
import os

DATASET_DIR = os.path.join(os.path.dirname(__file__), '../../datasets')

def load_questions(filename):
    path = os.path.join(DATASET_DIR, filename)
    with open(path, 'r') as f:
        questions = json.load(f)
    return questions
'''
def save_questions(filename, questions):
    path = os.path.join(DATASET_DIR, filename)
    with open(path, 'w') as f:
        json.dump(questions, f, indent=4)
'''