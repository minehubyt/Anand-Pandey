
import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { HeroContent } from '../types';

const Hero: React.FC = () => {
  const [content, setContent] = useState<HeroContent | null>(null);

  useEffect(() => {
    // Real-time subscription to cloud hero config
    const unsubscribe = contentService.subscribeHero((data) => {
      setContent(data);
    });
    return () => unsubscribe();
  }, []);

  if (!content) return <div className="min-h-[95vh] bg-slate-900 animate-pulse"></div>;

  return (
    <div className="relative min-h-[95vh] w-full flex items-center overflow-hidden bg-slate-900">
      {/* Background Image with Cinematic Scale Out */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={content.backgroundImage}
          alt="Strategy Visual"
          className="w-full h-full object-cover object-center brightness-[0.6] animate-scale-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32 w-full pt-48 pb-32">
        <div className="max-w-4xl">
          <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/60 mb-8 font-sans animate-reveal-up stagger-1">
            ON-DEMAND STRATEGIC BRIEFING
          </p>
          <div className="overflow-hidden mb-12">
            <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-medium text-white leading-[1.05] font-sans tracking-tight animate-reveal-up stagger-2">
              {content.headline}
            </h1>
          </div>
          <p className="text-[clamp(18px,1.8vw,24px)] text-white/80 mb-16 leading-relaxed font-light max-w-3xl font-sans animate-reveal-up stagger-3">
            {content.subtext}
          </p>
          <div className="flex items-center animate-reveal-up stagger-4">
            <a
              href="#appointments"
              className="group relative flex items-center gap-4 text-[13px] font-bold tracking-[0.3em] uppercase text-white py-2"
            >
              <span className="relative z-10">{content.ctaText}</span>
              <div className="w-12 h-px bg-[#CC1414] group-hover:w-20 transition-all duration-700"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#CC1414] group-hover:w-full transition-all duration-700 delay-100"></div>
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-16 right-16 hidden lg:block animate-reveal-left stagger-4">
        <div className="flex flex-col items-end space-y-4">
          <div className="w-24 h-px bg-white/20"></div>
          <span className="text-[10px] font-bold tracking-[0.5em] text-white/40 uppercase">EXCELLENCE REDEFINED</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
