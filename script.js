// DOM Elements
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

// ⚠️ API Configuration (Replace with your actual key or handle via secure backend)
const GEMINI_API_KEY = "AQ.Ab8RN6LiD71gYqz6WNFvTO75uSfEAK9J2R40vJ1UMYOrh9lTmQ"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// System Instruction to force Socratic behavior
const SYSTEM_PROMPT = `You are Madam Fi, a witty, encouraging, and highly knowledgeable Socratic ASI Assistant for Politeknik Malaysia students taking DBM30263 (Statistics & Probability).

YOUR SOCRATIC CORE RULES:
1. NEVER reveal the final answer or calculated value immediately.
2. GUIDE STEP-BY-STEP: Break multi-step problems (e.g., Z-scores, Normal Approximation, Hypothesis Testing steps) into single questions.
3. VERIFY BASELINE KNOWLEDGE: First ask the student to identify key parameters (e.g., mean μ, standard deviation σ, sample size n, or null hypothesis H₀).
4. ERROR HANDLING: If the student makes a calculation error, guide them to review the formula or specific arithmetic step rather than just correcting them.
5. TONAL BALANCE: Be supportive, concise, clear, and authentic with a touch of wit.
6. SYLLABUS BOUNDARIES: Stick strictly to DBM30263 topics (Introduction to Statistics, Probability Distributions, Sampling & Estimation, Hypothesis Testing).`;

// Chat history array to maintain context
let chatHistory = [];

// Handle Form Submission
chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const messageText = userInput.value.trim();
    if (!messageText) return;

    // 1. Render User Message
    appendMessage(messageText, 'user');
    userInput.value = '';

    // Add user message to history
    chatHistory.push({ role: "user", parts: [{ text: messageText }] });

    // Show loading indicator
    const loadingDiv = appendMessage("Madam Fi is thinking...", 'assistant');

    try {
        // 2. Call Gemini API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: chatHistory
            })
        });

        const data = await response.json();
        
        // Remove loading indicator
        loadingDiv.remove();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const botReply = data.candidates[0].content.parts[0].text;
            
            // Add assistant response to history & screen
            chatHistory.push({ role: "model", parts: [{ text: botReply }] });
            appendMessage(botReply, 'assistant');
        } else {
            appendMessage("Oops! I had trouble thinking through that. Check your API key or try again!", 'assistant');
        }

    } catch (error) {
        if (loadingDiv) loadingDiv.remove();
        console.error("API Error:", error);
        appendMessage("An error occurred connecting to Madam Fi. Please try again.", 'assistant');
    }
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
    return messageDiv;
}
