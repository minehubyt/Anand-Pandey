
import React from 'react';
import { ArrowLeft, Share2, Printer, Linkedin, Facebook, Twitter, Mail, Download } from 'lucide-react';

interface InsightDetailProps {
  id?: string;
  onBack: () => void;
}

const InsightDetail: React.FC<InsightDetailProps> = ({ id, onBack }) => {
  // Dummy detailed content mapping
  const content = {
    title: 'BIOSECURE Act Becomes Law, Limiting Grants With "Biotechnology Companies of Concern"',
    category: 'CLIENT ALERT',
    date: 'December 18, 2025',
    heroImage: 'https://images.unsplash.com/photo-1579154273821-7891397ad63b?auto=format&fit=crop&q=80&w=2400',
    keyPoints: [
      'The law has potentially significant implications for pharmaceutical manufacturers that rely on biotechnology equipment or services from a BCC.',
      'The law does not name specific companies as BCCs but treats any company on the Department of Defense’s 1260H list of "Chinese military companies" as a BCC while creating a process through which more companies can be designated.',
      'The law provides a five-year safe harbor for existing contracts with companies later designated as BCCs and excludes equipment produced or services provided previously by those companies.'
    ]
  };

  return (
    <div className="pt-24 pb-32 animate-fade-in">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
        
        {/* Breadcrumb / Back Link */}
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 hover:text-[#CC1414] transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO INSIGHTS</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-24">
          
          {/* Side Icons - Fixed width sidebar */}
          <aside className="hidden lg:flex flex-col space-y-8 pt-4 w-12 shrink-0">
             <button className="text-slate-400 hover:text-[#CC1414] transition-colors" title="Download PDF"><Download className="w-5 h-5" /></button>
             <button className="text-slate-400 hover:text-[#CC1414] transition-colors" title="Print"><Printer className="w-5 h-5" /></button>
             <div className="h-px w-full bg-slate-100"></div>
             <button className="text-slate-400 hover:text-[#CC1414] transition-colors"><Linkedin className="w-5 h-5" /></button>
             <button className="text-slate-400 hover:text-[#CC1414] transition-colors"><Facebook className="w-5 h-5" /></button>
             <button className="text-slate-400 hover:text-[#CC1414] transition-colors"><Twitter className="w-5 h-5" /></button>
             <button className="text-slate-400 hover:text-[#CC1414] transition-colors"><Mail className="w-5 h-5" /></button>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            
            <header className="mb-12 max-w-5xl">
              <p className="text-[12px] font-bold tracking-[0.3em] uppercase text-[#CC1414] mb-4">{content.category}</p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-serif text-slate-900 leading-[1.1] mb-8">
                {content.title}
              </h1>
              <p className="text-lg text-slate-500 font-light italic">Published on {content.date}</p>
            </header>

            {/* Hero Image */}
            <div className="aspect-[21/9] w-full bg-slate-100 overflow-hidden mb-16 shadow-lg">
               <img src={content.heroImage} alt="Legal Insight Header" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
            </div>

            <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
              <div className="flex-1 max-w-4xl">
                
                {/* Key Points Box */}
                <div className="bg-slate-50 border border-slate-100 p-8 lg:p-12 mb-16 relative shadow-sm">
                  <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#CC1414] mb-8">KEY POINTS</h2>
                  <ul className="space-y-6">
                    {content.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex space-x-4">
                        <span className="text-[#CC1414] text-2xl leading-none">•</span>
                        <p className="text-slate-700 leading-relaxed font-light">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Body Text */}
                <article className="prose prose-slate prose-lg max-w-none text-slate-800 font-light leading-relaxed space-y-8">
                  <p>
                    On December 18, 2025, as part of the Fiscal Year 2026 National Defense Authorization Act (NDAA), President Trump signed into law the BIOSECURE Act (the Act), which limits US government procurement from and grants to “biotechnology companies of concern” (BCCs). Under the Act, US government agencies cannot (1) buy or obtain biotechnology equipment or services provided by a BCC; (2) enter into, extend, or renew a contract with any entity using biotechnology equipment or services provided by a BCC to perform a government contract; or (3) expend loan or grant funds for biotechnology equipment or services provided by a BCC, whether directly or through a loan or grant recipient.
                  </p>
                  
                  <h3 className="text-2xl font-serif text-slate-900 pt-8 pb-2 border-b border-slate-100 mb-6">COMPANIES OF CONCERN</h3>
                  <p>
                    The Act does not name specific companies as BCCs but treats any company on the Department of Defense (Department of War) 1260H list of “Chinese military companies” as a BCC — including BGI, FGI, and MGI. By December 18, 2026, the Director of the Office of Management and Budget (OMB) will publish a full list of BCCs based on recommendations from key federal Secretaries and Directors, including Defense, Justice, Health and Human Services, Commerce, National Intelligence, Homeland Security, State, and National Cyber.
                  </p>

                  <p>
                    To be designated a BCC, a company must:
                  </p>
                  <ul className="list-disc pl-8 space-y-4">
                    <li>be subject to the administrative governance structure, direction, and control of, or operate on behalf of, the government of a foreign adversary;</li>
                    <li>be to any extent involved in the manufacturing, distribution, provision, or procurement of a biotechnology equipment or service; and</li>
                    <li>pose a US national security risk — such as through ties to foreign military, security, or intelligence agencies — by sharing multiomic data with a foreign adversary’s government, or by collecting such data without express informed consent.</li>
                  </ul>

                  <p>
                    Subsidiaries, parents, affiliates, and successors of named BCCs are also considered BCCs if they are directed or controlled by, or act on behalf of, the government of a foreign adversary.
                  </p>
                </article>
              </div>

              {/* Contact Sidebar */}
              <div className="w-full lg:w-80 shrink-0">
                 <div className="border-t-2 border-[#CC1414] pt-10 lg:sticky lg:top-32">
                    <h4 className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-10">CONTACTS</h4>
                    <div className="space-y-12">
                       <div className="group">
                          <p className="text-slate-900 font-serif text-2xl mb-1 group-hover:text-[#CC1414] transition-colors cursor-pointer">Anand Kumar Pandey</p>
                          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-4">LEGAL COUNSEL</p>
                          <div className="space-y-1">
                            <p className="text-sm text-slate-600 font-light hover:text-[#CC1414] cursor-pointer transition-colors">+91 11 2345 6789</p>
                            <p className="text-sm text-slate-600 font-light underline underline-offset-4 decoration-slate-100 hover:decoration-[#CC1414] transition-all cursor-pointer">delhi.office@akpandey.com</p>
                          </div>
                       </div>
                       <div className="group">
                          <p className="text-slate-900 font-serif text-2xl mb-1 group-hover:text-[#CC1414] transition-colors cursor-pointer">Rahul Sharma</p>
                          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-4">SENIOR ASSOCIATE</p>
                          <div className="space-y-1">
                            <p className="text-sm text-slate-600 font-light hover:text-[#CC1414] cursor-pointer transition-colors">+91 11 2345 6780</p>
                            <p className="text-sm text-slate-600 font-light underline underline-offset-4 decoration-slate-100 hover:decoration-[#CC1414] transition-all cursor-pointer">r.sharma@akpandey.com</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightDetail;
