
import React, { useState, useEffect } from 'react';
import { Menu, LogOut, Clock, CheckCircle, Search, FileText, Bell, RefreshCw, ChevronRight, Phone, Mail, Receipt, Download, FileUp, Calendar, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { auth } from '../../firebase';
import { contentService } from '../../services/contentService';
import { UserProfile, ClientDocument } from '../../types';
import BookingPage from '../BookingPage';

interface PremierClientDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
  userProfile: UserProfile;
}

const PremierClientDashboard: React.FC<PremierClientDashboardProps> = ({ onLogout, onNavigateHome, userProfile }) => {
  const [docs, setDocs] = useState<ClientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [uploadFile, setUploadFile] = useState<string>('');
  const [uploadTitle, setUploadTitle] = useState('');

  useEffect(() => {
    const unsub = contentService.subscribeClientDocuments(userProfile.uid, (data) => {
      setDocs(data);
      setLoading(false);
    });
    return () => unsub();
  }, [userProfile.uid]);

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) return;
    await contentService.addClientDocument({
        userId: userProfile.uid,
        type: 'brief',
        title: uploadTitle,
        url: uploadFile,
        uploadedBy: 'client',
        date: new Date().toISOString()
    });
    setUploadTitle(''); setUploadFile('');
    alert("Document securely transmitted to your counsel.");
  };

  const advocate = userProfile.assignedAdvocate;

  if (showBooking) {
     return <BookingPage onBack={() => setShowBooking(false)} />;
  }

  return (
    <div className="bg-[#050608] min-h-screen pt-20 font-sans text-white">
      <header className="fixed top-0 w-full z-[60] bg-[#0A0B0E] border-b border-white/5 h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onNavigateHome} className="p-2 -ml-2 text-white hover:text-[#CC1414] transition-colors"><Menu size={20}/></button>
          <div className="flex items-center font-sans uppercase tracking-[0.15em] font-bold text-[13px] md:text-[15px]">PREMIER CLIENT MATRIX</div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
           <button className="p-1 text-slate-400 hover:text-white transition-colors"><Bell size={18}/></button>
           <div className="w-8 h-8 bg-[#CC1414] rounded-full flex items-center justify-center text-white font-bold font-serif shadow-lg shadow-red-500/30">{userProfile.name.charAt(0)}</div>
           <button onClick={onLogout} className="p-1 text-slate-400 hover:text-[#CC1414] transition-colors"><LogOut size={18}/></button>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 animate-reveal-up">
           <div>
              <p className="text-[#CC1414] font-bold uppercase tracking-[0.3em] text-xs mb-4">Strategic Dashboard</p>
              <h1 className="text-4xl md:text-6xl font-serif mb-4">Welcome, {userProfile.name}</h1>
              <p className="text-slate-400 font-light text-lg">{userProfile.companyName || 'Private Client'} • Status: Active</p>
           </div>
           <button 
              onClick={() => setShowBooking(true)}
              className="px-10 py-5 bg-white text-slate-900 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#CC1414] hover:text-white transition-all rounded-sm shadow-2xl flex items-center gap-4"
           >
              Book Priority Consultation <ArrowRight size={16}/>
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* LEFT COLUMN: ADVOCATE & ACTIONS */}
           <div className="lg:col-span-4 space-y-8">
              {/* Advocate Card */}
              <div className="p-10 rounded-3xl bg-[#111216] border border-white/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#CC1414]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-8">Strategic Liaison</h4>
                 
                 {advocate ? (
                    <div className="text-center">
                       <div className="w-24 h-24 mx-auto rounded-full border-2 border-[#CC1414] p-1 mb-6">
                          <img src={advocate.photo || 'https://via.placeholder.com/150'} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"/>
                       </div>
                       <h3 className="text-2xl font-serif mb-2">{advocate.name}</h3>
                       <p className="text-slate-400 text-xs uppercase tracking-widest mb-8">{advocate.designation}</p>
                       <div className="flex gap-4 justify-center">
                          <a href={`tel:${advocate.phone}`} className="p-4 bg-[#CC1414] rounded-xl hover:scale-110 transition-transform shadow-lg shadow-red-900/50"><Phone size={20}/></a>
                          <a href={`mailto:${advocate.email}`} className="p-4 bg-white/10 rounded-xl hover:bg-white hover:text-black transition-all"><Mail size={20}/></a>
                       </div>
                    </div>
                 ) : (
                    <div className="text-center py-8">
                       <User size={48} className="mx-auto text-slate-700 mb-4"/>
                       <p className="text-slate-400 italic">Assigning Counsel...</p>
                    </div>
                 )}
              </div>

              {/* Upload Box */}
              <div className="p-10 rounded-3xl bg-[#111216] border border-white/5">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">Secure Upload</h4>
                 <div className="space-y-4">
                    <input 
                       value={uploadTitle} 
                       onChange={e => setUploadTitle(e.target.value)} 
                       placeholder="Document Name" 
                       className="w-full p-4 bg-black/20 border border-white/10 rounded-xl text-sm focus:border-[#CC1414] outline-none transition-colors"
                    />
                    <label className="flex items-center justify-center gap-3 p-4 border border-dashed border-white/20 rounded-xl hover:border-[#CC1414] hover:bg-[#CC1414]/5 cursor-pointer transition-all">
                       <FileUp size={16} className="text-slate-400"/>
                       <span className="text-xs uppercase tracking-widest text-slate-400">Select File</span>
                       <input type="file" className="hidden" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             const reader = new FileReader();
                             reader.onload = () => setUploadFile(reader.result as string);
                             reader.readAsDataURL(file);
                          }
                       }}/>
                    </label>
                    <button onClick={handleUpload} disabled={!uploadFile} className="w-full py-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#CC1414] hover:text-white transition-all disabled:opacity-50">Transmit Securely</button>
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: DOCS & INVOICES */}
           <div className="lg:col-span-8">
              <div className="p-10 rounded-3xl bg-[#111216] border border-white/5 min-h-[600px]">
                 <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                    <ShieldCheck className="text-[#CC1414]" size={24}/>
                    <h3 className="text-xl font-serif">Encrypted Document Vault</h3>
                 </div>

                 {loading ? (
                    <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-slate-600"/></div>
                 ) : docs.length === 0 ? (
                    <div className="text-center py-20 text-slate-600 font-light italic">No documents currently on file.</div>
                 ) : (
                    <div className="space-y-4">
                       {docs.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                             <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.type === 'invoice' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-400'}`}>
                                   {doc.type === 'invoice' ? <Receipt size={24}/> : <FileText size={24}/>}
                                </div>
                                <div>
                                   <h4 className="font-serif text-lg text-slate-200 group-hover:text-white transition-colors">{doc.title}</h4>
                                   <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                                      {new Date(doc.date).toLocaleDateString()} • {doc.uploadedBy === 'admin' ? 'Received from Counsel' : 'Uploaded by You'}
                                   </p>
                                </div>
                             </div>
                             
                             {doc.type === 'invoice' && (
                                <span className="px-4 py-1 bg-yellow-500/20 text-yellow-500 text-[9px] font-bold uppercase tracking-widest rounded-full">
                                   {doc.status || 'Payment Due'}
                                </span>
                             )}

                             <a href={doc.url} download className="p-3 bg-black rounded-xl text-slate-400 hover:text-white transition-colors"><Download size={18}/></a>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default PremierClientDashboard;
