document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ script.js loaded");
  const jobForm = document.getElementById("job-form");
  const chatForm = document.getElementById("chat-form");
  const jobDesc = document.getElementById("job-desc");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  function appendMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender);
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  jobForm.addEventListener("submit", async e => {
    e.preventDefault();
    const desc = jobDesc.value.trim();
    if (!desc) return;
    chatBox.innerHTML = "";
    appendMessage("📄 Вакансия отправлена...", "user");
    const res = await fetch("/set_job_description", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ description: desc })
    });
    const data = await res.json();
    if (data.message) appendMessage(data.message, "ai");
    else appendMessage("❌ "+data.error, "ai");
  });

  chatForm.addEventListener("submit", async e => {
    e.preventDefault();
    const msg = userInput.value.trim();
    if (!msg) return;
    appendMessage(msg, "user");
    userInput.value = "";
    const res = await fetch("/interview", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    if (data.answer) appendMessage(data.answer, "ai");
    else appendMessage("❌ "+data.error, "ai");
  });
});
