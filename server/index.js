import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in .env file");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: !!GEMINI_API_KEY, model: GEMINI_MODEL, provider: "gemini" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "A message is required." });
    }

    // Convert history to Gemini format
    const contents = history
      .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Add system prompt if needed. Gemini 1.5 handles system instructions separately,
    // but for simplicity we can add it as a user message or just use the model configuration.
    // Here we'll just send the message.
    contents.push({ role: "user", parts: [{ text: message }] });

    const result = await model.generateContentStream({
      contents: contents,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    res.status(200);
    res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      // Emulate Ollama response format for the frontend
      const data = JSON.stringify({
        model: GEMINI_MODEL,
        message: {
          role: "assistant",
          content: chunkText
        },
        done: false
      });
      res.write(data + "\n");
    }

    // Final chunk to signal completion if needed by the parser
    // (Existing parser handles the end of stream normally)
    res.end();

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(503).json({
      error: "AI service error. Please check your API key and connection."
    });
  }
});

app.listen(PORT, () => {
  console.log(`AR-Core API (Gemini) running at http://localhost:${PORT}`);
  console.log(`Model: ${GEMINI_MODEL}`);
});
