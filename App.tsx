
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AIConsultant from './components/AIConsultant';
import CaseManagement from './components/CaseManagement';
import ClientManagement from './components/ClientManagement';
import Accounting from './components/Accounting';
import LawsLibrary from './components/LawsLibrary';
import Login from './components/Login';
import { db } from './services/database';
import { LegalCase, Client, Invoice, UserRole, Expense, PaymentReceipt } from './types';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('visitor');
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);

  // محاكاة طلبات من الموقع الإلكتروني
  const [webLeads] = useState([
    { id: 1, name: 'سالم الشامسي', type: 'استشارة تجارية', date: 'اليوم', status: 'جديد' },
    { id: 2, name: 'فاطمة الظاهري', type: 'أحوال شخصية', date: 'أمس', status: 'قيد المراجعة' }
  ]);

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
      } catch (error) {
        console.error("فشل المزامنة:", error);
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
    setActiveTab('dashboard'); // دائماً التوجيه للرئيسية بعد الدخول
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('visitor');
    setCurrentClientId(null);
  };

  const handleAddCase = async (newCase: LegalCase) => {
    await db.save('cases', newCase);
    setCases(prev => [newCase, ...prev]);
  };

  const handleUpdateCase = async (updatedCase: LegalCase) => {
    await db.update('cases', updatedCase.id, updatedCase);
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleAddClient = async (newClient: Client) => {
    await db.save('clients', newClient);
    setClients(prev => [...prev, newClient]);
  };

  const handleUpdateClient = async (updatedClient: Client) => {
    await db.update('clients', updatedClient.id, updatedClient);
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleAddInvoice = async (newInvoice: Invoice) => {
    await db.save('invoices', newInvoice);
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const handleUpdateInvoice = async (updatedInvoice: Invoice) => {
    await db.update('invoices', updatedInvoice.id, updatedInvoice);
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  };

  const handleAddExpense = async (newExp: Expense) => {
    await db.save('expenses', newExp);
    setExpenses(prev => [newExp, ...prev]);
  };

  const handleAddReceipt = async (newReceipt: PaymentReceipt) => {
    await db.save('receipts', newReceipt);
    setReceipts(prev => [newReceipt, ...prev]);
  };

  // وظيفة الرجوع للقائمة الرئيسية
  const goBack = () => setActiveTab('dashboard');

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
        <div className="w-48 h-24 mb-8">
            <ICONS.Logo />
        </div>
        <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-[#d4af37] animate-progress"></div>
        </div>
        <p className="mt-4 text-[10px] font-black tracking-[0.3em] text-[#d4af37] uppercase">Linking to ahmed-helmy-legal.vercel.app...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Login onLogin={handleLogin} clients={clients} />;
  
  const displayCases = userRole === 'client' ? cases.filter(c => c.clientId === currentClientId) : cases;
  const displayInvoices = userRole === 'client' ? invoices.filter(i => i.clientId === currentClientId) : invoices;
  const displayReceipts = userRole === 'client' ? receipts.filter(r => r.clientId === currentClientId) : receipts;

  return (
    <div className="bg-[#f8fafc] min-h-screen relative overflow-x-hidden dir-rtl font-sans">
      <main className="min-h-screen">
        <div className="page-transition min-h-screen">
          
          {/* Main Dashboard / Home Menu */}
          {activeTab === 'dashboard' && (
            <Dashboard 
              cases={cases} 
              clients={clients} 
              invoices={invoices} 
              userRole={userRole} 
              webLeads={webLeads} 
              onNavigate={setActiveTab}
              onLogout={handleLogout}
            />
          )}

          {/* Sub Sections with Back Button */}
          {activeTab === 'ai-consultant' && (
            <AIConsultant onBack={goBack} />
          )}

          {activeTab === 'cases' && (
            <CaseManagement 
              cases={displayCases} 
              clients={clients} 
              userRole={userRole} 
              onAddCase={handleAddCase} 
              onUpdateCase={handleUpdateCase} 
              onAddClient={handleAddClient} 
              onBack={goBack}
            />
          )}

          {activeTab === 'clients' && (
            <ClientManagement 
              clients={clients} 
              cases={cases} 
              onAddClient={handleAddClient} 
              onUpdateClient={handleUpdateClient} 
              onBack={goBack}
            />
          )}

          {activeTab === 'accounting' && (
            <Accounting 
              invoices={displayInvoices} 
              cases={displayCases} 
              clients={clients} 
              expenses={expenses} 
              receipts={displayReceipts} 
              onAddInvoice={handleAddInvoice} 
              onUpdateInvoice={handleUpdateInvoice} 
              onAddExpense={handleAddExpense} 
              onAddReceipt={handleAddReceipt} 
              userRole={userRole} 
              onBack={goBack}
            />
          )}

          {activeTab === 'laws' && (
            <LawsLibrary onBack={goBack} />
          )}
        </div>
      </main>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
