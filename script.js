const WORKER_URL = "https://silent-cake-5518.fira-ukm.workers.dev"; // Gantikan URL Worker anda

let currentStep = 1; // Step 1: Input Nama/Poli, Step 2: Pilih Bahasa, Step 3: Tutoring
let studentProfile = { name: "", poly: "", language: "" };
let conversationHistory = [];
let lastActivityTime = Date.now();
const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 Minit

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const langContainer = document.getElementById('language-dropdown-container');
const langSelect = document.getElementById('language-select');

// 1. Apabila Halaman Dibuka: Madam Fi terus menyapa
window.addEventListener('DOMContentLoaded', () => {
  const initialGreeting = "Hi! I am Madam Fi, your learning assistant for course code DBM 30263 Statistics and Probability. I'm so glad you reached out!\n\nBoleh kongsikan **Nama** dan **Politeknik** anda dahulu?";
  appendMessage('assistant', initialGreeting);
});

// 2. Semak Idle Timeout (30 Minit)
function checkIdleTimeout() {
  const now = Date.now();
  if (now - lastActivityTime > IDLE_TIMEOUT) {
    conversationHistory = [];
    currentStep = 1;
    studentProfile = { name: "", poly: "", language: "" };
    document.getElementById('student-badge').style.display = 'none';
    langContainer.style.display = 'none';
    
    appendMessage('assistant', "🕒 *Sesi telah tamat (tiada aktiviti > 30 minit).* \n\nHi! I am Madam Fi, your learning assistant for course code DBM 30263 Statistics and Probability. Boleh kongsikan **Nama** dan **Politeknik** anda semula?");
  }
  lastActivityTime = now;
}

// 3. Pengendalian Input Pelajar
sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSendMessage();
});

async function handleSendMessage() {
  checkIdleTimeout();
  const text = userInput.value.trim();
  if (!text) return;

  // Papar mesej pelajar
  appendMessage('user', text);
  userInput.value = '';

  if (currentStep === 1) {
    // Pelajar memasukkan Nama & Poli
    studentProfile.name = text; // Simpan teks jawapan sebagai nama/info
    
    // Kemaskini Header Profil Pelajar
    document.getElementById('student-name-display').textContent = text;
    document.getElementById('student-poly-display').textContent = 'Politeknik';
    document.getElementById('student-badge').style.display = 'inline-block';

    // Maju ke Step 2 (Pilihan Bahasa melalui Dropdown)
    currentStep = 2;
    appendMessage('assistant', `Selamat datang **${text}**! Sila pilih bahasa pilihan anda daripada dropdown di bawah untuk kita bermula:`);
    
    // Tunjukkan Dropdown Bahasa & Sembunyikan seketika input teks
    langContainer.style.display = 'block';
    userInput.disabled = true;
    sendBtn.disabled = true;
  } 
  else if (currentStep === 3) {
    // Sesi Pembelajaran Sokratik Biasa
    await sendMessageToWorker(text);
  }
}

// 4. Apabila Pelajar Pilih Bahasa dari Dropdown
langSelect.addEventListener('change', async function() {
  studentProfile.language = this.value;
  
  // Sembunyikan dropdown & aktifkan semula input teks
  langContainer.style.display = 'none';
  userInput.disabled = false;
  sendBtn.disabled = false;
  
  appendMessage('user', `Saya memilih: ${studentProfile.language}`);
  
  // Maju ke Step 3 (Mula Tutoring)
  currentStep = 3;

  // Hantar data pengenalan lengkap ke Cloudflare Worker
  const promptContext = `My name and polytechnic info is: "${studentProfile.name}". I choose ${studentProfile.language} as my language. Please welcome me and ask how you can help with DBM30263 today in ${studentProfile.language}.`;
  await sendMessageToWorker(promptContext, true);
});

// 5. Fungsi Panggilan ke Cloudflare Worker
async function sendMessageToWorker(promptText, isInitialContext = false) {
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

    // Simpan dalam sejarah perbualan
    conversationHistory.push({ role: "user", parts: [{ text: promptText }] });
    conversationHistory.push({ role: "model", parts: [{ text: reply }] });

    appendMessage('assistant', reply);
  } catch (err) {
    appendMessage('assistant', "Maaf, ralat sambungan berlaku. Sila cuba lagi.");
  }
}

// 6. Fungsi Papar Mesej Chat
function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = text.replace(/\n/g, '<br>');
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
