// ===== RESULTS PAGE LOGIC =====
window.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const profession = params.get("profession") || "Unknown";
    const resultHeader = document.getElementById("professionHeader");
    if(resultHeader) resultHeader.textContent = `Profession: ${profession}`;

    // Fetch or generate model results
    const results = await fetchModelResults(profession);

    // Render results into the page
    renderScoreSummary(results.averageScore);
    renderSkillRatings(results.skillRatings);
    renderStrengths(results.strengths);
    renderWeakPoints(results.weakPoints);
    renderRecommendations(results.recommendations);
});

// ===== FETCH MODEL-GENERATED RESULTS =====
async function fetchModelResults(profession) {
    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.1",
                prompt: `
You are an AI interview evaluator. 
The candidate has just finished an interview for the profession: ${profession}.
Generate the following in JSON format:

{
    "averageScore": number (0-10),
    "skillRatings": {
        "Communication": number,
        "Structure": number,
        "Confidence": number,
        "Knowledge": number
    },
    "strengths": [array of strings, 3-5 points],
    "weakPoints": [array of strings, 3-5 points],
    "recommendations": [array of strings, 3-5 points]
}
Only output valid JSON.
                `
            })
        });

        const data = await response.json();
        return data.response ? JSON.parse(data.response) : {};
    } catch (err) {
        console.error("Error fetching model results:", err);
        // fallback data
        return {
            averageScore: 3.5,
            skillRatings: {
                Communication: 4,
                Structure: 3,
                Confidence: 3,
                Knowledge: 4
            },
            strengths: ["Clear and concise communication", "Strong technical knowledge", "Good use of examples"],
            weakPoints: ["Consider more details", "Answers could be more structured"],
            recommendations: ["Use STAR method", "Practice explaining concepts", "Maintain consistent answer length"]
        };
    }
}

// ===== RENDER FUNCTIONS =====
function renderScoreSummary(average) {
    const container = document.querySelector(".score-summary");
    if(container) container.innerHTML = `
        <h2>Score Summary</h2>
        <p>Your average score is <strong>${average}/10</strong></p>
    `;
}

function renderSkillRatings(ratings) {
    const container = document.querySelector(".skill-ratings");
    if(!container) return;
    let html = "<h2>Skill Ratings</h2><ul>";
    for(const [skill, score] of Object.entries(ratings)) {
        html += `<li>${skill}: <span>${score}/10</span></li>`;
    }
    html += "</ul>";
    container.innerHTML = html;
}

function renderStrengths(list) {
    const container = document.querySelector(".strengths");
    if(!container) return;
    let html = "<h2>Strengths</h2><ul>";
    list.forEach(item => { html += `<li>✓ ${item}</li>`; });
    html += "</ul>";
    container.innerHTML = html;
}

function renderWeakPoints(list) {
    const container = document.querySelector(".weak-points");
    if(!container) return;
    let html = "<h2>Weak Points</h2><ul>";
    list.forEach(item => { html += `<li>• ${item}</li>`; });
    html += "</ul>";
    container.innerHTML = html;
}

function renderRecommendations(list) {
    const container = document.querySelector(".recommendations");
    if(!container) return;
    let html = "<h2>Recommendations</h2><ol>";
    list.forEach(item => { html += `<li>${item}</li>`; });
    html += "</ol>";
    container.innerHTML = html;
}

// ===== BUTTON ACTIONS =====
const backHomeBtn = document.getElementById("backHomeBtn");
if(backHomeBtn) backHomeBtn.addEventListener("click", () => window.location.href = "../index.html");

const tryAgainBtn = document.getElementById("tryAgainBtn");
if(tryAgainBtn) tryAgainBtn.addEventListener("click", () => {
    const profession = new URLSearchParams(window.location.search).get("profession");
    window.location.href = `chat.html?profession=${profession}`;
});

// ===== SHARED SCRIPT FUNCTIONALITY =====
// === Smooth Scrolling for Nav Links ===
document.addEventListener("DOMContentLoaded", () => {
    // Fade-in on scroll
    const revealElements = document.querySelectorAll('.feature-card, .hero-text, .hero-img');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                el.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // trigger on load

    // Button hover animations
    document.querySelectorAll('.cta-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => btn.classList.add('hovered'));
        btn.addEventListener('mouseleave', () => btn.classList.remove('hovered'));
    });
});

