// --- WARNING: Hardcoding API key is a security risk. Use a server-side proxy in production. ---
const API_KEY = 'AIzaSyBWjDFkZaBCZ3k9amAJTIoGh9yQgh7wBTQ'; 

// Listen for messages from the popup (or other parts of the extension)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the message is the one we're expecting
  if (request.action === 'generateContent') {
    
    // Call the async function and handle the response
    generateGeminiContent(request.prompt)
      .then(response => sendResponse(response))
      .catch(error => sendResponse({ error: error.message }));

    // Important: return true to indicate that you will send a response asynchronously
    return true; 
  }
});

async function generateGeminiContent(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    // Optional: Add configuration like temperature, etc.
    // config: { temperature: 0.7 } 
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API call failed: ${response.status} - ${errorData.error.message}`);
    }

    const data = await response.json();
    
    // Extract the text from the API response structure
    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!geminiText) {
      throw new Error("Invalid response format from Gemini API.");
    }

    return { text: geminiText };

  } catch (error) {
    console.error("Gemini API Request Error:", error);
    return { error: error.message };
  }
}