
import React, { useState } from 'react';
import { Invoice, LegalCase, Client, Expense, ExpenseCategory } from '../types';

interface AccountingProps {
  invoices: Invoice[];
  cases: LegalCase[];
  clients: Client[];
  expenses: Expense[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoice: (invoice: Invoice) => void;
  onAddExpense: (expense: Expense) => void;
}

const Accounting: React.FC<AccountingProps> = ({ invoices, cases, clients, expenses, onAddInvoice, onUpdateInvoice, onAddExpense }) => {
  const [activeView, setActiveView] = useState<'invoices' | 'expenses'>('invoices');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState<Partial<Expense>>({
    category: ExpenseCategory.OFFICE,
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: Expense = {
      ...expenseForm as Expense,
      id: Math.random().toString(36).substr(2, 9)
    };
    onAddExpense(newExp);
    setShowExpenseModal(false);
    setExpenseForm({ category: ExpenseCategory.OFFICE, amount: 0, date: new Date().toISOString().split('T')[0], description: '' });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">النظام المالي</h2>
          <p className="text-slate-500 font-medium">إدارة شاملة للإيرادات والمصاريف والتحصيلات</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowExpenseModal(true)}
            className="bg-white text-red-600 border border-red-100 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-red-50 transition-all"
          >
            + تسجيل مصاريف
          </button>
          <button 
            onClick={() => setShowInvoiceModal(true)}
            className="bg-[#1a1a2e] text-white px-6 py-3 rounded-2xl font-black shadow-xl hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all"
          >
            + إصدار فاتورة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] border-r-8 border-green-500 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">إجمالي الإيرادات (المحصل)</p>
          <h3 className="text-2xl font-black text-green-600">{totalRevenue.toLocaleString()} د.إ</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border-r-8 border-red-500 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">إجمالي المصاريف</p>
          <h3 className="text-2xl font-black text-red-600">{totalExpenses.toLocaleString()} د.إ</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border-r-8 border-blue-500 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">صافي الدخل</p>
          <h3 className={`text-2xl font-black ${netIncome >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{netIncome.toLocaleString()} د.إ</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border-r-8 border-amber-500 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">عمولات الوسطاء المستحقة</p>
          <h3 className="text-2xl font-black text-amber-600">
            {clients.reduce((sum, c) => sum + (c.commissionAmount || 0), 0).toLocaleString()} د.إ
          </h3>
        </div>
      </div>

      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveView('invoices')}
          className={`px-8 py-2.5 rounded-xl font-bold text-xs transition-all ${activeView === 'invoices' ? 'bg-white shadow-sm text-[#1a1a2e]' : 'text-slate-500'}`}
        >الفواتير</button>
        <button 
          onClick={() => setActiveView('expenses')}
          className={`px-8 py-2.5 rounded-xl font-bold text-xs transition-all ${activeView === 'expenses' ? 'bg-white shadow-sm text-[#1a1a2e]' : 'text-slate-500'}`}
        >المصاريف</button>
      </div>

      {activeView === 'expenses' ? (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4">الفئة</th>
                <th className="px-6 py-4">الوصف</th>
                <th className="px-6 py-4">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">{exp.date}</td>
                  <td className="px-6 py-4">
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold border border-red-100">{exp.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{exp.description}</td>
                  <td className="px-6 py-4 text-sm font-black text-red-600">{exp.amount.toLocaleString()} د.إ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
           {/* Invoices Table logic remains similar but updated to the new design */}
           <table className="w-full text-right">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">رقم الفاتورة</th>
                <th className="px-6 py-4">الموكل</th>
                <th className="px-6 py-4">المبلغ</th>
                <th className="px-6 py-4">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-bold">#{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{inv.clientName}</td>
                  <td className="px-6 py-4 text-sm font-black">{inv.amount.toLocaleString()} د.إ</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h3 className="text-xl font-black mb-6">تسجيل مصاريف جديدة</h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">الفئة</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]"
                  value={expenseForm.category}
                  onChange={e => setExpenseForm({...expenseForm, category: e.target.value as ExpenseCategory})}
                >
                  {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">المبلغ (د.إ)</label>
                <input 
                  type="number" required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none"
                  value={expenseForm.amount}
                  onChange={e => setExpenseForm({...expenseForm, amount: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">الوصف</label>
                <textarea 
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none min-h-[80px]"
                  value={expenseForm.description}
                  onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 font-bold text-slate-400">إلغاء</button>
                <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-500/20">تسجيل</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounting;
