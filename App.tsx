
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIConsultant from './components/AIConsultant';
import CaseManagement from './components/CaseManagement';
import ClientManagement from './components/ClientManagement';
import Accounting from './components/Accounting';
import Login from './components/Login';
import { LegalCase, CaseStatus, CaseCategory, Client, Invoice, UserRole, Expense, ExpenseCategory } from './types';

const INITIAL_CLIENTS: Client[] = [
  { 
    id: 'c1', 
    name: 'سعيد محمد الهاشمي', 
    email: 'saeed@example.ae', 
    phone: '0501234567', 
    emiratesId: '784-1980-1234567-1', 
    type: 'Individual', 
    documents: [],
    totalCases: 1,
    createdAt: '2024-01-10 10:30 ص'
  }
];

const INITIAL_CASES: LegalCase[] = [
  {
    id: '1',
    caseNumber: '2024/1024',
    title: 'قضية تعويض عمالي',
    category: CaseCategory.LABOR,
    clientId: 'c1',
    clientName: 'سعيد محمد الهاشمي',
    opponentName: 'شركة الخليج',
    court: 'محاكم دبي',
    status: CaseStatus.ACTIVE,
    nextHearingDate: '2024-06-15',
    assignedLawyer: 'أحمد حلمي',
    createdAt: '2024-01-10',
    documents: [],
    comments: [],
    activities: [],
    totalFee: 15000,
    paidAmount: 5000,
    isArchived: false
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('visitor');
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [cases, setCases] = useState<LegalCase[]>(INITIAL_CASES);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleLogin = (role: UserRole, clientId?: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    if (clientId) setCurrentClientId(clientId);
    setActiveTab(role === 'admin' ? 'dashboard' : 'ai-consultant');
  };

  const handleAddCase = (newCase: LegalCase) => setCases([newCase, ...cases]);
  const handleUpdateCase = (updatedCase: LegalCase) => setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
  const handleAddClient = (newClient: Client) => setClients([...clients, newClient]);
  const handleAddInvoice = (newInvoice: Invoice) => setInvoices([newInvoice, ...invoices]);
  const handleUpdateInvoice = (updatedInvoice: Invoice) => setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  const handleAddExpense = (newExp: Expense) => setExpenses([newExp, ...expenses]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'ai-consultant': return <AIConsultant />;
      case 'cases': return <CaseManagement cases={cases} clients={clients} userRole={userRole} onAddCase={handleAddCase} onUpdateCase={handleUpdateCase} />;
      case 'clients': return <ClientManagement clients={clients} onAddClient={handleAddClient} />;
      case 'accounting': return <Accounting invoices={invoices} cases={cases} clients={clients} expenses={expenses} onAddInvoice={handleAddInvoice} onUpdateInvoice={handleUpdateInvoice} onAddExpense={handleAddExpense} />;
      default: return <Dashboard />;
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} clients={clients} />;

  return (
    <div className="flex bg-[#f4f7f6] min-h-screen relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={() => setIsAuthenticated(false)} />
      <main className="flex-1 lg:mr-72 overflow-x-hidden min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
