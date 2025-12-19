
import React, { useState, useEffect } from 'react';
import { View, ChatMessage, HistoryItem } from './types';
import HomeView from './components/HomeView';
import ChatView from './components/ChatView';
import VoiceView from './components/VoiceView';
import HistoryView from './components/HistoryView';
import ImageGenView from './components/ImageGenView';
import BottomNav from './components/BottomNav';
import { Sparkles, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: '1', title: 'Weekend Gateway', type: 'chat', timestamp: Date.now() }
  ]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addToHistory = (title: string, type: 'chat' | 'image' | 'voice') => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      type,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <HomeView onNavigate={setCurrentView} history={history} />;
      case View.CHAT:
        return <ChatView onInteraction={(t) => addToHistory(t, 'chat')} />;
      case View.VOICE:
        return <VoiceView onInteraction={(t) => addToHistory(t, 'voice')} />;
      case View.HISTORY:
        return <HistoryView history={history} />;
      case View.IMAGE_GEN:
        return <ImageGenView onInteraction={(t) => addToHistory(t, 'image')} />;
      default:
        return <HomeView onNavigate={setCurrentView} history={history} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 overflow-hidden shadow-2xl transition-colors duration-500">
      {/* Top Header Bar */}
      <header className="px-6 pt-6 pb-2 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800 shadow-sm">
            <img src="https://picsum.photos/seed/user123/100" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="font-medium text-slate-600 dark:text-slate-400">Hi, Babson</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 shadow-sm border border-slate-100 dark:border-zinc-800"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-200 dark:shadow-none">
            Get Plus <Sparkles size={14} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-24">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default App;
