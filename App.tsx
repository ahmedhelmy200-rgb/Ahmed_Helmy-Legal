
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AIConsultant from './components/AIConsultant';
import CaseManagement from './components/CaseManagement';
import ClientManagement from './components/ClientManagement';
import Accounting from './components/Accounting';
import LawsLibrary from './components/LawsLibrary';
import AdminSettings from './components/AdminSettings';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import { db } from './services/database';
import { LegalCase, Client, Invoice, UserRole, Expense, PaymentReceipt, SystemSettings, FutureDebt } from './types';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('visitor');
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [futureDebts, setFutureDebts] = useState<FutureDebt[]>([]);
  
  const [settings, setSettings] = useState<SystemSettings>({
    primaryColor: '#d4af37',
    language: 'ar',
    logo: '',
    stamp: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [casesData, clientsData, invoicesData, expensesData, receiptsData] = await Promise.all([
          db.fetchAll('cases'),
          db.fetchAll('clients'),
          db.fetchAll('invoices'),
          db.fetchAll('expenses'),
          db.fetchAll('receipts')
        ]);
        
        setCases(casesData || []);
        setClients(clientsData || []);
        setInvoices(invoicesData || []);
        setExpenses(expensesData || []);
        setReceipts(receiptsData || []);
        
        const savedSettings = localStorage.getItem('helm_settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("فشل مزامنة البيانات:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogin = (role: UserRole, clientId?: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    if (clientId) setCurrentClientId(clientId);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('visitor');
    setCurrentClientId(null);
  };

  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem('helm_settings', JSON.stringify(newSettings));
  };

  const goBack = () => setActiveTab('dashboard');

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-slate-800">
        <div className="w-48 h-24 mb-10 flex items-center justify-center p-4">
            <img src={settings.logo || "https://img.icons8.com/fluency/240/scales.png"} className="w-full h-full object-contain animate-pulse" />
        </div>
        <div className="w-64 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
            <div className="h-full bg-[#d4af37] animate-progress"></div>
        </div>
        <p className="mt-6 text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">HELM SMART PORTAL IS LOADING...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Login onLogin={handleLogin} clients={clients} />;
  
  return (
    <div className="bg-white min-h-screen relative overflow-x-hidden flex flex-col lg:flex-row-reverse dir-rtl font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={handleLogout}
        logo={settings.logo}
      />

      <main className="flex-1 lg:mr-72 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-30">
          <div className="w-10 h-10"><ICONS.Logo /></div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-slate-50 rounded-xl">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>

        <div className="page-transition min-h-screen">
          {activeTab === 'dashboard' && (
            <Dashboard 
              cases={cases} 
              clients={clients} 
              invoices={invoices} 
              userRole={userRole} 
              onNavigate={setActiveTab}
              onLogout={handleLogout}
              logo={settings.logo}
            />
          )}

          {activeTab === 'ai-consultant' && <AIConsultant onBack={goBack} />}

          {activeTab === 'cases' && (
            <CaseManagement 
              cases={userRole === 'client' ? cases.filter(c => c.clientId === currentClientId) : cases} 
              clients={clients} 
              userRole={userRole} 
              onAddCase={(c) => setCases([c, ...cases])} 
              onUpdateCase={(c) => setCases(cases.map(i => i.id === c.id ? c : i))} 
              onAddClient={(c) => setClients([...clients, c])}
              onBack={goBack}
            />
          )}

          {activeTab === 'clients' && (
            <ClientManagement 
              clients={clients} 
              cases={cases} 
              invoices={invoices}
              receipts={receipts}
              onAddClient={(c) => setClients([...clients, c])} 
              onUpdateClient={(c) => setClients(clients.map(i => i.id === c.id ? c : i))} 
              onBack={goBack}
            />
          )}

          {activeTab === 'accounting' && (
            <Accounting 
              invoices={userRole === 'client' ? invoices.filter(i => i.clientId === currentClientId) : invoices} 
              expenses={expenses}
              futureDebts={futureDebts}
              clients={clients}
              cases={cases}
              onAddExpense={(e) => setExpenses([e, ...expenses])}
              onAddFutureDebt={(d) => setFutureDebts([d, ...futureDebts])}
              onBack={goBack}
            />
          )}

          {activeTab === 'laws' && <LawsLibrary onBack={goBack} />}

          {activeTab === 'settings' && (
            <AdminSettings settings={settings} onUpdateSettings={updateSettings} onBack={goBack} />
          )}
        </div>
      </main>

      <style>{`
        @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress { animation: progress 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default App;
