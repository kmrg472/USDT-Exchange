
import React, { useState } from 'react';
import { View } from '../types';

interface Props {
  mode: View.LOGIN | View.REGISTER;
  onSuccess: (mobile: string, pass: string) => void;
  setView: (v: View) => void;
}

const Auth: React.FC<Props> = ({ mode, onSuccess, setView }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) return alert("Please provide a valid 10-digit identifier.");
    onSuccess(mobile, password);
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 md:mt-24 px-6 mb-20 md:mb-32">
      <div className="glass-panel p-8 md:p-20 rounded-[40px] md:rounded-[64px] relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -ml-32 -mt-32 opacity-60"></div>
        
        <div className="text-center mb-10 md:mb-16 relative">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-[24px] md:rounded-[32px] flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-lg shadow-blue-100">
             <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 italic uppercase text-slate-900">
            {mode === View.LOGIN ? 'IDENTIFY' : 'MEMBERSHIP'}
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[11px]">
            Secure node access portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 relative">
          <div className="space-y-3">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Member Identifier</label>
            <input 
              type="tel"
              required
              placeholder="10-digit mobile"
              className="w-full px-6 md:px-10 py-5 md:py-6 rounded-2xl md:rounded-[32px] border-2 border-slate-100 bg-white focus:border-blue-600 outline-none text-lg md:text-xl font-bold text-slate-900 transition-all tracking-tight"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Secure Passkey</label>
            <input 
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-6 md:px-10 py-5 md:py-6 rounded-2xl md:rounded-[32px] border-2 border-slate-100 bg-white focus:border-blue-600 outline-none text-lg md:text-xl font-bold text-slate-900 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-5 md:py-7 bg-slate-900 text-white font-black rounded-[24px] md:rounded-[40px] hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98] text-[10px] md:text-xs uppercase tracking-[0.3em] mt-4"
          >
            {mode === View.LOGIN ? 'Initialize Access' : 'Register Profile'}
          </button>
        </form>

        <div className="mt-12 md:mt-16 text-center pt-8 md:pt-10 border-t border-slate-100 relative">
          {mode === View.LOGIN ? (
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              New to node? {' '}
              <button onClick={() => setView(View.REGISTER)} className="text-blue-600 hover:text-slate-900 font-black underline underline-offset-4">
                Register Now
              </button>
            </p>
          ) : (
            <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
              Already registered? {' '}
              <button onClick={() => setView(View.LOGIN)} className="text-blue-600 hover:text-slate-900 font-black underline underline-offset-4">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
