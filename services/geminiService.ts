
import { GoogleGenAI, Type } from "@google/genai";

// Standard way to access env variables in a built Vite app on Vercel
const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

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
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error analyzing query:", error);
    return null;
  }
};

export const parseResume = async (resumeText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract detailed personal and professional information from this resume text. 
      Return the data in a structured JSON format.
      Resume Text: "${resumeText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            mobile: { type: Type.STRING },
            education: { type: Type.STRING },
            experience: { type: Type.STRING },
            interests: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Resume Parsing failed:", error);
    return null;
  }
};
