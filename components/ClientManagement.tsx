
import React, { useState } from 'react';
import { Client, CaseDocument } from '../types';

interface ClientManagementProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, onAddClient }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    type: 'Individual',
    name: '',
    email: '',
    phone: '',
    emiratesId: '',
    brokerName: '',
    commissionAmount: 0
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = {
      ...newClient as Client,
      id: Math.random().toString(36).substr(2, 9),
      documents: [],
      totalCases: 0,
      createdAt: new Date().toLocaleDateString('ar-AE')
    };
    onAddClient(client);
    setShowAddModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">إدارة الموكلين</h2>
          <p className="text-slate-500">قاعدة بيانات الموكلين، الوسطاء، وأرشيف المستندات الشخصية</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1a1a2e] text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all"
        >
          + إضافة موكل جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clients.map(client => (
          <div key={client.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-[#1a1a2e] text-[#d4af37] rounded-2xl flex items-center justify-center font-black text-2xl">
                {client.name.charAt(0)}
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black ${client.type === 'Corporate' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                  {client.type === 'Corporate' ? 'شركة' : 'فرد'}
                </span>
                {client.brokerName && (
                  <div className="mt-2 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">الوسيط: {client.brokerName}</div>
                )}
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-800 mb-1">{client.name}</h3>
            <p className="text-xs text-slate-400 mb-6">{client.emiratesId}</p>

            <div className="space-y-3 mb-8 bg-slate-50 p-4 rounded-2xl">
              <p className="text-xs font-bold text-slate-600">📞 {client.phone}</p>
              <p className="text-xs font-bold text-slate-600 truncate">📧 {client.email}</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedClient(client)}
                className="flex-1 bg-[#1a1a2e] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all"
              >الأرشيف والمستندات</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scroll">
            <h3 className="text-2xl font-black mb-8">إضافة ملف موكل جديد</h3>
            <form onSubmit={handleAddClient} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2">الاسم الكامل</label>
                <input required className="w-full border border-slate-200 rounded-xl px-5 py-3" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">رقم الهوية</label>
                <input required className="w-full border border-slate-200 rounded-xl px-5 py-3" value={newClient.emiratesId} onChange={e => setNewClient({...newClient, emiratesId: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">رقم الهاتف</label>
                <input required className="w-full border border-slate-200 rounded-xl px-5 py-3" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
              </div>
              <div className="col-span-2 border-t border-slate-100 pt-6">
                <h4 className="text-sm font-black text-amber-600 mb-4">بيانات الوسيط (اختياري)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">اسم الوسيط / البروكر</label>
                    <input className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm" value={newClient.brokerName} onChange={e => setNewClient({...newClient, brokerName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">العمولة المستحقة (د.إ)</label>
                    <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm" value={newClient.commissionAmount} onChange={e => setNewClient({...newClient, commissionAmount: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 font-bold text-slate-400">إلغاء</button>
                <button type="submit" className="flex-1 bg-[#1a1a2e] text-white py-4 rounded-2xl font-black shadow-xl">حفظ البيانات</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Archive Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col p-10 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black">أرشيف مستندات {selectedClient.name}</h3>
              <button onClick={() => setSelectedClient(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="space-y-6 flex-1 overflow-y-auto custom-scroll pr-4">
              <div className="grid grid-cols-2 gap-4">
                {['هوية إماراتية', 'جواز السفر', 'صورة شخصية', 'حكم محكمة', 'مستند دعم'].map(docType => (
                  <div key={docType} className="border-2 border-dashed border-slate-100 p-6 rounded-[2rem] text-center hover:border-[#d4af37] transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center mb-3 group-hover:bg-amber-50 group-hover:text-amber-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    </div>
                    <p className="text-xs font-black text-slate-500">{docType}</p>
                    <p className="text-[9px] text-slate-400 mt-1">اضغط للرفع</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
