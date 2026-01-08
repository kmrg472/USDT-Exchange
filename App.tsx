
import React, { useState, useEffect } from 'react';
import { View, User, Transaction, AdminSettings } from './types';
import Landing from './components/Landing';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [user, setUser] = useState<User | null>(null);

  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('exchange_settings_v4');
    return saved ? JSON.parse(saved) : {
      sellPrice: 91.50,
      buyPrice: 94.20,
      whatsappNumber: "919000000000",
      usdtWalletAddress: "TRX_WALLET_ADDRESS_EXAMPLE",
      usdtQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TRX_WALLET_ADDRESS_EXAMPLE",
      bankDetails: "ACCOUNT HOLDER: ADMIN\nACCOUNT NUMBER: 123456789\nIFSC CODE: SBIN0001234\nBANK: STATE BANK OF INDIA",
      bankQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=admin@upi",
      upiAddress: "admin@upi"
    };
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('exchange_transactions_v4');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('exchange_settings_v4', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('exchange_transactions_v4', JSON.stringify(transactions));
  }, [transactions]);

  const handleLogin = (mobile: string, pass: string) => {
    if (mobile === "0000000000" && pass === "admin") {
      setUser({ mobile, isAdmin: true });
      setCurrentView(View.ADMIN_DASHBOARD);
    } else {
      setUser({ mobile, isAdmin: false });
      setCurrentView(View.USER_DASHBOARD);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(View.LANDING);
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        view={currentView} 
        user={user} 
        onLogout={handleLogout} 
        setView={setCurrentView} 
      />
      
      <main className="flex-grow">
        {currentView === View.LANDING && (
          <Landing 
            sellPrice={settings.sellPrice} 
            buyPrice={settings.buyPrice}
            onGetStarted={() => setCurrentView(View.LOGIN)} 
          />
        )}
        
        {(currentView === View.LOGIN || currentView === View.REGISTER) && (
          <Auth 
            mode={currentView} 
            onSuccess={handleLogin} 
            setView={setCurrentView} 
          />
        )}

        {currentView === View.USER_DASHBOARD && user && (
          <UserDashboard 
            user={user} 
            settings={settings}
            transactions={transactions.filter(t => t.mobile === user.mobile)}
            onNewOrder={(order) => setTransactions([order, ...transactions])}
          />
        )}

        {currentView === View.ADMIN_DASHBOARD && user?.isAdmin && (
          <AdminDashboard 
            settings={settings}
            setSettings={setSettings}
            transactions={transactions}
            onUpdateStatus={(id, status) => {
              setTransactions(transactions.map(t => t.id === id ? { ...t, status } : t));
            }}
          />
        )}
      </main>

      <WhatsAppButton number={settings.whatsappNumber} />
      
      <footer className="py-12 md:py-20 border-t border-[var(--border-alpha)] bg-white mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" /></svg>
             </div>
             <span className="font-black text-2xl uppercase tracking-tighter text-slate-900">USDT ELITE</span>
          </div>
          <p className="text-slate-500 text-sm md:text-base mb-8 font-medium max-w-sm leading-relaxed">
            Premium USDT settlement node. Optimized for speed, reliability, and precision on free hosting environments.
          </p>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">
            &copy; {new Date().getFullYear()} Elite Network. Built for Professionals.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
