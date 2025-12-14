/*************************************************
 * QUESTION BANK (JSON – STRUCTURED & FAIR)
 *************************************************/
const QUESTION_BANK = {
    backend: [
        "Can you explain how REST differs from GraphQL?",
        "How do you manage database connections in FastAPI?",
        "What is dependency injection and how is it used in FastAPI?",
        "How do you handle authentication and authorization?",
        "What strategies do you use for scaling backend services?",
        "How do you design a clean project structure?"
    ],

    frontend: [
        "How does the browser render a web page?",
        "What are the differences between React and Vue?",
        "How do you optimize frontend performance?",
        "What is the virtual DOM?",
        "How do you handle state management?",
        "How do you ensure accessibility in web applications?"
    ],

    designer: [
        "How do you approach user research?",
        "Describe your design process from idea to prototype.",
        "How do you test usability?",
        "What is a design system?",
        "How do you collaborate with developers?",
        "How do you handle design feedback?"
    ],

    "product-manager": [
        "How do you define product success?",
        "How do you prioritize features?",
        "How do you work with stakeholders?",
        "What is your experience with product roadmaps?",
        "How do you handle conflicting requirements?",
        "How do you validate product ideas?"
    ],

    "marketing-manager": [
        "How do you measure campaign success?",
        "What marketing channels have you used?",
        "How do you define target audiences?",
        "How do you manage marketing budgets?",
        "What tools do you use for analytics?",
        "How do you improve conversion rates?"
    ],

    "data-scientist": [
        "How do you clean messy datasets?",
        "What is overfitting?",
        "How do you evaluate a machine learning model?",
        "Explain bias vs variance.",
        "What is feature engineering?",
        "How do you deploy ML models?"
    ]
};

/*************************************************
 * CHAT LOGIC
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chatWindow");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const interviewComplete = document.getElementById("interviewComplete");

    // Selected profession from professions page
    const profession = localStorage.getItem("profession") || "backend";
    const questions = QUESTION_BANK[profession];

    let currentQuestionIndex = 0;
    let currentQuestion = "";

    /*************************************************
     * UI HELPERS
     *************************************************/
    function addMessage(text, sender) {
        const msg = document.createElement("div");
        msg.className = `chat-message ${sender}-message`;
        msg.textContent = text;
        chatWindow.appendChild(msg);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    const addUserMessage = (t) => addMessage(t, "user");
    const addAIMessage = (t) => addMessage(t, "ai");

    /*************************************************
     * AI FEEDBACK (EVALUATION ONLY)
     *************************************************/
    async function askAI(question, answer) {
        try {
            const res = await fetch("http://127.0.0.1:8000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: `
You are an AI interview evaluator.

Profession: ${profession}
Question: ${question}
Candidate Answer: ${answer}

Give concise professional feedback:
- What was good
- What can be improved
(2–3 sentences max)
Do NOT ask a new question.
`
                })
            });

            const data = await res.json();
            return data.reply || "Thank you for your answer.";
        } catch (err) {
            console.error("AI error:", err);
            return "AI feedback is currently unavailable.";
        }
    }

    /*************************************************
     * INTERVIEW FLOW
     *************************************************/
    async function sendMessage() {
        const answer = userInput.value.trim();
        if (!answer) return;

        addUserMessage(answer);
        userInput.value = "";

        const feedback = await askAI(currentQuestion, answer);
        addAIMessage(feedback);

        currentQuestionIndex++;

        if (currentQuestionIndex >= questions.length) {
            endInterview();
        } else {
            askNextQuestion();
        }
    }

    function askNextQuestion() {
        currentQuestion = questions[currentQuestionIndex];
        addAIMessage(currentQuestion);
    }

    function endInterview() {
        addAIMessage("Interview complete. Great job!");
        document.querySelector(".chat-input-container").style.display = "none";
        interviewComplete.classList.remove("hidden");
    }

    /*************************************************
     * EVENTS
     *************************************************/
    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    /*************************************************
     * START INTERVIEW
     *************************************************/
    askNextQuestion();
});
/*************************************************
 * END OF FILE
 *************************************************/ 