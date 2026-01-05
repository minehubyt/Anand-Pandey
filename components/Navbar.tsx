
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, Globe, User } from 'lucide-react';
import MegaMenu from './MegaMenu';

interface NavbarProps {
  onNavigate: (type: 'home' | 'insight' | 'page' | 'rfp' | 'thinking' | 'practice' | 'login', id?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navLinks = [
    { name: 'What we Do', href: '#services', type: 'home' },
    { name: 'Who we Are', href: '#about', type: 'home' },
    { name: 'Our Thinking', href: '#insights', type: 'thinking' },
    { name: 'Career', href: '#careers', type: 'home' },
    { name: 'Offices', href: '#locations', type: 'home' },
    { name: 'Connect', href: '#appointments', type: 'home' }
  ];

  // Close menu on navigation
  const handleNavClick = (link: any) => {
    setIsOpen(false);
    setActiveMenu(null);
    if (link.type === 'thinking') {
      onNavigate('thinking');
    } else {
      onNavigate('home');
      if (link.href.startsWith('#')) {
        setTimeout(() => {
          const target = document.querySelector(link.href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const toggleMenu = (name: string, link: any) => {
    if (activeMenu === name) {
      setActiveMenu(null);
    } else {
      // Links that have sub-menus (MegaMenu)
      const hasSubMenu = ['What we Do', 'Who we Are', 'Our Thinking', 'Career', 'Offices', 'Connect'].includes(name);
      if (hasSubMenu) {
        setActiveMenu(name);
      } else {
        handleNavClick(link);
      }
    }
  };

  return (
    <nav 
      className="fixed top-0 w-full z-50 transition-all duration-300 bg-white border-b border-slate-200 py-3 md:py-4 shadow-sm"
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-12 lg:h-16">
          
          <div className="flex items-center min-w-0 flex-shrink-0">
            <button 
              className="mr-4 p-2 -ml-2 text-slate-900 focus:outline-none transition-colors group" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 transition-transform" />}
            </button>
            
            <button onClick={() => onNavigate('home')} className="flex items-center overflow-hidden group">
              <div className="flex items-center font-sans uppercase tracking-[0.18em] text-[#A6192E] font-medium transition-opacity">
                <span className="text-[14px] sm:text-[16px] md:text-[20px] lg:text-[23px] leading-none font-medium">AK PANDEY</span>
                <span className="text-[9px] sm:text-[10px] md:text-[12px] lg:text-[14px] mx-1 md:mx-1.5 self-center">&</span>
                <span className="text-[14px] sm:text-[16px] md:text-[20px] lg:text-[23px] leading-none font-medium">ASSOCIATES</span>
              </div>
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-8 xl:space-x-10 ml-6 h-full">
            <div className="flex items-center space-x-6 xl:space-x-8 h-full">
              {navLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="relative h-full flex items-center"
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(link.name, link);
                    }}
                    className={`text-[10px] xl:text-[11px] font-bold tracking-[0.15em] uppercase transition-all whitespace-nowrap py-4 border-b-2 ${activeMenu === link.name ? 'text-[#CC1414] border-[#CC1414]' : 'text-slate-800 border-transparent'}`}
                  >
                    {link.name}
                  </a>
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-5 border-l border-slate-200 pl-8 h-8 self-center">
              <button className="text-slate-800 transition-colors" aria-label="Search">
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
              <div className="flex items-center space-x-1.5 text-slate-800 transition-colors cursor-pointer group">
                <Globe className="w-5 h-5 stroke-[1.5]" />
                <span className="text-[11px] font-bold tracking-wider uppercase">EN</span>
              </div>
              <button 
                className="text-slate-800 transition-colors" 
                aria-label="Login"
                onClick={() => onNavigate('login')}
              >
                <User className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center space-x-4">
             <button className="p-1" aria-label="Search">
                <Search className="w-5 h-5 text-slate-900" />
             </button>
             <button 
              className="p-1" 
              aria-label="Login"
              onClick={() => onNavigate('login')}
             >
                <User className="w-5 h-5 text-slate-900" />
             </button>
          </div>
        </div>
      </div>

      <MegaMenu 
        activeMenu={activeMenu} 
        onClose={() => setActiveMenu(null)} 
        onNavigate={onNavigate as any} 
      />

      {/* Backdrop for the side drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div className={`fixed top-0 left-0 h-full bg-white z-40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl w-[85%] sm:w-[400px] md:w-[450px] lg:w-[500px] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col px-10 py-20 lg:px-16 lg:py-24 overflow-y-auto">
          <button 
            className="absolute top-8 right-8 p-2 text-slate-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>

          <div className="mb-16">
             <div className="flex items-center font-sans uppercase tracking-[0.18em] text-[#A6192E] font-medium mb-12">
                <span className="text-[18px] leading-none font-medium">AK PANDEY</span>
                <span className="text-[11px] mx-1.5 self-center">&</span>
                <span className="text-[18px] leading-none font-medium">ASSOCIATES</span>
             </div>
          </div>

          <div className="flex flex-col space-y-8 lg:space-y-10">
            {navLinks.map((link, idx) => (
              <div key={link.name} className="flex flex-col">
                <a
                  href={link.href}
                  className={`text-2xl lg:text-3xl font-serif font-medium text-slate-900 group flex justify-between items-center transition-all duration-700 transform ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                  style={{ transitionDelay: `${idx * 100 + 100}ms` }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link);
                  }}
                >
                  <span className="transition-colors">{link.name}</span>
                  <div className="w-10 h-px bg-slate-100 transition-all duration-500" />
                </a>
              </div>
            ))}
          </div>
          
          <div className={`mt-auto pt-20 transition-all duration-700 delay-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-slate-400 mb-8 border-b border-slate-100 pb-4">OFFICE LOCATIONS</p>
            <div className="space-y-6">
              <div className="group cursor-default">
                <p className="text-sm font-bold text-slate-900 mb-1">NEW DELHI</p>
                <p className="text-sm text-slate-500 font-light italic">High Court Chambers, Shanti Path</p>
              </div>
              <div className="group cursor-default">
                <p className="text-sm font-bold text-slate-900 mb-1">LUCKNOW</p>
                <p className="text-sm text-slate-500 font-light italic">Civil Lines, Hazratganj</p>
              </div>
              <div className="pt-8">
                <button 
                  onClick={() => { onNavigate('home'); setIsOpen(false); }} 
                  className="w-full bg-slate-900 text-white px-8 py-5 text-[11px] font-bold tracking-[0.3em] uppercase shadow-xl transition-all"
                >
                  SECURE CONSULTATION
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
