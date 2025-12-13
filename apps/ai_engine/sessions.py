from .inference import SuhbatAI
import asyncio

class Session:
    def __init__(self, memory_size: int = 4):
        self.model = None
        self.memory_size = memory_size
        self.memory = []
        self._loading_task = asyncio.create_task(self._load_model())

    async def _load_model(self):
        """Load the model in the background"""
        if self.model is None:
            print("[INFO] Loading SuhbatAI model...")
            self.model = await asyncio.to_thread(SuhbatAI)
            print("[INFO] Model loaded!")

    async def run(self, dataset):
        if self.model is None:
            # If model is not ready yet, return immediately
            return [{"input": item.get("text", ""), "output": "Model is still loading. Please try again in a few seconds."} for item in dataset]

        results = []
        for idx, item in enumerate(dataset):
            q = item.get("text") or item.get("question") or item.get("prompt")
            if not q:
                continue

            context = " ".join(self.memory[-self.memory_size:])
            full_prompt = f"{context} {q}" if context else q

            print(f"[{idx+1}/{len(dataset)}] Generating for: {q[:40]}...")
            answer = await asyncio.to_thread(self.model.generate, full_prompt)

            self.memory.append(f"User: {q}")
            self.memory.append(f"AI: {answer}")

            results.append({"input": q, "output": answer})

        return results

    def reset(self):
        """Clear conversation memory"""
        self.memory = []
