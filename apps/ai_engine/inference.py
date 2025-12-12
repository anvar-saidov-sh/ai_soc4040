from transformers import GPT2LMHeadModel, GPT2Tokenizer
from pathlib import Path
import torch
from pathlib import Path

# Absolute path to your local finetuned GPT2 folder
model_path = Path(__file__).parent / "finetuned-gpt2"



class SuhbatAI:
    def __init__(self):
        model_path = str(Path(__file__).resolve().parent.parent / "finetuned-gpt2")
        
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        # When passing to from_pretrained, use str()
        self.tokenizer = GPT2Tokenizer.from_pretrained(str(model_path))
        self.model = GPT2LMHeadModel.from_pretrained(str(model_path)).to(self.device)

    def generate(self, prompt, max_new_tokens=100):
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.device)
        outputs = self.model.generate(**inputs, max_new_tokens=max_new_tokens)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
