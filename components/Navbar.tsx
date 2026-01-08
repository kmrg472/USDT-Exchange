
import React from 'react';
import { View, User } from '../types';

interface Props {
  view: View;
  user: User | null;
  onLogout: () => void;
  setView: (v: View) => void;
}

const Navbar: React.FC<Props> = ({ view, user, onLogout, setView }) => {
  return (
    <nav className="glass-panel sticky top-0 z-50 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm">
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => setView(View.LANDING)}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 transition-transform active:scale-95">
          <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="flex flex-col -space-y-0.5">
          <span className="text-lg md:text-2xl font-black uppercase tracking-tighter text-slate-900">USDT ELITE</span>
          <span className="text-[9px] md:text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">Secure Node</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Portal Access</span>
              <span className="text-sm font-bold text-slate-700">{user.mobile}</span>
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-[10px] font-black text-red-500 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-all uppercase tracking-widest"
            >
              Exit
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setView(View.LOGIN)}
            className="px-6 md:px-8 py-2.5 md:py-3 bg-slate-900 text-white text-[10px] md:text-xs font-black rounded-xl hover:bg-blue-600 transition-all shadow-md active:scale-95 uppercase tracking-widest"
          >
            Place Trade
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
