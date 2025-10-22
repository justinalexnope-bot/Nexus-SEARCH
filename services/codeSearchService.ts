import { GoogleGenAI, Type } from "@google/genai";
import { CodeResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Code search will not work.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const codeResultSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'A unique identifier for the code snippet.' },
    repository: { type: Type.STRING, description: 'A plausible fictional repository name where this code might exist (e.g., "openai/gpt-3" or "torvalds/linux").' },
    filePath: { type: Type.STRING, description: 'A plausible fictional file path for the code snippet.' },
    language: { type: Type.STRING, description: 'The programming language of the code snippet (e.g., "Python", "JavaScript").' },
    url: { type: Type.STRING, description: 'A placeholder URL, should be "#".' },
    codeSnippet: { type: Type.STRING, description: 'The generated code snippet, which should be concise and relevant to the query.' },
  },
  required: ['id', 'repository', 'filePath', 'language', 'url', 'codeSnippet']
};

export const fetchCodeResults = async (query: string): Promise<CodeResult[]> => {
  if (!API_KEY) {
    return [];
  }
  
  console.log(`Generating code results for: "${query}"`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `You are a code search engine. Generate 2 relevant but distinct code examples for the query: "${query}". Provide plausible metadata for each.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: codeResultSchema,
        },
        temperature: 0.3,
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as CodeResult[];

  } catch (error) {
    console.error("Error fetching code search results from Gemini:", error);
    throw new Error("Failed to fetch code search results.");
  }
};