import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function test() {
  console.log("Testing Gemini API Key with gemini-2.5-flash...");
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    console.log("Success! Response:", response.text());
  } catch (error) {
    console.error("Gemini Test Failed!");
    console.error("Error Message:", error.message);
  }
}

test();
