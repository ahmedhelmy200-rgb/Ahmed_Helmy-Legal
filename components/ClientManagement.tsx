
import React, { useState } from 'react';
import { Client, LegalCase, Invoice, PaymentReceipt, CaseStatus } from '../types';

interface ClientManagementProps {
  clients: Client[];
  cases: LegalCase[];
  invoices: Invoice[];
  receipts: PaymentReceipt[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onBack: () => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, cases, invoices, receipts, onAddClient, onUpdateClient, onBack }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getClientStats = (clientId: string) => {
    const clientCases = cases.filter(c => c.clientId === clientId);
    const clientInvoices = invoices.filter(i => i.clientId === clientId);
    const totalDue = clientInvoices.reduce((s, i) => s + (i.status === 'Unpaid' ? i.amount : 0), 0);
    return { clientCases, totalDue };
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.phone.includes(searchTerm)
  );

  return (
    <div className="p-8 lg:p-12 animate-fade-in">
      {!selectedClient ? (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="flex items-center gap-6">
               <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </button>
               <div>
                  <h2 className="text-4xl font-black text-slate-800 tracking-tighter">إدارة الموكلين</h2>
                  <p className="text-slate-400 font-bold mt-1 text-sm">البحث، الإضافة، ومتابعة السجلات الشخصية</p>
               </div>
            </div>
            <button onClick={() => setShowAddModal(true)} className="bg-slate-900 text-white px-10 py-4 rounded-3xl font-black shadow-xl hover:bg-[#d4af37] transition-all hover:scale-105 active:scale-95">
              + إضافة موكل جديد
            </button>
          </div>

          {/* Search Bar Component */}
          <div className="mb-12 relative group max-w-4xl">
            <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#d4af37] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="ابحث عن موكل بالاسم أو رقم الهاتف..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-[2.5rem] py-6 pr-20 pl-8 text-slate-700 font-bold shadow-sm focus:ring-4 focus:ring-amber-500/5 focus:border-[#d4af37] outline-none transition-all placeholder:text-slate-300 placeholder:font-medium"
            />
            {searchTerm && (
               <button 
                 onClick={() => setSearchTerm('')}
                 className="absolute inset-y-0 left-0 pl-8 flex items-center text-slate-300 hover:text-red-500 transition-colors"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            )}
          </div>

          {/* Clients Grid */}
          {filteredClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredClients.map(client => (
                <div 
                  key={client.id} 
                  onClick={() => setSelectedClient(client)} 
                  className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-16 h-16 bg-slate-50 text-slate-300 group-hover:bg-[#d4af37] group-hover:text-white rounded-3xl flex items-center justify-center text-3xl font-black transition-all duration-500">
                        {client.name.charAt(0)}
                     </div>
                     <span className="bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase group-hover:bg-amber-50 group-hover:text-[#d4af37] transition-all">
                       {client.type === 'Individual' ? 'فرد' : 'شركة'}
                     </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-[#d4af37] transition-colors">{client.name}</h3>
                  <p className="text-xs text-slate-400 font-bold mb-8">{client.phone}</p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
                     <div className="bg-slate-50/50 p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">القضايا</p>
                        <p className="font-black text-slate-800">{cases.filter(c => c.clientId === client.id).length}</p>
                     </div>
                     <div className="bg-red-50/50 p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-red-400 uppercase mb-1">المستحقات</p>
                        <p className="font-black text-red-600">{getClientStats(client.id).totalDue.toLocaleString()} <span className="text-[8px]">د.إ</span></p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[4rem] border border-slate-100 border-dashed">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
               <h4 className="text-xl font-black text-slate-400">عذراً، لم نجد نتائج لـ "{searchTerm}"</h4>
               <p className="text-slate-300 text-sm mt-2">يرجى التأكد من كتابة الاسم أو الرقم بشكل صحيح</p>
               <button onClick={() => setSearchTerm('')} className="mt-8 text-[#d4af37] font-black text-xs underline">إلغاء البحث</button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-12 animate-fade-in">
           {/* Client Profile Header */}
           <div className="bg-slate-900 p-12 lg:p-16 rounded-[4rem] text-white flex flex-col lg:flex-row justify-between items-center gap-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="flex items-center gap-10 relative z-10">
                 <button onClick={() => setSelectedClient(null)} className="p-5 bg-white/10 rounded-3xl hover:bg-white/20 transition-all border border-white/5 shadow-xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </button>
                 <div>
                    <h2 className="text-5xl font-black text-[#d4af37] tracking-tighter">{selectedClient.name}</h2>
                    <div className="flex gap-4 mt-4">
                       <span className="text-slate-400 font-bold text-sm bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{selectedClient.emiratesId}</span>
                       <span className="text-slate-400 font-bold text-sm bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{selectedClient.phone}</span>
                    </div>
                 </div>
              </div>
              
              <div className="text-center lg:text-left relative z-10">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">إجمالي المحصل المالي</p>
                 <h3 className="text-5xl font-black text-green-400 tracking-tighter">
                   {(invoices.filter(i => i.clientId === selectedClient.id && i.status === 'Paid').reduce((s,i) => s + i.amount, 0)).toLocaleString()} 
                   <span className="text-lg mr-2 font-black">د.إ</span>
                 </h3>
              </div>
           </div>

           {/* Tabs and Content for Client Profile */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cases List */}
              <div className="lg:col-span-2 space-y-10">
                 <div className="flex items-center gap-6">
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">ملفات القضايا</h4>
                    <span className="h-px flex-1 bg-slate-100"></span>
                 </div>
                 
                 <div className="space-y-6">
                   {cases.filter(c => c.clientId === selectedClient.id).map(c => (
                      <div key={c.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-[#d4af37] hover:shadow-xl transition-all duration-500">
                         <div className="flex gap-6 items-center">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-amber-50 group-hover:text-[#d4af37] transition-all">
                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 mb-1">#{c.caseNumber}</p>
                               <h5 className="font-black text-slate-800 text-xl group-hover:text-[#d4af37] transition-colors">{c.title}</h5>
                               <p className="text-xs text-slate-400 mt-1 font-bold">{c.court}</p>
                            </div>
                         </div>
                         <div className={`px-6 py-2 rounded-2xl text-[10px] font-black shadow-sm ${
                            c.status === CaseStatus.WON ? 'bg-green-50 text-green-700 border border-green-100' :
                            c.status === CaseStatus.ACTIVE ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-50 text-slate-600 border border-slate-200'
                         }`}>{c.status}</div>
                      </div>
                   ))}
                 </div>
              </div>

              {/* Financial Summary & Actions */}
              <div className="space-y-10">
                 <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-10">الملخص المحاسبي</h4>
                    <div className="space-y-8">
                       <div className="flex justify-between items-end">
                          <span className="text-slate-400 font-bold text-sm">المطالبات الكلية</span>
                          <span className="font-black text-slate-800 text-2xl">{invoices.filter(i => i.clientId === selectedClient.id).reduce((s,i) => s + i.amount, 0).toLocaleString()} <span className="text-xs text-slate-300">د.إ</span></span>
                       </div>
                       <div className="flex justify-between items-end">
                          <span className="text-slate-400 font-bold text-sm">إجمالي المسدد</span>
                          <span className="font-black text-green-600 text-2xl">{invoices.filter(i => i.clientId === selectedClient.id && i.status === 'Paid').reduce((s,i) => s + i.amount, 0).toLocaleString()} <span className="text-xs text-green-200">د.إ</span></span>
                       </div>
                       <div className="pt-8 border-t border-slate-50 flex justify-between items-end">
                          <span className="text-slate-400 font-bold text-sm">المتبقي المطلوب</span>
                          <span className="font-black text-red-600 text-3xl">{invoices.filter(i => i.clientId === selectedClient.id && i.status === 'Unpaid').reduce((s,i) => s + i.amount, 0).toLocaleString()} <span className="text-xs text-red-200">د.إ</span></span>
                       </div>
                    </div>
                    <button className="w-full mt-12 bg-slate-900 text-white py-5 rounded-3xl font-black text-xs hover:bg-[#d4af37] transition-all shadow-xl shadow-slate-200">توليد كشف حساب تفصيلي</button>
                 </div>

                 {/* Documents List */}
                 <div className="bg-slate-50/50 p-12 rounded-[4rem] border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                       <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">المستندات الرقمية</h4>
                       <button className="text-[10px] bg-white border border-slate-200 px-4 py-2 rounded-xl font-black shadow-sm hover:border-[#d4af37] transition-all">رفع جديد</button>
                    </div>
                    <div className="space-y-4">
                       <div className="p-6 bg-white rounded-3xl border border-slate-100 flex items-center gap-5 group hover:border-[#d4af37] transition-all cursor-pointer">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></div>
                          <div>
                            <p className="text-[10px] font-black text-slate-800">صورة الهوية الإماراتية.pdf</p>
                            <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase">12 يناير 2025</p>
                          </div>
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

export default ClientManagement;
