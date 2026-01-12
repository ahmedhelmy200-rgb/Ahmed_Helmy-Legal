
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIConsultant from './components/AIConsultant';
import CaseManagement from './components/CaseManagement';
import ClientManagement from './components/ClientManagement';
import Accounting from './components/Accounting';
import { LegalCase, CaseStatus, CourtType, Client, Invoice } from './types';

const INITIAL_CLIENTS: Client[] = [
  { 
    id: 'c1', 
    name: 'سعيد محمد الهاشمي', 
    email: 'saeed@example.ae', 
    phone: '0501234567', 
    emiratesId: '784-1980-1234567-1', 
    address: 'شارع خليفة، العين، أبوظبي', 
    dateOfBirth: '1980-05-12', 
    type: 'Individual', 
    totalCases: 1,
    createdAt: '2024-01-10 10:30 ص'
  },
  { 
    id: 'c2', 
    name: 'مجموعة النماء العقارية', 
    email: 'contact@namaa.ae', 
    phone: '042001122', 
    emiratesId: 'EXP-123456', 
    address: 'منطقة المقطع، أبوظبي', 
    dateOfBirth: '2005-01-01', 
    type: 'Corporate', 
    totalCases: 1,
    createdAt: '2024-02-15 09:15 ص'
  },
  { 
    id: 'c3', 
    name: 'مطاحن دبي الكبرى', 
    email: 'office@dubaimills.com', 
    phone: '048887766', 
    emiratesId: 'CORP-889900', 
    address: 'جبل علي، دبي', 
    dateOfBirth: '1995-10-20', 
    type: 'Corporate', 
    totalCases: 1,
    createdAt: '2023-11-20 01:45 م'
  }
];

const INITIAL_CASES: LegalCase[] = [
  {
    id: '1',
    caseNumber: '2024/1024',
    title: 'قضية تعويض عمالي - فصل تعسفي',
    clientId: 'c1',
    clientName: 'سعيد محمد الهاشمي',
    opponentName: 'شركة الخليج للخدمات',
    court: CourtType.ADJD,
    status: CaseStatus.ACTIVE,
    nextHearingDate: '2024-06-15',
    assignedLawyer: 'أحمد حلمي',
    createdAt: '2024-01-10',
    documents: [],
    totalFee: 15000,
    paidAmount: 5000
  },
  {
    id: '2',
    caseNumber: '2024/505',
    title: 'نزاع عقاري - تسليم وحدة سكنية',
    clientId: 'c2',
    clientName: 'مجموعة النماء العقارية',
    opponentName: 'خالد عبدالله الجاسم',
    court: CourtType.ADJD,
    status: CaseStatus.PENDING,
    nextHearingDate: '2024-07-02',
    assignedLawyer: 'أحمد حلمي',
    createdAt: '2024-02-15',
    documents: [],
    totalFee: 45000,
    paidAmount: 45000
  }
];

const INITIAL_INVOICES: Invoice[] = [
  { id: 'inv1', invoiceNumber: '2024/001', caseId: '1', caseTitle: 'قضية تعويض عمالي', clientId: 'c1', clientName: 'سعيد الهاشمي', amount: 5000, date: '2024-01-15', status: 'Paid', description: 'دفعة أولى' },
  { id: 'inv2', invoiceNumber: '2024/002', caseId: '2', caseTitle: 'نزاع عقاري', clientId: 'c2', clientName: 'مجموعة النماء', amount: 45000, date: '2024-02-20', status: 'Paid', description: 'أتعاب كاملة' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cases, setCases] = useState<LegalCase[]>(INITIAL_CASES);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

  const handleAddCase = (newCase: LegalCase) => setCases([newCase, ...cases]);
  const handleUpdateCase = (updatedCase: LegalCase) => setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
  const handleAddClient = (newClient: Client) => setClients([...clients, newClient]);
  const handleAddInvoice = (newInvoice: Invoice) => setInvoices([newInvoice, ...invoices]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'ai-consultant': return <AIConsultant />;
      case 'accounting': return <Accounting invoices={invoices} cases={cases} onAddInvoice={handleAddInvoice} />;
      case 'cases': return <CaseManagement cases={cases} clients={clients} onAddCase={handleAddCase} onUpdateCase={handleUpdateCase} onAddClient={handleAddClient} />;
      case 'clients': return <ClientManagement clients={clients} cases={cases} onAddClient={handleAddClient} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex bg-[#f4f7f6] min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 mr-72 overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
