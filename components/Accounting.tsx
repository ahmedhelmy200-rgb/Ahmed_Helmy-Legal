
import React, { useState } from 'react';
import { Invoice, LegalCase, Client, UserRole, PaymentReceipt, Expense } from '../types';
import { ICONS } from '../constants';

interface AccountingProps {
  invoices: Invoice[];
  cases: LegalCase[];
  clients: Client[];
  expenses: Expense[];
  receipts: PaymentReceipt[];
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoice: (invoice: Invoice) => void;
  onAddExpense: (expense: Expense) => void;
  onAddReceipt: (receipt: PaymentReceipt) => void;
  userRole: UserRole;
  onBack: () => void;
}

const Accounting: React.FC<AccountingProps> = ({ 
  invoices, 
  cases, 
  clients, 
  expenses, 
  receipts, 
  onAddInvoice, 
  onUpdateInvoice, 
  onAddExpense, 
  onAddReceipt, 
  userRole, 
  onBack 
}) => {
  const [activeView, setActiveView] = useState<'invoices' | 'receipts'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);

  const isStaff = userRole === 'admin' || userRole === 'staff';

  const handleSendReminder = (invoice: Invoice) => {
    const client = clients.find(c => c.id === invoice.clientId);
    if (!client || !client.phone) {
      alert("تعذر العثور على رقم هاتف الموكل.");
      return;
    }

    const message = `السلام عليكم ورحمة الله وبركاته،\nنود تذكيركم بأن الفاتورة رقم (#${invoice.invoiceNumber}) بمبلغ (${invoice.amount.toLocaleString()} د.إ) بانتظار السداد.\nيرجى التكرم بتسوية المبلغ في أقرب وقت ممكن.\nشاكرين تعاونكم.\n\nمكتب أحمد حلمي للاستشارات القانونية`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${client.phone.replace(/\s+/g, '')}?text=${encodedMessage}`;
    
    // محاكاة إرسال إيميل ثم فتح الواتساب
    console.log(`Sending email reminder to ${client.email}...`);
    window.open(whatsappUrl, '_blank');
  };

  const RoyalSeal = () => (
    <div className="relative w-48 h-48 flex items-center justify-center opacity-85 transform -rotate-12 mix-blend-multiply select-none pointer-events-none drop-shadow-md">
       <div className="absolute inset-0 border-[6px] border-double border-red-800 rounded-full"></div>
       <div className="absolute inset-2 border-2 border-red-800/30 rounded-full"></div>
       <div className="flex flex-col items-center justify-center text-center p-4">
          <span className="text-[10px] font-black text-red-800 uppercase tracking-tighter leading-none mb-1">أحمد حلمي للاستشارات القانونية</span>
          <div className="w-20 h-20 border-2 border-red-800 rounded-full flex flex-col items-center justify-center bg-white/10 my-1 overflow-hidden p-3 shadow-inner">
             <img 
                src="https://img.icons8.com/fluency/96/scales.png" 
                alt="Stamp Logo" 
                className="w-full h-full object-contain filter grayscale sepia brightness-50 contrast-150"
             />
          </div>
          <span className="text-[9px] font-black text-red-800 uppercase tracking-[0.2em] leading-none mt-1">HELM OFFICIAL SEAL</span>
          <span className="text-[6px] font-bold text-red-800 mt-0.5 tracking-widest uppercase">Valid Document - UAE</span>
       </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 no-print gap-6">
        <div className="flex items-center gap-6">
           <button onClick={onBack} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 hover:bg-[#d4af37] transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
           <div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter">النظام المالي (حُلم)</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">إدارة الوثائق المالية الرسمية لمكتب المستشار أحمد حلمي</p>
           </div>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
           <button onClick={() => setActiveView('invoices')} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${activeView === 'invoices' ? 'bg-white shadow-lg text-[#020617]' : 'text-slate-500 hover:text-slate-800'}`}>الفواتير الضريبية</button>
           <button onClick={() => setActiveView('receipts')} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${activeView === 'receipts' ? 'bg-white shadow-lg text-[#020617]' : 'text-slate-500 hover:text-slate-800'}`}>سندات القبض المعتمدة</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden no-print animate-in fade-in zoom-in duration-300">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <tr>
              <th className="p-8">الرقم المرجعي</th>
              <th className="p-8">السيد الموكل</th>
              <th className="p-8">المبلغ الإجمالي</th>
              <th className="p-8">الحالة</th>
              <th className="p-8 text-center">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {activeView === 'invoices' ? invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                 <td className="p-8 font-black text-slate-800 group-hover:text-[#d4af37]">#{inv.invoiceNumber}</td>
                 <td className="p-8 font-bold text-slate-600">{inv.clientName}</td>
                 <td className="p-8 font-black text-slate-950">{inv.amount.toLocaleString()} د.إ</td>
                 <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black ${inv.status === 'Paid' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                      {inv.status === 'Paid' ? 'تم السداد' : 'بانتظار التحصيل'}
                    </span>
                 </td>
                 <td className="p-8 text-center flex items-center justify-center gap-2">
                    <button onClick={() => setSelectedInvoice(inv)} className="bg-[#020617] text-[#d4af37] px-5 py-2 rounded-xl text-[10px] font-black shadow-lg hover:scale-105 transition-transform">معاينة</button>
                    {isStaff && (inv.status === 'Unpaid' || inv.status === 'Partial') && (
                      <button 
                        onClick={() => handleSendReminder(inv)}
                        className="bg-green-600 text-white px-5 py-2 rounded-xl text-[10px] font-black shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
                        title="إرسال تذكير عبر الواتساب"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        تذكير
                      </button>
                    )}
                 </td>
              </tr>
            )) : receipts.map(rec => (
              <tr key={rec.id} className="hover:bg-slate-50 transition-colors group">
                 <td className="p-8 font-black text-slate-800 group-hover:text-green-600">#{rec.receiptNumber}</td>
                 <td className="p-8 font-bold text-slate-600">{rec.payerName}</td>
                 <td className="p-8 font-black text-slate-950">{rec.amount.toLocaleString()} د.إ</td>
                 <td className="p-8 text-center">
                    <button onClick={() => setSelectedReceipt(rec)} className="bg-green-600 text-white px-6 py-2 rounded-xl text-[10px] font-black shadow-lg hover:scale-105 transition-transform">فتح السند</button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PRINT MODAL FOR INVOICE --- */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4 print:p-0 print:static print:bg-white overflow-y-auto">
          <div className="bg-white w-full max-w-4xl shadow-2xl animate-in zoom-in duration-500 my-auto rounded-none border-[12px] border-white overflow-hidden print:border-none">
             <div className="p-6 bg-slate-100 flex justify-between items-center no-print border-b border-slate-200">
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-600 font-black text-xs bg-white px-6 py-2 rounded-xl border border-slate-200">إغلاق المعاينة</button>
                <div className="flex gap-2">
                   {isStaff && (selectedInvoice.status === 'Unpaid' || selectedInvoice.status === 'Partial') && (
                      <button onClick={() => handleSendReminder(selectedInvoice)} className="bg-green-600 text-white px-6 py-2 rounded-xl text-[10px] font-black shadow-lg flex items-center gap-2">
                         إرسال تذكير واتساب
                      </button>
                   )}
                   <button onClick={() => window.print()} className="bg-[#020617] text-[#d4af37] px-8 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-2 border border-[#d4af37]/20">
                      طباعة الفاتورة
                   </button>
                </div>
             </div>
             
             <div className="p-20 dir-rtl font-serif bg-white relative min-h-[1000px] border-[15px] border-slate-50 print:border-none">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none transform rotate-45 scale-125">
                    <div className="w-96 h-96"><ICONS.Logo /></div>
                </div>

                <div className="flex justify-between items-center border-b-[10px] border-[#d4af37] pb-12 mb-14">
                   <div className="text-right">
                      <h1 className="text-3xl font-black text-slate-950 mb-1 leading-tight">أحمد حلمي للاستشارات القانونية</h1>
                      <p className="text-sm font-bold text-slate-700">العين - دولة الإمارات العربية المتحدة</p>
                      <p className="text-[10px] text-slate-400 font-sans tracking-[0.4em] mt-1 font-black">VALIDATED BY HELM SYSTEM</p>
                   </div>
                   <div className="w-44 h-32 relative group">
                      <ICONS.Logo />
                   </div>
                   <div className="text-left font-sans">
                      <h1 className="text-3xl font-black text-slate-950 mb-1 tracking-tighter">AHMED HELMY</h1>
                      <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">LEGAL CONSULTANTS</p>
                   </div>
                </div>

                <div className="text-center mb-16">
                   <h2 className="inline-block border-b-4 border-slate-950 text-5xl font-black uppercase tracking-tighter pb-4">فاتورة ضريبية / TAX INVOICE</h2>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-16 bg-slate-50 p-12 rounded-[3.5rem] border border-slate-200 shadow-inner">
                   <div className="space-y-6">
                      <p className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">رقم الفاتورة / No:</span>
                        <span className="text-2xl font-black text-red-700 font-mono tracking-tighter">#{selectedInvoice.invoiceNumber}</span>
                      </p>
                      <p className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">تاريخ الإصدار / Date:</span>
                        <span className="text-xl font-black text-slate-900">{selectedInvoice.date}</span>
                      </p>
                   </div>
                   <div className="space-y-6 text-left">
                      <p className="flex flex-col border-b border-slate-200 pb-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">الموكل / To:</span>
                        <span className="text-2xl font-black text-slate-950">{selectedInvoice.clientName}</span>
                      </p>
                   </div>
                </div>

                <table className="w-full mb-20 rounded-[2.5rem] overflow-hidden shadow-md border border-slate-200">
                   <thead>
                      <tr className="bg-[#020617] text-[#d4af37]">
                         <th className="p-8 text-right text-xs font-black uppercase tracking-[0.3em]">وصف الخدمة القانونية / LEGAL SERVICE</th>
                         <th className="p-8 text-center text-xs font-black w-64 uppercase tracking-[0.3em]">المبلغ (د.إ) / AMOUNT (AED)</th>
                      </tr>
                   </thead>
                   <tbody className="bg-white">
                      <tr>
                         <td className="p-14 text-2xl font-bold italic leading-relaxed text-slate-800 border-b border-slate-100">
                            {selectedInvoice.description || 'تقديم خدمات الاستشارات والتمثيل القانوني والبحث الفني المعتمد أمام الجهات المعنية بدولة الإمارات.'}
                         </td>
                         <td className="p-14 text-center font-black text-6xl text-slate-950 bg-slate-50/70 border-b border-slate-100">{selectedInvoice.amount.toLocaleString()}</td>
                      </tr>
                   </tbody>
                </table>

                <div className="flex justify-end mb-24">
                    <div className="w-[450px] space-y-4">
                        <div className="flex justify-between items-end border-t-[8px] border-[#d4af37] pt-8">
                            <span className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">المجموع الكلي:</span>
                            <span className="text-5xl font-black text-slate-950">{selectedInvoice.amount.toLocaleString()} د.إ</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end mt-40">
                   <div className="max-w-md text-[11px] text-slate-500 leading-relaxed border-r-8 border-[#d4af37] pr-10 italic">
                      <p className="font-black text-slate-950 mb-4 uppercase not-italic tracking-[0.2em] text-sm border-b border-slate-100 pb-2">شروط السداد وإشعار العميل:</p>
                      <p>يرجى سداد المبلغ المستحق قبل تاريخ {selectedInvoice.dueDate}. كافة الشيكات والتحويلات يجب أن تُصرف باسم "أحمد حلمي للاستشارات القانونية" حصراً.</p>
                   </div>
                   
                   <div className="relative flex flex-col items-center">
                      <div className="absolute -top-36 left-12 z-20">
                         <RoyalSeal />
                      </div>
                      <div className="text-center relative z-10">
                         <p className="text-[11px] font-black text-slate-400 mb-28 uppercase tracking-[0.5em]">الختم والتوقيع الرسمي</p>
                         <div className="w-72 h-[3px] bg-slate-950 mb-4 shadow-sm"></div>
                         <p className="text-2xl font-black text-slate-950 tracking-tighter">المستشار / أحمد حلمي</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">AUTHORISED SIGNATORY</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- PRINT MODAL FOR RECEIPT --- */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex items-center justify-center p-4 print:p-0 print:static print:bg-white overflow-y-auto">
          <div className="bg-white w-full max-w-4xl shadow-2xl animate-in slide-in-from-bottom duration-500 my-auto rounded-none overflow-hidden print:border-none">
             <div className="p-6 bg-slate-100 flex justify-between items-center no-print border-b border-slate-200">
                <button onClick={() => setSelectedReceipt(null)} className="text-slate-600 font-black text-xs bg-white px-6 py-2 rounded-xl border border-slate-200">إلغاء</button>
                <button onClick={() => window.print()} className="bg-green-700 text-white px-8 py-3 rounded-2xl font-black text-xs shadow-xl flex items-center gap-2">طباعة سند القبض المعتمد</button>
             </div>
             
             <div className="p-20 dir-rtl font-serif bg-white relative min-h-[850px] border-[15px] border-slate-50 print:border-none">
                <div className="flex justify-between items-end border-b-[8px] border-green-800 pb-10 mb-14">
                   <div className="text-right">
                      <h1 className="text-3xl font-black text-slate-950 mb-1">أحمد حلمي للاستشارات القانونية</h1>
                      <p className="text-sm font-bold text-slate-600">Al Ain, UAE - قسم المحاسبة المالية</p>
                   </div>
                   <div className="w-40 h-32"><ICONS.Logo /></div>
                   <div className="text-left font-sans">
                      <h1 className="text-3xl font-black text-slate-950 mb-1">OFFICIAL</h1>
                      <p className="text-xs font-black text-green-700 uppercase tracking-widest">RECEIPT VOUCHER</p>
                   </div>
                </div>

                <div className="text-center mb-16">
                   <h2 className="inline-block px-16 py-4 border-[5px] border-slate-950 rounded-[3.5rem] text-4xl font-black bg-slate-50 shadow-inner">سند قبض رسمي / RECEIPT VOUCHER</h2>
                </div>

                <div className="grid grid-cols-2 mb-16 text-lg bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 shadow-inner">
                   <p><span className="font-bold text-slate-500 ml-6 uppercase">التاريخ / Date:</span> <span className="font-black text-slate-950 text-xl">{selectedReceipt.date}</span></p>
                   <p className="text-left"><span className="font-bold text-slate-500 ml-6 uppercase">رقم السند / No:</span> <span className="text-green-800 font-mono font-black text-3xl">#{selectedReceipt.receiptNumber}</span></p>
                </div>

                <div className="space-y-12 text-2xl leading-[2.8]">
                   <div className="flex border-b-2 border-slate-100 pb-2">
                      <span className="font-black text-slate-500 ml-8 min-w-[180px]">استلمنا من:</span>
                      <span className="font-black flex-1 text-slate-950 border-b border-dashed border-slate-400">{selectedReceipt.payerName}</span>
                   </div>
                   <div className="flex border-b-2 border-slate-100 pb-2">
                      <span className="font-black text-slate-500 ml-8 min-w-[180px]">مبلغ وقدره:</span>
                      <span className="font-black flex-1 text-slate-950 bg-green-50 px-8 py-2 rounded-2xl border border-green-100 shadow-inner tracking-tighter">
                        {selectedReceipt.amount.toLocaleString()} د.إ
                      </span>
                   </div>
                   <div className="flex border-b-2 border-slate-100 pb-2">
                      <span className="font-black text-slate-500 ml-8 min-w-[180px]">وذلك عن:</span>
                      <span className="font-bold flex-1 text-slate-800 italic border-b border-dashed border-slate-400">{selectedReceipt.description}</span>
                   </div>
                </div>

                <div className="flex justify-between items-end mt-44">
                   <div className="text-center">
                      <p className="font-black text-slate-500 mb-28 uppercase tracking-[0.4em] text-xs">المستلم / RECEIVED BY</p>
                      <div className="w-64 h-[2px] bg-slate-200 mb-4"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Auth. Accounting Dept</p>
                   </div>
                   
                   <div className="relative flex flex-col items-center">
                        <div className="absolute -top-40 left-6 z-20">
                           <RoyalSeal />
                        </div>
                        <div className="text-center relative z-10">
                           <p className="font-black text-slate-900 mb-28 uppercase tracking-[0.4em] text-xs">الختم والتوقيع الرسمي</p>
                           <div className="w-72 h-[3px] bg-slate-950 mb-4 shadow-sm"></div>
                           <p className="text-2xl font-black text-slate-950 tracking-tighter">المستشار / أحمد حلمي</p>
                        </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounting;
