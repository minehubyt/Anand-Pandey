
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeLegalQuery = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this legal query and categorize it into a practice area and urgency level.
      Query: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPracticeArea: { type: Type.STRING },
            urgency: { type: Type.STRING, description: "Low, Medium, or High" },
            briefAdvice: { type: Type.STRING, description: "One sentence of general guidance" }
          },
          required: ["suggestedPracticeArea", "urgency", "briefAdvice"]
        }
      }
    });

    // response.text is a getter property, using it to extract JSON
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error analyzing query:", error);
    return null;
  }
};