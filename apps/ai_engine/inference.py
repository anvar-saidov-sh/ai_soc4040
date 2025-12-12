import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

class SuhbatAI:
    def __init__(self):
        print("Loading model...")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.model = GPT2LMHeadModel.from_pretrained("finetuned-gpt2").to(self.device)
        self.tokenizer = GPT2Tokenizer.from_pretrained("finetuned-gpt2")
        self.tokenizer.pad_token = self.tokenizer.eos_token

        print("Model loaded.")

    def generate(self, prompt):
        inputs = self.tokenizer(
            prompt,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=128
        ).to(self.device)

        outputs = self.model.generate(
            **inputs,
            max_new_tokens=50,
            do_sample=True,
            temperature=0.8,
            top_p=0.9,
            eos_token_id=self.tokenizer.eos_token_id,
        )

        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
