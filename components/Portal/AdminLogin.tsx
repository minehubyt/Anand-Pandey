
import React, { useState } from 'react';
import { X, Shield, ArrowRight, Mail } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth, googleProvider } from '../../firebase';

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check for specific 'admin' / 'admin' credentials as requested
    if (username === 'admin' && password === 'admin') {
      setTimeout(() => {
        onLogin();
        setLoading(false);
      }, 1000);
      return;
    }

    // Fallback to Firebase for other email-based accounts if necessary
    try {
      if (username.includes('@')) {
        await signInWithEmailAndPassword(auth, username, password);
        onLogin();
      } else {
        setError('Invalid administrative credentials.');
      }
    } catch (err: any) {
      setError('Invalid administrative credentials or network error.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err: any) {
      setError('Google authentication failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-hidden relative">
      {/* Background with scale-out animation */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2400')] bg-cover bg-center opacity-10 blur-sm scale-105 animate-scale-out" />
      
      <div className="relative z-10 w-full max-w-lg bg-white p-12 lg:p-16 shadow-2xl animate-reveal-up rounded-sm">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-slate-400 hover:text-[#CC1414] transition-colors group"
          aria-label="Exit Login"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="text-center mb-16">
          {/* Brand Logo Header */}
          <div className="mb-10 flex flex-col items-center">
            <div className="flex items-center font-sans uppercase tracking-[0.18em] text-[#A6192E] font-medium mb-2">
              <span className="text-[20px] lg:text-[24px] leading-none font-medium">AK PANDEY</span>
              <span className="text-[12px] lg:text-[14px] mx-1.5 self-center">&</span>
              <span className="text-[20px] lg:text-[24px] leading-none font-medium">ASSOCIATES</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-100"></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 ml-1">Username</label>
            <input 
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 p-5 text-slate-900 focus:border-[#CC1414] focus:outline-none transition-all font-light rounded-sm"
              placeholder="Enter liaison ID"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 ml-1">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 p-5 text-slate-900 focus:border-[#CC1414] focus:outline-none transition-all font-light rounded-sm"
              placeholder="Enter authorization key"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-medium animate-pulse text-center">{error}</p>}

          <div className="space-y-4 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-[#CC1414] transition-all flex items-center justify-center gap-4 shadow-2xl transform active:scale-95 disabled:opacity-50 rounded-sm"
            >
              {loading ? 'AUTHORIZING...' : 'AUTHORIZE SESSION'} <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-slate-300 bg-white px-4">Or</div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-5 border border-slate-200 text-slate-900 text-[11px] font-bold tracking-[0.3em] uppercase hover:border-[#CC1414] hover:text-[#CC1414] transition-all flex items-center justify-center gap-4 shadow-sm active:scale-95 disabled:opacity-50 rounded-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
              Liaison via Google
            </button>
          </div>
        </form>

        <div className="mt-16 pt-10 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-3 text-slate-300">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">ENCRYPTED LIAISON CHANNEL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
