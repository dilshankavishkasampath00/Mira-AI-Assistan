// Get API key from environment
const getAPIKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    console.error('VITE_GEMINI_API_KEY is not set');
  }
  return key || '';
};

export const chatWithGemini = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  try {
    if (!prompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    const API_KEY = getAPIKey();
    if (!API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY is not configured. Please set it in your environment variables.');
    }

    // Format history for API
    const contents = history.length > 0 
      ? [...history.map(h => ({
          role: h.role,
          parts: h.parts,
        })), {
          role: 'user',
          parts: [{ text: prompt }],
        }]
      : [{ role: 'user', parts: [{ text: prompt }] }];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          system_instruction: "You are Mira, a helpful, friendly, and sophisticated AI personal assistant. Your tone is elegant and concise.",
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`API error: ${error.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response text received from Gemini');
    }
    
    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini error: ${error.message}`);
    }
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const API_KEY = getAPIKey();
    if (!API_KEY) {
      throw new Error('VITE_GEMINI_API_KEY is not configured.');
    }
    
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Generate an image: ${prompt}` }],
          }],
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`API error: ${error.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
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
