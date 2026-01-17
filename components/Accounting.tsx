
import React, { useState, useMemo } from 'react';
import { Invoice, LegalCase, Client, Expense, ExpenseCategory, FutureDebt, PaymentReceipt } from '../types';

interface AccountingProps {
  invoices: Invoice[];
  expenses: Expense[];
  futureDebts: FutureDebt[];
  clients: Client[];
  cases: LegalCase[];
  onAddExpense: (exp: Expense) => void;
  onAddFutureDebt: (debt: FutureDebt) => void;
  onAddInvoice?: (inv: Invoice) => void;
  onBack: () => void;
}

const Accounting: React.FC<AccountingProps> = ({ invoices, expenses, futureDebts, clients, cases, onAddExpense, onAddFutureDebt, onAddInvoice, onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'invoices' | 'expenses' | 'debts' | 'reports'>('overview');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'year'>('all');
  // Added missing state for showing the expense modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // موازنة البيانات المالية
  const stats = useMemo(() => {
    const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
    const pendingRevenue = invoices.filter(i => i.status === 'Unpaid').reduce((s, i) => s + i.amount, 0);
    const officeExpenses = expenses.filter(e => e.category === ExpenseCategory.OFFICE).reduce((s, e) => s + e.amount, 0);
    const personalExpenses = expenses.filter(e => e.category === ExpenseCategory.PERSONAL).reduce((s, e) => s + e.amount, 0);
    const futureCollections = futureDebts.reduce((s, d) => s + d.amount, 0);
    
    return { totalRevenue, pendingRevenue, officeExpenses, personalExpenses, futureCollections, netProfit: totalRevenue - officeExpenses };
  }, [invoices, expenses, futureDebts]);

  return (
    <div className="p-8 lg:p-16 animate-fade-in bg-white min-h-screen">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
        <div className="flex items-center gap-6">
           <button onClick={onBack} className="p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-[#d4af37] hover:text-white transition-all shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
           <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter">الإدارة المالية المركزية</h2>
              <p className="text-slate-400 font-bold mt-1">كافة القيود، المصاريف، والتدفقات النقدية في مكان واحد</p>
           </div>
        </div>
        
        <div className="flex bg-slate-100/50 p-1.5 rounded-3xl border border-slate-100 shadow-inner">
           {(['overview', 'invoices', 'expenses', 'debts', 'reports'] as const).map(tab => (
             <button 
               key={tab} 
               onClick={() => setActiveSubTab(tab)} 
               className={`px-6 py-3 rounded-2xl text-[10px] font-black transition-all duration-300 ${activeSubTab === tab ? 'bg-white shadow-xl text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
             >
                {tab === 'overview' ? 'لوحة الأداء' : tab === 'invoices' ? 'الفواتير والإيصالات' : tab === 'expenses' ? 'سجل المصاريف' : tab === 'debts' ? 'ديون مستقبلية' : 'التقارير المالية'}
             </button>
           ))}
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <div className="space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">إجمالي المحصل</p>
                 <h3 className="text-4xl font-black text-green-600 tracking-tighter">{stats.totalRevenue.toLocaleString()} <span className="text-xs">د.إ</span></h3>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">مصاريف التشغيل</p>
                 <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{stats.officeExpenses.toLocaleString()} <span className="text-xs">د.إ</span></h3>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">مستحقات (Unpaid)</p>
                 <h3 className="text-4xl font-black text-amber-600 tracking-tighter">{stats.pendingRevenue.toLocaleString()} <span className="text-xs">د.إ</span></h3>
              </div>
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-slate-200">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">صافي الأرباح</p>
                 <h3 className="text-4xl font-black text-[#d4af37] tracking-tighter">{stats.netProfit.toLocaleString()} <span className="text-xs">د.إ</span></h3>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
                 <h4 className="font-black text-xl mb-8 flex justify-between items-center">
                    آخر الإيرادات
                    <button onClick={() => setActiveSubTab('invoices')} className="text-xs text-[#d4af37] underline">عرض الكل</button>
                 </h4>
                 <div className="space-y-4">
                    {invoices.slice(0, 5).map(inv => (
                       <div key={inv.id} className="flex justify-between items-center p-5 bg-slate-50 rounded-3xl border border-slate-100">
                          <div>
                             <p className="font-black text-sm">{clients.find(c => c.id === inv.clientId)?.name || 'موكل عام'}</p>
                             <p className="text-[10px] text-slate-400 mt-1">{inv.date}</p>
                          </div>
                          <div className="text-left">
                             <p className="font-black text-slate-800">{inv.amount.toLocaleString()} د.إ</p>
                             <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {inv.status === 'Paid' ? 'تم الدفع' : 'معلق'}
                             </span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
                 <h4 className="font-black text-xl mb-8">إحصائيات المصاريف</h4>
                 <div className="h-64 flex items-end justify-around gap-4 px-6 border-b border-slate-50">
                    <div className="flex-1 bg-blue-100 rounded-t-3xl transition-all hover:bg-blue-200 relative group" style={{ height: `${(stats.officeExpenses / (stats.officeExpenses + stats.personalExpenses)) * 100 || 0}%` }}>
                       <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">مصاريف مكتب</span>
                    </div>
                    <div className="flex-1 bg-amber-100 rounded-t-3xl transition-all hover:bg-amber-200 relative group" style={{ height: `${(stats.personalExpenses / (stats.officeExpenses + stats.personalExpenses)) * 100 || 0}%` }}>
                       <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">مصاريف شخصية</span>
                    </div>
                 </div>
                 <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] text-slate-400 font-bold mb-1">المكتب</p>
                       <p className="font-black text-blue-600">{stats.officeExpenses.toLocaleString()} د.إ</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-2xl">
                       <p className="text-[10px] text-slate-400 font-bold mb-1">الشخصية</p>
                       <p className="font-black text-amber-600">{stats.personalExpenses.toLocaleString()} د.إ</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                 <h4 className="font-black text-2xl text-slate-800">سجل الفواتير والإيصالات</h4>
                 <p className="text-slate-400 text-xs mt-1">إدارة كافة المطالبات المالية والمبالغ المحصلة</p>
              </div>
              <div className="flex gap-4">
                 <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black hover:bg-slate-50 shadow-sm transition-all">تحميل كشف مالي (Excel)</button>
                 <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black hover:bg-[#d4af37] shadow-xl transition-all">+ فاتورة جديدة</button>
              </div>
           </div>
           <table className="w-full text-right">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                 <tr>
                    <th className="p-8">الموكل والقضية</th>
                    <th className="p-8">المبلغ</th>
                    <th className="p-8">الحالة</th>
                    <th className="p-8">التاريخ</th>
                    <th className="p-8 text-center">إجراءات</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-all group">
                       <td className="p-8">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[#d4af37] font-black">
                                {clients.find(c => c.id === inv.clientId)?.name.charAt(0)}
                             </div>
                             <div>
                                <p className="font-black text-sm text-slate-800">{clients.find(c => c.id === inv.clientId)?.name}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{cases.find(c => c.id === (inv as any).caseId)?.title || 'خدمة استشارية'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-8 font-black text-slate-900 text-lg">{inv.amount.toLocaleString()} <span className="text-[10px] text-slate-400">د.إ</span></td>
                       <td className="p-8">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black ${inv.status === 'Paid' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                             {inv.status === 'Paid' ? 'تم تحصيلها' : 'لم تدفع بعد'}
                          </span>
                       </td>
                       <td className="p-8 text-slate-400 text-xs font-bold">{inv.date}</td>
                       <td className="p-8 text-center">
                          <button className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeSubTab === 'expenses' && (
        <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
           <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h4 className="font-black text-2xl text-slate-800">سجل المصروفات التشغيلية</h4>
              <button onClick={() => setShowExpenseModal(true)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black hover:bg-red-600 shadow-xl transition-all">+ إضافة مصروف جديد</button>
           </div>
           <table className="w-full text-right">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                 <tr>
                    <th className="p-8">التصنيف</th>
                    <th className="p-8">البيان / الوصف</th>
                    <th className="p-8">القيمة</th>
                    <th className="p-8">التاريخ</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {expenses.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50/80 transition-all">
                       <td className="p-8">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black ${e.category === ExpenseCategory.PERSONAL ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                             {e.category === ExpenseCategory.PERSONAL ? 'شخصي' : 'مكتبي'}
                          </span>
                       </td>
                       <td className="p-8 font-black text-slate-700">{e.description}</td>
                       <td className="p-8 font-black text-slate-900">{e.amount.toLocaleString()} د.إ</td>
                       <td className="p-8 text-slate-400 text-xs font-bold">{e.date}</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeSubTab === 'debts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {futureDebts.map(debt => (
             <div key={debt.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden hover:-translate-y-2 transition-all group">
                <div className="absolute top-0 right-0 w-2 h-full bg-[#d4af37]"></div>
                <div className="flex justify-between items-start mb-8">
                   <div className="p-4 bg-amber-50 rounded-2xl text-[#d4af37]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase">تاريخ الاستحقاق</p>
                      <p className="font-black text-slate-800 text-sm">{debt.dueDate}</p>
                   </div>
                </div>
                <h5 className="font-black text-2xl text-slate-800 mb-2">{debt.clientName}</h5>
                <p className="text-xs text-slate-400 mb-8 leading-relaxed">{debt.description}</p>
                <div className="flex justify-between items-end pt-8 border-t border-slate-50">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 mb-1">المبلغ المنتظر</p>
                      <p className="text-3xl font-black text-slate-900">{debt.amount.toLocaleString()} <span className="text-xs">د.إ</span></p>
                   </div>
                   <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   </button>
                </div>
             </div>
           ))}
           <button onClick={() => {}} className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-slate-300 hover:border-[#d4af37] hover:text-[#d4af37] transition-all group">
              <svg className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              <span className="font-black text-sm">إضافة مديونية جديدة</span>
           </button>
        </div>
      )}
    </div>
  );
};

export default Accounting;
