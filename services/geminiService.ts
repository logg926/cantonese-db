import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

export interface GroundingResult {
  text: string;
  urls: { title: string; uri: string }[];
}

export const searchComposerInfo = async (query: string): Promise<GroundingResult> => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a concise, professional summary about: "${query}". Focus on their musical style, notable works, and contribution to Cantonese or choral music if applicable. Keep it under 200 words.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No information found.";
    
    // Extract grounding chunks/URLs
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, uri: web.uri }));

    // Remove duplicates based on URI
    const uniqueUrls = Array.from(new Map(urls.map((item: any) => [item.uri, item])).values()) as { title: string; uri: string }[];

    return {
      text,
      urls: uniqueUrls,
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return {
      text: "Sorry, I couldn't retrieve information at this time.",
      urls: [],
    };
  }
};
