
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  generateSecretAdmirerNote: async (targetName: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a mysterious, polite, and slightly poetic secret admirer note for someone named ${targetName}. Keep it short (under 50 words) and classic MySpace vibes.`,
      });
      return response.text || "I've been watching your profile from afar... you're amazing!";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "You have a new secret admirer! They think you're pretty cool.";
    }
  },

  generateBlogPrompt: async (topic: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Give me 3 creative and funny blog post titles about ${topic} for a retro social media platform.`,
      });
      return response.text || "1. My thoughts on this! 2. Why this matters 3. A cool story";
    } catch (error) {
      return "1. Life update! 2. Check this out 3. Random thoughts";
    }
  }
};
