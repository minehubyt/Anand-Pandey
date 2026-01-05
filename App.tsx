
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from './firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Insights from './components/Insights';
import Innovation from './components/Innovation';
import NewsCarousel from './components/NewsCarousel';
import PracticeAreas from './components/PracticeAreas';
import OfficeLocation from './components/OfficeLocation';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';
import InsightDetail from './components/InsightDetail';
import GenericPage from './components/GenericPage';
import RFPPage from './components/RFPPage';
import OurThinkingPage from './components/OurThinkingPage';
import PracticeAreaPage from './components/PracticeAreaPage';
import AdminLogin from './components/Portal/AdminLogin';
import AdminPortal from './components/Portal/AdminPortal';
import { contentService } from './services/contentService';

type ViewType = 'home' | 'insight' | 'page' | 'rfp' | 'thinking' | 'practice' | 'login' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<{ type: ViewType; id?: string }>({ type: 'home' });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Parse hash on initial load and handle deep-linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === 'home') {
        setView({ type: 'home' });
      } else if (hash.startsWith('insight/')) {
        setView({ type: 'insight', id: hash.split('/')[1] });
      } else if (hash.startsWith('page/')) {
        setView({ type: 'page', id: hash.split('/')[1] });
      } else if (hash.startsWith('practice/')) {
        setView({ type: 'practice', id: hash.split('/')[1] });
      } else if (hash === 'thinking') {
        setView({ type: 'thinking' });
      } else if (hash === 'rfp') {
        setView({ type: 'rfp' });
      } else if (hash === 'login') {
        setView({ type: 'login' });
      } else if (hash === 'admin') {
        setView({ type: 'admin' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on mount

    contentService.seedData();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setIsAdminAuthenticated(true);
        setUser(firebaseUser);
        if (window.location.hash === '#login') {
          navigateTo('admin');
        }
      }
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdminAuthenticated(false);
    setUser(null);
    navigateTo('home');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    navigateTo('admin');
  };

  const navigateTo = (type: ViewType, id?: string) => {
    if (view.type === type && view.id === id) return;
    setIsTransitioning(true);
    
    // Update Hash for deep-linking
    const newHash = id ? `${type}/${id}` : type;
    window.location.hash = newHash;

    setTimeout(() => {
      setView({ type, id });
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  const renderContent = () => {
    if (view.type === 'login') {
      return (
        <AdminLogin 
          onLogin={handleAdminLoginSuccess} 
          onClose={() => navigateTo('home')}
        />
      );
    }
    
    if (view.type === 'admin') {
      if (!isAdminAuthenticated) {
        return (
          <AdminLogin 
            onLogin={handleAdminLoginSuccess} 
            onClose={() => navigateTo('home')}
          />
        );
      }
      return <AdminPortal onLogout={handleLogout} />;
    }

    switch (view.type) {
      case 'insight':
        return <InsightDetail id={view.id} onBack={() => navigateTo('thinking')} />;
      case 'page':
        if (view.id === 'submit-rfp') {
          return <RFPPage onBack={() => navigateTo('home')} />;
        }
        return <GenericPage id={view.id} onBack={() => navigateTo('home')} />;
      case 'rfp':
        return <RFPPage onBack={() => navigateTo('home')} />;
      case 'thinking':
        return <OurThinkingPage onBack={() => navigateTo('home')} onInsightClick={(id) => navigateTo('insight', id)} />;
      case 'practice':
        return <PracticeAreaPage id={view.id || ''} onBack={() => navigateTo('home')} onNavigate={navigateTo} />;
      default:
        return (
          <>
            <Hero />
            <NewsCarousel onInsightClick={(id) => navigateTo('insight', id)} />
            <Innovation />
            <Insights onInsightClick={(id) => navigateTo('insight', id)} />
            
            <section id="about" className="py-32 md:py-48 bg-white overflow-hidden">
              <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 md:gap-32 items-center">
                  <div className="relative group overflow-hidden bg-slate-100 shadow-2xl animate-clip-reveal">
                    <img
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"
                      alt="AK Pandey Professional"
                      className="relative z-10 w-full grayscale group-hover:grayscale-0 transition-all duration-[2s] scale-100 group-hover:scale-105"
                    />
                  </div>
                  <div className="max-w-xl animate-reveal-left stagger-2">
                    <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase text-[#CC1414] mb-8">FOUNDER & LEADERSHIP</h2>
                    <h3 className="text-[clamp(2.5rem,5vw,4.5rem)] font-serif text-slate-900 mb-12 leading-tight">Advocate<br />Anand Kumar Pandey</h3>
                    <div className="space-y-10 text-[clamp(17px,1.2vw,20px)] text-slate-500 font-light leading-relaxed">
                      <p>
                        With profound expertise in domestic and international mandates, Advocate Anand Kumar Pandey orchestrates critical legal strategies for high-stakes environments.
                      </p>
                      <p>
                        His counsel is sought at the intersection of constitutional safeguards and cross-border commercial dynamics, delivering precision in an era of volatility.
                      </p>
                      <div className="pt-8">
                        <button 
                          onClick={() => navigateTo('page', 'leadership')} 
                          className="group relative px-12 py-5 bg-slate-900 text-white font-bold text-[12px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-700"
                        >
                          <span className="relative z-10 group-hover:text-white transition-colors duration-500">MEET THE COUNSEL</span>
                          <div className="absolute inset-0 bg-[#CC1414] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <PracticeAreas onNavigate={navigateTo} />
            <OfficeLocation />
            <BookingForm />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#CC1414] selection:text-white">
      {view.type !== 'admin' && view.type !== 'login' && <Navbar onNavigate={navigateTo} />}
      
      <div 
        className={`fixed inset-0 bg-white z-[100] pointer-events-none transition-opacity duration-700 ease-in-out ${isTransitioning ? 'opacity-100' : 'opacity-0'}`} 
      />

      <main 
        key={view.type + (view.id || '')}
        className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isTransitioning ? 'opacity-0 scale-[0.98] blur-xl translate-y-4' : 'opacity-100 scale-100 blur-0 translate-y-0'} animate-page-fade`}
      >
        {renderContent()}
      </main>
      
      {view.type !== 'admin' && view.type !== 'login' && <Footer onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
