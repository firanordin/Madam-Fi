// 1. URL Worker Sebenar Anda
const WORKER_URL = "https://silent-cake-5518.fira-ukm.workers.dev";

// Fungsi khas untuk mencari ruang borak secara automatik
function getChatContainer() {
  return document.getElementById("chat-messages") || 
         document.getElementById("chat-box") || 
         document.querySelector(".chat-messages") || 
         document.querySelector(".chat-box") ||
         document.body;
}

// 2. Fungsi panggil Madam Fi dari Cloudflare Worker
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

    return data.candidates[0]?.content?.parts[0]?.text || "Maaf, tiada respon diterima dari server.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Oops! Madam Fi tengah sibuk sikit. Cuba refresh atau tanya lagi sekali ya!";
  }
}

// 3. Fungsi paparkan mesej ke skrin
function appendMessage(sender, text) {
  const container = getChatContainer();
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}-message`;
  msgDiv.style.margin = "10px 0";
  msgDiv.style.padding = "10px 14px";
  msgDiv.style.borderRadius = "12px";
  msgDiv.style.maxWidth = "80%";
  
  if (sender === "user") {
    msgDiv.style.backgroundColor = "#d1e7dd";
    msgDiv.style.color = "#0f5132";
    msgDiv.style.marginLeft = "auto";
    msgDiv.style.textAlign = "right";
    msgDiv.innerHTML = `<strong>Anda:</strong> ${text}`;
  } else {
    msgDiv.style.backgroundColor = "#f8f9fa";
    msgDiv.style.color = "#212529";
    msgDiv.style.marginRight = "auto";
    msgDiv.style.border = "1px solid #dee2e6";
    msgDiv.style.textAlign = "left";
    msgDiv.innerHTML = `<strong>Madam Fi:</strong> ${text}`;
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

// 4. Pastikan HTML selesai dimuatkan sebelum event listener diikat
document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form") || document.querySelector("form");
  const userInput = document.getElementById("user-input") || document.querySelector("input[type='text']") || document.querySelector("input");

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!userInput) return;

      const text = userInput.value.trim();
      if (!text) return;

      const container = getChatContainer();

      // Papar mesej pengguna
      appendMessage("user", text);
      userInput.value = "";

      // Papar indikator loading
      const loadingDiv = document.createElement("div");
      loadingDiv.id = "loading-indicator";
      loadingDiv.style.fontStyle = "italic";
      loadingDiv.style.color = "#6c757d";
      loadingDiv.style.margin = "8px 0";
      loadingDiv.innerText = "Madam Fi sedang memikirkan jawapan...";
      
      if (container) {
        container.appendChild(loadingDiv);
        container.scrollTop = container.scrollHeight;
      }

      // Ambil respon AI
      const reply = await sendMessageToMadamFi(text);

      // Padam indikator loading & papar jawapan
      const indicator = document.getElementById("loading-indicator");
      if (indicator) indicator.remove();

      appendMessage("bot", reply);
    });
  }
});
