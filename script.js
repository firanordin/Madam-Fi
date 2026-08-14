const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-btn');
const topicSelect = document.getElementById('topic-select');
const profileView = document.getElementById('profile-view');
const appContent = document.getElementById('app-content');
const startApp = document.getElementById('start-app');
const editProfile = document.getElementById('edit-profile');
const studentDisplay = document.getElementById('student-display');
const fileUpload = document.getElementById('file-upload');
const fileName = document.getElementById('file-name');

function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  let cleanedText = String(text).replace(/\*/g, '');
  cleanedText = cleanedText.replace(/\n/g, '<br>');
  msgDiv.innerHTML = cleanedText;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  if (window.renderMathInElement) renderMathInElement(msgDiv, { delimiters: [{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}], throwOnError:false });
}

function showView(viewName) {
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(`${viewName}-view`)?.classList.add('active');
  document.querySelector(`.tab[data-view="${viewName}"]`)?.classList.add('active');
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => showView(tab.dataset.view)));

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('statpheaProfile') || 'null');
  if (profile?.name && profile?.institution) {
    document.getElementById('student-name').value = profile.name;
    document.getElementById('poly-name').value = profile.institution;
    document.getElementById('programme').value = profile.programme || '';
    studentDisplay.textContent = `${profile.name} • ${profile.institution}`;
    profileView.hidden = true;
    appContent.hidden = false;
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
  profileView.hidden = true;
  appContent.hidden = false;
});

editProfile?.addEventListener('click', () => {
  profileView.hidden = false;
  appContent.hidden = true;
});

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  appendMessage('user', text);
  userInput.value = '';
  const topic = topicSelect?.value || 'probability-distribution';
  const prompts = {
    'probability-distribution': 'Good start. First, identify what type of random variable or distribution the question is asking about. What clue in the question helped you decide?',
    probability: 'Good start. Before calculating, identify the event(s) and the probability rule that seems relevant. Which rule do you think applies?',
    statistics: 'Good start. Identify the given information first: sample/population, measure, and any known parameters. What do you know from the question?'
  };
  appendMessage('bot', `<strong>STATPHEA</strong><br>${prompts[topic]}`);
}

sendBtn?.addEventListener('click', sendMessage);
userInput?.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } });
clearBtn?.addEventListener('click', () => { chatMessages.innerHTML = '<div class="message bot"><strong>STATPHEA 👋</strong><br>Let\'s start again. Tell me what you know from the question.</div>'; userInput.value = ''; });

fileUpload?.addEventListener('change', () => {
  const file = fileUpload.files?.[0];
  if (!file) return;
  fileName.textContent = `Selected: ${file.name}`;
  appendMessage('bot', `<strong>STATPHEA</strong><br>I've received <strong>${file.name}</strong>. File processing will be connected to the AI next. For now, you can also type the question or upload a clear image/PDF of it.`);
});

document.querySelectorAll('.note-btn').forEach(button => button.addEventListener('click', () => {
  const panel = document.querySelector('.content-panel');
  if (panel) panel.innerHTML = '<h3>Probability Distribution Notes</h3><p><strong>Lecturer content placeholder.</strong> Upload your mind map and answer scheme so we can replace this section with your official notes.</p><div class="notice">Your lecturer-provided scheme will be the authoritative reference for STATPHEA.</div>';
}));

document.getElementById('start-practice')?.addEventListener('click', () => {
  const question = document.getElementById('practice-question').value.trim();
  if (!question) return;
  showView('coach');
  appendMessage('user', question);
  appendMessage('bot', '<strong>STATPHEA</strong><br>We will not jump to the final answer. First: what information is given, and what is the question asking you to find?');
});

loadProfile();
