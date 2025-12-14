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
        "How do you ensure accessibility?"
    ],
    designer: [
        "How do you approach user research?",
        "What is your design process from idea to prototype?",
        "How do you test usability?",
        "What is a design system?",
        "How do you collaborate with developers?",
        "How do you handle feedback?"
    ],
    "product-manager": [
        "How do you define product success?",
        "How do you prioritize features?",
        "How do you work with stakeholders?",
        "What is your experience with roadmaps?",
        "How do you handle conflicting requirements?",
        "How do you validate ideas?"
    ],
    "marketing-manager": [
        "How do you measure campaign success?",
        "What marketing channels have you used?",
        "How do you define target audiences?",
        "How do you manage budgets?",
        "What tools do you use for analytics?",
        "How do you improve conversion rates?"
    ],
    "data-scientist": [
        "How do you clean messy datasets?",
        "What is overfitting?",
        "How do you evaluate a model?",
        "Explain bias vs variance",
        "What is feature engineering?",
        "How do you deploy ML models?"
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chatWindow");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");

    // 🔹 Read profession from URL
    const params = new URLSearchParams(window.location.search);
    const profession = params.get("profession");

    const questions = QUESTION_BANK[profession];
    if (!questions) {
        addAIMessage("Invalid profession selected.");
        return;
    }
    // At the top of DOMContentLoaded
    const professionHeader = document.getElementById("professionHeader");

    // Map for display names if needed
    const PROFESSION_NAMES = {
        frontend: "Frontend Developer",
        backend: "Backend Developer",
        designer: "UI/UX Designer",
        "product-manager": "Product Manager",
        "marketing-manager": "Marketing Manager",
        "data-scientist": "Data Scientist"
    };

    // After reading profession from URL
    const professionDisplayName = PROFESSION_NAMES[profession] || "Chat";
    professionHeader.textContent = professionDisplayName;


    let currentQuestionIndex = 0;
    const interviewResults = [];

    function addMessage(text, sender) {
        const msg = document.createElement("div");
        msg.className = `chat-message ${sender}-message`;
        msg.textContent = text;
        chatWindow.appendChild(msg);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function addUserMessage(text) {
        addMessage(text, "user");
    }

    function addAIMessage(text) {
        addMessage(text, "ai");
    }

    function askNextQuestion() {
        if (currentQuestionIndex >= questions.length) {
            endInterview();
            return;
        }
        addAIMessage(questions[currentQuestionIndex]);
    }

    function sendMessage() {
        const answer = userInput.value.trim();
        if (!answer) return;

        addUserMessage(answer);

        interviewResults.push({
            question: questions[currentQuestionIndex],
            answer
        });

        userInput.value = "";
        currentQuestionIndex++;
        askNextQuestion();
    }

    function endInterview() {
        sessionStorage.setItem(
            "interviewResults",
            JSON.stringify(interviewResults)
        );
        sessionStorage.setItem(
            "selectedProfession",
            profession
        );
        window.location.href = "results.html";
    }

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    // 🔹 Start interview
    askNextQuestion();
});
