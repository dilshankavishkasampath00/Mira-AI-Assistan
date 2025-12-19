
import React from 'react';
import { Search, Mic, MessageSquare, FileText, ImageIcon, ChevronRight, ArrowUpRight } from 'lucide-react';
import { View, HistoryItem } from '../types';

interface HomeViewProps {
  onNavigate: (view: View) => void;
  history: HistoryItem[];
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, history }) => {
  const quickActions = [
    { id: View.CHAT, title: 'Chat Assistant', icon: MessageSquare, color: 'bg-indigo-50 dark:bg-zinc-900', iconColor: 'text-indigo-600' },
    { id: View.CHAT, title: 'Create AI Task', icon: FileText, color: 'bg-slate-50 dark:bg-zinc-900', iconColor: 'text-slate-600 dark:text-zinc-400' },
    { id: View.IMAGE_GEN, title: 'Image Generator', icon: ImageIcon, color: 'bg-slate-50 dark:bg-zinc-900', iconColor: 'text-slate-600 dark:text-zinc-400' },
    { id: View.VOICE, title: 'Voice Input', icon: Mic, color: 'bg-slate-50 dark:bg-zinc-900', iconColor: 'text-slate-600 dark:text-zinc-400' },
  ];

  return (
    <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero */}
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Hello, I'm Mira 👋
        </h1>
        <p className="text-slate-500 dark:text-zinc-500 leading-relaxed text-sm">
          Your personal assistant AI to chat, create, and organize.
        </p>
      </section>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Ask Mira anything..." 
          className="w-full h-14 pl-12 pr-14 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          onKeyDown={(e) => {
            if (e.key === 'Enter') onNavigate(View.CHAT);
          }}
        />
        <button 
          onClick={() => onNavigate(View.VOICE)}
          className="absolute inset-y-2 right-2 px-3 rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-none hover:bg-indigo-600 transition-colors"
        >
          <Mic size={20} />
        </button>
      </div>

      {/* Grid Actions */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onNavigate(action.id)}
            className={`${action.color} p-6 rounded-[2rem] flex flex-col items-start text-left gap-4 group relative transition-transform hover:scale-[1.02] active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 shadow-sm`}
          >
            <div className={`p-3 rounded-xl bg-white dark:bg-zinc-800 ${action.iconColor} shadow-sm`}>
              <action.icon size={24} />
            </div>
            <span className="font-semibold text-sm leading-tight max-w-[80px]">
              {action.title}
            </span>
            <div className="absolute top-4 right-4 text-slate-300 dark:text-zinc-700">
              <ArrowUpRight size={20} />
            </div>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Recent Chat</h2>
        </div>
        <div className="space-y-2">
          {history.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              onClick={() => onNavigate(View.CHAT)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-500">
                  <MessageSquare size={18} />
                </div>
                <span className="font-medium text-sm">{item.title}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 dark:text-zinc-700" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
