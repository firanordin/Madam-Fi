const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const topicSelect = document.getElementById('topic-select');
const profileView = document.getElementById('profile-view');
const aiView = document.getElementById('ai-view');
const startApp = document.getElementById('start-app');
const editProfile = document.getElementById('edit-profile');
const studentDisplay = document.getElementById('student-display');
const fileUpload = document.getElementById('file-upload');
const fileName = document.getElementById('file-name');

function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = String(text).replace(/\n/g, '<br>');
  chatMessages?.appendChild(msgDiv);
  if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function openAI() {
  profileView.hidden = true;
  aiView.hidden = false;
  aiView.classList.add('active');
}

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('statpheaProfile') || 'null');
  if (profile?.name && profile?.institution) {
    document.getElementById('student-name').value = profile.name;
    document.getElementById('poly-name').value = profile.institution;
    document.getElementById('programme').value = profile.programme || '';
    studentDisplay.textContent = `${profile.name} • ${profile.institution}`;
    openAI();
  }
}

startApp?.addEventListener('click', () => {
  const name = document.getElementById('student-name').value.trim();
  const institution = document.getElementById('poly-name').value.trim();
  const programme = document.getElementById('programme').value.trim();
  if (!name || !institution) {
    alert('Please enter your name and Polytechnic / Institution.');
    return;
  }
  localStorage.setItem('statpheaProfile', JSON.stringify({ name, institution, programme }));
  studentDisplay.textContent = `${name} • ${institution}`;
  openAI();
});

editProfile?.addEventListener('click', () => {
  profileView.hidden = false;
  aiView.hidden = true;
});

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  appendMessage('user', text);
  userInput.value = '';
  const topic = topicSelect?.value || 'probability-distribution';
  const prompts = {
    'probability-distribution': 'Before we solve it, tell me: what information is given, what is the question asking you to find, and what do you think is the first step?',
    probability: 'Before calculating, identify the event(s) and the probability rule you think applies. What clue in the question helped you decide?',
    statistics: 'First identify the given information and what the question asks you to find. What do you already know?'
  };
  appendMessage('bot', `<strong>STATPHEA</strong><br>${prompts[topic]}`);
}

sendBtn?.addEventListener('click', sendMessage);
userInput?.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

clearBtn?.addEventListener('click', () => {
  chatMessages.innerHTML = '<div class="message bot"><strong>STATPHEA 👋</strong><br>Upload a question or type it below. Then show me what you understand or how you would start.</div>';
  userInput.value = '';
  fileUpload.value = '';
  fileName.textContent = 'No file selected';
});

fileUpload?.addEventListener('change', () => {
  const file = fileUpload.files?.[0];
  if (!file) return;
  fileName.textContent = `Selected: ${file.name}`;
  appendMessage('bot', `<strong>STATPHEA</strong><br>Question received: <strong>${file.name}</strong>.<br>For now, tell me what you understand from the question. AI file processing will be connected in the next step.`);
});

loadProfile();
