
// @ts-ignore
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@^0.16.0";

// Get API key from environment or window
const getAPIKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    console.error('VITE_GEMINI_API_KEY is not set');
  }
  return key || '';
};

const getAIClient = () => {
  const apiKey = getAPIKey();
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured. Please set it in your environment variables.');
  }
  try {
    return new GoogleGenerativeAI({ apiKey });
  } catch (error) {
    console.error('Failed to initialize GoogleGenerativeAI:', error);
    throw error;
  }
};

export const chatWithGemini = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  try {
    if (!prompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    const client = getAIClient();
    const model = client.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: "You are Mira, a helpful, friendly, and sophisticated AI personal assistant. Your tone is elegant and concise.",
    });

    // Format history properly
    const formattedHistory = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: Array.isArray(h.parts) ? h.parts : [{ text: String(h.parts) }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No response text received from Gemini');
    }
    
    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    // Return a helpful error message to the user
    if (error instanceof Error) {
      throw new Error(`Gemini error: ${error.message}`);
    }
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const client = getAIClient();
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const result = await model.generateContent({
      contents: [{
        parts: [{ text: `Generate an image: ${prompt}` }],
      }],
    });

    const response = await result.response;
    const text = response.text();
    
    // For actual image generation, you would need to use a dedicated image model
    // or handle the response appropriately
    console.log('Image generation result:', text);
    return null;
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
};

// Encoding/Decoding for Live API
export const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encodeBase64 = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
