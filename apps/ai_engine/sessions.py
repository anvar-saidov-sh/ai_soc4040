from .inference import SuhbatAI

class Session:
    def __init__(self):
        self.model = SuhbatAI()

    def run(self, dataset):
        results = []

        for idx, item in enumerate(dataset):
            q = item.get("text") or item.get("question") or item.get("prompt")

            if not q:
                print(f"[WARN] No valid text field in item #{idx}: {item}")
                continue

            print(f"[{idx+1}/{len(dataset)}] Generating for: {q[:40]}...")
            answer = self.model.generate(q)

            results.append({
                "input": q,
                "output": answer
            })

        return results
