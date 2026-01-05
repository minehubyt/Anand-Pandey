
import React, { useState } from 'react';
import { Calendar, Send, Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { analyzeLegalQuery } from '../services/geminiService';
import { contentService } from '../services/contentService';

const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    query: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{ suggestedPracticeArea: string; urgency: string; briefAdvice: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleQueryBlur = async () => {
    if (formData.query.length > 20) {
      setAnalyzing(true);
      const result = await analyzeLegalQuery(formData.query);
      if (result) setAnalysis(result);
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contentService.addInquiry({
        type: 'appointment',
        name: formData.name,
        email: formData.email,
        details: {
          preferredDate: formData.date,
          query: formData.query,
          aiAnalysis: analysis
        }
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Cloud connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="mb-10 flex justify-center">
            <CheckCircle className="w-24 h-24 text-green-500 animate-bounce" />
          </div>
          <h3 className="text-4xl font-serif mb-6">Appointment Requested</h3>
          <p className="text-xl text-slate-600 mb-12 font-light leading-relaxed">Thank you, {formData.name}. Your request has been securely transmitted to our cloud servers. Our chamber team will contact you at {formData.email} shortly.</p>
          <button 
            onClick={() => { setSubmitted(false); setAnalysis(null); setFormData({name:'', email:'', date:'', query:''}); }}
            className="px-10 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-[#CC1414] transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="appointments" className="py-24 md:py-40 bg-blue-900 text-white overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 xl:px-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32 items-center">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-blue-200 mb-6">Consultation</h2>
            <h3 className="text-[clamp(2rem,5vw,3.75rem)] font-serif mb-10 leading-[1.15]">Secure Your Private Strategy Session</h3>
            <p className="text-lg md:text-xl text-blue-100 font-light mb-16 leading-relaxed">
              Inquiries are processed in real-time. Provide a brief overview of your case, and our AI assistant will help prioritize your request for Advocate Anand Kumar Pandey.
            </p>
            
            <div className="space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-blue-800 flex items-center justify-center shrink-0 shadow-lg">
                  <Calendar className="w-7 h-7" />
                </div>
                <span className="text-lg font-light text-blue-50">Flexible virtual and in-person slots available</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-blue-800 flex items-center justify-center shrink-0 shadow-lg">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <span className="text-lg font-light text-blue-50">Complete confidentiality guaranteed</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-14 shadow-2xl rounded-sm text-slate-900 w-full">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-blue-900 transition-colors bg-transparent font-light text-lg"
                    placeholder="E.g. Rajesh Kumar"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-blue-900 transition-colors bg-transparent font-light text-lg"
                    placeholder="E.g. rajesh@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Preferred Date</label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full border-b border-slate-200 py-4 focus:outline-none focus:border-blue-900 transition-colors bg-transparent font-light text-lg"
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Initial Case Overview</label>
                <textarea
                  required
                  rows={4}
                  value={formData.query}
                  onChange={(e) => setFormData({...formData, query: e.target.value})}
                  onBlur={handleQueryBlur}
                  className="w-full border border-slate-100 p-6 focus:outline-none focus:border-blue-900 transition-colors bg-slate-50 font-light text-[16px] md:text-lg resize-none shadow-inner"
                  placeholder="Tell us briefly about your legal challenge..."
                />
                
                {analyzing && (
                  <div className="absolute bottom-6 right-6 flex items-center gap-3 text-xs text-blue-600 bg-white px-4 py-2 shadow-xl border border-blue-50 rounded-full animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI Analyzing Query...
                  </div>
                )}
              </div>

              {analysis && (
                <div className="p-8 bg-blue-50 border-l-4 border-blue-800 animate-fade-in shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-800" />
                    <span className="text-[10px] font-bold uppercase text-blue-900 tracking-[0.2em]">Smart Assistant Insights</span>
                  </div>
                  <div className="text-[16px] space-y-3 font-light text-slate-700 leading-relaxed">
                    <p><span className="font-semibold text-slate-900">Practice Area:</span> {analysis.suggestedPracticeArea}</p>
                    <p><span className="font-semibold text-slate-900">Priority:</span> {analysis.urgency}</p>
                    <p className="italic mt-4 text-blue-800 font-medium">"{analysis.briefAdvice}"</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-blue-900 hover:bg-slate-900 text-white font-bold uppercase tracking-[0.3em] text-[12px] transition-all flex items-center justify-center gap-4 group shadow-xl transform hover:-translate-y-1 disabled:opacity-50"
              >
                {submitting ? 'TRANSMITTING...' : 'AUTHORIZE REQUEST'}
                <Send className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
