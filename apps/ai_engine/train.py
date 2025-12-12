from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments
from data_loader import load_json_dataset

def main():
    print("Loading dataset...")
    dataset = load_json_dataset("datasets")

    tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
    tokenizer.pad_token = tokenizer.eos_token

    def tokenize(batch):
        tokens = tokenizer(batch["text"], truncation=True, padding="max_length", max_length=128)
        tokens["labels"] = tokens["input_ids"].copy()  # REQUIRED FOR LOSS
        return tokens

    print("Tokenizing...")
    tokenized = dataset.map(tokenize, batched=True)

    print("Loading model...")
    model = GPT2LMHeadModel.from_pretrained("gpt2")

    args = TrainingArguments(
        output_dir="finetuned-gpt2",
        overwrite_output_dir=True,
        per_device_train_batch_size=2,
        num_train_epochs=3,
        save_steps=50,
        logging_steps=20,
        report_to="none"
    )

    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=tokenized
    )

    print("Training model...")
    trainer.train()

    model.save_pretrained("finetuned-gpt2")
    tokenizer.save_pretrained("finetuned-gpt2")
    print("Training complete. Model saved.")

if __name__ == "__main__":
    main()
