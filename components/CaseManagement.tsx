
import React, { useState } from 'react';
import { LegalCase, CaseStatus, CourtType, CaseDocument, Client } from '../types';
import { analyzeCaseStrategy } from '../services/geminiService';

interface CaseManagementProps {
  cases: LegalCase[];
  clients: Client[];
  onAddCase: (newCase: LegalCase) => void;
  onUpdateCase: (updatedCase: LegalCase) => void;
  onAddClient: (newClient: Client) => void;
}

const CaseManagement: React.FC<CaseManagementProps> = ({ cases, clients, onAddCase, onUpdateCase, onAddClient }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [filterCourt, setFilterCourt] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Saved Filters State
  const [savedFilters, setSavedFilters] = useState<{id: string, name: string, court: string, status: string}[]>([]);
  const [newFilterName, setNewFilterName] = useState('');

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // New Case Form State
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState<Partial<LegalCase>>({
    status: CaseStatus.ACTIVE,
    court: CourtType.DUBAI,
    clientId: '',
    documents: [],
    totalFee: 0,
    paidAmount: 0,
    opponentName: '',
    nextHearingDate: ''
  });
  const [newClientFields, setNewClientFields] = useState({
    name: '',
    phone: '',
    email: '',
    emiratesId: '',
    address: '',
    dateOfBirth: '',
    type: 'Individual' as 'Individual' | 'Corporate'
  });

  const handleAnalyze = async () => {
    if (!selectedCase) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const result = await analyzeCaseStrategy(selectedCase.title, selectedCase.court, selectedCase.status, selectedCase.opponentName);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleSaveFilter = () => {
    if (!newFilterName.trim()) return;
    const newFilter = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFilterName,
      court: filterCourt,
      status: filterStatus
    };
    setSavedFilters([...savedFilters, newFilter]);
    setNewFilterName('');
  };

  const applySavedFilter = (filter: {court: string, status: string}) => {
    setFilterCourt(filter.court);
    setFilterStatus(filter.status);
  };

  const deleteSavedFilter = (id: string) => {
    setSavedFilters(savedFilters.filter(f => f.id !== id));
  };

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalClientId = newCaseForm.clientId;
    let finalClientName = clients.find(cl => cl.id === finalClientId)?.name || '';

    if (showNewClientForm) {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('ar-AE') + ' ' + now.toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' });
      
      const newClientId = Math.random().toString(36).substr(2, 9);
      const newClient: Client = {
        ...newClientFields,
        id: newClientId,
        totalCases: 1,
        createdAt: formattedDate
      };
      onAddClient(newClient);
      finalClientId = newClientId;
      finalClientName = newClient.name;
    }

    const id = Math.random().toString(36).substr(2, 9);
    const fullCase: LegalCase = {
      ...newCaseForm as LegalCase,
      id,
      clientId: finalClientId || '',
      clientName: finalClientName,
      createdAt: new Date().toISOString().split('T')[0],
      documents: []
    };
    
    onAddCase(fullCase);
    resetForm();
  };

  const resetForm = () => {
    setShowAddModal(false);
    setShowNewClientForm(false);
    setNewCaseForm({ status: CaseStatus.ACTIVE, court: CourtType.DUBAI, clientId: '', documents: [], totalFee: 0, paidAmount: 0, opponentName: '', nextHearingDate: '' });
    setNewClientFields({ name: '', phone: '', email: '', emiratesId: '', address: '', dateOfBirth: '', type: 'Individual' });
  };

  const filteredCases = cases.filter(c => {
    const matchesCourt = filterCourt === 'all' || c.court === filterCourt;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      c.caseNumber.toLowerCase().includes(searchLower) ||
      c.title.toLowerCase().includes(searchLower) ||
      c.clientName.toLowerCase().includes(searchLower);
    
    return matchesCourt && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.ACTIVE: return 'bg-blue-100 text-blue-700';
      case CaseStatus.CLOSED: return 'bg-slate-100 text-slate-700';
      case CaseStatus.JUDGMENT: return 'bg-green-100 text-green-700';
      case CaseStatus.APPEAL: return 'bg-purple-100 text-purple-700';
      case CaseStatus.PENDING: return 'bg-amber-100 text-amber-700';
      case CaseStatus.LITIGATION: return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">إدارة القضايا</h2>
          <p className="text-slate-500">متابعة ملفات القضايا في مختلف محاكم الدولة</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all flex items-center gap-2"
        >
          <span>+ إضافة قضية جديدة</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-100 bg-white space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input 
                type="text" 
                placeholder="البحث برقم القضية، العنوان، أو اسم الموكل..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-12 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-5 py-3 rounded-xl border flex items-center gap-2 text-sm font-bold transition-all ${showAdvancedFilters ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              <span>تصفية متقدمة</span>
            </button>
          </div>

          {showAdvancedFilters && (
            <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 mr-1 uppercase tracking-wider">المحكمة</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={filterCourt}
                    onChange={(e) => setFilterCourt(e.target.value)}
                  >
                    <option value="all">كل المحاكم</option>
                    {Object.values(CourtType).map(court => (
                      <option key={court} value={court}>{court}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 mr-1 uppercase tracking-wider">الحالة</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">كل الحالات</option>
                    {Object.values(CaseStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="text-[11px] font-bold text-slate-500 mr-1 uppercase tracking-wider">حفظ التصفية الحالية</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="اسم التصفية..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={newFilterName}
                            onChange={(e) => setNewFilterName(e.target.value)}
                        />
                        <button 
                            onClick={handleSaveFilter}
                            disabled={!newFilterName.trim()}
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            حفظ
                        </button>
                    </div>
                </div>
              </div>
              
              {savedFilters.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-400 ml-2">الفلاتر المحفوظة:</span>
                      {savedFilters.map(filter => (
                          <div key={filter.id} className="group flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg hover:border-amber-300 transition-all cursor-pointer">
                              <span 
                                onClick={() => applySavedFilter(filter)}
                                className="text-xs font-bold text-amber-800"
                              >
                                {filter.name}
                              </span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteSavedFilter(filter.id); }}
                                className="text-amber-400 hover:text-amber-700 opacity-50 group-hover:opacity-100 transition-opacity"
                              >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                              </button>
                          </div>
                      ))}
                  </div>
              )}
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">رقم القضية</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">عنوان القضية</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">الموكل</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase text-center">التحصيل</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase text-center">الحالة</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase">الجلسة القادمة</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((c) => {
                const paidPercent = c.totalFee > 0 ? Math.round((c.paidAmount / c.totalFee) * 100) : 0;
                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-sm font-mono font-bold text-slate-700">{c.caseNumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-800">{c.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">فتح في: {c.createdAt}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{c.clientName}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-green-500" style={{ width: `${paidPercent}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{paidPercent}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">
                       <div className={`flex items-center gap-1.5 ${new Date(c.nextHearingDate) < new Date() ? 'text-red-600' : 'text-slate-700'}`}>
                         {c.nextHearingDate}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => {
                          setSelectedCase(c);
                          setAnalysisResult(null);
                        }}
                        className="bg-[#1a1a2e] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all"
                      >
                        التفاصيل
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Detail Drawer */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedCase.title}</h3>
                <p className="text-sm text-slate-500">رقم الملف: {selectedCase.caseNumber}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scroll space-y-8">
              
              {/* AI Strategic Analysis Section - The Genius Feature */}
              <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37] opacity-10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-20 transition-opacity"></div>
                 <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="text-lg font-black text-[#d4af37] flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          التحليل الاستراتيجي الذكي
                       </h4>
                       <button 
                         onClick={handleAnalyze}
                         disabled={isAnalyzing}
                         className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                       >
                         {isAnalyzing ? 'جاري التحليل...' : 'تحديث التحليل'}
                       </button>
                    </div>
                    
                    {!analysisResult && !isAnalyzing && (
                       <div className="text-center py-6">
                          <p className="text-sm text-slate-300 mb-4">احصل على رؤية استراتيجية فورية للقضية باستخدام الذكاء الاصطناعي</p>
                          <button onClick={handleAnalyze} className="bg-[#d4af37] text-[#1a1a2e] px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform">
                             بدء التحليل
                          </button>
                       </div>
                    )}

                    {isAnalyzing && (
                       <div className="space-y-3 animate-pulse">
                          <div className="h-2 bg-white/10 rounded w-3/4"></div>
                          <div className="h-2 bg-white/10 rounded w-full"></div>
                          <div className="h-2 bg-white/10 rounded w-5/6"></div>
                       </div>
                    )}

                    {analysisResult && (
                       <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: analysisResult }} />
                    )}
                 </div>
              </section>

              <section>
                <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-4">الوضع المالي للقضية</h4>
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                   <div className="flex justify-between items-end mb-4">
                      <div>
                         <p className="text-[10px] text-slate-400">إجمالي الأتعاب</p>
                         <h5 className="text-xl font-black text-slate-800">{selectedCase.totalFee?.toLocaleString() || 0} د.إ</h5>
                      </div>
                      <div className="text-left">
                         <p className="text-[10px] text-slate-400">المبلغ المحصل</p>
                         <h5 className="text-xl font-black text-green-600">{selectedCase.paidAmount?.toLocaleString() || 0} د.إ</h5>
                      </div>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500" 
                        style={{ width: `${selectedCase.totalFee > 0 ? (selectedCase.paidAmount / selectedCase.totalFee) * 100 : 0}%` }}
                      ></div>
                   </div>
                   <p className="text-[10px] text-slate-400 text-center">
                      تم تحصيل {selectedCase.totalFee > 0 ? Math.round((selectedCase.paidAmount / selectedCase.totalFee) * 100) : 0}% من إجمالي الأتعاب
                   </p>
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-4">بيانات الموكل والمحكمة</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">المحكمة</p>
                    <p className="text-sm font-bold text-slate-800">{selectedCase.court}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">الحالة الحالية</p>
                    <p className="text-sm font-bold text-slate-800">{selectedCase.status}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">الموكل</p>
                    <p className="text-sm font-bold text-slate-800">{selectedCase.clientName}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">الخصم</p>
                    <p className="text-sm font-bold text-slate-800">{selectedCase.opponentName}</p>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">المستندات المرفقة</h4>
                  <button className="text-[10px] bg-slate-800 text-white px-2 py-1 rounded">إضافة ملف</button>
                </div>
                <div className="space-y-2">
                  {selectedCase.documents.length > 0 ? (
                    selectedCase.documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-[#d4af37] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-slate-400 group-hover:text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{doc.name}</p>
                            <p className="text-[10px] text-slate-400">{doc.uploadDate}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-xs text-slate-400 border border-dashed rounded-xl">لا توجد مستندات</p>
                  )}
                </div>
              </section>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button 
                className="flex-1 bg-[#1a1a2e] text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
              >
                تحديث بيانات القضية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1a1a2e] p-6 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-xl font-bold">إضافة قضية جديدة</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:rotate-90 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleAddCase} className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">رقم القضية</label>
                <input required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newCaseForm.caseNumber} onChange={e => setNewCaseForm({...newCaseForm, caseNumber: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">المحكمة</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newCaseForm.court} onChange={e => setNewCaseForm({...newCaseForm, court: e.target.value as CourtType})}>
                  {Object.values(CourtType).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان القضية</label>
                <input required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newCaseForm.title} onChange={e => setNewCaseForm({...newCaseForm, title: e.target.value})} />
              </div>

              {/* Status Selection Field */}
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">حالة القضية</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#d4af37]"
                  value={newCaseForm.status}
                  onChange={e => setNewCaseForm({...newCaseForm, status: e.target.value as CaseStatus})}
                >
                  {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">إجمالي الأتعاب (د.إ)</label>
                <input type="number" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newCaseForm.totalFee} onChange={e => setNewCaseForm({...newCaseForm, totalFee: Number(e.target.value)})} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">المقدم المدفوع (د.إ)</label>
                <input type="number" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newCaseForm.paidAmount} onChange={e => setNewCaseForm({...newCaseForm, paidAmount: Number(e.target.value)})} />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم الخصم</label>
                <input required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newCaseForm.opponentName} onChange={e => setNewCaseForm({...newCaseForm, opponentName: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ الجلسة القادمة</label>
                <input type="date" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#d4af37]" value={newCaseForm.nextHearingDate} onChange={e => setNewCaseForm({...newCaseForm, nextHearingDate: e.target.value})} />
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100">إلغاء</button>
                <button type="submit" className="px-8 py-2.5 bg-[#d4af37] text-[#1a1a2e] rounded-xl font-bold shadow-lg hover:scale-105 transition-all">حفظ القضية</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;
