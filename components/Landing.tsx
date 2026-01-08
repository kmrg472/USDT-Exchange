
import React from 'react';

interface Props {
  sellPrice: number;
  buyPrice: number;
  onGetStarted: () => void;
}

const Landing: React.FC<Props> = ({ sellPrice, buyPrice, onGetStarted }) => {
  return (
    <div className="relative pt-10 md:pt-24 pb-20 md:pb-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 items-center mb-24 md:mb-40">
          <div className="lg:col-span-7 space-y-8 md:space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[9px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Institutional Node v6.0</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-black leading-[1.1] tracking-tighter text-slate-900">
              Reliable <span className="text-blue-600">USDT</span> Settlement.
            </h1>
            
            <p className="text-base md:text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
              Experience the fastest USDT to INR conversions in India. Built for professional traders with real-time settlement tracking and zero hidden fees.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 uppercase tracking-widest text-xs md:text-sm"
              >
                Place Trade
              </button>
              <div className="flex items-center gap-4 text-slate-400">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04c0 4.835 1.353 9.32 3.718 13.14a11.969 11.969 0 0014.9 0c2.365-3.82 3.718-8.305 3.718-13.14z" /></svg>
                 </div>
                 <div className="text-[10px] md:text-[11px] font-bold leading-tight uppercase tracking-widest">
                    Verified <span className="block text-slate-900">Escrow Network</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="glass-panel p-8 md:p-14 rounded-[40px] md:rounded-[64px] relative shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-[80px] -mr-10 -mt-10 opacity-60"></div>
              
              <div className="space-y-10 relative z-10">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">Buy USDT (Index)</span>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">₹{buyPrice.toFixed(2)}</span>
                    <span className="text-blue-600 text-[10px] font-black uppercase">Standard</span>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-100"></div>

                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">Sell USDT (Index)</span>
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">₹{sellPrice.toFixed(2)}</span>
                    <span className="text-green-600 text-[10px] font-black uppercase">Instant</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-4 relative z-10">
                 <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Network Mode</span>
                   <span className="text-slate-900">TRC20</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Transfer Cycle</span>
                   <span className="text-blue-600">Real-time</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <section className="mb-24 md:mb-40">
           <div className="text-center mb-16 md:mb-20">
              <span className="text-[10px] md:text-[11px] font-black text-blue-600 uppercase tracking-[0.4em] block mb-4 italic">The Protocol</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 leading-tight">Elite Flow Architecture</h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto mt-4 text-sm md:text-lg px-4 leading-relaxed">Our step-by-step descriptive process ensures every transaction is safe and verified.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
              {[
                { 
                  step: "01", 
                  title: "Secure Auth", 
                  desc: "Identify yourself with your mobile ID. Every user gets a private, encrypted digital ledger for audit history.",
                  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                },
                { 
                  step: "02", 
                  title: "Transfer Proof", 
                  desc: "Follow descriptive instructions to transfer assets. Provide the blockchain hash for our auditors to verify in real-time.",
                  icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                },
                { 
                  step: "03", 
                  title: "Ledger Payout", 
                  desc: "Once verified, our system initiates a direct payout to your target bank or UPI in less than 5 minutes.",
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                }
              ].map((item, idx) => (
                <div key={idx} className="custom-card p-8 md:p-12 rounded-[32px] md:rounded-[56px] relative group overflow-hidden bg-white">
                   <div className="absolute -top-6 -right-6 text-7xl md:text-9xl font-black text-slate-50 opacity-10 group-hover:text-blue-50 transition-all">{item.step}</div>
                   <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 shadow-sm">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                   </div>
                   <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 uppercase italic text-slate-900 leading-tight">{item.title}</h3>
                   <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Final Conversion Section */}
        <section className="mb-24 md:mb-40 text-center">
          <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 bg-slate-900 rounded-[40px] md:rounded-[64px] text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[120px]"></div>
            </div>
            <div className="relative z-10 space-y-8 md:space-y-12">
               <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase italic">Institutional Precision.</h2>
               <p className="text-slate-400 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                 Join 5,000+ traders using our settlement node for high-volume USDT liquidity. Instant verification, no delays.
               </p>
               <button 
                 onClick={onGetStarted}
                 className="px-12 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 uppercase tracking-widest text-xs md:text-sm"
               >
                 Place Trade Now
               </button>
            </div>
          </div>
        </section>

        {/* Descriptive Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: 'Network Reach', val: '₹500Cr+' },
            { label: 'Uptime Protocol', val: '100.0%' },
            { label: 'Settlement Node', val: 'v6.0' },
            { label: 'Verification', val: 'Active' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[40px] border border-slate-100 text-center shadow-sm">
              <span className="block text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.4em] mb-2 md:mb-3">{item.label}</span>
              <span className="text-xl md:text-3xl font-black tracking-tighter text-slate-900 italic leading-none">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
