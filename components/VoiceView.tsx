
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Circle } from 'lucide-react';

interface VoiceViewProps {
  onInteraction: (text: string) => void;
}

const VoiceView: React.FC<VoiceViewProps> = ({ onInteraction }) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState([4, 6, 8, 5, 7]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setVolume(prev => prev.map(() => Math.floor(Math.random() * 10) + 2));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setVolume([2, 2, 2, 2, 2]);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const toggleVoice = () => {
    if (!isActive) {
      setIsActive(true);
      setIsListening(true);
      onInteraction('Voice session started');
    } else {
      setIsActive(false);
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">
          {isActive ? (isListening ? "Listening..." : "Mira Speaking...") : "Voice Mode"}
        </h2>
        <p className="text-slate-500 dark:text-zinc-500 max-w-[240px] mx-auto text-sm leading-relaxed">
          {isActive ? "Go ahead, I'm here to help you with anything." : "Tap the button below to start a voice conversation with Mira."}
        </p>
      </div>

      <div className="relative flex items-center justify-center h-64 w-64">
        {/* Animated Rings */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping duration-[2000ms]" />
            <div className="absolute inset-4 rounded-full bg-indigo-500/20 animate-ping duration-[3000ms]" />
          </>
        )}
        
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${
          isActive ? 'bg-indigo-500 shadow-2xl shadow-indigo-300' : 'bg-slate-100 dark:bg-zinc-900'
        }`}>
          {isActive ? (
            <div className="flex items-end gap-1.5 h-16">
              {volume.map((v, i) => (
                <div 
                  key={i} 
                  className="w-2.5 bg-white rounded-full transition-all duration-100"
                  style={{ height: `${v * 10}%` }}
                />
              ))}
            </div>
          ) : (
            <Mic size={64} className="text-slate-300 dark:text-zinc-700" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleVoice}
          className={`p-6 rounded-3xl transition-all shadow-xl active:scale-90 ${
            isActive 
              ? 'bg-red-50 text-red-500 hover:bg-red-100' 
              : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
        >
          {isActive ? <MicOff size={32} /> : <Mic size={32} />}
        </button>
        
        {isActive && (
          <button className="p-6 rounded-3xl bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 shadow-lg border border-slate-100 dark:border-zinc-800">
            <Volume2 size={32} />
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceView;
