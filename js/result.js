document.addEventListener("DOMContentLoaded", async () => {
    const resultsBox = document.getElementById("finalResult");

    const answers = JSON.parse(sessionStorage.getItem("interviewResults"));
    const profession = sessionStorage.getItem("selectedProfession");

    const res = await fetch("http://127.0.0.1:8000/final-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            profession,
            answers
        })
    });

    const data = await res.json();

    const result = JSON.parse(data.result);

    resultsBox.innerHTML = `
        <h2>Overall Score</h2>
        <div class="score">${result.score}/100</div>
        <h3>Verdict: ${result.verdict}</h3>
        <p>${result.summary}</p>
    `;
});
