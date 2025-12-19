
import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithGemini } from '../geminiService';

interface ChatViewProps {
  onInteraction: (text: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ onInteraction }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hello! I'm Mira. How can I assist you today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithGemini(input, messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })));
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || "I'm sorry, I couldn't generate a response.",
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      onInteraction(input.length > 20 ? input.substring(0, 20) + '...' : input);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your message.';
      console.error('Chat error:', error);
      
      const errorAiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] -mx-6 px-6 pt-2">
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-500 text-white rounded-tr-none' 
                : 'bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-2xl rounded-tl-none flex gap-2">
              <Loader2 className="animate-spin text-indigo-500" size={18} />
              <span className="text-xs text-slate-500 dark:text-zinc-500">Mira is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 pb-2">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="w-full h-14 pl-6 pr-14 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute inset-y-2 right-2 px-3 rounded-xl bg-indigo-500 text-white shadow-md disabled:opacity-50 transition-all hover:bg-indigo-600 active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
