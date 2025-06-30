let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const sendBtn = document.getElementById("sendBtn");
const status = document.getElementById("status");
const responseDiv = document.getElementById("response");

startBtn.onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        sendBtn.disabled = false;
    };

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    status.textContent = "Status: Recording...";
};

stopBtn.onclick = () => {
    mediaRecorder.stop();
    stopBtn.disabled = true;
    status.textContent = "Status: Recording stopped.";
};

sendBtn.onclick = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.mp3");

    status.textContent = "Status: Sending...";

    try {
        const response = await fetch("/interview", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        responseDiv.textContent = data.response;
        status.textContent = "Status: Done.";
    } catch (err) {
        status.textContent = "Status: Error sending audio.";
        responseDiv.textContent = err.toString();
    }

    sendBtn.disabled = true;
    startBtn.disabled = false;
};
