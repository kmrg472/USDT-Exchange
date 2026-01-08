
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedSite } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSiteContent(prompt: string): Promise<GeneratedSite> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a professional website content structure for: ${prompt}. Focus on making it suitable for a high-converting landing page.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            siteName: { type: Type.STRING },
            heroHeadline: { type: Type.STRING },
            heroSubheadline: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  body: { type: Type.STRING }
                },
                required: ["id", "title", "body"]
              }
            },
            footerNote: { type: Type.STRING }
          },
          required: ["siteName", "heroHeadline", "heroSubheadline", "sections", "footerNote"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return result as GeneratedSite;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
