import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Note: Listing models is not directly supported in the SDK,
// but we can test a few common names.
const testModels = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-pro"];

for (const modelName of testModels) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say test");
    console.log(`✅ ${modelName} works`);
  } catch (e) {
    console.log(`❌ ${modelName} failed: ${e.message}`);
  }
}
