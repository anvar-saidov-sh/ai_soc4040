from openai import OpenAI
import os

# Вставь свой ключ сюда или используй переменные окружения
api_key = os.getenv("OPENAI_API_KEY") or "sk-..."  # ← замени здесь

client = OpenAI(api_key=api_key)

try:
    response = client.models.list()
    models = [m.id for m in response.data]
    print("✅ API Key is valid.")
    print("📋 Available models:")
    for model in models:
        print("-", model)

    # Проверим доступ к конкретным моделям
    for target in ["gpt-3.5-turbo", "gpt-4", "gpt-4o"]:
        if target in models:
            print(f"🟢 {target} is available.")
        else:
            print(f"🔴 {target} is NOT available.")

except Exception as e:
    print("❌ API Key check failed:")
    print(e)
