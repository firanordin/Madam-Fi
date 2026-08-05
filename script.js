// Gantikan URL di dalam pembuka & penutup pengikat " " di bawah dengan URL .workers.dev anda:
const WORKER_URL = "https://silent-cake-5518.fira-ukm.workers.dev";

// Fungsi untuk panggil Madam Fi melalui Cloudflare Worker
async function sendMessageToMadamFi(userPrompt) {
  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: `Anda ialah Madam Fi, seorang pensyarah Socratic yang mesra dan tegas untuk kursus DBM30263 (Statistics & Probability). Jawab soalan pelajar ini secara bertahap:\n\nPelajar: ${userPrompt}`
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Worker Error:", data.error);
      throw new Error(data.error);
    }

    // Mengambil jawapan daripada struktur balasan Gemini
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Fetch Error:", error);
    return "Oops! Madam Fi tengah sibuk sikit. Cuba refresh atau tanya lagi sekali ya!";
  }
}
