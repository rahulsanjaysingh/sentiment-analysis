
import { GoogleGenAI, Type } from "@google/genai";
import { SentimentResult } from "../types";

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  if (!text.trim()) {
    return { error: "No text provided" } as any;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the sentiment of the following text: "${text}"`,
    config: {
      systemInstruction: "You are an advanced Sentiment Analysis Engine. Analyze the input text and return a precise JSON object. Ensure all scores are numbers, not strings. Detect sarcasm, emotional tone, and provide a sentence-level breakdown.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overall_sentiment: {
            type: Type.STRING,
            description: "Positive, Negative, Neutral, or Mixed",
          },
          confidence_score: {
            type: Type.NUMBER,
            description: "A percentage from 0 to 100",
          },
          sentiment_score: {
            type: Type.NUMBER,
            description: "A score from -1 to +1",
          },
          emotional_tone: {
            type: Type.STRING,
            description: "Description of the emotional tone",
          },
          sarcasm_detected: {
            type: Type.BOOLEAN,
          },
          sentence_analysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sentence: { type: Type.STRING },
                sentiment: { type: Type.STRING },
                sentiment_score: { type: Type.NUMBER },
                emotional_tone: { type: Type.STRING },
              },
              required: ["sentence", "sentiment", "sentiment_score", "emotional_tone"],
            },
          },
          key_emotional_words: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          "overall_sentiment",
          "confidence_score",
          "sentiment_score",
          "emotional_tone",
          "sarcasm_detected",
          "sentence_analysis",
          "key_emotional_words"
        ],
      },
    },
  });

  try {
    const result = JSON.parse(response.text);
    return result as SentimentResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response format from engine");
  }
};
