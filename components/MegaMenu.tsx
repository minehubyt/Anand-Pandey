
import React from 'react';

interface MegaMenuProps {
  activeMenu: string | null;
  onClose: () => void;
  onNavigate: (type: 'home' | 'insight' | 'page' | 'rfp' | 'thinking' | 'practice', id?: string) => void;
}

const MENU_DATA: Record<string, {
  sections: { title: string; links: { name: string; type: 'insight' | 'page' | 'anchor' | 'rfp' | 'thinking' | 'practice'; id: string; href?: string }[] }[];
  featured?: { title: string; desc: string; image: string; type: 'insight' | 'page' | 'anchor' | 'rfp' | 'thinking' | 'practice'; id: string };
}> = {
  'Who we Are': {
    sections: [
      {
        title: 'OUR FIRM',
        links: [
          { name: 'Firm Profile', type: 'page', id: 'firm-profile' },
          { name: 'Leadership', type: 'page', id: 'leadership' },
          { name: 'History', type: 'page', id: 'history' },
          { name: 'Values & Culture', type: 'page', id: 'values' },
        ]
      }
    ],
    featured: {
      title: 'Decades of Excellence',
      desc: 'Learn about our journey from a small chamber to a leading legal powerhouse in South Asia.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      type: 'page',
      id: 'history'
    }
  },
  'What we Do': {
    sections: [
      {
        title: 'PRACTICES',
        links: [
          { name: 'Corporate Law', type: 'practice', id: 'corp-law' },
          { name: 'Criminal Defense', type: 'practice', id: 'crim-defense' },
          { name: 'Civil Litigation', type: 'practice', id: 'civil-litigation' },
          { name: 'Intellectual Property', type: 'practice', id: 'ip-law' },
          { name: 'Family Law', type: 'practice', id: 'family-law' },
        ]
      },
      {
        title: 'INDUSTRIES',
        links: [
          { name: 'Technology', type: 'page', id: 'industry-tech' },
          { name: 'Financial Institutions', type: 'page', id: 'industry-finance' },
          { name: 'Energy & Infrastructure', type: 'page', id: 'industry-energy' },
          { name: 'Healthcare', type: 'page', id: 'industry-healthcare' },
        ]
      }
    ],
    featured: {
      title: 'Complex Mandates',
      desc: 'We navigate the most challenging legal landscapes with strategic foresight and precision.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
      type: 'practice',
      id: 'corp-law'
    }
  },
  'Our Thinking': {
    sections: [
      {
        title: 'EXPLORE',
        links: [
          { name: 'Latest Insights', type: 'thinking', id: 'insights' },
          { name: 'Annual Reports', type: 'thinking', id: 'reports' },
          { name: 'Legal Briefings Podcast', type: 'thinking', id: 'podcasts' },
          { name: 'Thought Articles', type: 'thinking', id: 'articles' },
        ]
      },
      {
        title: 'RESOURCES',
        links: [
          { name: 'Year in Review', type: 'page', id: 'year-in-review' },
          { name: 'Practice Guides', type: 'page', id: 'guides' },
          { name: 'Webcasts', type: 'page', id: 'events' },
        ]
      }
    ],
    featured: {
      title: '2025 Judiciary Review',
      desc: 'Our latest analysis on the shifting priorities of high-stakes litigation in India.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
      type: 'thinking',
      id: 'year-in-review'
    }
  },
  'Career': {
    sections: [
      {
        title: 'OPPORTUNITIES',
        links: [
          { name: 'Law Students', type: 'page', id: 'careers-students' },
          { name: 'Experienced Lawyers', type: 'page', id: 'careers-exp' },
          { name: 'Staff Roles', type: 'page', id: 'careers-staff' },
        ]
      },
      {
        title: 'LIFE AT THE FIRM',
        links: [
          { name: 'Culture & Mentorship', type: 'page', id: 'culture' },
          { name: 'Professional Development', type: 'page', id: 'development' },
        ]
      }
    ],
    featured: {
      title: 'Join Our Legacy',
      desc: 'We are always looking for driven, exceptional legal talent to join our chambers.',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800',
      type: 'page',
      id: 'careers-exp'
    }
  },
  'Offices': {
    sections: [
      {
        title: 'DOMESTIC',
        links: [
          { name: 'New Delhi', type: 'practice', id: 'locations', href: '#locations' },
          { name: 'Lucknow', type: 'practice', id: 'locations', href: '#locations' },
          { name: 'Mumbai (Coming Soon)', type: 'practice', id: 'locations', href: '#locations' },
        ]
      },
      {
        title: 'GLOBAL REACH',
        links: [
          { name: 'Strategic Partnerships', type: 'page', id: 'partnerships' },
          { name: 'Global Network', type: 'page', id: 'global-network' },
        ]
      }
    ],
    featured: {
      title: 'Strategic Presence',
      desc: 'Operating from the heart of India’s administrative and judicial capitals.',
      image: 'https://images.unsplash.com/photo-1524492459413-5bc37ec4e271?auto=format&fit=crop&q=80&w=800',
      type: 'practice',
      id: 'locations'
    }
  },
  'Connect': {
    sections: [
      {
        title: 'GET IN TOUCH',
        links: [
          { name: 'Submit RFP', type: 'rfp', id: 'submit-rfp' },
          { name: 'General Inquiries', type: 'page', id: 'contact' },
          { name: 'Book an Appointment', type: 'practice', id: 'appointments', href: '#appointments' },
        ]
      },
      {
        title: 'MEDIA',
        links: [
          { name: 'Press Room', type: 'page', id: 'press' },
          { name: 'Speaker Requests', type: 'page', id: 'speakers' },
        ]
      }
    ],
    featured: {
      title: 'Global Inquiries',
      desc: 'For complex cross-border mandates, contact our specialized international liaison team.',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800',
      type: 'rfp',
      id: 'submit-rfp'
    }
  }
};

