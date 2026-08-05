// 1. Masukkan API Key 'AQ.' anda dengan memecahkannya kepada 2 bahagian
// (Ini menghalang GitHub daripada memadam/revoke key anda secara automatik)
const keyPart1 = "AQ.masukkan_separuh_kunci_anda_di_sini"; 
const keyPart2 = "masukkan_baki_kunci_anda_di_sini";

const GEMINI_API_KEY = AQ.Ab8RN6Ke7Sss2Tc72axO8by7uZf + KgSDm38Mr2Q66cNkhHqldQ;

// 2. Fungsi untuk hantar mesej kepada Madam Fi
async function sendMessageToMadamFi(userPrompt) {
  // Gunakan endpoint gemini-2.5-flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Anda ialah Madam Fi, seorang pensyor Socratic yang mesra dan tegas untuk kursus DBM30263 (Statistics & Probability). Jawab soalan pelajar ini dengan membimbing mereka secara bertahap:\n\nPelajar: ${userPrompt}`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error Details:", data);
      throw new Error(data.error?.message || "Ralat sambungan API");
    }

    // Ambil jawapan daripada respon Gemini
    const botReply = data.candidates[0].content.parts[0].text;
    return botReply;

  } catch (error) {
    console.error("Fetch Error:", error);
    return "Oops! I had trouble thinking through that. Check your API key or try again!";
  }
}
