
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, Users, MapPin, 
  LogOut, Plus, Edit2, Trash2, 
  CheckCircle, Archive, MessageSquare, RefreshCw,
  Mic, Calendar, Image as ImageIcon, Save, X, 
  ArrowRight, FileType, Filter, Inbox, Clock, ShieldCheck,
  Briefcase, Phone, Search, Bell, Activity, Globe, Zap,
  Sun, Moon, ChevronRight, Download, Link, ExternalLink,
  Heading1, Heading2, AlignLeft, Type, FileUp, Music, Database,
  Linkedin, MessageCircle, Mail, BookOpen, Star, Palette
} from 'lucide-react';
import { contentService } from '../../services/contentService';
import { HeroContent, Insight, Author, Inquiry, OfficeLocation, Event } from '../../types';

interface AdminPortalProps {
  onLogout: () => void;
}

type Tab = 'hero' | 'insights' | 'reports' | 'casestudy' | 'podcasts' | 'authors' | 'offices' | 'appointments' | 'rfp' | 'contacts';

const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Entities
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [offices, setOffices] = useState<OfficeLocation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Editor State
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
  const [activeEntity, setActiveEntity] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const unsubHero = contentService.subscribeHero((data) => setHero(data));
    const unsubInsights = contentService.subscribeInsights((data) => setInsights(data));
    const unsubAuthors = contentService.subscribeAuthors((data) => setAuthors(data));
    const unsubOffices = contentService.subscribeOffices((data) => setOffices(data));
    const unsubInquiries = contentService.subscribeInquiries((data) => {
      setInquiries(data);
      setLoading(false);
    });

    return () => {
      unsubHero(); unsubInsights(); unsubAuthors(); unsubOffices(); unsubInquiries();
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'hero') {
        await contentService.updateHero(activeEntity);
      } else if (['insights', 'reports', 'podcasts', 'casestudy'].includes(activeTab)) {
        await contentService.saveInsight({ ...activeEntity, type: activeTab });
      } else if (activeTab === 'authors') {
        await contentService.saveAuthor(activeEntity);
      } else if (activeTab === 'offices') {
        await contentService.saveOffice(activeEntity);
      }
      setIsEditing(false);
    } catch (err) {
      alert('Error saving data. Please check connection.');
    }
  };

  const filteredInquiries = inquiries
    .filter(iq => {
      if (activeTab === 'appointments') return iq.type === 'appointment';
      if (activeTab === 'rfp') return iq.type === 'rfp';
      if (activeTab === 'contacts') return iq.type === 'contact';
      return false;
    })
    .filter(iq => 
      iq.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      iq.uniqueId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iq.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const openEditor = (entity: any = null, mode: 'create' | 'edit' = 'create') => {
    setEditMode(mode);
    if (entity) {
      setActiveEntity(entity);
    } else {
      // Default initial states based on tab
      const defaults: any = { title: '', desc: '', image: '', category: 'Legal Update', content: '', isFeatured: false, featuredColor: '#0A1931' };
      if (activeTab === 'podcasts') Object.assign(defaults, { season: '1', episode: '1', audioUrl: '' });
      if (activeTab === 'reports') Object.assign(defaults, { pdfUrl: '' });
      if (activeTab === 'authors') Object.assign(defaults, { linkedin: '', whatsapp: '', email: '', qualifications: '', bio: '' });
      if (activeTab === 'offices') Object.assign(defaults, { coordinates: { lat: 28.6139, lng: 77.2090 }, address: '', phone: '', email: '', image: '' });
      setActiveEntity(defaults);
    }
    setIsEditing(true);
  };

  const insertTag = (tag: string) => {
    const textarea = document.getElementById('rich-content-area') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selection = text.substring(start, end);
    let newContent = '';
    
    if (tag === 'img') {
      const url = prompt('Enter Image URL:');
      if (url) newContent = `${before}<img src="${url}" class="w-full my-8" />${after}`;
    } else if (tag === 'h1') {
      newContent = `${before}<h1 class="text-4xl font-serif mt-12 mb-6">${selection || 'Heading'}</h1>${after}`;
    } else if (tag === 'p') {
      newContent = `${before}<p class="text-lg leading-relaxed mb-6">${selection || 'Paragraph text...'}</p>${after}`;
    } else if (tag === 'bold') {
      newContent = `${before}<b>${selection || 'Bold Text'}</b>${after}`;
    } else if (tag === 'gap') {
      newContent = `${before}<div class="h-12"></div>${after}`;
    } else if (tag === 'highlight') {
      newContent = `${before}<span class="bg-[#CC1414] text-white px-2 py-1">${selection || 'Highlighted Text'}</span>${after}`;
    }

    if (newContent) setActiveEntity({...activeEntity, content: newContent});
  };

  const renderContentEditor = () => {
    return (
      <div className="space-y-8 animate-reveal-up pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">Mandate Title</label>
            <input required type="text" value={activeEntity.title} onChange={e => setActiveEntity({...activeEntity, title: e.target.value})} className={`w-full p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`} placeholder="The TechCorp Landmark Acquisition" />
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">Content Category</label>
            <input type="text" value={activeEntity.category} onChange={e => setActiveEntity({...activeEntity, category: e.target.value})} className={`w-full p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`} placeholder="CLIENT ALERT / NEWS" />
          </div>
        </div>

        <div className="flex items-center gap-6 p-6 rounded-2xl border border-[#CC1414]/20 bg-[#CC1414]/5">
           <div className="flex items-center gap-3">
              <Star className={activeEntity.isFeatured ? "text-yellow-500 fill-yellow-500" : "text-slate-300"} size={24}/>
              <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Featured on News Carousel</span>
           </div>
           <button 
             type="button"
             onClick={() => setActiveEntity({...activeEntity, isFeatured: !activeEntity.isFeatured})}
             className={`w-12 h-6 rounded-full relative transition-all ${activeEntity.isFeatured ? 'bg-yellow-500' : 'bg-slate-300'}`}
           >
             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${activeEntity.isFeatured ? 'right-1' : 'left-1'}`} />
           </button>
           {activeEntity.isFeatured && (
             <div className="ml-auto flex items-center gap-3">
               <Palette size={16} className="text-slate-400" />
               <input type="color" value={activeEntity.featuredColor} onChange={e => setActiveEntity({...activeEntity, featuredColor: e.target.value})} className="w-8 h-8 rounded-lg overflow-hidden border-none p-0 cursor-pointer" />
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Carousel Theme</span>
             </div>
           )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <AssetUploadField label="Thumbnail Image URL" value={activeEntity.image} onChange={val => setActiveEntity({...activeEntity, image: val})} isDark={isDarkMode} />
           <AssetUploadField label="Banner/Carousel Image URL" value={activeEntity.bannerImage} onChange={val => setActiveEntity({...activeEntity, bannerImage: val})} isDark={isDarkMode} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <AssetUploadField label="PDF Document URL" icon={<FileUp size={16}/>} value={activeEntity.pdfUrl} onChange={val => setActiveEntity({...activeEntity, pdfUrl: val})} isDark={isDarkMode} />
           {activeTab === 'podcasts' && (
             <AssetUploadField label="Audio Resource URL" icon={<Music size={16}/>} value={activeEntity.audioUrl} onChange={val => setActiveEntity({...activeEntity, audioUrl: val})} isDark={isDarkMode} />
           )}
        </div>

        <div className={`rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'} overflow-hidden`}>
           <div className={`p-4 border-b flex flex-wrap gap-3 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-50 bg-slate-50/50'}`}>
              <EditorBtn icon={<Heading1 size={18}/>} onClick={() => insertTag('h1')} label="H1" />
              <EditorBtn icon={<Type size={18}/>} onClick={() => insertTag('p')} label="Text" />
              <EditorBtn icon={<Palette size={18}/>} onClick={() => insertTag('highlight')} label="Highlight" />
              <EditorBtn icon={<AlignLeft size={18}/>} onClick={() => insertTag('gap')} label="Gap" />
              <EditorBtn icon={<ImageIcon size={18}/>} onClick={() => insertTag('img')} label="Img" />
              <div className="ml-auto flex items-center gap-2">
                 <span className="text-[10px] font-bold text-[#CC1414] uppercase tracking-widest">Full Freedom Editor</span>
              </div>
           </div>
           <textarea 
             id="rich-content-area"
             value={activeEntity.content} 
             onChange={e => setActiveEntity({...activeEntity, content: e.target.value})} 
             className={`w-full p-10 min-h-[500px] bg-transparent outline-none font-mono text-sm leading-relaxed ${isDarkMode ? 'text-white' : 'text-slate-800'}`} 
             placeholder="Enter HTML content here for full design freedom..."
           />
        </div>
      </div>
    );
  };

  const renderAuthorEditor = () => (
    <div className="space-y-8 animate-reveal-up pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">Full Name</label>
          <input required type="text" value={activeEntity.name} onChange={e => setActiveEntity({...activeEntity, name: e.target.value})} className={`w-full p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">Profile Photo URL</label>
          <input required type="text" value={activeEntity.image} onChange={e => setActiveEntity({...activeEntity, image: e.target.value})} className={`w-full p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <SocialInput icon={<Linkedin size={16}/>} label="LinkedIn Profile" value={activeEntity.linkedin} onChange={v => setActiveEntity({...activeEntity, linkedin: v})} isDark={isDarkMode} />
         <SocialInput icon={<MessageCircle size={16}/>} label="WhatsApp Business" value={activeEntity.whatsapp} onChange={v => setActiveEntity({...activeEntity, whatsapp: v})} isDark={isDarkMode} />
         <SocialInput icon={<Mail size={16}/>} label="Contact Email" value={activeEntity.email} onChange={v => setActiveEntity({...activeEntity, email: v})} isDark={isDarkMode} />
      </div>
      <div className="space-y-4">
        <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">Qualifications & Credentials</label>
        <input type="text" value={activeEntity.qualifications} onChange={e => setActiveEntity({...activeEntity, qualifications: e.target.value})} className={`w-full p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} placeholder="B.A. LL.B (Hons), Senior Advocate, Supreme Court..." />
      </div>
      <div className="space-y-4">
        <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">Brief Professional Narration</label>
        <textarea value={activeEntity.bio} onChange={e => setActiveEntity({...activeEntity, bio: e.target.value})} className={`w-full p-6 rounded-xl border min-h-[250px] ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} placeholder="Detailed career history and specialization overview..." />
      </div>
    </div>
  );

  const renderOfficeEditor = () => (
    <div className="space-y-8 animate-reveal-up pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">City/Branch Name</label>
          <input required type="text" value={activeEntity.city} onChange={e => setActiveEntity({...activeEntity, city: e.target.value})} className={`w-full p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">Office Exterior/Interior Image URL</label>
          <input required type="text" value={activeEntity.image} onChange={e => setActiveEntity({...activeEntity, image: e.target.value})} className={`w-full p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-red-50/20 p-8 rounded-2xl border border-red-100">
        <div className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-widest text-[#CC1414]">Geographic Latitude (Red Pin)</label>
          <input type="number" step="any" value={activeEntity.coordinates?.lat} onChange={e => setActiveEntity({...activeEntity, coordinates: {...activeEntity.coordinates, lat: parseFloat(e.target.value)}})} className="w-full p-4 rounded-xl border bg-white border-slate-100 outline-none" />
        </div>
        <div className="space-y-4">
          <label className="text-[11px] font-bold uppercase tracking-widest text-[#CC1414]">Geographic Longitude (Red Pin)</label>
          <input type="number" step="any" value={activeEntity.coordinates?.lng} onChange={e => setActiveEntity({...activeEntity, coordinates: {...activeEntity.coordinates, lng: parseFloat(e.target.value)}})} className="w-full p-4 rounded-xl border bg-white border-slate-100 outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-4">
           <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">Office Contact Number</label>
           <input type="text" value={activeEntity.phone} onChange={e => setActiveEntity({...activeEntity, phone: e.target.value})} className={`w-full p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} />
         </div>
         <div className="space-y-4">
           <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">Office Contact Email</label>
           <input type="email" value={activeEntity.email} onChange={e => setActiveEntity({...activeEntity, email: e.target.value})} className={`w-full p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} />
         </div>
      </div>
      <div className="space-y-4">
        <label className="text-[11px] font-bold uppercase tracking-widest opacity-50">Full Postal Address</label>
        <textarea value={activeEntity.address} onChange={e => setActiveEntity({...activeEntity, address: e.target.value})} className={`w-full p-6 rounded-xl border min-h-[120px] ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} />
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#090A0C]' : 'bg-[#F4F7FE]'}`}>
      
      {/* Sidebar - Pro UI */}
      <aside className={`w-[280px] flex flex-col h-full shrink-0 transition-all duration-500 ${isDarkMode ? 'bg-[#101114] border-r border-white/5' : 'bg-white border-r border-slate-200'} z-[90]`}>
        <div className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-12 h-12 bg-[#CC1414] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-500/20">
               <ShieldCheck size={26} strokeWidth={1.5} />
             </div>
             <div className="flex flex-col">
               <span className={`text-[17px] font-bold tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AK PANDEY</span>
               <span className={`text-[9px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>COMMAND</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-10">
          <SidebarSection label="Marketing Suite" isDark={isDarkMode} />
          <SidebarLink id="hero" active={activeTab} set={setActiveTab} label="Main Banners" icon={<Database size={18} />} isDark={isDarkMode} />
          <SidebarLink id="insights" active={activeTab} set={setActiveTab} label="Insights" icon={<FileText size={18} />} isDark={isDarkMode} />
          <SidebarLink id="reports" active={activeTab} set={setActiveTab} label="Reports" icon={<FileType size={18} />} isDark={isDarkMode} />
          <SidebarLink id="podcasts" active={activeTab} set={setActiveTab} label="Podcasts" icon={<Music size={18} />} isDark={isDarkMode} />
          <SidebarLink id="casestudy" active={activeTab} set={setActiveTab} label="Case Studies" icon={<BookOpen size={18} />} isDark={isDarkMode} />
          
          <div className="h-6" />
          <SidebarSection label="Administrative" isDark={isDarkMode} />
          <SidebarLink id="authors" active={activeTab} set={setActiveTab} label="Counsel profiles" icon={<Users size={18} />} isDark={isDarkMode} />
          <SidebarLink id="offices" active={activeTab} set={setActiveTab} label="Global Offices" icon={<Globe size={18} />} isDark={isDarkMode} />
          
          <div className="h-6" />
          <SidebarSection label="Mandate Inflow" isDark={isDarkMode} />
          <SidebarLink id="appointments" active={activeTab} set={setActiveTab} label="Appointments" icon={<Calendar size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type === 'appointment' && i.status === 'new').length} />
          <SidebarLink id="rfp" active={activeTab} set={setActiveTab} label="RFPs" icon={<Zap size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type === 'rfp' && i.status === 'new').length} />
          <SidebarLink id="contacts" active={activeTab} set={setActiveTab} label="Contact Inbound" icon={<Inbox size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type === 'contact' && i.status === 'new').length} />
        </nav>

        {/* Footer controls */}
        <div className="p-4 mt-auto border-t border-white/5 space-y-2">
           <div className={`flex items-center justify-between px-6 py-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
             <div className="flex items-center gap-3">
               {isDarkMode ? <Moon size={16} className="text-[#CC1414]" /> : <Sun size={16} className="text-[#CC1414]" />}
               <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>{isDarkMode ? 'Dark' : 'Light'}</span>
             </div>
             <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-10 h-5 rounded-full relative transition-all ${isDarkMode ? 'bg-[#CC1414]' : 'bg-slate-300'}`}>
               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`} />
             </button>
          </div>
          <button onClick={onLogout} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold tracking-widest uppercase transition-all ${isDarkMode ? 'text-slate-500 hover:bg-white/5 hover:text-[#CC1414]' : 'text-slate-400 hover:bg-slate-50 hover:text-[#CC1414]'}`}>
            <LogOut size={18} /> Disconnect
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Dynamic Nav Bar */}
        <header className={`h-24 px-12 flex items-center justify-between shrink-0 z-50 transition-colors ${isDarkMode ? 'bg-[#090A0C]/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
          <div>
            <p className={`text-[10px] font-bold tracking-[0.4em] uppercase mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>CHAMBER COMMAND</p>
            <h2 className={`text-2xl font-serif tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab.toUpperCase()} Matrix</h2>
          </div>
          <div className="flex items-center gap-8">
            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full border ${isDarkMode ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Protocol Active</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-serif italic text-lg ring-2 ring-[#CC1414] ring-offset-4 ring-offset-transparent shadow-xl">AP</div>
          </div>
        </header>

        {/* Dynamic Main Space */}
        <main className="flex-1 overflow-y-auto px-12 py-12 custom-scrollbar relative">
          {loading ? (
             <div className="absolute inset-0 flex items-center justify-center flex-col gap-6">
               <RefreshCw className="w-12 h-12 animate-spin text-[#CC1414]" />
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading Intelligence...</p>
             </div>
          ) : isEditing ? (
             <div className="animate-reveal-up max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-16">
                   <h3 className={`text-4xl font-serif ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{editMode === 'create' ? 'Add' : 'Edit'} {activeTab}</h3>
                   <div className="flex gap-4">
                     <button onClick={() => setIsEditing(false)} className={`px-8 py-4 text-[11px] font-bold uppercase tracking-widest rounded-2xl transition-all ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-600'}`}>Discard Changes</button>
                     <button onClick={handleSave} className="px-10 py-4 bg-[#CC1414] text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/20 flex items-center gap-3">
                       <Save size={18}/> Commit to Cloud
                     </button>
                   </div>
                </header>
                {activeTab === 'authors' ? renderAuthorEditor() : activeTab === 'offices' ? renderOfficeEditor() : renderContentEditor()}
             </div>
          ) : (
            <div className="space-y-12 animate-page-fade pb-32 max-w-7xl mx-auto">
              
              {/* MANAGEMENT GRID VIEW */}
              {['hero', 'insights', 'reports', 'podcasts', 'casestudy', 'authors', 'offices'].includes(activeTab) && (
                <>
                  <header className="flex justify-between items-center">
                    <div className={`p-5 rounded-2xl flex items-center gap-4 ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-white shadow-sm border border-slate-50'}`}>
                       <Database className="text-[#CC1414]" size={22}/>
                       <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab === 'hero' ? 'BANNERS' : insights.filter(i => i.type === activeTab).length || 0} Assets Deployed</span>
                    </div>
                    {activeTab !== 'hero' && (
                      <button onClick={() => openEditor()} className="px-10 py-4.5 bg-[#CC1414] text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/20 flex items-center gap-3 transform hover:scale-105 transition-all">
                        <Plus size={20}/> New {activeTab} Entry
                      </button>
                    )}
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                     {activeTab === 'hero' && hero && (
                        <AssetCard title="Main Landing Banner" desc={hero.headline} image={hero.backgroundImage} onEdit={() => openEditor(hero, 'edit')} isDark={isDarkMode} isHero />
                     )}
                     {activeTab === 'authors' && authors.map(author => (
                        <AssetCard key={author.id} title={author.name} desc={author.title} image={author.image} onEdit={() => openEditor(author, 'edit')} onDelete={() => contentService.deleteAuthor(author.id)} isDark={isDarkMode} />
                     ))}
                     {activeTab === 'offices' && offices.map(office => (
                        <AssetCard key={office.id} title={office.city} desc={office.address} image={office.image || ''} onEdit={() => openEditor(office, 'edit')} onDelete={() => contentService.deleteOffice(office.id)} isDark={isDarkMode} />
                     ))}
                     {['insights', 'reports', 'podcasts', 'casestudy'].includes(activeTab) && insights.filter(i => i.type === activeTab).map(insight => (
                        <AssetCard key={insight.id} title={insight.title} desc={insight.category} image={insight.image} isFeatured={insight.isFeatured} onEdit={() => openEditor(insight, 'edit')} onDelete={() => contentService.deleteInsight(insight.id)} isDark={isDarkMode} />
                     ))}
                  </div>
                </>
              )}

              {/* MANDATES FEED (Appointment/RFP/Contact) */}
              {['appointments', 'rfp', 'contacts'].includes(activeTab) && (
                <div className="space-y-10">
                   <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                      <div className={`relative flex items-center px-8 py-5 rounded-2xl flex-1 max-w-2xl ${isDarkMode ? 'bg-white/5 border border-white/5' : 'bg-white shadow-sm border border-slate-100'}`}>
                         <Search className="text-slate-400" size={20}/>
                         <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Omni-Search by Mandate ID, Name, or Institutional Email..." className="bg-transparent border-none outline-none w-full ml-4 text-[15px] font-light text-slate-500" />
                      </div>
                   </div>

                   <div className="space-y-4">
                      {filteredInquiries.length === 0 ? (
                        <div className="py-40 text-center opacity-20 italic font-serif text-3xl">No mandates detected in current filter.</div>
                      ) : (
                        filteredInquiries.map(iq => (
                          <div key={iq.id} className={`p-10 rounded-2xl border flex flex-col md:flex-row items-center gap-12 transition-all group ${isDarkMode ? 'bg-[#121317] border-white/5 hover:bg-[#1A1B20]' : 'bg-white border-slate-100 hover:shadow-2xl'}`}>
                             <div className="w-16 h-16 bg-[#CC1414]/5 rounded-2xl flex items-center justify-center shrink-0">
                                {iq.type === 'appointment' ? <Calendar className="text-[#CC1414]" size={28}/> : iq.type === 'rfp' ? <Briefcase className="text-[#CC1414]" size={28}/> : <Inbox className="text-[#CC1414]" size={28}/>}
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-4 mb-3">
                                   <span className="text-[11px] font-bold text-[#CC1414] uppercase tracking-widest font-mono bg-[#CC1414]/10 px-3 py-1 rounded-full">{iq.uniqueId}</span>
                                   <span className={`w-2.5 h-2.5 rounded-full ${iq.status === 'new' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                                   <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{iq.status}</span>
                                </div>
                                <h5 className={`text-2xl font-serif truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{iq.name}</h5>
                                <p className="text-sm text-slate-500 font-light mt-1">{iq.email} • {new Date(iq.date).toLocaleDateString()}</p>
                             </div>
                             <div className="flex-1 opacity-70 hidden lg:block">
                                <p className="text-sm italic leading-relaxed line-clamp-2">"{iq.details?.query || iq.details?.message || 'High-level advisory request.'}"</p>
                             </div>
                             <div className="flex gap-4">
                                {iq.status === 'new' && (
                                   <button onClick={() => contentService.updateInquiryStatus(iq.id, 'reviewed')} className="px-8 py-3.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#CC1414] transition-all">Review</button>
                                )}
                                <button onClick={() => contentService.updateInquiryStatus(iq.id, 'archived')} className={`p-4 rounded-xl ${isDarkMode ? 'hover:bg-white/5 text-slate-500' : 'hover:bg-slate-50 text-slate-400'}`}><Archive size={20}/></button>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// HELPERS
const SidebarSection: React.FC<{ label: string, isDark: boolean }> = ({ label, isDark }) => (
  <p className={`px-6 text-[9px] font-bold tracking-[0.4em] uppercase mt-4 mb-3 transition-colors ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{label}</p>
);

const SidebarLink: React.FC<{ id: Tab, active: Tab, set: any, label: string, icon: any, isDark: boolean, badge?: number }> = ({ id, active, set, label, icon, isDark, badge }) => (
  <button 
    onClick={() => set(id)} 
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 relative group ${active === id ? (isDark ? 'bg-white/5 text-[#CC1414]' : 'bg-[#CC1414] text-white shadow-2xl shadow-red-500/40') : (isDark ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')}`}
  >
    <div className={`transition-transform duration-500 ${active === id ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
    <span className={`text-[13px] font-bold tracking-[0.1em] transition-all pt-0.5 ${active === id ? 'translate-x-1' : ''}`}>{label}</span>
    {badge ? <span className={`ml-auto w-6 h-6 flex items-center justify-center rounded-xl text-[10px] font-bold ${active === id ? 'bg-white text-[#CC1414]' : 'bg-[#CC1414] text-white'}`}>{badge}</span> : null}
    {active === id && !isDark && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-inner" />}
  </button>
);

const AssetCard: React.FC<{ title: string, desc: string, image: string, isFeatured?: boolean, onEdit: () => void, onDelete?: () => void, isDark: boolean, isHero?: boolean }> = ({ title, desc, image, isFeatured, onEdit, onDelete, isDark, isHero }) => (
  <div className={`rounded-2xl border transition-all group overflow-hidden flex flex-col h-full ${isDark ? 'bg-[#101114] border-white/5' : 'bg-white border-slate-100 hover:shadow-2xl'}`}>
    <div className="aspect-video bg-slate-900/10 overflow-hidden relative">
       <img src={image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt={title} />
       <div className="absolute inset-0 bg-black/10" />
       {isFeatured && <div className="absolute top-4 right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg"><Star size={14} fill="white" /></div>}
    </div>
    <div className="p-8 flex flex-col flex-1">
       <h4 className={`text-xl font-serif mb-3 line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
       <p className="text-sm text-slate-500 font-light mb-10 line-clamp-2 h-10 leading-relaxed">{desc}</p>
       <div className="flex gap-4 items-center mt-auto">
          <button onClick={onEdit} className="text-[10px] font-bold uppercase tracking-widest text-[#CC1414] hover:text-slate-900 flex items-center gap-2">REVISE <ChevronRight size={14}/></button>
          {!isHero && onDelete && <button onClick={onDelete} className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-red-600 ml-auto transition-colors">DECOMMISSION</button>}
       </div>
    </div>
  </div>
);

const AssetUploadField: React.FC<{ label: string, value: string, onChange: (v: string) => void, isDark: boolean, icon?: any }> = ({ label, value, onChange, isDark, icon }) => (
  <div className="space-y-4">
    <label className="text-[11px] font-bold uppercase tracking-widest opacity-50 flex items-center gap-2">{icon || <ImageIcon size={16}/>} {label}</label>
    <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className={`w-full p-4 rounded-xl text-xs font-mono border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100'}`} placeholder="https://..." />
  </div>
);

const SocialInput: React.FC<{ icon: any, label: string, value: string, onChange: (v: string) => void, isDark: boolean }> = ({ icon, label, value, onChange, isDark }) => (
  <div className={`p-5 rounded-xl border flex items-center gap-4 transition-all ${isDark ? 'bg-white/5 border-white/10 focus-within:border-[#CC1414]/40' : 'bg-slate-50 border-slate-100 focus-within:border-[#CC1414]/40'}`}>
     <div className="text-[#CC1414]">{icon}</div>
     <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className="w-full bg-transparent border-none outline-none text-xs font-medium placeholder:text-slate-300" placeholder={`Social URL...`} />
     </div>
  </div>
);

const EditorBtn: React.FC<{ icon: any, onClick: () => void, label?: string }> = ({ icon, onClick, label }) => (
  <button type="button" onClick={onClick} className="p-2.5 rounded-lg hover:bg-[#CC1414] hover:text-white transition-all flex items-center gap-2 text-slate-500 border border-slate-100 hover:border-transparent">
    {icon}
    {label && <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>}
  </button>
);

export default AdminPortal;
