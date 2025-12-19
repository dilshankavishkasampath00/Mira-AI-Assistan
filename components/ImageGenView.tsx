
import React, { useState } from 'react';
import { ImageIcon, Send, Loader2, Download, RefreshCw } from 'lucide-react';
import { generateImage } from '../geminiService';

interface ImageGenViewProps {
  onInteraction: (text: string) => void;
}

const ImageGenView: React.FC<ImageGenViewProps> = ({ onInteraction }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const imageUrl = await generateImage(prompt);
      if (!imageUrl) {
        setError('Failed to generate image. Please try again.');
      } else {
        setResult(imageUrl);
        onInteraction(`Generated: ${prompt.substring(0, 15)}...`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-4 animate-in fade-in duration-500">
      <section className="space-y-1">
        <h2 className="text-2xl font-bold">Image Generator</h2>
        <p className="text-slate-500 dark:text-zinc-500 text-sm">Create visuals from text descriptions.</p>
      </section>

      <div className="aspect-square w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-indigo-500" size={40} />
            <p className="text-sm font-medium animate-pulse">Designing your masterpiece...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 text-red-500">
            <p className="text-sm text-center px-12 font-medium">{error}</p>
            <button 
              onClick={handleGenerate}
              className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : result ? (
          <>
            <img src={result} alt="Generated" className="w-full h-full object-cover animate-in zoom-in-95 duration-500" />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <a 
                href={result} 
                download="mira-gen.png"
                className="p-3 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-lg text-slate-700 dark:text-white hover:scale-110 transition-transform"
              >
                <Download size={20} />
              </a>
              <button 
                onClick={handleGenerate}
                className="p-3 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-lg text-indigo-600 hover:scale-110 transition-transform"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-slate-300 dark:text-zinc-700">
            <ImageIcon size={64} strokeWidth={1} />
            <p className="text-sm text-center px-12">Describe what you want to see and Mira will generate it for you.</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A surreal landscape with floating islands and neon waterfalls..."
            className="w-full min-h-[100px] p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400 dark:placeholder:text-zinc-600"
          />
          <button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
            className="absolute bottom-4 right-4 p-4 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-200 dark:shadow-none disabled:opacity-50 hover:bg-indigo-600 active:scale-95 transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['Cyberpunk', 'Realistic', 'Oil Painting', 'Minimalist', '3D Render'].map(style => (
            <button 
              key={style}
              onClick={() => setPrompt(prev => prev + ' ' + style)}
              className="px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:border-indigo-500 transition-colors"
            >
              + {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGenView;
