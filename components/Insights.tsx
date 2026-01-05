
import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { Insight } from '../types';
import { RefreshCw } from 'lucide-react';

interface InsightsProps {
  onInsightClick: (id: string, title: string) => void;
}

const Insights: React.FC<InsightsProps> = ({ onInsightClick }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = contentService.subscribeInsights((data) => {
      setInsights(data.slice(0, 3)); // Only show top 3 on home
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="insights" className="py-16 md:py-20 bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        <div className="flex justify-between items-end mb-12 animate-reveal-up">
          <div>
            <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#CC1414] mb-4">THOUGHT LEADERSHIP</h2>
            <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-serif text-slate-900 leading-tight">Expert Briefings</h3>
          </div>
          <button className="hidden md:block text-[9px] font-bold tracking-[0.3em] uppercase text-slate-400 border-b border-slate-200 pb-1 hover:text-[#CC1414] hover:border-[#CC1414] transition-all">
            EXPLORE ALL THINKING
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12"><RefreshCw className="w-7 h-7 animate-spin text-slate-200" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 xl:gap-16">
            {insights.map((item, idx) => (
              <div 
                key={item.id} 
                className={`group cursor-pointer animate-reveal-up stagger-${idx + 1}`} 
                onClick={() => onInsightClick(item.id, item.title)}
              >
                <div className="aspect-[16/10] overflow-hidden mb-6 relative bg-slate-200 shadow-sm">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2.5s] ease-out"
                  />
                  <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-1000"></div>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-[#CC1414]">{item.category}</span>
                  <span className="w-3 h-px bg-slate-200"></span>
                  <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-slate-400">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                <h3 className="text-lg font-serif text-slate-900 leading-snug group-hover:text-[#CC1414] transition-colors duration-500 mb-4 line-clamp-2">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-2 text-[8px] font-bold tracking-[0.3em] uppercase text-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-1 group-hover:translate-y-0">
                  <span>READ FULL ANALYSIS</span>
                  <div className="w-5 h-px bg-[#CC1414]"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Insights;
