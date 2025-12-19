
import React from 'react';
import { Home, MessageSquare, Mic, Clock } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { view: View.HOME, label: 'Home', icon: Home },
    { view: View.CHAT, label: 'Chat', icon: MessageSquare },
    { view: View.VOICE, label: 'Voice', icon: Mic },
    { view: View.HISTORY, label: 'History', icon: Clock },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-slate-100 dark:border-zinc-800 flex items-center justify-around px-6 z-20">
      {navItems.map((item) => {
        const isActive = currentView === item.view || (item.view === View.CHAT && currentView === View.IMAGE_GEN);
        const Icon = item.icon;
        
        return (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/40' : ''}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
            {isActive && <div className="w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-0.5" />}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
