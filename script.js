// 1. Tampal URL Cloudflare Worker anda di sini
const WORKER_URL = "https://silent-cake-5518.fira-ukm.workers.dev";

// 2. Elemen UI
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

// Fungsi untuk panggil Madam Fi melalui Cloudflare Worker
async function sendMessageToMadamFi(promptText) {
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: `Anda ialah Madam Fi, seorang pensyarah Socratic yang mesra dan tegas untuk kursus DBM30263 (Statistics & Probability). Jawab soalan pelajar ini secara bertahap:\n\nPelajar: ${promptText}`
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Worker Error:", data.error);
      return "Oops! Ada masalah teknikal pada laluan pelayan.";
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Oops! Madam Fi tengah sibuk sikit. Cuba refresh atau tanya lagi sekali ya!";
  }
}

// Fungsi untuk papar mesej dalam borak
function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}-message`;
  msgDiv.style.margin = "10px 0";
  msgDiv.style.padding = "10px";
  msgDiv.style.borderRadius = "8px";
  
  if (sender === "user") {
    msgDiv.style.backgroundColor = "#e3f2fd";
    msgDiv.style.textAlign = "right";
    msgDiv.innerHTML = `<strong>Anda:</strong> ${text}`;
  } else {
    msgDiv.style.backgroundColor = "#f5f5f5";
    msgDiv.style.textAlign = "left";
    msgDiv.innerHTML = `<strong>Madam Fi:</strong> ${text}`;
  }

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mengendalikan hantaran borak oleh pengguna
if (chatForm) {
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    // Papar mesej pengguna
    appendMessage("user", text);
    userInput.value = "";

    // Papar indikator "sedang menaip..."
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loading-indicator";
    loadingDiv.style.fontStyle = "italic";
    loadingDiv.style.color = "#888";
    loadingDiv.style.margin = "5px 0";
    loadingDiv.innerText = "Madam Fi sedang memikirkan jawapan...";
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Dapatkan jawapan dari API
    const reply = await sendMessageToMadamFi(text);

    // Padam indikator loading dan papar jawapan Madam Fi
    const indicator = document.getElementById("loading-indicator");
    if (indicator) indicator.remove();
    
    appendMessage("bot", reply);
  });
}
