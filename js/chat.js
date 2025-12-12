document.addEventListener("DOMContentLoaded", () => {

    // ====== CHAT LOGIC WITH MODEL-GENERATED QUESTIONS ======
    let questionCount = 0;
    const maxQuestions = 6;
    let conversationHistory = [];

    const chatWindow = document.getElementById("chatWindow");
    const sendBtn = document.getElementById("sendBtn");
    const userInput = document.getElementById("userInput");

    if (!chatWindow || !sendBtn || !userInput) {
        console.error("Chat elements not found!");
        return;
    }

    // ====== HELPER FUNCTIONS ======
    function addAIMessage(text) {
        const msg = document.createElement("div");
        msg.className = "chat-message ai-message";
        msg.textContent = text;
        msg.style.opacity = 0;
        chatWindow.appendChild(msg);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        setTimeout(() => msg.style.opacity = 1, 50);
    }

    function addUserMessage(text) {
        const msg = document.createElement("div");
        msg.className = "chat-message user-message";
        msg.textContent = text;
        msg.style.opacity = 0;
        chatWindow.appendChild(msg);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        setTimeout(() => msg.style.opacity = 1, 50);
    }

    // ====== FIRST QUESTION ======
    addAIMessage("Hello! Let's start your interview. Tell me about yourself and your background.");

    // ====== SEND BUTTON HANDLER ======
    sendBtn.addEventListener("click", async () => {
        const message = userInput.value.trim();
        if (!message) return;

        addUserMessage(message);
        userInput.value = "";

        conversationHistory.push({ role: "user", content: message });
        questionCount++;

        if (questionCount >= maxQuestions) {
            endInterview();
            return;
        }

        const nextQuestion = await askModelForNextQuestion(conversationHistory);
        addAIMessage(nextQuestion);
        conversationHistory.push({ role: "assistant", content: nextQuestion });
    });

    // ====== LOCAL LLM REQUEST ======
    async function askModelForNextQuestion(history) {
        try {
            const response = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama3.1",
                    prompt: makeModelPrompt(history)
                })
            });

            const data = await response.json();
            return data.response || "Sorry, I couldn't generate a question.";
        } catch (err) {
            console.error("Model error:", err);
            return "Sorry, I couldn't generate a question.";
        }
    }

    function makeModelPrompt(history) {
        return `
You are an AI interview coach. Generate ONLY interview questions.

Conversation so far:
${history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

Based on the candidate's last answer, generate the next interview question.
Do NOT write explanations or greetings, only the question.
        `;
    }

    // ====== END INTERVIEW ======
    function endInterview() {
        document.querySelector(".chat-input-container").style.display = "none";
        showInterviewComplete();
    }

    function showInterviewComplete() {
        const box = document.getElementById("interviewComplete");
        box.classList.remove("hidden");

        setTimeout(() => {
            box.classList.add("show");
        }, 50);
    }

    // ====== SEE RESULTS BUTTON ======
    const btn = document.getElementById("seeResultsBtn");
    if (btn) {
        btn.addEventListener("click", () => {
            window.location.href = "results.html";
        });
    }

}); // End DOMContentLoaded