const MegaMenu: React.FC<MegaMenuProps> = ({ activeMenu, onClose, onNavigate }) => {
  if (!activeMenu || !MENU_DATA[activeMenu]) return null;

  const data = MENU_DATA[activeMenu];

  return (
    <div 
      className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl z-50 animate-fade-in-up"
      onMouseLeave={onClose}
    >
      <div className="max-w-[1600px] mx-auto px-12 py-16 flex gap-20">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12">
          {data.sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-[11px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-6 pb-2 border-b border-slate-100">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <button 
                      onClick={() => {
                        if (link.type === 'practice' && link.href?.startsWith('#')) {
                          onNavigate('home');
                          setTimeout(() => {
                             const el = document.getElementById(link.id);
                             el?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        } else {
                          onNavigate(link.type as any, link.id);
                        }
                        onClose();
                      }}
                      className="text-[15px] text-slate-900 hover:text-[#CC1414] transition-colors font-medium flex items-center group text-left"
                    >
                      {link.name}
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#CC1414]">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {data.featured && (
          <div className="w-[400px] bg-slate-50 p-8 flex flex-col group">
             <div className="aspect-video overflow-hidden mb-6">
               <img 
                 src={data.featured.image} 
                 alt={data.featured.title} 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
               />
             </div>
             <h4 className="text-xl font-serif text-slate-900 mb-3">{data.featured.title}</h4>
             <p className="text-sm text-slate-600 font-light leading-relaxed mb-6">
               {data.featured.desc}
             </p>
             <button 
              onClick={() => {
                onNavigate(data.featured!.type as any, data.featured!.id);
                onClose();
              }}
              className="mt-auto text-[11px] font-bold tracking-widest uppercase text-slate-900 border-b border-slate-900 pb-1 self-start hover:text-[#CC1414] hover:border-[#CC1414] transition-all"
             >
               LEARN MORE
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MegaMenu;
