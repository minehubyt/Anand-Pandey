
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { contentService } from '../services/contentService';
import { Insight } from '../types';

interface NewsCarouselProps {
  onInsightClick: (id: string) => void;
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ onInsightClick }) => {
  const [newsItems, setNewsItems] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const transitionRef = useRef<boolean>(true);

  useEffect(() => {
    const unsubscribe = contentService.subscribeFeaturedInsights((data) => {
      if (data.length > 0) {
        setNewsItems(data);
        setCurrentIndex(data.length); // Start at the first item of the second set for seamless loop
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-[450px] flex items-center justify-center bg-slate-50"><RefreshCw className="animate-spin text-slate-200" /></div>;
  if (newsItems.length === 0) return null;

  const extendedItems = [...newsItems, ...newsItems, ...newsItems];
  const slideWidth = 75;
  const sideOffset = (100 - slideWidth) / 2;

  const nextSlide = () => {
    if (!transitionRef.current) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (!transitionRef.current) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= newsItems.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - newsItems.length);
    } else if (currentIndex < newsItems.length) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + newsItems.length);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="relative w-full">
        {/* Nav Buttons */}
        <div className="absolute inset-y-0 left-0 lg:left-8 z-30 flex items-center">
          <button onClick={prevSlide} className="p-4 text-white/40 hover:text-white transition-colors bg-black/10 hover:bg-black/30 rounded-full ml-4 backdrop-blur-sm">
            <ChevronLeft className="w-8 h-8 lg:w-12 lg:h-12 stroke-[1.5]" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 lg:right-8 z-30 flex items-center">
          <button onClick={nextSlide} className="p-4 text-white/40 hover:text-white transition-colors bg-black/10 hover:bg-black/30 rounded-full mr-4 backdrop-blur-sm">
            <ChevronRight className="w-8 h-8 lg:w-12 lg:h-12 stroke-[1.5]" />
          </button>
        </div>

        <div 
          className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]' : ''}`}
          onTransitionEnd={handleTransitionEnd}
          style={{ transform: `translateX(calc(${sideOffset}% - ${currentIndex * slideWidth}%))` }}
        >
          {extendedItems.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <div key={index} className={`flex-none w-[90%] md:w-[75%] px-2 lg:px-4 transition-all duration-700 ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}>
                <div className={`relative w-full aspect-[16/7] min-h-[350px] lg:min-h-[450px] ${item.featuredColor || 'bg-[#0A1931]'} flex items-center shadow-xl overflow-hidden group rounded-sm`}>
                  <img 
                    src={item.bannerImage || item.image} 
                    className={`absolute inset-0 w-full h-full object-cover grayscale mix-blend-overlay transition-all duration-[3s] ${isActive ? 'opacity-50 group-hover:scale-110' : 'opacity-20'}`}
                    alt={item.title}
                  />
                  <div className={`relative z-10 px-8 lg:px-20 max-w-4xl text-white transition-all duration-700 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <p className="text-[10px] lg:text-[12px] font-bold tracking-[0.3em] uppercase mb-4 lg:mb-8 text-white/90">{item.category}</p>
                    <h2 className="text-2xl lg:text-5xl font-serif mb-8 lg:mb-12 leading-[1.15]">{item.title}</h2>
                    <button onClick={() => onInsightClick(item.id)} className="text-[11px] lg:text-[13px] font-bold tracking-[0.2em] uppercase border-b-[3px] border-white pb-1.5 inline-block hover:text-[#CC1414] hover:border-[#CC1414] transition-all">
                      READ MORE
                    </button>
                  </div>
                  {!isActive && <div className="absolute inset-0 bg-black/60 z-20"></div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center space-x-3 mt-12">
          {newsItems.map((_, index) => {
            const normalizedIndex = currentIndex % newsItems.length;
            const isDotActive = normalizedIndex === index;
            return (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(index + newsItems.length);
                }}
                className={`h-1.5 transition-all duration-300 rounded-full ${isDotActive ? 'bg-black w-10' : 'bg-slate-300 w-3'}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewsCarousel;
