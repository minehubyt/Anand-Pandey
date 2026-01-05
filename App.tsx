
import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Insights from './components/Insights';
import QuotesCarousel from './components/QuotesCarousel';
import NewsCarousel from './components/NewsCarousel';
import PracticeAreas from './components/PracticeAreas';
import OfficeLocation from './components/OfficeLocation';
import BookingPage from './components/BookingPage';
import Footer from './components/Footer';
import InsightDetail from './components/InsightDetail';
import GenericPage from './components/GenericPage';
import RFPPage from './components/RFPPage';
import OurThinkingPage from './components/OurThinkingPage';
import PracticeAreaPage from './components/PracticeAreaPage';
import CareersPage from './components/CareersPage';
import JobListingPage from './components/JobListingPage';
import ApplyForm from './components/ApplicantPortal/ApplyForm';
import ApplicantDashboard from './components/ApplicantPortal/Dashboard';
import GeneralUserDashboard from './components/Portal/GeneralUserDashboard';
import AdminLogin from './components/Portal/AdminLogin';
import AdminPortal from './components/Portal/AdminPortal';
import { contentService } from './services/contentService';
import { Job, UserProfile } from './types';

type ViewType = 'home' | 'insight' | 'page' | 'rfp' | 'thinking' | 'practice' | 'careers' | 'jobs' | 'dashboard' | 'login' | 'admin' | 'booking';

