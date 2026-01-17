
import React, { useState, useEffect } from 'react';
import { LegalCase, CaseStatus, CaseCategory, Client, UserRole, CaseComment, CaseActivity } from '../types';
import { analyzeCaseStrategy } from '../services/geminiService';
import { CASE_CATEGORIES_TREE } from '../constants';

interface CaseManagementProps {
  cases: LegalCase[];
  clients: Client[];
  userRole: UserRole;
  onAddCase: (newCase: LegalCase) => void;
  onUpdateCase: (updatedCase: LegalCase) => void;
  onAddClient: (newClient: Client) => void;
  onBack: () => void;
}

const CaseManagement: React.FC<CaseManagementProps> = ({ cases, clients, userRole, onAddCase, onUpdateCase, onAddClient, onBack }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'comments' | 'activities' | 'strategy'>('details');
  const [commentInput, setCommentInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const [isAddingQuickClient, setIsAddingQuickClient] = useState(false);
  const [quickClientForm, setQuickClientForm] = useState({ name: '', phone: '', emiratesId: '' });

  const [newCaseForm, setNewCaseForm] = useState<Partial<LegalCase>>({
    category: CaseCategory.CIVIL,
    subCategory: '',
    status: CaseStatus.ACTIVE,
    totalFee: 0,
    paidAmount: 0,
    clientId: ''
  });

  const canModify = userRole === 'admin' || userRole === 'staff';
  const canArchive = userRole === 'admin';

  useEffect(() => {
    if (newCaseForm.category) {
       setNewCaseForm(prev => ({ ...prev, subCategory: '' }));
    }
  }, [newCaseForm.category]);

  const logActivity = (currentCase: LegalCase, type: CaseActivity['type'], description: string): LegalCase => {
    const activity: CaseActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      description,
      userRole,
      userName: userRole === 'admin' ? 'إدارة المكتب' : (userRole === 'staff' ? 'SAMAR' : currentCase.clientName),
      timestamp: new Date().toLocaleDateString('ar-AE', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      })
    };
    return {
      ...currentCase,
      activities: [activity, ...(currentCase.activities || [])]
    };
  };

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === newCaseForm.clientId);
    let caseToAdd: LegalCase = {
      ...newCaseForm as LegalCase,
      id: Math.random().toString(36).substr(2, 9),
      clientName: client?.name || 'عميل جديد',
      createdAt: new Date().toLocaleDateString('ar-AE'),
      documents: [],
      comments: [],
      activities: [],
      isArchived: false,
      subCategory: newCaseForm.subCategory || 'عام',
      assignedLawyer: 'المستشار أحمد حلمي'
    };
    onAddCase(caseToAdd);
    setShowAddModal(false);
  };

  const handleStatusChange = (newStatus: CaseStatus) => {
    if (!selectedCase || selectedCase.status === newStatus) return;
    // Explicitly type as LegalCase to avoid narrowing issues
    let updatedCase: LegalCase = { ...selectedCase, status: newStatus };
    updatedCase = logActivity(updatedCase, 'status_change', `تغيير حالة الملف من ${selectedCase.status} إلى ${newStatus}`);
    onUpdateCase(updatedCase);
    setSelectedCase(updatedCase);
  };

  const handleAddComment = () => {
    if (!selectedCase || !commentInput.trim()) return;
    const newComment: CaseComment = {
      id: Math.random().toString(36).substr(2, 9),
      authorRole: userRole,
      authorName: userRole === 'admin' ? 'إدارة المكتب' : (userRole === 'staff' ? 'SAMAR' : selectedCase.clientName),
      text: commentInput,
      date: new Date().toLocaleDateString('ar-AE')
    };
    // Fix: Explicitly type updatedCase as LegalCase to prevent narrowing to required 'comments'
    let updatedCase: LegalCase = { ...selectedCase, comments: [...(selectedCase.comments || []), newComment] };
    updatedCase = logActivity(updatedCase, 'comment_added', 'إضافة ملاحظة جديدة على الملف');
    onUpdateCase(updatedCase);
    setSelectedCase(updatedCase);
    setCommentInput('');
  };

  const handleGetSmartTip = async () => {
    if (!selectedCase) return;
    setIsAnalyzing(true);
    setActiveDetailTab('strategy');
    const result = await analyzeCaseStrategy(
        `القضية: ${selectedCase.title}, المحكمة: ${selectedCase.court}, الخصم: ${selectedCase.opponentName}, الحالة: ${selectedCase.status}`,
        selectedCase.court,
        selectedCase.status,
        selectedCase.opponentName
    );
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const getActivityIcon = (type: CaseActivity['type']) => {
    switch (type) {
      case 'status_change': return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>;
      case 'comment_added': return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg></div>;
      default: return <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>;
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
           <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">إدارة القضايا</h2>
              <p className="text-slate-500 font-medium">تصنيف البلاغات، الأرشفة، والقرارات الذكية</p>
           </div>
        </div>
        {canModify && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#1a1a2e] text-white px-8 py-3 rounded-2xl font-black shadow-xl hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all"
          >
            + تسجيل قضية جديدة
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">رقم القضية</th>
              <th className="px-6 py-4">التصنيف</th>
              <th className="px-6 py-4">الموكل</th>
              <th className="px-6 py-4">الأتعاب</th>
              <th className="px-6 py-4">الحالة</th>
              <th className="px-6 py-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.filter(c => !c.isArchived).map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold">{c.caseNumber}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-100">{c.category}</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-600">{c.clientName}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{(c.totalFee || 0).toLocaleString()} د.إ</td>
                <td className="px-6 py-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                     c.status === CaseStatus.ACTIVE ? 'bg-green-50 text-green-700' :
                     'bg-slate-100 text-slate-600'
                   }`}>{c.status}</span>
                </td>
                <td className="px-6 py-4 text-center">
                   <button 
                    onClick={() => { setSelectedCase(c); setActiveDetailTab('details'); setAnalysisResult(null); }}
                    className="bg-slate-100 text-[#1a1a2e] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[#d4af37] transition-all"
                   >التفاصيل</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#1a1a2e] text-white">
              <div>
                <h3 className="text-xl font-black">{selectedCase.title}</h3>
                <p className="text-xs text-slate-400">رقم الملف: {selectedCase.caseNumber}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="flex border-b border-slate-100 bg-slate-50 px-6 items-center">
                <button onClick={() => setActiveDetailTab('details')} className={`px-4 py-4 text-xs font-bold border-b-2 transition-colors ${activeDetailTab === 'details' ? 'border-[#d4af37] text-[#1a1a2e]' : 'border-transparent text-slate-400'}`}>التفاصيل</button>
                <button onClick={() => setActiveDetailTab('comments')} className={`px-4 py-4 text-xs font-bold border-b-2 transition-colors ${activeDetailTab === 'comments' ? 'border-[#d4af37] text-[#1a1a2e]' : 'border-transparent text-slate-400'}`}>الملاحظات</button>
                <button onClick={() => setActiveDetailTab('activities')} className={`px-4 py-4 text-xs font-bold border-b-2 transition-colors ${activeDetailTab === 'activities' ? 'border-[#d4af37] text-[#1a1a2e]' : 'border-transparent text-slate-400'}`}>النشاطات</button>
                
                {/* AI Tip Button next to tabs */}
                <button 
                  onClick={handleGetSmartTip}
                  disabled={isAnalyzing}
                  className="mr-auto flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-700 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {isAnalyzing ? 'جاري التحليل...' : 'استراتيجية ذكية'}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-6">
                {activeDetailTab === 'details' && (
                  <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                       <div><p className="text-slate-400 text-xs">التصنيف</p><p className="font-bold">{selectedCase.category}</p></div>
                       <div><p className="text-slate-400 text-xs">الموكل</p><p className="font-bold">{selectedCase.clientName}</p></div>
                       <div><p className="text-slate-400 text-xs">الخصم</p><p className="font-bold">{selectedCase.opponentName || '-'}</p></div>
                       <div><p className="text-slate-400 text-xs">المحكمة</p><p className="font-bold">{selectedCase.court || '-'}</p></div>
                       <div className="col-span-2 pt-4 border-t border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">الموقف المالي</p>
                          <div className="flex gap-4">
                            <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                               <p className="text-[9px] text-slate-500">الأتعاب</p>
                               <p className="font-black">{(selectedCase.totalFee || 0).toLocaleString()} د.إ</p>
                            </div>
                            <div className="flex-1 bg-green-50 p-3 rounded-xl border border-green-100">
                               <p className="text-[9px] text-green-600">المحصل</p>
                               <p className="font-black text-green-700">{(selectedCase.paidAmount || 0).toLocaleString()} د.إ</p>
                            </div>
                          </div>
                       </div>
                    </div>
                  </section>
                )}

                {activeDetailTab === 'strategy' && (
                  <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl min-h-[300px] flex flex-col">
                    <h4 className="text-amber-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                       نصيحة "حُلم" الذكية للمستشار
                    </h4>
                    {isAnalyzing ? (
                      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400">
                         <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                         <p className="text-[10px] animate-pulse">جاري دراسة أوراق القضية وتحليل الثغرات...</p>
                      </div>
                    ) : (
                      <div className="prose prose-invert prose-sm text-xs leading-relaxed opacity-90" dangerouslySetInnerHTML={{ __html: analysisResult || 'لم يتم إجراء تحليل بعد.' }} />
                    )}
                  </section>
                )}

                {activeDetailTab === 'comments' && (
                  <div className="flex flex-col h-full">
                     <div className="flex-1 space-y-4 mb-4">
                        {selectedCase.comments?.map(comment => (
                            <div key={comment.id} className="p-4 rounded-2xl bg-slate-50 text-xs border border-slate-100">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="font-black">{comment.authorName}</span>
                                  <span className="text-[10px] text-slate-400">{comment.date}</span>
                               </div>
                               <p>{comment.text}</p>
                            </div>
                        ))}
                     </div>
                     <div className="flex gap-2">
                        <input className="flex-1 bg-slate-50 px-4 py-2 text-xs rounded-xl outline-none" placeholder="اكتب تعليقاً..." value={commentInput} onChange={e => setCommentInput(e.target.value)} />
                        <button onClick={handleAddComment} className="bg-[#1a1a2e] text-white px-4 py-2 rounded-xl text-xs font-bold">إرسال</button>
                     </div>
                  </div>
                )}

                {activeDetailTab === 'activities' && (
                  <div className="space-y-6 relative pl-4 border-l-2 border-slate-100 ml-4">
                     {selectedCase.activities?.map(activity => (
                        <div key={activity.id} className="relative flex gap-4 items-start">
                           <div className="absolute -right-[33px]">{getActivityIcon(activity.type)}</div>
                           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full">
                              <p className="text-xs font-bold">{activity.description}</p>
                              <span className="text-[9px] text-slate-400">{activity.timestamp}</span>
                           </div>
                        </div>
                     ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Add Modal Simplified for integration */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-black mb-8">تسجيل بلاغ/قضية جديدة</h3>
            <form onSubmit={handleAddCase} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2">عنوان القضية</label>
                <input required className="w-full border border-slate-200 rounded-xl px-5 py-3 outline-none focus:border-[#d4af37]" onChange={e => setNewCaseForm({...newCaseForm, title: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-400 mb-2">التصنيف</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm" onChange={e => setNewCaseForm({...newCaseForm, category: e.target.value as CaseCategory})}>
                  {Object.values(CaseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-400 mb-2">الموكل</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm" onChange={e => setNewCaseForm({...newCaseForm, clientId: e.target.value})}>
                  <option value="">اختر الموكل...</option>
                  {clients.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
                </select>
              </div>
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 font-bold text-slate-400">إلغاء</button>
                <button type="submit" className="flex-1 bg-[#1a1a2e] text-white py-4 rounded-2xl font-black shadow-xl">تسجيل القضية</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;
