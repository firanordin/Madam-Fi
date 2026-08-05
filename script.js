// DOM Elements
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// Handle Form Submission
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const messageText = userInput.value.trim();
    if (!messageText) return;

    // 1. Render User Message
    appendMessage(messageText, 'user');
    userInput.value = '';

    // 2. Placeholder for Assistant Response
    // In the next step, we will connect this to your LLM API endpoint.
    setTimeout(() => {
        appendMessage("Got it! Let's examine this step by step. First, can you identify the key variables given in your problem statement?", 'assistant');
    }, 600);
});

// Helper Function to Append Messages
function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    const p = document.createElement('p');
    p.textContent = text;
    
    messageDiv.appendChild(p);
    chatBox.appendChild(messageDiv);
    
    // Auto-scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}
