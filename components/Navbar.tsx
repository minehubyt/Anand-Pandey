
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, Globe, User } from 'lucide-react';
import MegaMenu from './MegaMenu';

interface NavbarProps {
  onNavigate: (type: 'home' | 'insight' | 'page' | 'rfp' | 'thinking' | 'practice' | 'careers' | 'login' | 'booking', id?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'What we Do', href: '#services', type: 'home' },
    { name: 'Who we Are', href: '#about', type: 'home' },
    { name: 'Our Thinking', href: '#insights', type: 'thinking' },
    { name: 'Career', href: '#careers', type: 'careers' },
    { name: 'Offices', href: '#locations', type: 'home' },
    { name: 'Connect', href: '#booking', type: 'booking' }
  ];

  const handleNavClick = (link: any) => {
    setIsOpen(false);
    setActiveMenu(null);
    if (link.type === 'thinking') {
      onNavigate('thinking');
    } else if (link.type === 'careers') {
      onNavigate('careers');
    } else if (link.type === 'booking') {
      onNavigate('booking');
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
      const hasSubMenu = ['What we Do', 'Who we Are', 'Our Thinking', 'Offices', 'Connect'].includes(name);
      if (hasSubMenu) {
        setActiveMenu(name);
      } else {
        handleNavClick(link);
      }
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] bg-white border-b border-slate-200 ${isScrolled ? 'py-2 shadow-md' : 'py-3 lg:py-5 shadow-sm'}`}
    >
      <div className="max-w-[1920px] mx-auto px-6 lg:px-10 xl:px-16">
        <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-12' : 'h-12 lg:h-14'}`}>
          
          {/* Logo Section */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            <button 
              className="mr-4 p-2 -ml-2 text-slate-900 focus:outline-none transition-colors group lg:hidden" 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 transition-transform" />}
            </button>
            
            <button onClick={() => onNavigate('home')} className="flex items-center overflow-hidden group">
              <div className="flex items-center font-sans uppercase tracking-[0.18em] text-[#A6192E] font-medium transition-all duration-500 origin-left">
                <span className={`leading-none font-medium transition-all duration-500 ${isScrolled ? 'text-[16px] lg:text-[18px]' : 'text-[18px] lg:text-[24px]'}`}>AK PANDEY</span>
                <span className={`mx-1.5 self-center transition-all duration-500 ${isScrolled ? 'text-[10px] lg:text-[11px]' : 'text-[11px] lg:text-[13px]'}`}>&</span>
                <span className={`leading-none font-medium transition-all duration-500 ${isScrolled ? 'text-[16px] lg:text-[18px]' : 'text-[18px] lg:text-[24px]'}`}>ASSOCIATES</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center h-full ml-auto">
            <div className={`flex items-center h-full transition-all duration-500 ${isScrolled ? 'gap-6 xl:gap-8' : 'gap-5 xl:gap-10'}`}>
              {navLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="relative h-full flex items-center group"
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleMenu(link.name, link);
                    }}
                    className={`font-bold tracking-[0.12em] uppercase transition-all whitespace-nowrap border-b-2 py-1
                      ${isScrolled ? 'text-[10px] xl:text-[11px]' : 'text-[10px] lg:text-[11px] xl:text-[12px] 2xl:text-[13px]'}
                      ${activeMenu === link.name ? 'text-[#CC1414] border-[#CC1414]' : 'text-slate-800 border-transparent hover:text-[#CC1414]'}
                    `}
                  >
                    {link.name}
                  </a>
                </div>
              ))}
            </div>
            
            {/* Right Icons Section */}
            <div className={`flex items-center border-l border-slate-200 self-center transition-all duration-500 
              ${isScrolled ? 'ml-6 pl-6 h-6 gap-3' : 'ml-8 pl-8 h-8 gap-4 xl:gap-6'}`}
            >
              <button className="text-slate-800 hover:text-[#CC1414] transition-colors p-1" aria-label="Search">
                <Search className={`${isScrolled ? 'w-4 h-4' : 'w-5 h-5'} stroke-[1.5] transition-all duration-300`} />
              </button>
              
              <div className="flex items-center gap-1.5 text-slate-800 hover:text-[#CC1414] transition-colors cursor-pointer group select-none px-1">
                <Globe className={`${isScrolled ? 'w-4 h-4' : 'w-5 h-5'} stroke-[1.5] transition-all duration-300`} />
                <span className={`font-bold tracking-wider uppercase transition-all duration-300 ${isScrolled ? 'text-[9px]' : 'text-[10px] xl:text-[11px]'}`}>EN</span>
              </div>
              
              <button 
                className="text-slate-800 hover:text-[#CC1414] transition-colors p-1" 
                aria-label="Login"
                onClick={() => onNavigate('login')}
              >
                <User className={`${isScrolled ? 'w-4 h-4' : 'w-5 h-5'} stroke-[1.5] transition-all duration-300`} />
              </button>
            </div>
          </div>

          {/* Mobile Right Icons */}
          <div className="lg:hidden flex items-center space-x-3">
             <button className="p-2 text-slate-900" aria-label="Search">
                <Search className="w-5 h-5" />
             </button>
             <button 
              className="p-2 text-slate-900" 
              aria-label="Login"
              onClick={() => onNavigate('login')}
             >
                <User className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      <MegaMenu 
        activeMenu={activeMenu} 
        onClose={() => setActiveMenu(null)} 
        onNavigate={onNavigate as any} 
      />

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer (unchanged logic, preserving layout) */}
      <div className={`fixed top-0 left-0 h-full bg-white z-40 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl w-[85%] sm:w-[400px] md:w-[450px] lg:w-[500px] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col px-10 py-20 lg:px-16 lg:py-24 overflow-y-auto">
          <button 
            className="absolute top-8 right-8 p-2 text-slate-400 transition-colors hover:text-[#CC1414]"
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
                  <span className="transition-colors group-hover:text-[#CC1414]">{link.name}</span>
                  <div className="w-10 h-px bg-slate-100 group-hover:bg-[#CC1414] transition-all duration-500" />
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
                  onClick={() => { onNavigate('booking'); setIsOpen(false); }} 
                  className="w-full bg-slate-900 text-white px-8 py-5 text-[11px] font-bold tracking-[0.3em] uppercase shadow-xl transition-all hover:bg-[#CC1414]"
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
