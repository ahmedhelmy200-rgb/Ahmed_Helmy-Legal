
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
import { LegalCase, Client, Invoice, UserRole, Expense, FutureDebt, SystemSettings, LegalDocument } from './types';
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
  const [futureDebts, setFutureDebts] = useState<FutureDebt[]>([]);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  
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
        const [casesData, clientsData, invoicesData, expensesData, debtsData, docsData] = await Promise.all([
          db.fetchAll('cases'),
          db.fetchAll('clients'),
          db.fetchAll('invoices'),
          db.fetchAll('expenses'),
          db.fetchAll('future_debts'),
          db.fetchAll('documents')
        ]);
        
        setCases(casesData || []);
        setClients(clientsData || []);
        setInvoices(invoicesData || []);
        setExpenses(expensesData || []);
        setFutureDebts(debtsData || []);
        setDocuments(docsData || []);
        
        const savedSettings = localStorage.getItem('helm_settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
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

  const handleAddInvoice = (inv: Invoice) => {
    setInvoices([inv, ...invoices]);
    db.save('invoices', inv);
  };

  const handleAddExpense = (exp: Expense) => {
    setExpenses([exp, ...expenses]);
    db.save('expenses', exp);
  };

  const handleAddFutureDebt = (debt: FutureDebt) => {
    setFutureDebts([debt, ...futureDebts]);
    db.save('future_debts', debt);
  };

  const handleUpdateInvoice = (updatedInv: Invoice) => {
    setInvoices(invoices.map(i => i.id === updatedInv.id ? updatedInv : i));
    db.update('invoices', updatedInv.id, updatedInv);
  };

  const goBack = () => setActiveTab('dashboard');

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 font-sans">
        <div className="w-32 h-32 mb-8 animate-pulse">
            <ICONS.Logo />
        </div>
        <div className="w-64 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#d4af37] animate-progress"></div>
        </div>
        <p className="mt-6 text-sm font-bold tracking-widest text-slate-400 uppercase">HELM SMART 3.5 IS LOADING...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Login onLogin={handleLogin} clients={clients} />;
  
  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden flex flex-col lg:flex-row-reverse dir-rtl font-sans selection:bg-[#d4af37] selection:text-white text-slate-800">
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
        <div className="page-transition min-h-screen p-4 lg:p-8">
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
              onAddCase={(c) => { setCases([c, ...cases]); db.save('cases', c); }} 
              onUpdateCase={(c) => { setCases(cases.map(i => i.id === c.id ? c : i)); db.update('cases', c.id, c); }} 
              onAddClient={(c) => { setClients([...clients, c]); db.save('clients', c); }}
              onBack={goBack}
            />
          )}

          {activeTab === 'clients' && (
            <ClientManagement 
              clients={clients} 
              cases={cases} 
              invoices={invoices}
              documents={documents}
              onAddClient={(c) => { setClients([...clients, c]); db.save('clients', c); }} 
              onUpdateClient={(c) => { setClients(clients.map(i => i.id === c.id ? c : i)); db.update('clients', c.id, c); }} 
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
              onAddExpense={handleAddExpense}
              onAddFutureDebt={handleAddFutureDebt}
              onAddInvoice={handleAddInvoice}
              onUpdateInvoice={handleUpdateInvoice}
              onBack={goBack}
            />
          )}

          {activeTab === 'laws' && <LawsLibrary onBack={goBack} />}

          {activeTab === 'settings' && (
            <AdminSettings settings={settings} onUpdateSettings={(s) => { setSettings(s); localStorage.setItem('helm_settings', JSON.stringify(s)); }} onBack={goBack} />
          )}
        </div>
      </main>

      <style>{`
        @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress { animation: progress 2s ease-in-out infinite; }
        .page-transition { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;
