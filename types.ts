
export enum View {
  HOME = 'HOME',
  CHAT = 'CHAT',
  VOICE = 'VOICE',
  HISTORY = 'HISTORY',
  IMAGE_GEN = 'IMAGE_GEN'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  type: 'chat' | 'image' | 'voice';
  timestamp: number;
}
