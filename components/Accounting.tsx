
import React, { useState, useMemo } from 'react';
import { Invoice, LegalCase, Client, Expense, ExpenseCategory, FutureDebt } from '../types';

interface AccountingProps {
  invoices: Invoice[];
  expenses: Expense[];
  futureDebts: FutureDebt[];
  clients: Client[];
  cases: LegalCase[];
  onAddExpense: (exp: Expense) => void;
  onAddFutureDebt: (debt: FutureDebt) => void;
  onAddInvoice?: (inv: Invoice) => void;
  onUpdateInvoice?: (inv: Invoice) => void;
  onBack: () => void;
}

const Accounting: React.FC<AccountingProps> = ({ invoices, expenses, futureDebts, clients, cases, onAddExpense, onAddFutureDebt, onAddInvoice, onUpdateInvoice, onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'invoices' | 'expenses' | 'debts'>('overview');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);

  // Form State
  const [newInv, setNewInv] = useState<Partial<Invoice>>({ amount: 0, clientId: '', description: '' });
  const [newExp, setNewExp] = useState<Partial<Expense>>({ amount: 0, description: '', category: ExpenseCategory.OFFICE });
  const [newDebt, setNewDebt] = useState<Partial<FutureDebt>>({ amount: 0, clientName: '', dueDate: '' });

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.paidAmount, 0);
  const totalOfficeExp = expenses.filter(e => e.category === ExpenseCategory.OFFICE).reduce((s, e) => s + e.amount, 0);
  const totalPersonalExp = expenses.filter(e => e.category === ExpenseCategory.PERSONAL).reduce((s, e) => s + e.amount, 0);

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddInvoice && newInv.clientId && newInv.amount) {
      const inv: Invoice = {
        id: Math.random().toString(36).substr(2, 9),
        clientId: newInv.clientId,
        amount: Number(newInv.amount),
        paidAmount: 0,
        status: 'Unpaid',
        date: new Date().toLocaleDateString('ar-AE'),
        description: newInv.description
      };
      onAddInvoice(inv);
      setShowInvoiceModal(false);
      setNewInv({ amount: 0, clientId: '', description: '' });
    }
  };

  return (
    <div className="p-4 lg:p-8 animate-fade-in font-sans">
      {/* Finance Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
        <div className="flex items-center gap-6">
           <button onClick={onBack} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
           <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter">الإدارة المالية المركزية</h2>
              <p className="text-[#d4af37] font-bold text-sm">كافة التدفقات النقدية والمصاريف والديون</p>
           </div>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           {(['overview', 'invoices', 'expenses', 'debts'] as const).map(tab => (
             <button 
               key={tab} 
               onClick={() => setActiveSubTab(tab)} 
               className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all duration-300 ${activeSubTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-800'}`}
             >
                {tab === 'overview' ? 'لوحة الأداء' : tab === 'invoices' ? 'الفواتير والإيصالات' : tab === 'expenses' ? 'المصاريف' : 'ديون مستقبلية'}
             </button>
           ))}
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">إجمالي المحصل</p>
              <h3 className="text-4xl font-black text-green-600">{totalRevenue.toLocaleString()} <span className="text-sm">د.إ</span></h3>
           </div>
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">مصاريف المكتب</p>
              <h3 className="text-4xl font-black text-red-500">{totalOfficeExp.toLocaleString()} <span className="text-sm">د.إ</span></h3>
           </div>
           <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl"></div>
              <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-2">صافي الأرباح</p>
              <h3 className="text-4xl font-black">{(totalRevenue - totalOfficeExp).toLocaleString()} <span className="text-sm text-[#d4af37]">د.إ</span></h3>
           </div>

           {/* Expenses Categories Table */}
           <div className="md:col-span-3 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-xl font-black text-slate-800">توزيع المصروفات</h4>
                 <button onClick={() => setShowExpenseModal(true)} className="bg-red-500 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] hover:bg-red-600 transition-all">+ إضافة مصروف</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 mb-2 uppercase">المكتب والتشغيل</p>
                    <p className="text-2xl font-black text-slate-800">{totalOfficeExp.toLocaleString()} د.إ</p>
                 </div>
                 <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                    <p className="text-[10px] font-black text-amber-500 mb-2 uppercase">مصاريف شخصية (منفصلة)</p>
                    <p className="text-2xl font-black text-amber-700">{totalPersonalExp.toLocaleString()} د.إ</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-black text-xl text-slate-800">سجل الفواتير والإيصالات</h4>
              <button onClick={() => setShowInvoiceModal(true)} className="bg-[#d4af37] text-white px-8 py-3 rounded-2xl text-[11px] font-black hover:bg-slate-900 transition-all shadow-lg">+ إنشاء فاتورة جديدة</button>
           </div>
           <table className="w-full text-right">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 tracking-widest border-b border-slate-200">
                 <tr>
                    <th className="p-6">الموكل والقضية</th>
                    <th className="p-6">المبلغ الإجمالي</th>
                    <th className="p-6">المحصل</th>
                    <th className="p-6">الحالة</th>
                    <th className="p-6">التاريخ</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-all">
                       <td className="p-6">
                          <p className="font-bold text-slate-700 text-sm">{clients.find(c => c.id === inv.clientId)?.name || 'غير محدد'}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">{inv.description || 'خدمة عامة'}</p>
                       </td>
                       <td className="p-6 font-black text-slate-800">{inv.amount.toLocaleString()} د.إ</td>
                       <td className="p-6 font-black text-green-600">{inv.paidAmount.toLocaleString()} د.إ</td>
                       <td className="p-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {inv.status === 'Paid' ? 'تم التحصيل' : 'مستحقة'}
                          </span>
                       </td>
                       <td className="p-6 text-slate-400 text-xs font-bold">{inv.date}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative animate-fade-in border border-slate-200">
              <h3 className="text-2xl font-black text-slate-800 mb-6">إنشاء فاتورة جديدة</h3>
              <form onSubmit={handleSubmitInvoice} className="space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-400 mb-2 block">الموكل</label>
                    <select 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none"
                      onChange={e => setNewInv({...newInv, clientId: e.target.value})}
                    >
                      <option value="">اختر الموكل...</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 mb-2 block">المبلغ (د.إ)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-700 outline-none"
                      onChange={e => setNewInv({...newInv, amount: Number(e.target.value)})}
                    />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 mb-2 block">الوصف</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none"
                      onChange={e => setNewInv({...newInv, description: e.target.value})}
                    />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowInvoiceModal(false)} className="flex-1 py-3 text-slate-400 font-bold">إلغاء</button>
                    <button type="submit" className="flex-1 py-3 bg-[#d4af37] text-white font-black rounded-xl shadow-lg">حفظ الفاتورة</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Accounting;
