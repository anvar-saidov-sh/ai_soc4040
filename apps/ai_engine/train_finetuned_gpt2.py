from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments
from datasets import load_dataset

# --- Load Dataset ---
dataset = load_dataset("wikitext", "wikitext-2-raw-v1")  # replace with your dataset if local

# --- Load tokenizer and model ---
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

# --- Fix padding issue ---
tokenizer.pad_token = tokenizer.eos_token
model.config.pad_token_id = tokenizer.eos_token_id

# --- Tokenize function ---
def tokenize_function(examples):
    tokenized = tokenizer(
        examples["text"],
        truncation=True,
        padding="max_length",
        max_length=128
    )
    tokenized["labels"] = tokenized["input_ids"].copy()  # labels = input_ids
    return tokenized

tokenized_datasets = dataset.map(tokenize_function, batched=True, remove_columns=["text"])

# --- Split datasets ---
train_dataset = tokenized_datasets["train"]
eval_dataset = tokenized_datasets["validation"]

# --- Training arguments ---
training_args = TrainingArguments(
    output_dir="./finetuned-gpt2",
    overwrite_output_dir=True,
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    num_train_epochs=1,
    logging_steps=100,
    save_steps=500,
    save_total_limit=2,
    learning_rate=5e-5,
    weight_decay=0.01,
    fp16=False
)


# --- Trainer setup ---
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)

# --- Start training ---
trainer.train()
