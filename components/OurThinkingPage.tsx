
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Mic, FileText, Sparkles, Download, Play, ArrowRight, Search, RefreshCw, Calendar } from 'lucide-react';
import { contentService } from '../services/contentService';
import { Insight, Event } from '../types';

interface OurThinkingPageProps {
  onBack: () => void;
  onInsightClick: (id: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Content', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'insights', label: 'Insights', icon: <FileText className="w-4 h-4" /> },
  { id: 'reports', label: 'Reports', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'podcasts', label: 'Podcasts', icon: <Mic className="w-4 h-4" /> },
  { id: 'events', label: 'Firm Events', icon: <Calendar className="w-4 h-4" /> },
  { id: 'articles', label: 'Articles', icon: <FileText className="w-4 h-4" /> },
];

const OurThinkingPage: React.FC<OurThinkingPageProps> = ({ onBack, onInsightClick }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [contentItems, setContentItems] = useState<Insight[]>([]);
  const [eventItems, setEventItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubInsights = contentService.subscribeInsights((data) => {
      setContentItems(data);
    });
    const unsubEvents = contentService.subscribeEvents((data) => {
      setEventItems(data);
      setLoading(false);
    });
    return () => { unsubInsights(); unsubEvents(); };
  }, []);

  // Prepare normalized list of all "thinking" items
  const normalizedEvents = eventItems.map(ev => ({
    id: ev.id,
    type: 'events' as const,
    category: 'Firm Event',
    title: ev.title,
    date: ev.date,
    desc: ev.desc,
    image: ev.image
  }));

  const allThinking = [...contentItems, ...normalizedEvents].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredItems = activeTab === 'all' 
    ? allThinking 
    : allThinking.filter(item => item.type === activeTab);

  return (
    <div className="pt-24 lg:pt-32 pb-32 animate-fade-in bg-white min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="animate-fade-in-up">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-[#CC1414] transition-colors mb-12"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO CHAMBERS</span>
            </button>
            <h1 className="text-5xl lg:text-7xl font-serif text-slate-900 leading-[1.05] mb-6">
              Our Thinking
            </h1>
            <p className="text-xl text-slate-500 font-light max-w-2xl leading-relaxed">
              Proprietary research, strategic analysis, and expert dialogues at the intersection of law, business, and policy.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group animate-fade-in-up delay-100">
             <input 
               type="text" 
               placeholder="Search our analysis..." 
               className="w-full border-b border-slate-200 py-3 pl-0 pr-10 focus:outline-none focus:border-[#CC1414] transition-colors font-light text-slate-900 bg-transparent"
             />
             <Search className="absolute right-0 top-3 w-5 h-5 text-slate-400 group-focus-within:text-[#CC1414] transition-colors" />
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-8 border-b border-slate-100 mb-16 overflow-x-auto pb-px no-scrollbar animate-fade-in-up delay-200">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === cat.id 
                  ? 'border-[#CC1414] text-[#CC1414]' 
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="hidden md:inline">{cat.icon}</span>
              <span className="text-xs font-bold tracking-widest uppercase">{cat.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><RefreshCw className="animate-spin text-slate-200 w-12 h-12" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {filteredItems.map((item, idx) => (
              <div 
                key={item.id} 
                className="group cursor-pointer flex flex-col h-full animate-fade-in-up" 
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => onInsightClick(item.id)}
              >
                <div className="aspect-[16/10] overflow-hidden mb-8 relative shadow-sm bg-slate-100">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s] ease-out"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    {item.type === 'podcasts' && (
                      <div className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                         <Play className="w-4 h-4 fill-white" />
                      </div>
                    )}
                    {(item.type === 'reports' || item.type === 'events') && (
                      <div className={`w-10 h-10 ${item.type === 'events' ? 'bg-indigo-600' : 'bg-[#CC1414]'} rounded-full flex items-center justify-center text-white shadow-lg`}>
                         {item.type === 'events' ? <Calendar className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-6">
                   <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#CC1414] border border-[#CC1414]/20 px-3 py-1">
                     {item.category}
                   </span>
                   <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                     {item.date}
                   </span>
                </div>

                <h3 className="text-2xl font-serif text-slate-900 leading-tight mb-4 group-hover:text-[#CC1414] transition-colors flex-grow">
                  {item.title}
                </h3>
                
                <p className="text-slate-500 font-light text-sm leading-relaxed mb-8 line-clamp-3">
                  {item.desc}
                </p>

                <div className="mt-auto flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] uppercase text-slate-900 group-hover:text-[#CC1414] transition-colors">
                  <span>
                    {item.type === 'podcasts' ? 'LISTEN NOW' : item.type === 'reports' ? 'DOWNLOAD PDF' : item.type === 'events' ? 'EVENT DETAILS' : 'READ FULL ANALYSIS'}
                  </span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurThinkingPage;
