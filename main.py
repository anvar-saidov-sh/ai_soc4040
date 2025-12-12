from apps.ai_engine.sessions import Session
from apps.ai_engine.data_loader import load_json_dataset

def main():
    print("Loading dataset...")
    dataset = load_json_dataset("datasets")

    print("Dataset size:", len(dataset))
    print("Loading model...")
    session = Session()

    print("Running inference...")
    results = session.run(dataset)

    print("\n--- FIRST 5 RESULTS ---")
    for r in results[:5]:
        print("Q:", r["input"])
        print("A:", r["output"])
        print("----------------------")

if __name__ == "__main__":
    main()
