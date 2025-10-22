import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateGroundedSummary(query: string): Promise<string> {
  if (!API_KEY) {
    return "AI features are disabled because the API key is missing.";
  }
  
  if (!query) {
    return "Cannot generate a summary for an empty query.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a concise, helpful summary for the user's search query: "${query}". The summary should synthesize information based on your general knowledge to answer the user's likely intent. Do not mention that you are not searching the web.`,
      config: {
        temperature: 0.2,
        topP: 0.9,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API (Summary):", error);
    throw new Error("Failed to generate AI summary.");
  }
}

export async function generateDeepDiveSummary(query: string): Promise<string> {
  if (!API_KEY) {
    return "AI features are disabled because the API key is missing.";
  }
  
  if (!query) {
    return "Cannot generate a summary for an empty query.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Perform a deep, comprehensive analysis of the following topic: "${query}". Provide a detailed, well-structured explanation that covers key aspects, nuances, and implications. Assume the user is looking for more than just a surface-level answer.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        temperature: 0.5,
        topP: 0.9,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API (Deep Dive Summary):", error);
    throw new Error("Failed to generate Deep Dive summary.");
  }
}
