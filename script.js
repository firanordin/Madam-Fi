function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  
  // 1. Buang semua tanda asterisk (*) daripada teks jawapan
  let cleanedText = text.replace(/\*/g, '');

  // 2. Tukar perenggan / baris baharu
  cleanedText = cleanedText.replace(/\n/g, '<br>');
  
  msgDiv.innerHTML = cleanedText;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // 3. Render formula matematik KaTeX jika disuntik oleh Gemini
  if (window.renderMathInElement) {
    renderMathInElement(msgDiv, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ],
      throwOnError: false
    });
  }
}
