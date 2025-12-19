document.getElementById('submitBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const responseDiv = document.getElementById('response');
    responseDiv.textContent = '...Thinking...';
    
    // 1. Send message to the background Service Worker
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'generateContent',
        prompt: prompt
      });
  
      // 3. Display the result from the Service Worker
      if (response && response.text) {
        responseDiv.textContent = response.text;
      } else {
        responseDiv.textContent = `Error: ${response.error || 'Unknown response'}`;
      }
    } catch (error) {
      console.error("Error communicating with background script:", error);
      responseDiv.textContent = 'Error sending request.';
    }
  });