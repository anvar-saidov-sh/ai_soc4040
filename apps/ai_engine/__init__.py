"""
AI Engine package for SuhbatAI.

This package handles:
- Loading and preprocessing datasets
- Model architecture definition
- Training and evaluation utilities
- Inference pipeline for scoring candidates
"""

from .data_loader import load_questions_dataset
from .inference import evaluate_candidate

__all__ = [
    "load_questions_dataset",
    "evaluate_candidate",
]
