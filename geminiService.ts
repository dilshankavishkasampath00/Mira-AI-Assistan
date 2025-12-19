// Get API key from environment
const getAPIKey = () => {
  // Using aimlapi.com key
  const key = '73d53e839d7e4ec59b1d5167df30aaa1';
  if (!key) {
    console.error('API_KEY is not set');
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
      throw new Error('API_KEY is not configured.');
    }

    // Build message array for aimlapi.com
    const messages = history.length > 0
      ? [...history.map(h => ({
          role: h.role === 'model' ? 'assistant' : 'user',
          content: h.parts.map(p => p.text).join(''),
        })), {
          role: 'user',
          content: prompt,
        }]
      : [{ role: 'user', content: prompt }];

    const res = await fetch(
      `https://api.aimlapi.com/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages,
          system: "You are Mira, a helpful, friendly, and sophisticated AI personal assistant. Your tone is elegant and concise.",
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`API error: ${error.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    
    if (!text) {
      throw new Error('No response text received from API');
    }
    
    return text;
  } catch (error) {
    console.error('API error:', error);
    if (error instanceof Error) {
      throw new Error(`API error: ${error.message}`);
    }
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const API_KEY = getAPIKey();
    if (!API_KEY) {
      throw new Error('API_KEY is not configured.');
    }
    
    const res = await fetch(
      `https://api.aimlapi.com/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [{
            role: 'user',
            content: `Generate an image: ${prompt}`,
          }],
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`API error: ${error.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content;
    
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