const App: React.FC = () => {
  const [view, setView] = useState<{ type: ViewType; id?: string }>({ type: 'home' });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [applyingFor, setApplyingFor] = useState<Job | null>(null);
  
  const [pendingJobApplication, setPendingJobApplication] = useState<Job | null>(null);
  
  const viewRef = useRef(view);
  useEffect(() => { viewRef.current = view; }, [view]);

  const createSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const navigateTo = (type: ViewType, id?: string, title?: string) => {
    if (view.type === type && view.id === id) return;
    setIsTransitioning(true);
    
    // Construct Clean URL
    let path = '/';
    if (type === 'home') path = '/';
    else if (type === 'insight' && title) path = `/insights/${createSlug(title)}`;
    else if (type === 'insight' && id) path = `/insights/${id}`; // Fallback if no title
    else if (type === 'page') path = `/page/${id}`;
    else if (type === 'practice') path = `/practice/${id}`;
    else if (type === 'rfp') path = '/rfp';
    else if (type === 'booking') path = '/booking';
    else if (type === 'careers') path = '/careers';
    else if (type === 'thinking') path = '/thinking';
    else if (type === 'login') path = '/login';
    else if (type === 'dashboard') path = '/dashboard';
    else if (type === 'jobs') path = '/careers/jobs';
    else if (type === 'admin') path = '/portal/admin';
    else if (id) path = `/${type}/${id}`;
    else path = `/${type}`;

    window.history.pushState({ type, id }, '', path);

    setTimeout(() => {
      // Use slug as ID if title is present to allow lookup by slug in components
      setView({ type, id: (type === 'insight' && title) ? createSlug(title) : id });
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => setIsTransitioning(false), 100);
    }, 600);
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);
      const root = parts[0];
      const sub = parts[1];

      // Map Paths to Views
      if (!root) setView({ type: 'home' });
      else if (root === 'insights' && sub) setView({ type: 'insight', id: sub });
      else if (root === 'page' && sub) setView({ type: 'page', id: sub });
      else if (root === 'practice' && sub) setView({ type: 'practice', id: sub });
      else if (root === 'rfp') setView({ type: 'rfp' });
      else if (root === 'booking') setView({ type: 'booking' });
      else if (root === 'thinking') setView({ type: 'thinking' });
      else if (root === 'careers') {
         if (sub === 'jobs') setView({ type: 'jobs' });
         else setView({ type: 'careers' });
      }
      else if (root === 'login') setView({ type: 'login' });
      else if (root === 'dashboard') setView({ type: 'dashboard' });
      else if (root === 'portal' && sub === 'admin') setView({ type: 'admin' });
      else setView({ type: 'home' }); // Default fallback
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Handle initial load
    
    contentService.seedData();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const profile = await contentService.getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
        
        const isAdmin = firebaseUser.email?.toLowerCase() === 'admin@anandpandey.in' || profile?.role === 'admin';
        setIsAdminAuthenticated(isAdmin);

        if (viewRef.current.type === 'login' && !pendingJobApplication) {
          navigateTo('dashboard');
        }

        if (pendingJobApplication) {
          setApplyingFor(pendingJobApplication);
          setPendingJobApplication(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAdminAuthenticated(false);
      }
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      unsubscribe();
    };
  }, [pendingJobApplication]);

  const handleApplyClick = (job: Job) => {
    if (!user) {
      setPendingJobApplication(job);
      navigateTo('login');
      return;
    }
    setApplyingFor(job);
  };

  const renderContent = () => {
    if (view.type === 'login') return (
      <AdminLogin 
        intendedRole={pendingJobApplication ? 'applicant' : 'general'}
        onLogin={() => {
           if (!pendingJobApplication) {
             navigateTo('dashboard');
           }
        }} 
        onClose={() => {
          setPendingJobApplication(null);
          navigateTo('home');
        }} 
      />
    );

    if (isAdminAuthenticated || user?.email?.toLowerCase() === 'admin@anandpandey.in' || userProfile?.role === 'admin') {
      if (view.type === 'dashboard' || view.type === 'admin') {
        return <AdminPortal onLogout={() => { auth.signOut(); navigateTo('home'); }} />;
      }
    }
    
    if (view.type === 'dashboard') {
      if (userProfile?.role === 'applicant') {
        return <ApplicantDashboard onLogout={() => auth.signOut()} onNavigateHome={() => navigateTo('home')} />;
      }
      return <GeneralUserDashboard onLogout={() => auth.signOut()} onNavigateHome={() => navigateTo('home')} />;
    }

    switch (view.type) {
      case 'booking': return <BookingPage onBack={() => navigateTo('home')} />;
      case 'jobs': return <JobListingPage onBack={() => navigateTo('careers')} onApply={handleApplyClick} />;
      case 'careers': return <CareersPage onBack={() => navigateTo('home')} onNavigate={navigateTo} />;
      case 'insight': return <InsightDetail id={view.id} onBack={() => navigateTo('thinking')} />;
      case 'thinking': return <OurThinkingPage onBack={() => navigateTo('home')} onInsightClick={(id, title) => navigateTo('insight', id, title)} />;
      case 'practice': return <PracticeAreaPage id={view.id || ''} onBack={() => navigateTo('home')} onNavigate={navigateTo} />;
      case 'rfp': return <RFPPage onBack={() => navigateTo('home')} />;
      default:
        return (
          <>
            <Hero />
            <NewsCarousel onInsightClick={(id, title) => navigateTo('insight', id, title)} />
            <QuotesCarousel />
            <PracticeAreas onNavigate={navigateTo} />
            <Insights onInsightClick={(id, title) => navigateTo('insight', id, title)} />
            <OfficeLocation />
          </>
        );
    }
  };

  const showGlobalFooter = !['admin', 'login', 'thinking', 'careers', 'jobs', 'dashboard', 'booking', 'rfp'].includes(view.type);

  return (
    <div className="min-h-screen bg-white">
      {!['admin', 'login', 'careers', 'jobs', 'dashboard', 'booking'].includes(view.type) && <Navbar onNavigate={navigateTo} />}
      
      {applyingFor && (
        <ApplyForm 
          job={applyingFor} 
          onClose={() => setApplyingFor(null)} 
          onSuccess={() => {
            setApplyingFor(null);
            navigateTo('dashboard');
          }}
        />
      )}

      <main 
        key={view.type + (view.id || '')} 
        className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
          isTransitioning 
            ? 'opacity-0 translate-y-4 blur-sm scale-[0.98]' 
            : 'opacity-100 translate-y-0 blur-0 scale-100'
        }`}
      >
        {renderContent()}
      </main>
      
      {showGlobalFooter && <Footer onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
