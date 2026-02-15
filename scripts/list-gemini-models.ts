import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const result = await genAI.listModels();
    console.log("Available models:");
    result.models.forEach((m) => {
      console.log(`- ${m.name} (${m.displayName})`);
      console.log(
        `  Supported methods: ${m.supportedGenerationMethods.join(", ")}`,
      );
    });
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
