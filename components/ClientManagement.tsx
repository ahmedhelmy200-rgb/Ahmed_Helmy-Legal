
import React, { useState } from 'react';
import { Client, LegalCase, Invoice, LegalDocument, CaseStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface ClientManagementProps {
  clients: Client[];
  cases: LegalCase[];
  invoices: Invoice[];
  documents: LegalDocument[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onBack: () => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, cases, invoices, documents, onAddClient, onBack }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredClients = clients.filter(c => c.name.includes(searchTerm) || c.phone.includes(searchTerm));

  return (
    <div className="p-4 lg:p-8 animate-fade-in font-sans">
      {!selectedClient ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="flex items-center gap-6">
              <button onClick={onBack} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">إدارة الموكلين</h2>
                <p className="text-slate-400 font-bold text-sm">البحث، الإضافة، ومتابعة السجلات</p>
              </div>
            </div>
            <button onClick={() => setShowAddModal(true)} className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs hover:bg-[#d4af37] shadow-xl transition-all">+ إضافة موكل جديد</button>
          </div>

          <div className="mb-10 relative">
             <input 
               type="text" 
               placeholder="ابحث عن موكل بالاسم أو الرقم..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full h-16 bg-white border border-slate-200 rounded-[1.5rem] px-12 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#d4af37]/5 focus:border-[#d4af37] transition-all"
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredClients.map(client => (
               <div 
                 key={client.id} 
                 onClick={() => setSelectedClient(client)}
                 className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
               >
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/10 transition-colors">
                     <p className="text-2xl font-black text-[#d4af37]">{client.name.charAt(0)}</p>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-1">{client.name}</h3>
                  <p className="text-xs text-slate-400 font-bold mb-6">{client.phone}</p>
                  <div className="flex gap-2">
                     <span className="bg-slate-50 text-[9px] font-black px-3 py-1.5 rounded-full border border-slate-200 text-slate-500">{client.type === 'Individual' ? 'فرد' : 'شركة'}</span>
                     <span className="bg-[#d4af37]/10 text-[9px] font-black px-3 py-1.5 rounded-full border border-[#d4af37]/20 text-[#d4af37] uppercase tracking-widest">{cases.filter(c => c.clientId === client.id).length} قضايا</span>
                  </div>
               </div>
             ))}
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-fade-in">
           {/* Client Profile Header */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="flex items-center gap-8">
                    <button onClick={() => setSelectedClient(null)} className="p-4 bg-slate-100 rounded-2xl hover:bg-[#d4af37] hover:text-white transition-all">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] border border-slate-200 flex items-center justify-center text-4xl font-black text-[#d4af37] shadow-inner">
                       {selectedClient.name.charAt(0)}
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-slate-800">{selectedClient.name}</h2>
                       <div className="flex gap-4 mt-2">
                          <span className="text-slate-400 font-bold text-xs">الهوية: {selectedClient.emiratesId}</span>
                          <span className="text-slate-400 font-bold text-xs">الهاتف: {selectedClient.phone}</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الرصيد المالي</p>
                    <h3 className="text-4xl font-black text-green-600">{(invoices.filter(i => i.clientId === selectedClient.id && i.status === 'Paid').reduce((s,i) => s + i.paidAmount, 0)).toLocaleString()} <span className="text-sm">د.إ</span></h3>
                 </div>
              </div>
           </div>

           {/* Tabs and Data */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                 <h4 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <span className="w-1 h-5 bg-[#d4af37] rounded-full"></span>
                    القضايا المرتبطة
                 </h4>
                 <div className="space-y-4">
                    {cases.filter(c => c.clientId === selectedClient.id).map(c => (
                       <div key={c.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-200 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                          <div>
                             <p className="text-sm font-bold text-slate-700">{c.title}</p>
                             <p className="text-[10px] text-slate-400 font-bold mt-1">#{c.caseNumber}</p>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                 <h4 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <span className="w-1 h-5 bg-blue-400 rounded-full"></span>
                    المستندات الرقمية
                 </h4>
                 <div className="space-y-4">
                    {documents.filter(d => d.clientId === selectedClient.id).map(d => (
                       <div key={d.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-200 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all cursor-pointer">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 border border-slate-100 shadow-sm">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          </div>
                          <div className="flex-1">
                             <p className="text-sm font-bold text-slate-700">{d.title}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{d.category} - {d.uploadDate}</p>
                          </div>
                       </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-black text-xs hover:border-[#d4af37] hover:text-[#d4af37] transition-all">+ رفع مستند جديد</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
