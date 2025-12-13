from transformers import AutoTokenizer, AutoModelForCausalLM
from pathlib import Path
import torch

class SuhbatAI:
    def __init__(self):
        model_path = Path(__file__).resolve().parent.parent / "finetuned-gpt2"
        self.tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
        self.model = AutoModelForCausalLM.from_pretrained(model_path, local_files_only=True)
        self.model.eval()

    def generate(self, prompt: str, context: str = "") -> str:
        """
        Generate text based on a prompt, optionally including context.
        """
        # Prepend context if available
        full_input = f"{context}\nUser: {prompt}\nAI:" if context else prompt

        inputs = self.tokenizer(full_input, return_tensors="pt", truncation=True, max_length=512)
        with torch.no_grad():
            output = self.model.generate(
                **inputs,
                max_new_tokens=150,
                do_sample=True,
                temperature=0.7,
                top_p=0.9,
                pad_token_id=self.tokenizer.eos_token_id
            )

        return self.tokenizer.decode(output[0], skip_special_tokens=True)
