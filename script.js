// ==========================================
// MADAM FI - DBM30263 SOCRATIC TUTOR SCRIPT
// ==========================================

// 1. URL Cloudflare Worker Backend
const WORKER_URL = "https://silent-cake-5518.fira-ukm.workers.dev";

// 2. Fungsi Pembantu: Cari bekas mesej borak secara dinamik
function getChatContainer() {
  return document.getElementById("chat-messages") || 
         document.getElementById("chat-box") || 
         document.querySelector(".chat-messages") || 
         document.querySelector(".chat-box") ||
         document.body;
}

// 3. Fungsi Komunikasi API dengan Worker Cloudflare
async function sendMessageToMadamFi(promptText) {
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: `You are Madam Fi, a friendly, encouraging, yet structured Socratic tutor for the course DBM30263 (Statistics & Probability) at Polytechnic / University level.

INSTRUCTIONS:
1. Language Mode: DUAL LANGUAGE (Bahasa Melayu & English). Match the student's language, or explain complex concepts using both BM and English terms side-by-side (e.g., "Standard Deviation / Sisihan Piawai", "Mean / Min").
2. Socratic Style: Do NOT give the direct final answer immediately. Guide the student step-by-step using guiding questions, hints, breakdown of steps, or brief formulas.
3. Keep your response concise, clear, well-formatted, and student-friendly.

Student's Message: ${promptText}`
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Worker Error:", data.error);
      return "Oops! Ada masalah teknikal pada pelayan / Technical issue detected with the server.";
    }

    return data.candidates[0]?.content?.parts[0]?.text || "Maaf, tiada respon diterima dari server / No response received.";
  } catch (error) {
    console.error("Fetch Error:", error);
    return "Oops! Madam Fi tengah sibuk sikit. Sila kemaskini (refresh) atau cuba sebentar lagi!";
  }
}

// 4. Fungsi Menambah Mesej ke Paparan Skrin
function appendMessage(sender, text) {
  const container = getChatContainer();
  if (!container) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}-message`;
  
  // Gaya paparan mesej
  msgDiv.style.margin = "10px 0";
  msgDiv.style.padding = "10px 14px";
  msgDiv.style.borderRadius = "12px";
  msgDiv.style.maxWidth = "80%";
  msgDiv.style.lineHeight = "1.5";
  
  if (sender === "user") {
    msgDiv.style.backgroundColor = "#d1e7dd";
    msgDiv.style.color = "#0f5132";
    msgDiv.style.marginLeft = "auto";
    msgDiv.style.textAlign = "right";
    msgDiv.innerHTML = `<strong>Anda:</strong> ${text.replace(/\n/g, '<br>')}`;
  } else {
    msgDiv.style.backgroundColor = "#f8f9fa";
    msgDiv.style.color = "#212529";
    msgDiv.style.marginRight = "auto";
    msgDiv.style.border = "1px solid #dee2e6";
    msgDiv.style.textAlign = "left";
    msgDiv.innerHTML = `<strong>Madam Fi:</strong> ${text.replace(/\n/g, '<br>')}`;
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

// 5. Pengendali Acara (Event Listener) Utama
document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form") || document.querySelector("form");
  const userInput = document.getElementById("user-input") || 
                    document.querySelector("input[type='text']") || 
                    document.querySelector("input");

  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!userInput) return;

      const text = userInput.value.trim();
      if (!text) return;

      const container = getChatContainer();

      // 1. Papar Mesej Pengguna
      appendMessage("user", text);
      userInput.value = "";

      // 2. Papar Indikator Menunggu (Loading)
      const loadingDiv = document.createElement("div");
      loadingDiv.id = "loading-indicator";
      loadingDiv.style.fontStyle = "italic";
      loadingDiv.style.color = "#6c757d";
      loadingDiv.style.margin = "8px 0";
      loadingDiv.innerText = "Madam Fi sedang memikirkan jawapan / thinking...";
      
      if (container) {
        container.appendChild(loadingDiv);
        container.scrollTop = container.scrollHeight;
      }

      // 3. Dapatkan Balasan daripada Worker / Gemini API
      const reply = await sendMessageToMadamFi(text);

      // 4. Padam Indikator Loading & Paparkan Balasan Madam Fi
      const indicator = document.getElementById("loading-indicator");
      if (indicator) indicator.remove();

      appendMessage("bot", reply);
    });
  }
});
