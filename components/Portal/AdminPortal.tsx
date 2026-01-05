
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, FileText, Users, MapPin, 
  LogOut, Plus, Edit2, Trash2, 
  CheckCircle, Archive, MessageSquare, RefreshCw,
  Mic, Calendar, ImageIcon, Save, X, 
  ArrowRight, FileType, Filter, Inbox, Clock, ShieldCheck,
  Briefcase, Phone, Search, Bell, Activity, Globe, Zap,
  Sun, Moon, ChevronRight, Download, Link, ExternalLink,
  Heading1, Heading2, AlignLeft, Type, FileUp, Music, Database,
  Linkedin, MessageCircle, Mail, BookOpen, Star, Palette, List, Maximize2, Monitor,
  UserCheck, GraduationCap, Eye
} from 'lucide-react';
import { contentService } from '../../services/contentService';
import { HeroContent, Insight, Author, Inquiry, OfficeLocation, Job, JobApplication } from '../../types';

interface AdminPortalProps {
  onLogout: () => void;
}

type Tab = 'hero' | 'insights' | 'reports' | 'podcasts' | 'casestudy' | 'authors' | 'offices' | 'appointments' | 'rfp' | 'jobs' | 'applications';

const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Entities
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [offices, setOffices] = useState<OfficeLocation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Editor States
  const [isEditing, setIsEditing] = useState(false);
  const [activeEntity, setActiveEntity] = useState<any>(null);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubHero = contentService.subscribeHero(setHero);
    const unsubInsights = contentService.subscribeInsights(setInsights);
    const unsubAuthors = contentService.subscribeAuthors(setAuthors);
    const unsubOffices = contentService.subscribeOffices(setOffices);
    const unsubInquiries = contentService.subscribeInquiries(setInquiries);
    const unsubJobs = contentService.subscribeJobs(setJobs);
    const unsubApps = contentService.subscribeAllApplications(setApplications);

    return () => {
      unsubHero();
      unsubInsights();
      unsubAuthors();
      unsubOffices();
      unsubInquiries();
      unsubJobs();
      unsubApps();
    };
  }, []);

  useEffect(() => {
    if (loading && (hero || insights.length > 0)) setLoading(false);
  }, [hero, insights]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleEdit = (entity: any, tab?: Tab) => {
    if (tab) setActiveTab(tab);
    setActiveEntity({ ...entity });
    setIsEditing(true);
  };

  const handleNew = () => {
    const templates: Record<Tab, any> = {
      hero: { ...hero },
      insights: { type: 'insights', title: '', category: 'LEGAL UPDATE', desc: '', content: '', image: '', bannerImage: '' },
      reports: { type: 'reports', title: '', category: 'ANNUAL REPORT', desc: '', pdfUrl: '', image: '', bannerImage: '' },
      podcasts: { type: 'podcasts', title: '', category: 'LEGAL PODCAST', desc: '', audioUrl: '', season: '1', episode: '1', image: '', bannerImage: '' },
      casestudy: { type: 'casestudy', title: '', category: 'MANDATE OUTCOME', desc: '', content: '', image: '', bannerImage: '' },
      authors: { name: '', title: 'Counsel', bio: '', linkedin: '', whatsapp: '', email: '', qualifications: '', image: '' },
      offices: { city: '', address: '', phone: '', email: '', coordinates: { lat: 28.61, lng: 77.20 }, image: '' },
      jobs: { title: '', department: 'Litigation', location: 'New Delhi', description: '', status: 'active' },
      appointments: null,
      rfp: null,
      applications: null
    };
    setActiveEntity(templates[activeTab]);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (activeTab === 'hero') {
        // Save hero logic via service
      } else if (['insights', 'reports', 'podcasts', 'casestudy'].includes(activeTab)) {
        await contentService.saveInsight(activeEntity);
      } else if (activeTab === 'authors') {
        await contentService.saveAuthor(activeEntity);
      } else if (activeTab === 'offices') {
        await contentService.saveOffice(activeEntity);
      } else if (activeTab === 'jobs') {
        await contentService.saveJob(activeEntity);
      }
      setIsEditing(false);
      setActiveEntity(null);
    } catch (err) {
      alert("Protocol error: Save failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm data erasure?")) return;
    if (['insights', 'reports', 'podcasts', 'casestudy'].includes(activeTab)) {
      await contentService.deleteInsight(id);
    } else if (activeTab === 'authors') {
      await contentService.deleteAuthor(id);
    } else if (activeTab === 'offices') {
      await contentService.deleteOffice(id);
    } else if (activeTab === 'jobs') {
      await contentService.deleteJob(id);
    }
  };

  const filteredInquiries = inquiries.filter(i => 
    (activeTab === 'appointments' ? i.type === 'appointment' : i.type !== 'appointment') &&
    (i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.uniqueId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredApplications = applications.filter(app => 
    app.data.personal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#0A0B0E]' : 'bg-[#F4F7FE]'}`}>
      
      {/* Sidebar - Precision Control */}
      <aside className={`w-[290px] flex flex-col h-full shrink-0 border-r ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="p-8 pb-4">
          <div className="flex items-center gap-4 mb-10">
             <div className="w-12 h-12 bg-[#CC1414] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-red-500/20">
                <ShieldCheck size={28}/>
             </div>
             <span className={`text-[18px] font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                AKP ADMIN
             </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Chamber Strategy</div>
          <SidebarLink id="hero" active={activeTab} set={setActiveTab} label="Hero Banners" icon={<Database size={18} />} isDark={isDarkMode} />
          <SidebarLink id="insights" active={activeTab} set={setActiveTab} label="Legal Insights" icon={<FileText size={18} />} isDark={isDarkMode} />
          <SidebarLink id="reports" active={activeTab} set={setActiveTab} label="Annual Reports" icon={<BookOpen size={18} />} isDark={isDarkMode} />
          <SidebarLink id="podcasts" active={activeTab} set={setActiveTab} label="Podcasts" icon={<Music size={18} />} isDark={isDarkMode} />
          <SidebarLink id="casestudy" active={activeTab} set={setActiveTab} label="Case Studies" icon={<Star size={18} />} isDark={isDarkMode} />
          
          <div className="px-4 py-2 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Organization</div>
          <SidebarLink id="authors" active={activeTab} set={setActiveTab} label="Managing Authors" icon={<Users size={18} />} isDark={isDarkMode} />
          <SidebarLink id="offices" active={activeTab} set={setActiveTab} label="Global Offices" icon={<MapPin size={18} />} isDark={isDarkMode} />
          
          <div className="px-4 py-2 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Talent Hub</div>
          <SidebarLink id="jobs" active={activeTab} set={setActiveTab} label="Mandate Openings" icon={<Briefcase size={18} />} isDark={isDarkMode} />
          <SidebarLink id="applications" active={activeTab} set={setActiveTab} label="Talent Pool" icon={<UserCheck size={18} />} isDark={isDarkMode} badge={applications.filter(a => a.status === 'Received').length} />

          <div className="px-4 py-2 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Communications</div>
          <SidebarLink id="appointments" active={activeTab} set={setActiveTab} label="Appointments" icon={<Calendar size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type === 'appointment' && i.status === 'new').length} />
          <SidebarLink id="rfp" active={activeTab} set={setActiveTab} label="Mandate Inbox" icon={<Inbox size={18} />} isDark={isDarkMode} badge={inquiries.filter(i => i.type !== 'appointment' && i.status === 'new').length} />
        </nav>

        <div className="p-4 mt-auto border-t border-white/5 space-y-2">
          <button onClick={toggleDarkMode} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">
            {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
            {isDarkMode ? 'Luminous Protocol' : 'Nocturnal Protocol'}
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-[#CC1414] hover:bg-red-50 transition-colors">
            <LogOut size={18} /> Exit Matrix
          </button>
        </div>
      </aside>

      {/* Main Command Area */}
      <main className="flex-1 overflow-y-auto px-12 py-12 custom-scrollbar relative">
        
        {/* Header Branding */}
        <div className="flex justify-between items-center mb-16 animate-reveal-up">
           <div>
              <h2 className={`text-4xl font-serif mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {activeTab === 'hero' ? 'Strategic Banners' : 
                 activeTab === 'insights' ? 'Thought Leadership' :
                 activeTab === 'reports' ? 'Institutional Reports' :
                 activeTab === 'podcasts' ? 'Podcast Broadcasts' :
                 activeTab === 'authors' ? 'Counsel Profiles' :
                 activeTab === 'offices' ? 'Chamber Locations' :
                 activeTab === 'appointments' ? 'Consultation Logs' : 
                 activeTab === 'jobs' ? 'Recruitment Mandates' :
                 activeTab === 'applications' ? 'Candidate Dossiers' : 'Mandate Inbox'}
              </h2>
              <p className="text-slate-400 font-light italic">Managing {activeTab} protocol within the AK Pandey framework.</p>
           </div>
           
           {['hero', 'insights', 'reports', 'podcasts', 'casestudy', 'authors', 'offices', 'jobs'].includes(activeTab) && !isEditing && (
             <button 
              onClick={handleNew}
              className="px-10 py-5 bg-[#CC1414] text-white text-[11px] font-bold tracking-[0.3em] uppercase rounded-full hover:scale-105 transition-all shadow-xl shadow-red-500/20 flex items-center gap-3"
             >
               <Plus size={18}/> Add New Entity
             </button>
           )}

           {['appointments', 'rfp', 'applications'].includes(activeTab) && (
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, Name or Role..." 
                  className={`pl-12 pr-6 py-4 rounded-full border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-1 focus:ring-[#CC1414] min-w-[300px]`}
                 />
              </div>
           )}
        </div>

        {/* Dynamic Content Grid */}
        <div className="animate-reveal-up stagger-1">
          {isEditing ? (
            <div className={`p-12 rounded-3xl border shadow-2xl ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'}`}>
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-serif">Editing Entity</h3>
                  <button onClick={() => setIsEditing(false)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  {/* Left Column: Media & Meta */}
                  <div className="lg:col-span-4 space-y-10">
                     {activeTab !== 'jobs' && (
                       <ImagePicker 
                          label="Thumbnail / Portrait" 
                          value={activeEntity.image} 
                          onChange={v => setActiveEntity({...activeEntity, image: v})} 
                          isDark={isDarkMode} 
                       />
                     )}
                     
                     {activeEntity.bannerImage !== undefined && (
                        <ImagePicker 
                          label="Banner / Hero Backdrop" 
                          value={activeEntity.bannerImage} 
                          onChange={v => setActiveEntity({...activeEntity, bannerImage: v})} 
                          isDark={isDarkMode} 
                          wide
                        />
                     )}
                     
                     <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Visibility & Status</label>
                        <div className="flex flex-col gap-3">
                           {activeEntity.isFeatured !== undefined && (
                             <ToggleButton 
                              active={activeEntity.isFeatured} 
                              onClick={() => setActiveEntity({...activeEntity, isFeatured: !activeEntity.isFeatured})} 
                              label="Feature on Home" 
                             />
                           )}
                           {activeEntity.showInHero !== undefined && (
                             <ToggleButton 
                              active={activeEntity.showInHero} 
                              onClick={() => setActiveEntity({...activeEntity, showInHero: !activeEntity.showInHero})} 
                              label="Show in Main Hero" 
                             />
                           )}
                           {activeTab === 'jobs' && (
                              <ToggleButton 
                                active={activeEntity.status === 'active'} 
                                onClick={() => setActiveEntity({...activeEntity, status: activeEntity.status === 'active' ? 'closed' : 'active'})} 
                                label="Mandate Active" 
                              />
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Content Matrix */}
                  <div className="lg:col-span-8 space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputField label="Primary Title" value={activeEntity.title || activeEntity.name} onChange={v => setActiveEntity({...activeEntity, [activeEntity.name !== undefined ? 'name' : 'title']: v})} isDark={isDarkMode} />
                        
                        {activeTab === 'jobs' ? (
                           <div className="space-y-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Department</label>
                              <select 
                                 value={activeEntity.department}
                                 onChange={e => setActiveEntity({...activeEntity, department: e.target.value})}
                                 className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                              >
                                 <option>Litigation</option>
                                 <option>Corporate</option>
                                 <option>Support</option>
                                 <option>Internship</option>
                              </select>
                           </div>
                        ) : (
                           <InputField label="Category / Role" value={activeEntity.category || activeEntity.title} onChange={v => setActiveEntity({...activeEntity, [activeEntity.category !== undefined ? 'category' : 'title']: v})} isDark={isDarkMode} />
                        )}
                     </div>

                     {activeTab === 'jobs' && (
                        <InputField label="Location (City/Branch)" value={activeEntity.location} onChange={v => setActiveEntity({...activeEntity, location: v})} isDark={isDarkMode} icon={<MapPin size={16}/>} />
                     )}

                     {activeTab === 'podcasts' && (
                       <div className="grid grid-cols-2 gap-8 p-8 bg-blue-50/10 border border-blue-500/20 rounded-2xl">
                          <InputField label="Season" value={activeEntity.season} onChange={v => setActiveEntity({...activeEntity, season: v})} isDark={isDarkMode} />
                          <InputField label="Episode" value={activeEntity.episode} onChange={v => setActiveEntity({...activeEntity, episode: v})} isDark={isDarkMode} />
                          <div className="col-span-2">
                             <FileUploader label="Audio Source (.mp3)" value={activeEntity.audioUrl} onChange={v => setActiveEntity({...activeEntity, audioUrl: v})} icon={<Music/>} />
                          </div>
                       </div>
                     )}

                     {activeTab === 'reports' && (
                       <div className="p-8 bg-red-50/10 border border-red-500/20 rounded-2xl">
                          <FileUploader label="PDF Document (.pdf)" value={activeEntity.pdfUrl} onChange={v => setActiveEntity({...activeEntity, pdfUrl: v})} icon={<FileUp/>} />
                       </div>
                     )}

                     {activeTab === 'authors' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-slate-50/30 rounded-2xl">
                          <InputField label="LinkedIn URL" value={activeEntity.linkedin} onChange={v => setActiveEntity({...activeEntity, linkedin: v})} isDark={isDarkMode} icon={<Linkedin size={16}/>} />
                          <InputField label="WhatsApp Contact" value={activeEntity.whatsapp} onChange={v => setActiveEntity({...activeEntity, whatsapp: v})} isDark={isDarkMode} icon={<MessageCircle size={16}/>} />
                          <InputField label="Official Email" value={activeEntity.email} onChange={v => setActiveEntity({...activeEntity, email: v})} isDark={isDarkMode} icon={<Mail size={16}/>} />
                          <InputField label="Qualifications" value={activeEntity.qualifications} onChange={v => setActiveEntity({...activeEntity, qualifications: v})} isDark={isDarkMode} icon={<BookOpen size={16}/>} />
                       </div>
                     )}

                     {activeTab === 'offices' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-slate-50/30 rounded-2xl">
                          <InputField label="Phone" value={activeEntity.phone} onChange={v => setActiveEntity({...activeEntity, phone: v})} isDark={isDarkMode} icon={<Phone size={16}/>} />
                          <InputField label="Email" value={activeEntity.email} onChange={v => setActiveEntity({...activeEntity, email: v})} isDark={isDarkMode} icon={<Mail size={16}/>} />
                          <div className="col-span-2">
                             <InputField label="Full Address" value={activeEntity.address} onChange={v => setActiveEntity({...activeEntity, address: v})} isDark={isDarkMode} />
                          </div>
                          <InputField label="Latitude" value={activeEntity.coordinates.lat.toString()} onChange={v => setActiveEntity({...activeEntity, coordinates: {...activeEntity.coordinates, lat: parseFloat(v) || 0}})} isDark={isDarkMode} />
                          <InputField label="Longitude" value={activeEntity.coordinates.lng.toString()} onChange={v => setActiveEntity({...activeEntity, coordinates: {...activeEntity.coordinates, lng: parseFloat(v) || 0}})} isDark={isDarkMode} />
                       </div>
                     )}

                     <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Brief Narration / Summary</label>
                        <textarea 
                          value={activeEntity.desc || activeEntity.bio || activeEntity.description} 
                          onChange={e => setActiveEntity({...activeEntity, [activeEntity.bio !== undefined ? 'bio' : activeEntity.description !== undefined ? 'description' : 'desc']: e.target.value})}
                          className={`w-full p-6 border rounded-2xl min-h-[120px] focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200'}`}
                          placeholder="Summary for cards and snippets..."
                        />
                     </div>

                     {['insights', 'casestudy'].includes(activeTab) && (
                       <RichContentEditor 
                          value={activeEntity.content || ''} 
                          onChange={v => setActiveEntity({...activeEntity, content: v})} 
                          isDark={isDarkMode} 
                       />
                     )}

                     <div className="pt-12 border-t border-white/5 flex gap-6">
                        <button onClick={handleSave} className="flex-1 py-5 bg-[#CC1414] text-white text-[11px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3">
                           <Save size={18}/> AUTHORIZE SAVE
                        </button>
                        <button onClick={() => setIsEditing(false)} className="px-12 py-5 bg-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-widest rounded-2xl">Cancel</button>
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-8">
               {/* Entity Lists */}
               {['insights', 'reports', 'podcasts', 'casestudy'].includes(activeTab) && (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {insights.filter(i => i.type === activeTab).map(item => (
                      <DashboardCard 
                        key={item.id} 
                        title={item.title} 
                        subtitle={item.category} 
                        image={item.image} 
                        onEdit={() => handleEdit(item)} 
                        onDelete={() => handleDelete(item.id)}
                        isDark={isDarkMode}
                      />
                    ))}
                 </div>
               )}

               {activeTab === 'jobs' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {jobs.map(job => (
                      <div key={job.id} className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'} group relative`}>
                         <div className="flex justify-between items-start mb-6">
                            <div>
                               <span className="px-3 py-1 bg-[#CC1414]/5 text-[#CC1414] text-[9px] font-bold uppercase tracking-widest rounded-full">{job.department}</span>
                               <h3 className={`text-2xl font-serif mt-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{job.title}</h3>
                               <p className="text-slate-400 text-xs mt-1 flex items-center gap-2"><MapPin size={12}/> {job.location}</p>
                            </div>
                            <div className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${job.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'}`}>
                               {job.status}
                            </div>
                         </div>
                         <p className="text-slate-500 text-sm font-light line-clamp-2 mb-8">{job.description}</p>
                         <div className="flex gap-3">
                            <button onClick={() => handleEdit(job)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-900 hover:text-white transition-all rounded-xl text-[10px] font-bold uppercase tracking-widest">Manage Mandate</button>
                            <button onClick={() => handleDelete(job.id)} className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-xl"><Trash2 size={16}/></button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}

               {activeTab === 'authors' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {authors.map(author => (
                      <DashboardCard 
                        key={author.id} 
                        title={author.name} 
                        subtitle={author.title} 
                        image={author.image} 
                        onEdit={() => handleEdit(author)} 
                        onDelete={() => handleDelete(author.id)}
                        isDark={isDarkMode}
                        portrait
                      />
                    ))}
                 </div>
               )}

               {activeTab === 'offices' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {offices.map(office => (
                      <DashboardCard 
                        key={office.id} 
                        title={office.city} 
                        subtitle={office.address} 
                        image={office.image} 
                        onEdit={() => handleEdit(office)} 
                        onDelete={() => handleDelete(office.id)}
                        isDark={isDarkMode}
                      />
                    ))}
                 </div>
               )}

               {['appointments', 'rfp', 'applications'].includes(activeTab) && (
                  <div className={`overflow-hidden rounded-3xl border ${isDarkMode ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'}`}>
                     <table className="w-full text-left border-collapse">
                        <thead className={isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'}>
                           <tr>
                              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest">{activeTab === 'applications' ? 'Dossier Image' : 'Unique ID'}</th>
                              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest">{activeTab === 'applications' ? 'Candidate Profile' : 'Principal Liaison'}</th>
                              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest">{activeTab === 'applications' ? 'Mandate Applied' : 'Date Received'}</th>
                              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest">Status</th>
                              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {(activeTab === 'applications' ? filteredApplications : filteredInquiries).map(item => (
                              <tr key={item.id} className={`hover:bg-slate-500/5 transition-colors group`}>
                                 <td className="px-8 py-6">
                                    {activeTab === 'applications' ? (
                                       <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                          {(item as JobApplication).data.personal.photo ? (
                                             <img src={(item as JobApplication).data.personal.photo} className="w-full h-full object-cover" />
                                          ) : (
                                             <div className="w-full h-full flex items-center justify-center text-slate-300"><Users size={16}/></div>
                                          )}
                                       </div>
                                    ) : (
                                       <span className="text-[11px] font-bold tracking-widest text-[#CC1414] bg-red-500/5 px-3 py-1 rounded-full">{(item as Inquiry).uniqueId}</span>
                                    )}
                                 </td>
                                 <td className="px-8 py-6">
                                    <p className={`font-serif text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab === 'applications' ? (item as JobApplication).data.personal.name : item.name}</p>
                                    <p className="text-xs text-slate-500 font-light">{activeTab === 'applications' ? (item as JobApplication).data.personal.email : item.email}</p>
                                 </td>
                                 <td className="px-8 py-6">
                                    {activeTab === 'applications' ? (
                                       <div>
                                          <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{(item as JobApplication).jobTitle}</p>
                                          <p className="text-xs text-slate-500">{new Date((item as JobApplication).submittedDate).toLocaleDateString()}</p>
                                       </div>
                                    ) : (
                                       <span className="text-sm text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                                    )}
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                       <div className={`w-2 h-2 rounded-full ${['new', 'Received'].includes(item.status) ? 'bg-[#CC1414] animate-pulse' : 'bg-slate-300'}`} />
                                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.status}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       {activeTab === 'applications' ? (
                                          <button 
                                             onClick={() => setSelectedApp(item as JobApplication)}
                                             className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
                                             title="Review Dossier"
                                          >
                                             <Eye size={16}/>
                                          </button>
                                       ) : (
                                          <button className="p-3 hover:bg-slate-100 rounded-xl transition-colors"><Maximize2 size={16}/></button>
                                       )}
                                       <button className="p-3 hover:bg-slate-100 rounded-xl transition-colors"><CheckCircle size={16}/></button>
                                       <button className="p-3 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>
          )}
        </div>

        {/* Application Review Modal */}
        {selectedApp && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col ${isDarkMode ? 'bg-[#111216] text-white' : 'bg-white text-slate-900'}`}>
                 <header className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-[#CC1414] text-white">
                    <div>
                       <h3 className="text-2xl font-serif">Candidate Dossier</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Reviewing Application for: {selectedApp.jobTitle}</p>
                    </div>
                    <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={24}/></button>
                 </header>
                 
                 <div className="flex-1 overflow-y-auto p-10 md:p-16 space-y-16 custom-scrollbar">
                    <section className="flex flex-col md:flex-row gap-12 items-start">
                       <div className="w-40 h-40 rounded-3xl overflow-hidden bg-slate-100 border-4 border-white shadow-xl shrink-0">
                          {selectedApp.data.personal.photo ? (
                             <img src={selectedApp.data.personal.photo} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50"><Users size={48}/></div>
                          )}
                       </div>
                       <div className="space-y-6">
                          <div>
                             <h4 className="text-4xl font-serif">{selectedApp.data.personal.name}</h4>
                             <p className="text-slate-400 font-light italic mt-1">{selectedApp.data.personal.email} • {selectedApp.data.personal.mobile}</p>
                          </div>
                          <div className="flex flex-wrap gap-4">
                             <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                                <GraduationCap size={16} className="text-[#CC1414]"/>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Academic Verified</span>
                             </div>
                             <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                                <ShieldCheck size={16} className="text-[#CC1414]"/>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Security Clearance</span>
                             </div>
                          </div>
                       </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <DossierItem label="Academic Pedigree" icon={<GraduationCap size={20}/>} content={selectedApp.data.education} isDark={isDarkMode} />
                       <DossierItem label="Mandate History" icon={<Briefcase size={20}/>} content={selectedApp.data.experience} isDark={isDarkMode} />
                       <div className="md:col-span-2">
                          <DossierItem label="Personal Motivations & Interests" icon={<Star size={20}/>} content={selectedApp.data.interests} isDark={isDarkMode} />
                       </div>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#CC1414]"><Download size={24}/></div>
                          <div>
                             <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Legal Resume Dossier</p>
                             <p className="text-xs text-slate-400">Authorized PDF for Partner Review</p>
                          </div>
                       </div>
                       <button className="px-8 py-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#CC1414] transition-all rounded-lg">Download Mandate</button>
                    </div>
                 </div>

                 <footer className="px-10 py-8 border-t border-white/5 flex gap-4 bg-slate-50/50">
                    <button className="flex-1 py-4 bg-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-green-600/20 hover:scale-105 transition-all">Move to Interview Stage</button>
                    <button className="flex-1 py-4 bg-[#CC1414] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/20 hover:scale-105 transition-all">Authorize Rejection</button>
                    <button onClick={() => setSelectedApp(null)} className="px-10 py-4 bg-white border border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all">Close Dossier</button>
                 </footer>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

// --- SUPPORTING COMPONENTS ---

const DossierItem = ({ label, icon, content, isDark }: any) => (
  <div className={`p-8 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'} space-y-4 shadow-sm`}>
     <div className="flex items-center gap-3 text-slate-400">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
     </div>
     <p className="text-lg font-light leading-relaxed whitespace-pre-line">{content || 'No documentation provided.'}</p>
  </div>
);

const SidebarLink = ({ id, active, set, label, icon, isDark, badge }: any) => (
  <button 
    onClick={() => set(id)} 
    className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 transform active:scale-95 ${active === id ? 'bg-[#CC1414] text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    {icon}
    <span className="text-[13px] font-bold tracking-widest uppercase flex-1 text-left">{label}</span>
    {badge ? <span className="px-2.5 py-1 bg-white/20 text-white text-[10px] font-bold rounded-full">{badge}</span> : null}
  </button>
);

const InputField = ({ label, value, onChange, isDark, icon, type = "text" }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
       {icon} {label}
    </label>
    <input 
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC1414] font-light ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
    />
  </div>
);

const ImagePicker = ({ label, value, onChange, isDark, wide }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
    <div 
      className={`relative group overflow-hidden rounded-2xl border border-dashed transition-all hover:border-[#CC1414] ${wide ? 'aspect-video' : 'aspect-square'} ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}
    >
       {value ? (
         <img src={value} className="w-full h-full object-cover" />
       ) : (
         <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3">
            <ImageIcon size={32} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Select Asset</span>
         </div>
       )}
       <input 
          type="file" 
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => onChange(reader.result);
              reader.readAsDataURL(file);
            }
          }}
          className="absolute inset-0 opacity-0 cursor-pointer" 
       />
       {value && (
         <button onClick={() => onChange('')} className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-[#CC1414]"><X size={14}/></button>
       )}
    </div>
  </div>
);

const FileUploader = ({ label, value, onChange, icon }: any) => (
  <div className="space-y-4">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
    <div className="flex items-center gap-4">
       <div className="flex-1 p-4 bg-slate-100 rounded-xl text-slate-400 text-xs overflow-hidden truncate">
          {value ? value.substring(0, 50) + '...' : 'No mandate file attached.'}
       </div>
       <label className="px-6 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-[#CC1414] transition-all flex items-center gap-2">
          {icon} Upload
          <input 
            type="file" 
            className="hidden" 
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => onChange(reader.result);
                reader.readAsDataURL(file);
              }
            }}
          />
       </label>
    </div>
  </div>
);

const ToggleButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className="flex items-center gap-4 group">
     <div className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-[#CC1414]' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? 'left-7' : 'left-1'}`} />
     </div>
     <span className="text-xs font-medium text-slate-500 group-hover:text-slate-900">{label}</span>
  </button>
);

const DashboardCard = ({ title, subtitle, image, onEdit, onDelete, isDark, portrait }: any) => (
  <div className={`group relative rounded-3xl border overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 ${isDark ? 'bg-[#111216] border-white/5' : 'bg-white border-slate-100'}`}>
     <div className={`${portrait ? 'aspect-[3/4]' : 'aspect-video'} overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-[2s]`}>
        <img src={image || 'https://picsum.photos/seed/legal/800/600'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
     </div>
     <div className="p-8">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#CC1414] mb-2">{subtitle}</h4>
        <p className={`text-xl font-serif leading-tight line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</p>
        <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
           <button onClick={onEdit} className="flex-1 py-3 bg-slate-100 hover:bg-slate-900 hover:text-white transition-all rounded-xl text-[10px] font-bold uppercase tracking-widest">Edit</button>
           <button onClick={onDelete} className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-xl"><Trash2 size={16}/></button>
        </div>
     </div>
  </div>
);

const RichContentEditor = ({ value, onChange, isDark }: any) => {
  const addBlock = (type: string) => {
    let tag = '';
    if (type === 'h1') tag = '# Heading 1\n';
    if (type === 'h2') tag = '## Heading 2\n';
    if (type === 'text') tag = 'New paragraph content...\n';
    if (type === 'gap') tag = '\n\n';
    if (type === 'bullet') tag = '* Keypoint point\n';
    onChange(value + tag);
  };

  return (
    <div className="space-y-4">
       <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Strategic Content Narrative (Markdown Supported)</label>
       <div className={`border rounded-2xl overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
          <div className={`flex flex-wrap gap-2 p-3 border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
             <ToolbarButton onClick={() => addBlock('h1')} icon={<Heading1 size={14}/>} label="H1" />
             <ToolbarButton onClick={() => addBlock('h2')} icon={<Heading2 size={14}/>} label="H2" />
             <ToolbarButton onClick={() => addBlock('text')} icon={<AlignLeft size={14}/>} label="Para" />
             <ToolbarButton onClick={() => addBlock('gap')} icon={<Maximize2 size={14}/>} label="Spacer" />
             <ToolbarButton onClick={() => addBlock('bullet')} icon={<List size={14}/>} label="List" />
             <ToolbarButton onClick={() => addBlock('image')} icon={<ImageIcon size={14}/>} label="Insert Image" />
          </div>
          <textarea 
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full p-8 min-h-[400px] focus:outline-none font-light text-lg leading-relaxed bg-transparent text-inherit resize-y"
            placeholder="Craft your mandate narrative here..."
          />
       </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, icon, label }: any) => (
  <button onClick={onClick} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:border-[#CC1414] hover:text-[#CC1414] transition-all">
    {icon} {label}
  </button>
);

export default AdminPortal;
