
import React, { useState } from 'react';
import { AdminSettings, Transaction, OrderStatus } from '../types';

interface Props {
  settings: AdminSettings;
  setSettings: (s: AdminSettings) => void;
  transactions: Transaction[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const AdminDashboard: React.FC<Props> = ({ settings, setSettings, transactions, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 md:gap-12 mb-12 md:mb-20">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">COMMAND NODE</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-[11px]">Core Infrastructure Protocol v6.0</p>
        </div>
        
        <div className="flex w-full md:w-auto bg-white p-1.5 rounded-2xl md:rounded-[32px] border border-slate-100 shadow-sm overflow-x-auto">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 md:flex-none px-6 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-[26px] text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Audit Queue
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 md:flex-none px-6 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-[26px] text-[10px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === 'settings' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Protocols
          </button>
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">
          <div className="lg:col-span-8 bg-white p-6 md:p-16 rounded-[32px] md:rounded-[64px] border border-slate-100 shadow-xl space-y-12 md:space-y-16">
            <section>
              <div className="mb-8 md:mb-10">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Market Index</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Adjust the global exchange spread.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div className="space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex justify-between">
                    <span>Acquisition</span>
                    <span className="text-blue-600">Buy</span>
                  </label>
                  <input type="number" step="0.01" className="w-full px-6 md:px-8 py-5 md:py-6 rounded-2xl md:rounded-[32px] border-2 border-slate-50 bg-slate-50 font-black text-2xl md:text-3xl text-blue-600 outline-none focus:bg-white transition-all tracking-tighter" value={settings.buyPrice} onChange={(e) => setSettings({...settings, buyPrice: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 flex justify-between">
                    <span>Disposal</span>
                    <span className="text-slate-900">Sell</span>
                  </label>
                  <input type="number" step="0.01" className="w-full px-6 md:px-8 py-5 md:py-6 rounded-2xl md:rounded-[32px] border-2 border-slate-50 bg-slate-50 font-black text-2xl md:text-3xl text-slate-900 outline-none focus:bg-white transition-all tracking-tighter" value={settings.sellPrice} onChange={(e) => setSettings({...settings, sellPrice: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-8 md:mb-10">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Clearance Gateways</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Receiving account credentials.</p>
              </div>
              <div className="space-y-8 md:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                   <div className="space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Crypto QR (Public URL)</label>
                      <input className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 text-xs outline-none" value={settings.usdtQrUrl} onChange={(e) => setSettings({...settings, usdtQrUrl: e.target.value})} />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Fiat QR (Public URL)</label>
                      <input className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white font-bold text-slate-600 text-xs outline-none" value={settings.bankQrUrl} onChange={(e) => setSettings({...settings, bankQrUrl: e.target.value})} />
                   </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Detailed Bank Protocols</label>
                  <textarea rows={4} className="w-full px-6 py-5 rounded-2xl md:rounded-[32px] border border-slate-100 bg-slate-50 text-sm font-bold text-slate-500 outline-none focus:bg-white resize-none font-mono uppercase" value={settings.bankDetails} onChange={(e) => setSettings({...settings, bankDetails: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                   <div className="space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Master UPI ID</label>
                      <input className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white font-black text-slate-900 text-sm outline-none" value={settings.upiAddress} onChange={(e) => setSettings({...settings, upiAddress: e.target.value})} />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Line (WA)</label>
                      <input className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white font-black text-slate-900 text-sm outline-none" value={settings.whatsappNumber} onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})} />
                   </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[56px] shadow-lg border border-slate-100">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-8 text-center border-b border-slate-50 pb-4 italic">Crypto Node Preview</span>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <img src={settings.usdtQrUrl} className="w-full aspect-square object-contain rounded-xl" />
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Pending Verification</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {transactions.map(t => (
              <div key={t.id} className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black">
                      {t.type === 'BUY' ? 'B' : 'S'}
                   </div>
                   <div>
                      <p className="font-black text-slate-900 text-lg tracking-tighter italic">{t.mobile}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ref: {t.id.toUpperCase()}</p>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                  {t.status === 'PENDING' ? (
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button onClick={() => onUpdateStatus(t.id, 'APPROVED')} className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100">Release</button>
                      <button onClick={() => onUpdateStatus(t.id, 'REJECTED')} className="flex-1 sm:flex-none px-6 py-3 bg-white text-red-500 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50">Reject</button>
                    </div>
                  ) : (
                    <span className={`text-[11px] font-black uppercase tracking-widest ${t.status === 'APPROVED' ? 'text-green-600' : 'text-red-500'}`}>{t.status}</span>
                  )}
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No transactions in queue</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
