import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { XCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#05101A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#f59e0b]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="bg-[#0A2540] border border-[#1a365d] p-8 rounded-3xl w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-10 relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FBBF24] shadow-[0_0_20px_rgba(251,191,36,0.3)] rounded-2xl mx-auto flex items-center justify-center mb-4">
            <span className="font-serif font-bold text-2xl text-[#0A2540]">G8</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-white">Staff Login</h2>
          <p className="text-slate-400 text-sm mt-2">Sign in to manage resort bookings</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium mb-6 flex items-start gap-2">
            <XCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-3 font-medium text-white focus:border-[#FBBF24]/50 focus:ring-1 focus:ring-[#FBBF24]/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#05101A] border border-[#1a365d] rounded-xl px-4 py-3 font-medium text-white focus:border-[#FBBF24]/50 focus:ring-1 focus:ring-[#FBBF24]/50 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#FBBF24] hover:bg-[#f59e0b] text-[#0A2540] font-bold py-4 rounded-xl mt-4 transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            {loading ? <div className="w-5 h-5 border-2 border-[#0A2540]/30 border-t-[#0A2540] flex-shrink-0 rounded-full animate-spin"></div> : 'Access Dashboard'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-[#1a365d]">
          <a href="/" className="text-sm font-bold text-slate-500 hover:text-white transition-colors inline-block">
            &larr; Return to Guest Website
          </a>
        </div>
      </div>
    </div>
  );
}
