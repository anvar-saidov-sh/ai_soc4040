from apps.ai_engine.sessions import Session
from apps.ai_engine.data_loader import load_json_dataset

def main():
    # Load your dataset
    print("Loading dataset...")
    dataset = load_json_dataset("datasets")
    print("Dataset size:", len(dataset))

    # Initialize model session with memory
    session = Session(max_memory_tokens=1024)  # matches updated sessions.py

    # Run inference
    print("Running inference...")
    results = session.run(dataset)

    # Print first few results for inspection
    print("\n--- FIRST 5 RESULTS ---")
    for r in results[:5]:
        print("Q:", r["input"])
        print("A:", r["output"])
        print("----------------------")

    # Example of resetting memory
    print("Resetting memory...")
    session.reset()
    print("Memory after reset:", session.memory)

if __name__ == "__main__":
    main()
