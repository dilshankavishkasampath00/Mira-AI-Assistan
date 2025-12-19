
import React from 'react';
import { HistoryItem } from '../types';
import { MessageSquare, ImageIcon, Mic, Calendar, Trash2 } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const getIcon = (type: HistoryItem['type']) => {
    switch (type) {
      case 'chat': return <MessageSquare size={18} />;
      case 'image': return <ImageIcon size={18} />;
      case 'voice': return <Mic size={18} />;
      default: return <MessageSquare size={18} />;
    }
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true 
    }).format(new Date(ts));
  };

  return (
    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">History</h2>
        <button className="text-slate-400 dark:text-zinc-600 hover:text-red-500 transition-colors">
          <Trash2 size={20} />
        </button>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300 dark:text-zinc-800">
          <Calendar size={64} strokeWidth={1} />
          <p className="mt-4 text-sm">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div 
              key={item.id}
              className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-indigo-100 dark:hover:border-indigo-900/40 transition-all"
            >
              <div className={`p-3 rounded-xl flex items-center justify-center ${
                item.type === 'image' ? 'bg-purple-50 text-purple-500' :
                item.type === 'voice' ? 'bg-amber-50 text-amber-500' :
                'bg-indigo-50 text-indigo-500'
              } dark:bg-zinc-800`}>
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-0.5">{formatDate(item.timestamp)}</p>
              </div>
              <div className="text-slate-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                <Calendar size={16} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
