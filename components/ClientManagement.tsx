
import React, { useState, useRef } from 'react';
import { Client, LegalCase, CaseStatus } from '../types';

interface ClientManagementProps {
  clients: Client[];
  cases: LegalCase[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
  onBack: () => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, cases, onAddClient, onUpdateClient, onBack }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for contact editing
  const [editForm, setEditForm] = useState({
    email: '',
    phone: ''
  });

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

  const handleUpdateContact = () => {
    if (!selectedClient) return;
    const updatedClient = {
      ...selectedClient,
      email: editForm.email,
      phone: editForm.phone
    };
    onUpdateClient(updatedClient);
    setSelectedClient(updatedClient);
    setIsEditingContact(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedClient) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedClient = {
          ...selectedClient,
          profileImage: reader.result as string
        };
        onUpdateClient(updatedClient);
        setSelectedClient(updatedClient);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditMode = () => {
    if (selectedClient) {
      setEditForm({
        email: selectedClient.email,
        phone: selectedClient.phone
      });
      setIsEditingContact(true);
    }
  };

  const getClientCases = (clientId: string) => {
    return cases.filter(c => c.clientId === clientId);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
           <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">إدارة الموكلين</h2>
              <p className="text-slate-500 font-medium">قاعدة بيانات الموكلين، الوسطاء، وأرشيف المستندات الشخصية</p>
           </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1a1a2e] text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all"
        >
          + إضافة موكل جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clients.map(client => {
          const clientCases = getClientCases(client.id);
          return (
            <div key={client.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                {client.profileImage ? (
                  <img src={client.profileImage} alt={client.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-md" />
                ) : (
                  <div className="w-16 h-16 bg-[#1a1a2e] text-[#d4af37] rounded-2xl flex items-center justify-center font-black text-2xl">
                    {client.name.charAt(0)}
                  </div>
                )}
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${client.type === 'Corporate' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                    {client.type === 'Corporate' ? 'شركة' : 'فرد'}
                  </span>
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
                >الملف الشخصي والقضايا ({clientCases.length})</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scroll">
            <h3 className="text-2xl font-black mb-8">إضافة ملف موكل جديد</h3>
            <form onSubmit={handleAddClient} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2">الاسم الكامل</label>
                <input required className="w-full border border-slate-200 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">رقم الهوية</label>
                <input required className="w-full border border-slate-200 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newClient.emiratesId} onChange={e => setNewClient({...newClient, emiratesId: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">رقم الهاتف</label>
                <input required className="w-full border border-slate-200 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
              </div>
              <div className="col-span-2 border-t border-slate-100 pt-6">
                <h4 className="text-sm font-black text-amber-600 mb-4">بيانات الوسيط (اختياري)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">اسم الوسيط / البروكر</label>
                    <input className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]" value={newClient.brokerName} onChange={e => setNewClient({...newClient, brokerName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">العمولة المستحقة (د.إ)</label>
                    <input type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d4af37]" value={newClient.commissionAmount} onChange={e => setNewClient({...newClient, commissionAmount: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 font-bold text-slate-400">إلغاء</button>
                <button type="submit" className="flex-1 bg-[#1a1a2e] text-white py-4 rounded-2xl font-black shadow-xl hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all">حفظ البيانات</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Profile and Cases Drawer */}
      {selectedClient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#1a1a2e] text-white">
              <div className="flex items-center gap-6">
                 {/* Profile Image Customization */}
                 <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {selectedClient.profileImage ? (
                      <img src={selectedClient.profileImage} alt={selectedClient.name} className="w-20 h-20 rounded-3xl object-cover border-2 border-[#d4af37] shadow-xl" />
                    ) : (
                      <div className="w-20 h-20 bg-[#1e293b] text-[#d4af37] rounded-3xl flex items-center justify-center font-black text-3xl border-2 border-white/10">
                        {selectedClient.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black">{selectedClient.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">تاريخ الانضمام: {selectedClient.createdAt}</p>
                 </div>
              </div>
              <button onClick={() => { setSelectedClient(null); setIsEditingContact(false); }} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scroll p-8 space-y-8">
              {/* Contact Information Section */}
              <section className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative group">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black text-slate-800">بيانات الاتصال</h4>
                  {!isEditingContact ? (
                    <button onClick={openEditMode} className="text-[10px] font-black text-[#d4af37] bg-white border border-[#d4af37]/20 px-3 py-1 rounded-lg hover:bg-[#d4af37] hover:text-white transition-all">تعديل</button>
                  ) : (
                    <div className="flex gap-2">
                       <button onClick={handleUpdateContact} className="text-[10px] font-black text-white bg-green-600 px-3 py-1 rounded-lg">حفظ</button>
                       <button onClick={() => setIsEditingContact(false)} className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-lg">إلغاء</button>
                    </div>
                  )}
                </div>

                {isEditingContact ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">البريد الإلكتروني</label>
                      <input 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm mt-1 outline-none focus:ring-2 focus:ring-[#d4af37]" 
                        value={editForm.email} 
                        onChange={e => setEditForm({...editForm, email: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400">رقم الهاتف</label>
                      <input 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm mt-1 outline-none focus:ring-2 focus:ring-[#d4af37]" 
                        value={editForm.phone} 
                        onChange={e => setEditForm({...editForm, phone: e.target.value})} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 text-xs shadow-sm">📧</span>
                      <p className="text-sm font-bold text-slate-700">{selectedClient.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 text-xs shadow-sm">📞</span>
                      <p className="text-sm font-bold text-slate-700">{selectedClient.phone}</p>
                    </div>
                  </div>
                )}
              </section>

              {/* Associated Cases List */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black text-slate-800">القضايا المرتبطة</h4>
                  <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500">
                    {getClientCases(selectedClient.id).length} قضايا
                  </span>
                </div>
                <div className="space-y-4">
                  {getClientCases(selectedClient.id).length > 0 ? (
                    getClientCases(selectedClient.id).map(c => (
                      <div key={c.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-[#d4af37] transition-all group/case">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-black text-slate-800">{c.title}</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${c.status === CaseStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">رقم القضية: {c.caseNumber}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl">
                      <p className="text-xs text-slate-400 italic">لا توجد قضايا مسجلة لهذا الموكل حالياً.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Documents Archive Section */}
              <section>
                <h4 className="text-sm font-black text-slate-800 mb-4">أرشيف المستندات الشخصية</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['هوية إماراتية', 'جواز السفر', 'صورة شخصية', 'رسائل ثبوتية'].map(docType => (
                    <div key={docType} className="border-2 border-dashed border-slate-100 p-6 rounded-[2rem] text-center hover:border-[#d4af37] transition-all cursor-pointer group">
                      <div className="w-10 h-10 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center mb-3 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      </div>
                      <p className="text-[10px] font-black text-slate-500">{docType}</p>
                      <p className="text-[9px] text-slate-400 mt-1">اضغط للرفع</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
