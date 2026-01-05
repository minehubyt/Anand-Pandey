
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface GenericPageProps {
  id?: string;
  onBack: () => void;
}

const GenericPage: React.FC<GenericPageProps> = ({ id, onBack }) => {
  const titles: Record<string, string> = {
    'firm-profile': 'Our Firm Profile',
    'leadership': 'Leadership & People',
    'history': 'Our Legacy & History',
    'values': 'Values & Culture',
    'pro-bono': 'Pro Bono Commitment',
    'corp-law': 'Corporate & Commercial Law',
    'crim-defense': 'Criminal Defense Strategy',
    'civil-litigation': 'Civil Litigation & Disputes',
    'ip-law': 'Intellectual Property Protection',
    'estate-planning': 'Estate Planning & Trusts',
    'industry-tech': 'Technology Industry Sector',
    'industry-finance': 'Financial Institutions Group',
    'industry-healthcare': 'Healthcare & Life Sciences',
    'podcasts': 'Legal Briefings Podcast',
    'events': 'Upcoming Legal Events',
    'year-in-review': '2025 Year In Review',
    'thought-leadership': 'Global Thought Leadership',
    'submit-rfp': 'Submit a Request for Proposal',
    'contact': 'Contact Our Chambers'
  };

  const title = titles[id || ''] || 'General Information';

  return (
    <div className="pt-32 md:pt-48 pb-32 md:pb-48 animate-fade-in bg-white min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        <button 
          onClick={onBack}
          className="flex items-center space-x-3 text-[11px] font-bold tracking-[0.3em] uppercase text-slate-400 hover:text-[#CC1414] transition-colors mb-20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>BACK TO HOME</span>
        </button>

        <header className="mb-24 max-w-5xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 leading-[1.05] mb-14">
            {title}
          </h1>
          <div className="h-2 w-32 bg-[#CC1414] shadow-sm"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
          <div className="lg:col-span-8 space-y-16">
            <p className="text-2xl md:text-3xl font-light text-slate-600 leading-relaxed italic border-l-8 border-slate-50 pl-10">
              Under the stewardship of Advocate Anand Kumar Pandey, our firm has redefined the standards of legal excellence in the South Asian region, blending traditional advocacy with modern strategic innovation.
            </p>
            
            <article className="prose prose-slate prose-xl max-w-none text-slate-800 font-light leading-[1.8] space-y-12">
              <p>
                Our chambers operate on the principle that every client deserves a tailored, high-stakes strategy that anticipates both judicial shifts and regulatory evolution. Whether we are navigating complex cross-border transactions or representing high-profile individuals in constitutional matters, our commitment remains unwavering.
              </p>
              
              <h3 className="text-3xl md:text-4xl font-serif text-slate-900 pt-8">STRATEGIC EXCELLENCE</h3>
              <p>
                As a premier boutique law firm based in Delhi and Lucknow, we have built a reputation for handling mandates that other firms find too complex. Our methodology involves a deep dive into the underlying commercial and personal motivations of our clients, ensuring that legal solutions align perfectly with broader objectives.
              </p>
              
              <div className="w-full aspect-video overflow-hidden bg-slate-50 shadow-2xl border border-slate-100 rounded-sm">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Professional Office Interior" 
                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-[2s] scale-100 hover:scale-105"
                />
              </div>

              <p>
                We believe in the power of knowledge. Our "Thinking" is not just a repository of alerts, but an active research engine that fuels our advocacy. By staying ahead of the curve in sectors like AI regulation, biotechnology, and digital privacy, we provide our clients with a distinct competitive advantage in an increasingly volatile global landscape.
              </p>
            </article>
          </div>

          <div className="lg:col-span-4 space-y-16 shrink-0">
             <div className="bg-slate-50 p-12 md:p-14 border border-slate-100 shadow-sm">
                <h4 className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-400 mb-10 pb-4 border-b border-slate-200">RELATED EXPERTISE</h4>
                <ul className="space-y-8">
                  <li><button className="text-slate-900 hover:text-[#CC1414] font-medium transition-colors text-xl flex items-center group">Constitutional Litigation <span className="ml-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">→</span></button></li>
                  <li><button className="text-slate-900 hover:text-[#CC1414] font-medium transition-colors text-xl flex items-center group">Cross-border M&A <span className="ml-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">→</span></button></li>
                  <li><button className="text-slate-900 hover:text-[#CC1414] font-medium transition-colors text-xl flex items-center group">White-Collar Defense <span className="ml-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">→</span></button></li>
                  <li><button className="text-slate-900 hover:text-[#CC1414] font-medium transition-colors text-xl flex items-center group">Regulatory Compliance <span className="ml-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">→</span></button></li>
                </ul>
             </div>

             <div className="p-12 md:p-14 border-2 border-slate-100 group cursor-pointer hover:border-[#CC1414] transition-all bg-white shadow-lg">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#CC1414] mb-6">CONNECT</p>
                <p className="text-3xl font-serif text-slate-900 mb-10 leading-tight">Discuss your specific requirements with our senior counsel.</p>
                <button 
                  onClick={() => onBack()}
                  className="text-xs font-bold tracking-[0.4em] uppercase border-b-2 border-slate-900 pb-2 group-hover:text-[#CC1414] group-hover:border-[#CC1414] transition-all inline-block"
                >
                   BOOK A SESSION
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
