// Auto-detect and fallback between localhost and Android emulator 10.0.2.2 or custom setting
export async function getWorkingApiUrl() {
  const custom = localStorage.getItem("arcore_api_url");
  const candidates = custom
    ? [custom, "http://localhost:5000", "http://10.0.2.2:5000"]
    : ["http://localhost:5000", "http://10.0.2.2:5000"];

  for (const url of candidates) {
    try {
      const res = await fetch(`${url}/api/health`, { method: "GET" });
      if (res.ok) {
        return url;
      }
    } catch (e) {
      // try next
    }
  }
  return custom || "http://localhost:5000";
}

export async function sendMessage(message, history = [], onChunk) {
  const baseUrl = await getWorkingApiUrl();
  console.log(`Sending message to ${baseUrl}/api/chat`);
  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let messageText = "";
    let model = "";

    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        const chunk = JSON.parse(line);
        const text = chunk?.message?.content || "";
        messageText += text;
        model = chunk?.model || model;
        onChunk?.(messageText);
      }

      if (done) break;
    }

    if (buffer.trim()) {
      try {
        const chunk = JSON.parse(buffer);
        messageText += chunk?.message?.content || "";
        model = chunk?.model || model;
        onChunk?.(messageText);
      } catch (e) {
        console.warn("Error parsing final chunk:", e);
      }
    }

    return { message: messageText || "I couldn't generate a response.", model };
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error(
      `Failed to connect to backend (${baseUrl}).\n\nFixes:\n1. Run 'npm run server' on your PC.\n2. If using USB device, run: adb reverse tcp:5000 tcp:5000\n3. Check Settings for API endpoint.`
    );
  }
}

export async function checkHealth() {
  const baseUrl = await getWorkingApiUrl();
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    return response.ok;
  } catch (err) {
    console.error("Health check failed:", err);
    return false;
  }
}
