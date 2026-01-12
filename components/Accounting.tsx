
import React, { useState } from 'react';
import { Invoice, LegalCase } from '../types';

interface AccountingProps {
  invoices: Invoice[];
  cases: LegalCase[];
  onAddInvoice: (invoice: Invoice) => void;
}

const Accounting: React.FC<AccountingProps> = ({ invoices, cases, onAddInvoice }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state for new invoice
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    invoiceNumber: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'Unpaid',
    description: ''
  });

  const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = invoices.filter(inv => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.includes(searchTerm) || 
    inv.clientName.includes(searchTerm) || 
    inv.caseTitle.includes(searchTerm)
  );

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-green-50 text-green-700 border-green-100';
      case 'Partial': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-red-50 text-red-700 border-red-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'Paid': return 'مدفوع بالكامل';
      case 'Partial': return 'مدفوع جزئياً';
      default: return 'غير مدفوع';
    }
  };

  const handleCaseSelect = (caseId: string) => {
    const selectedCase = cases.find(c => c.id === caseId);
    if (selectedCase) {
      setNewInvoice({
        ...newInvoice,
        caseId: selectedCase.id,
        caseTitle: selectedCase.title,
        clientId: selectedCase.clientId,
        clientName: selectedCase.clientName
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInvoice.caseId && newInvoice.amount && newInvoice.amount > 0) {
      const invoiceToAdd: Invoice = {
        ...newInvoice as Invoice,
        id: Math.random().toString(36).substr(2, 9),
      };
      onAddInvoice(invoiceToAdd);
      setShowAddModal(false);
      // Reset form
      setNewInvoice({
        invoiceNumber: `INV-${new Date().getFullYear()}-${(invoices.length + 2).toString().padStart(3, '0')}`,
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'Unpaid',
        description: ''
      });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">الحسابات والفواتير</h2>
          <p className="text-slate-500 font-medium">إدارة التدفقات المالية وفواتير الموكلين بدقة</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1a1a2e] text-white px-8 py-3.5 rounded-2xl font-black shadow-xl hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all flex items-center gap-2 group"
        >
          <span className="text-xl group-hover:rotate-90 transition-transform">+</span>
          <span>إصدار فاتورة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-8 rounded-[2rem] border-r-8 border-green-500 shadow-sm hover:shadow-lg transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">إجمالي المحصل</p>
          <h3 className="text-3xl font-black text-green-600 tracking-tighter">{totalRevenue.toLocaleString()} د.إ</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-r-8 border-amber-500 shadow-sm hover:shadow-lg transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">المبالغ المستحقة</p>
          <h3 className="text-3xl font-black text-amber-600 tracking-tighter">{pendingRevenue.toLocaleString()} د.إ</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-r-8 border-[#1a1a2e] shadow-sm hover:shadow-lg transition-all">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">إجمالي الفواتير</p>
          <h3 className="text-3xl font-black text-[#1a1a2e] tracking-tighter">{invoices.length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">سجل العمليات المالية</h3>
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              type="text" 
              placeholder="بحث برقم الفاتورة، الموكل أو القضية..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-12 pl-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <th className="px-8 py-5">رقم الفاتورة</th>
                <th className="px-8 py-5">الموكل</th>
                <th className="px-8 py-5">القضية</th>
                <th className="px-8 py-5">المبلغ</th>
                <th className="px-8 py-5">التاريخ</th>
                <th className="px-8 py-5 text-center">الحالة</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-5 text-sm font-mono font-bold text-slate-700">#{inv.invoiceNumber}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">{inv.clientName}</td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-medium text-slate-500 max-w-[200px] truncate" title={inv.caseTitle}>
                      {inv.caseTitle}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-slate-800">{inv.amount.toLocaleString()} د.إ</td>
                  <td className="px-8 py-5 text-xs text-slate-400 font-bold">{inv.date}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider border ${getStatusStyle(inv.status)}`}>
                      {getStatusLabel(inv.status)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-left">
                    <button className="text-[#d4af37] hover:text-[#1a1a2e] font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-2">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                       تحميل PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredInvoices.length === 0 && (
            <div className="p-20 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
               </div>
               <p className="text-slate-400 font-bold">لا توجد سجلات مالية مطابقة للبحث</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
            <div className="bg-[#1a1a2e] p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight">إصدار فاتورة أتعاب</h3>
                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">مكتب المستشار أحمد حلمي</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="relative z-10 p-2 hover:bg-white/10 rounded-xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37] opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 grid grid-cols-2 gap-8">
              <div className="col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">رقم الفاتورة</label>
                <input 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37] font-mono font-bold text-slate-700" 
                  value={newInvoice.invoiceNumber} 
                  onChange={e => setNewInvoice({...newInvoice, invoiceNumber: e.target.value})} 
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">تاريخ الإصدار</label>
                <input 
                  type="date" 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37] font-bold text-slate-700" 
                  value={newInvoice.date} 
                  onChange={e => setNewInvoice({...newInvoice, date: e.target.value})} 
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">اختيار القضية</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37] font-bold text-slate-700 appearance-none"
                  value={newInvoice.caseId || ""}
                  onChange={(e) => handleCaseSelect(e.target.value)}
                >
                  <option value="" disabled>اختر القضية المعنية...</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.caseNumber} - {c.title}</option>
                  ))}
                </select>
                {newInvoice.clientName && (
                  <p className="mt-2 text-[10px] font-bold text-[#d4af37] px-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    الموكل: {newInvoice.clientName}
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">المبلغ (د.إ)</label>
                <input 
                  type="number" 
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37] font-black text-slate-800" 
                  value={newInvoice.amount} 
                  onChange={e => setNewInvoice({...newInvoice, amount: Number(e.target.value)})} 
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">حالة الدفع</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37] font-bold text-slate-700"
                  value={newInvoice.status}
                  onChange={e => setNewInvoice({...newInvoice, status: e.target.value as any})}
                >
                  <option value="Unpaid">غير مدفوع</option>
                  <option value="Partial">مدفوع جزئياً</option>
                  <option value="Paid">مدفوع بالكامل</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">وصف الخدمة / التفاصيل</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37] min-h-[100px] font-medium text-slate-700" 
                  value={newInvoice.description} 
                  onChange={e => setNewInvoice({...newInvoice, description: e.target.value})} 
                  placeholder="مثال: دفعة تحت الحساب لأتعاب المرافعة..."
                />
              </div>

              <div className="col-span-2 flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                >
                  إلغاء العملية
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8960c] text-[#1a1a2e] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-600/20 hover:scale-[1.02] transition-all active:scale-95"
                >
                  اعتماد وإصدار الفاتورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounting;
