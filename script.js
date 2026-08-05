const WORKER_URL = "https://silent-cake-5518.YOUR-SUBDOMAIN.workers.dev"; // Kemaskini URL Worker anda

let studentProfile = {
  name: "",
  poly: "",
  language: ""
};

let conversationHistory = [];
let lastActivityTime = Date.now();
const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 Minit

const onboardingOverlay = document.getElementById('onboarding-overlay');
const onboardingForm = document.getElementById('onboarding-form');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 1. Process Onboarding Form
onboardingForm.addEventListener('submit', async function(e) {
  e.preventDefault();

  // Ambil maklumat daripada input & dropdown
  studentProfile.name = document.getElementById('student-name-input').value.trim();
  studentProfile.poly = document.getElementById('student-poly-input').value.trim();
  studentProfile.language = document.getElementById('language-select').value;

  if (!studentProfile.name || !studentProfile.poly || !studentProfile.language) {
    alert("Sila lengkapkan semua ruangan.");
    return;
  }

  // Hide Onboarding & Enable Chat UI
  onboardingOverlay.style.display = 'none';
  document.getElementById('display-name').textContent = studentProfile.name;
  document.getElementById('display-poly').textContent = studentProfile.poly;
  document.getElementById('student-badge').style.display = 'block';

  userInput.disabled = false;
  sendBtn.disabled = false;

  // Hantar data pengenalan terus ke Madam Fi secara latar belakang
  const systemPromptTrigger = `My name is ${studentProfile.name} from ${studentProfile.poly}. I prefer to learn in ${studentProfile.language}. Please start our session.`;
  await sendMessageToMadamFi(systemPromptTrigger, true);
});

// 2. Semak Idle Timeout (30 Minit)
function checkIdleTimeout() {
  const now = Date.now();
  if (now - lastActivityTime > IDLE_TIMEOUT) {
    conversationHistory = [];
    alert("Sesi anda telah tamat (idle > 30 minit). Sila isi semula pengenalan diri.");
    onboardingOverlay.style.display = 'flex';
    userInput.disabled = true;
    sendBtn.disabled = true;
  }
  lastActivityTime = now;
}

// 3. Fungsi Hantar Mesej ke Worker
async function sendMessageToMadamFi(promptText, isInitialSystemPrompt = false) {
  checkIdleTimeout();

  if (!isInitialSystemPrompt) {
    appendMessage('user', promptText);
  }

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: promptText,
        history: conversationHistory
      })
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;

    // Simpan dalam Sejarah Perbualan
    conversationHistory.push({ role: "user", parts: [{ text: promptText }] });
    conversationHistory.push({ role: "model", parts: [{ text: reply }] });

    appendMessage('assistant', reply);
  } catch (err) {
    appendMessage('assistant', "Maaf, berlaku ralat sambungan. Sila cuba lagi.");
  }
}

// 4. Papar Mesej pada Chat UI
function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handler untuk Butang Send Pelajar
sendBtn.addEventListener('click', () => {
  const text = userInput.value.trim();
  if (text) {
    sendMessageToMadamFi(text);
    userInput.value = '';
  }
});
