
import React, { useState } from 'react';
import { User, Transaction, AdminSettings, OrderType } from '../types';

interface Props {
  user: User;
  settings: AdminSettings;
  transactions: Transaction[];
  onNewOrder: (t: Transaction) => void;
}

const UserDashboard: React.FC<Props> = ({ user, settings, transactions, onNewOrder }) => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('SELL');
  const [txid, setTxid] = useState('');
  const [amount, setAmount] = useState('');
  const [payout, setPayout] = useState('');

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txid || !amount || !payout) return;
    
    const newT: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      mobile: user.mobile,
      type: orderType,
      txid,
      amount: parseFloat(amount),
      payoutDetails: payout,
      status: 'PENDING',
      timestamp: Date.now()
    };
    onNewOrder(newT);
    setShowOrderForm(false);
    setTxid('');
    setAmount('');
    setPayout('');
  };

  const currentRate = orderType === 'BUY' ? settings.buyPrice : settings.sellPrice;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 md:gap-12 mb-12 md:mb-20">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"></span>
            <span className="text-[9px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Verified Connection Node 01</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic leading-none">DASHBOARD</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.1em] text-[10px] md:text-xs">Manage your secure exchange movements.</p>
        </div>
        
        {!showOrderForm && (
          <div className="flex flex-col sm:flex-row gap-4 p-1.5 md:p-2 bg-white rounded-2xl md:rounded-[40px] border border-slate-100 w-full lg:w-auto shadow-sm">
            <button 
              onClick={() => { setOrderType('BUY'); setShowOrderForm(true); }}
              className="px-8 md:px-12 py-4 md:py-5 bg-blue-600 text-white font-black rounded-xl md:rounded-[32px] text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
            >
              Acquire USDT
            </button>
            <button 
              onClick={() => { setOrderType('SELL'); setShowOrderForm(true); }}
              className="px-8 md:px-12 py-4 md:py-5 bg-slate-900 text-white font-black rounded-xl md:rounded-[32px] text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-100"
            >
              Liquidate USDT
            </button>
          </div>
        )}
      </div>

      {showOrderForm ? (
        <div className="bg-white p-6 md:p-16 rounded-[32px] md:rounded-[64px] border border-slate-100 shadow-xl animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12 md:mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-3 md:mb-4 uppercase italic">
                {orderType === 'BUY' ? 'Acquisition Protocol' : 'Liquidation Protocol'}
              </h2>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-blue-50 rounded-lg border border-blue-100 text-[10px] font-black text-blue-600 uppercase">
                  Rate: ₹{currentRate.toFixed(2)}
                </span>
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest hidden sm:inline">Descriptive Audit Ready</span>
              </div>
            </div>
            <button onClick={() => setShowOrderForm(false)} className="self-end md:self-auto w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border border-slate-100">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            {/* Step 1 */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-50 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm">1</div>
                   <span className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-widest">Asset Transfer</span>
                </div>

                <p className="text-[10px] md:text-[11px] text-slate-500 font-bold uppercase tracking-wide mb-8 leading-relaxed">
                  Transfer the {orderType === 'BUY' ? 'INR' : 'USDT'} amount to the verified clearance node below.
                </p>
                
                {orderType === 'SELL' ? (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100 inline-block w-full">
                       <img src={settings.usdtQrUrl} alt="QR" className="w-40 h-40 md:w-48 md:h-48 mx-auto" />
                    </div>
                    <div className="p-5 bg-white rounded-2xl border border-slate-100 cursor-pointer text-center" onClick={() => {navigator.clipboard.writeText(settings.usdtWalletAddress); alert('Copied')}}>
                      <span className="text-[9px] font-black text-slate-400 uppercase mb-2 block tracking-widest">TRC20 Public Wallet</span>
                      <code className="block text-[10px] text-blue-600 font-mono font-bold break-all">{settings.usdtWalletAddress}</code>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100">
                       <img src={settings.bankQrUrl} alt="QR" className="w-40 h-40 md:w-48 md:h-48 mx-auto mb-4" />
                       <p className="text-[9px] font-black text-slate-900 uppercase text-center tracking-widest">Settlement QR</p>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">UPI Address</p>
                        <p className="text-base font-black text-slate-900">{settings.upiAddress}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Bank Node</p>
                        <p className="text-[10px] font-bold text-slate-500 leading-relaxed font-mono whitespace-pre-wrap">{settings.bankDetails}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Steps 2-4 */}
            <form onSubmit={handleOrder} className="lg:col-span-8 space-y-10 md:space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-1">
                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-900">2</div>
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Ref / TXID</label>
                  </div>
                  <input required placeholder="Paste proof identifier" className="w-full px-6 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm font-bold text-slate-900 transition-all font-mono" value={txid} onChange={(e) => setTxid(e.target.value)} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-1">
                    <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-900">3</div>
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Quantity</label>
                  </div>
                  <div className="relative">
                    <input type="number" step="0.01" required placeholder="0.00" className="w-full px-6 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-lg md:text-xl font-black text-slate-900 pr-20" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase">USDT</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 p-8 md:p-12 rounded-[32px] md:rounded-[48px] shadow-xl shadow-blue-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                 <div className="text-center sm:text-left">
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest block mb-2">Settlement Value</span>
                    <span className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter italic">₹{(parseFloat(amount || '0') * currentRate).toLocaleString()}</span>
                 </div>
                 <div className="px-5 py-2.5 bg-white/10 rounded-full border border-white/20 text-center">
                    <span className="text-[9px] font-black text-white uppercase tracking-widest block">Elite Index Applied</span>
                 </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 px-1">
                   <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-900">4</div>
                   <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     {orderType === 'BUY' ? 'Your USDT Target' : 'Your Bank/UPI Target'}
                   </label>
                </div>
                <textarea required rows={3} placeholder={orderType === 'BUY' ? "Destination USDT Address (TRC20)" : "Bank A/c No, IFSC or UPI ID"} className="w-full px-6 py-5 rounded-xl md:rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm font-bold text-slate-900 transition-all resize-none" value={payout} onChange={(e) => setPayout(e.target.value)} />
              </div>

              <button type="submit" className={`w-full py-5 md:py-7 font-black rounded-2xl md:rounded-[40px] shadow-xl transition-all hover:scale-[1.01] active:scale-95 text-[10px] md:text-xs uppercase tracking-[0.4em] ${orderType === 'BUY' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
                Execute Secure Protocol
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Ledger History</h3>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Real-time Node Audit</div>
          </div>
          
          {transactions.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[32px] md:rounded-[48px] py-24 md:py-40 text-center shadow-sm">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Zero transaction signatures found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {/* For mobile we use cards, for desktop we could use table but cards work better for "descriptive" feel */}
              {transactions.map(t => (
                <div key={t.id} className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-blue-200 transition-colors">
                  <div className="flex gap-4 md:gap-6 items-center">
                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-[10px] font-black border ${t.type === 'BUY' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                      {t.type}
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic"># {t.id.toUpperCase()}</div>
                      <div className="text-sm md:text-lg font-black text-slate-900 tracking-tight">{new Date(t.timestamp).toLocaleDateString()} at {new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-center">
                    <div className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter">₹{(t.amount * (t.type === 'BUY' ? settings.buyPrice : settings.sellPrice)).toLocaleString()}</div>
                    <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.amount} USDT Units</div>
                  </div>
                  <div className="w-full md:w-auto flex justify-between md:justify-end items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                    <span className={`inline-flex px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      t.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      t.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' :
                      'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {t.status}
                    </span>
                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">
                      {t.status === 'PENDING' ? "Awaiting Audit" : 
                       t.status === 'APPROVED' ? "Settled" : "Refused"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
