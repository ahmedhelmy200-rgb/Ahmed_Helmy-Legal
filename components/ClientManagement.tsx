
import React, { useState } from 'react';
import { Client, LegalCase } from '../types';

interface ClientManagementProps {
  clients: Client[];
  cases: LegalCase[];
  onAddClient: (client: Client) => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, cases, onAddClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    type: 'Individual',
    name: '',
    email: '',
    phone: '',
    emiratesId: '',
    address: '',
    dateOfBirth: ''
  });

  const filteredClients = clients.filter(client => 
    client.name.includes(searchTerm) || 
    client.emiratesId.includes(searchTerm) || 
    client.phone.includes(searchTerm)
  );

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-AE') + ' ' + now.toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' });
    
    const client: Client = {
      ...newClient as Client,
      id: Math.random().toString(36).substr(2, 9),
      totalCases: 0,
      createdAt: formattedDate
    };
    onAddClient(client);
    setShowAddModal(false);
    setNewClient({ type: 'Individual', name: '', email: '', phone: '', emiratesId: '', address: '', dateOfBirth: '' });
  };

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">إدارة الموكلين</h2>
          <p className="text-slate-500">قاعدة بيانات الموكلين المسجلين في النظام والملفات الشخصية</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1a1a2e] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>إضافة موكل جديد</span>
        </button>
      </div>

      {/* Stats Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي الموكلين</p>
          <p className="text-2xl font-black text-[#1a1a2e]">{clients.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">أفراد</p>
          <p className="text-2xl font-black text-blue-600">{clients.filter(c => c.type === 'Individual').length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">شركات</p>
          <p className="text-2xl font-black text-purple-600">{clients.filter(c => c.type === 'Corporate').length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">انضموا هذا الشهر</p>
          <p className="text-2xl font-black text-green-600">4</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            type="text" 
            placeholder="بحث بالاسم، رقم الهوية، أو البريد الإلكتروني..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-12 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200">تصفية حسب النوع</button>
           <button className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200">ترتيب حسب التاريخ</button>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredClients.map(client => {
          const clientCases = cases.filter(c => c.clientId === client.id);
          return (
            <div key={client.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-[#1a1a2e] text-[#d4af37] rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-900/10">
                  {client.name.charAt(0)}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${client.type === 'Corporate' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                    {client.type === 'Corporate' ? 'شركة / مؤسسة' : 'فرد'}
                  </span>
                  <div className="text-[9px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded">
                    مسجل في: {client.createdAt}
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-[#1a1a2e] transition-colors">{client.name}</h3>
              <p className="text-xs text-slate-400 mb-6 font-mono flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                {client.emiratesId}
              </p>
              
              <div className="space-y-3 mb-8 bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <span className="font-bold">{client.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <span className="truncate">{client.email}</span>
                </div>
                {client.address && (
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                    </div>
                    <span className="line-clamp-2 leading-relaxed">{client.address}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">القضايا</p>
                  <p className="text-2xl font-black text-[#1a1a2e]">{clientCases.length}</p>
                </div>
                <button className="bg-[#1a1a2e] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all">الملف الكامل</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1a1a2e] p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black">إضافة ملف موكل جديد</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:rotate-90 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleAddClient} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-2">نوع الموكل</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setNewClient({...newClient, type: 'Individual'})}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${newClient.type === 'Individual' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >فرد</button>
                    <button 
                      type="button"
                      onClick={() => setNewClient({...newClient, type: 'Corporate'})}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${newClient.type === 'Corporate' ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >شركة / مؤسسة</button>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-2">الاسم الكامل</label>
                  <input required className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-2">رقم الهوية / السجل</label>
                  <input required className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newClient.emiratesId} onChange={e => setNewClient({...newClient, emiratesId: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-2">رقم الهاتف</label>
                  <input required className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-2">البريد الإلكتروني</label>
                  <input type="email" required className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-2">العنوان الوطني</label>
                  <input className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-slate-500 font-bold">إلغاء</button>
                <button type="submit" className="flex-1 py-3 bg-[#d4af37] text-[#1a1a2e] rounded-xl font-bold shadow-lg hover:scale-105 transition-all">حفظ وإضافة</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
