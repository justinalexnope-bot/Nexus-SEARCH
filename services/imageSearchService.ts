import { GoogleGenAI } from "@google/genai";
import { ImageResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Image generation will not work.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchImageResults = async (query: string, page: number = 1): Promise<ImageResult[]> => {
  if (!API_KEY) {
    return [];
  }

  console.log(`Generating images for: "${query}", page: ${page}`);
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `A vibrant, high-quality photograph related to: ${query}. Style variation ${page}.`,
      config: {
        numberOfImages: 4,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    return response.generatedImages.map((img, index) => {
      const base64Image = img.image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      return {
        id: `${query.replace(/\s+/g, '-')}-${page}-${index}`,
        url: imageUrl,
        thumbnailUrl: imageUrl,
        alt: `AI-generated image for ${query} - page ${page} - ${index + 1}`,
        isExplicit: false,
      };
    });
  } catch (error) {
    console.error("Error generating images with Imagen:", error);
    throw new Error("Failed to generate image results.");
  }
};