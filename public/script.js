const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';
  input.disabled = true
  const thinkingMessageElement = appendMessage("bot", "Gemini is thinking...")

  try {
    const response = await fetch("/api/chat" , {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: { userMessage: userMessage }})
    })

    if (thinkingMessageElement && thinkingMessageElement.parentNode === chatBox) {
      chatBox.removeChild(thinkingMessageElement)
    }

    if (!response.ok) {
      let errorDetails = `Error: ${response.status} ${response.statusText}`
      try {
        const errorData = await response.json()
        errorDetails = errorData.error || errorDetails
      } catch (errorJson) {
        console.warn("Could not parse error response as JSON:", errorJson)
      }
      appendMessage("bot", `Error: ${errorDetails}`)
      return
    }

    const data = await response.json()
    appendMessage("bot", data.message)

  } catch (networkError) {
    console.error("Fetch API call failed:", networkError)

    appendMessage("bot", "Network error: Could not connect to the server")
  } finally {
    input.disabled = false
  }
  
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg
}