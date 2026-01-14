
import React, { useState } from 'react';
import { LegalCase, CaseStatus, CaseCategory, Client, UserRole, CaseComment, CaseActivity } from '../types';
import { analyzeCaseStrategy } from '../services/geminiService';

interface CaseManagementProps {
  cases: LegalCase[];
  clients: Client[];
  userRole: UserRole;
  onAddCase: (newCase: LegalCase) => void;
  onUpdateCase: (updatedCase: LegalCase) => void;
}

const CaseManagement: React.FC<CaseManagementProps> = ({ cases, clients, userRole, onAddCase, onUpdateCase }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'comments' | 'activities'>('details');
  const [commentInput, setCommentInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const [newCaseForm, setNewCaseForm] = useState<Partial<LegalCase>>({
    category: CaseCategory.CIVIL,
    status: CaseStatus.ACTIVE,
    totalFee: 0,
    paidAmount: 0
  });

  // Helper to log activities
  const logActivity = (currentCase: LegalCase, type: CaseActivity['type'], description: string): LegalCase => {
    const activity: CaseActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      description,
      userRole,
      userName: userRole === 'admin' ? 'إدارة المكتب' : currentCase.clientName,
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
      clientName: client?.name || '',
      createdAt: new Date().toLocaleDateString('ar-AE'),
      documents: [],
      comments: [],
      activities: [],
      isArchived: false
    };

    // Log creation
    const creationActivity: CaseActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'info_update',
      description: 'تم فتح الملف وإنشاء القضية في النظام',
      userRole: userRole,
      userName: userRole === 'admin' ? 'إدارة المكتب' : client?.name || 'مستخدم',
      timestamp: new Date().toLocaleDateString('ar-AE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    caseToAdd.activities = [creationActivity];

    onAddCase(caseToAdd);
    setShowAddModal(false);
    setNewCaseForm({ category: CaseCategory.CIVIL, status: CaseStatus.ACTIVE, totalFee: 0, paidAmount: 0 });
  };

  const handleStatusChange = (newStatus: CaseStatus) => {
    if (!selectedCase || selectedCase.status === newStatus) return;
    
    let updatedCase = { ...selectedCase, status: newStatus };
    updatedCase = logActivity(updatedCase, 'status_change', `تغيير حالة الملف من ${selectedCase.status} إلى ${newStatus}`);
    
    onUpdateCase(updatedCase);
    setSelectedCase(updatedCase);
  };

  const handleAddComment = () => {
    if (!selectedCase || !commentInput.trim()) return;

    const newComment: CaseComment = {
      id: Math.random().toString(36).substr(2, 9),
      authorRole: userRole,
      authorName: userRole === 'admin' ? 'إدارة المكتب' : selectedCase.clientName,
      text: commentInput,
      date: new Date().toLocaleDateString('ar-AE')
    };

    let updatedCase = { ...selectedCase, comments: [...(selectedCase.comments || []), newComment] };
    updatedCase = logActivity(updatedCase, 'comment_added', 'إضافة ملاحظة جديدة على الملف');
    
    onUpdateCase(updatedCase);
    setSelectedCase(updatedCase);
    setCommentInput('');
  };

  const handleAnalyze = async () => {
    if (!selectedCase) return;
    setIsAnalyzing(true);
    const result = await analyzeCaseStrategy(selectedCase.title, selectedCase.court, selectedCase.status, selectedCase.opponentName);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleArchiveCase = (c: LegalCase) => {
    let updatedCase = { ...c, status: CaseStatus.ARCHIVED, isArchived: true };
    updatedCase = logActivity(updatedCase, 'info_update', 'تم أرشفة القضية وإغلاق الملف');
    onUpdateCase(updatedCase);
    setSelectedCase(null);
  };

  const getActivityIcon = (type: CaseActivity['type']) => {
    switch (type) {
      case 'status_change': return (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </div>
      );
      case 'comment_added': return (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm border border-green-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </div>
      );
      default: return (
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      );
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">إدارة القضايا</h2>
          <p className="text-slate-500 font-medium">تصنيف البلاغات، الأرشفة، والقرارات القضائية</p>
        </div>
        {userRole === 'admin' && (
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
                <td className="px-6 py-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                     c.status === CaseStatus.ACTIVE ? 'bg-green-50 text-green-700' :
                     c.status === CaseStatus.PENDING ? 'bg-amber-50 text-amber-700' :
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

      {/* Add Case Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl">
            <h3 className="text-2xl font-black mb-8">تسجيل بلاغ/قضية جديدة</h3>
            <form onSubmit={handleAddCase} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2">رقم القضية / البلاغ</label>
                <input required className="w-full border border-slate-200 rounded-xl px-5 py-3 outline-none focus:border-[#d4af37]" onChange={e => setNewCaseForm({...newCaseForm, caseNumber: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2">عنوان القضية</label>
                <input required className="w-full border border-slate-200 rounded-xl px-5 py-3 outline-none focus:border-[#d4af37]" onChange={e => setNewCaseForm({...newCaseForm, title: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2">تصنيف البلاغ</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]"
                  onChange={e => setNewCaseForm({...newCaseForm, category: e.target.value as CaseCategory})}
                >
                  {Object.values(CaseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 mb-2">الموكل</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#d4af37]"
                  onChange={e => setNewCaseForm({...newCaseForm, clientId: e.target.value})}
                >
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

      {/* Case Archive/Details Drawer */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#1a1a2e] text-white">
              <div>
                <h3 className="text-xl font-black">{selectedCase.title}</h3>
                <p className="text-xs text-slate-400 mt-1">رقم الملف: {selectedCase.caseNumber}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50 px-6">
                <button 
                  onClick={() => setActiveDetailTab('details')}
                  className={`px-4 py-4 text-xs font-bold border-b-2 transition-colors ${activeDetailTab === 'details' ? 'border-[#d4af37] text-[#1a1a2e]' : 'border-transparent text-slate-400'}`}
                >
                  تفاصيل الملف
                </button>
                <button 
                  onClick={() => setActiveDetailTab('comments')}
                  className={`px-4 py-4 text-xs font-bold border-b-2 transition-colors ${activeDetailTab === 'comments' ? 'border-[#d4af37] text-[#1a1a2e]' : 'border-transparent text-slate-400'}`}
                >
                  الملاحظات ({selectedCase.comments?.length || 0})
                </button>
                <button 
                  onClick={() => setActiveDetailTab('activities')}
                  className={`px-4 py-4 text-xs font-bold border-b-2 transition-colors ${activeDetailTab === 'activities' ? 'border-[#d4af37] text-[#1a1a2e]' : 'border-transparent text-slate-400'}`}
                >
                  سجل النشاطات
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-6">
                {activeDetailTab === 'details' && (
                  <>
                    <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">بيانات القضية</h4>
                         {userRole === 'admin' && (
                            <select 
                              value={selectedCase.status}
                              onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold outline-none focus:border-[#d4af37]"
                            >
                              {Object.values(CaseStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                         )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                         <div>
                            <p className="text-slate-400 text-xs">التصنيف</p>
                            <p className="font-bold text-slate-700">{selectedCase.category}</p>
                         </div>
                         <div>
                            <p className="text-slate-400 text-xs">الموكل</p>
                            <p className="font-bold text-slate-700">{selectedCase.clientName}</p>
                         </div>
                         <div>
                            <p className="text-slate-400 text-xs">الخصم</p>
                            <p className="font-bold text-slate-700">{selectedCase.opponentName || 'غير محدد'}</p>
                         </div>
                         <div>
                            <p className="text-slate-400 text-xs">المحكمة</p>
                            <p className="font-bold text-slate-700">{selectedCase.court || 'غير محدد'}</p>
                         </div>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-sm font-black text-slate-800 mb-4">مستندات القضية</h4>
                      <div className="grid grid-cols-2 gap-4">
                          {['قرار نيابة', 'مذكرة دفاع', 'مستند دعم', 'حكم محكمة'].map(d => (
                            <div key={d} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:border-[#d4af37] transition-all cursor-pointer">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <span className="text-xs font-bold text-slate-700">{d}</span>
                            </div>
                          ))}
                      </div>
                    </section>

                    {/* AI Strategy Analysis */}
                    {userRole === 'admin' && (
                        <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 text-white shadow-xl mt-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-black text-[#d4af37] flex items-center gap-2">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                               التحليل الاستراتيجي (AI)
                            </h4>
                            <button onClick={handleAnalyze} disabled={isAnalyzing} className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors">
                              {isAnalyzing ? 'جاري التحليل...' : 'تحديث التحليل'}
                            </button>
                          </div>
                          {analysisResult ? (
                            <div className="prose prose-invert prose-sm text-xs leading-relaxed opacity-90" dangerouslySetInnerHTML={{ __html: analysisResult }} />
                          ) : (
                            <p className="text-xs text-slate-400 text-center py-4">اضغط على زر التحديث للحصول على رؤية ذكية لموقف القضية والخطوات القادمة.</p>
                          )}
                        </section>
                    )}

                    {userRole === 'admin' && (
                      <div className="pt-8 mt-auto border-t border-slate-100">
                        <button 
                          onClick={() => handleArchiveCase(selectedCase)}
                          className="w-full py-4 bg-amber-50 text-amber-700 rounded-2xl font-bold text-xs hover:bg-amber-100 transition-all border border-amber-100"
                        >
                          نقل إلى الأرشيف النهائي
                        </button>
                      </div>
                    )}
                  </>
                )}

                {activeDetailTab === 'comments' && (
                  <div className="flex flex-col h-full">
                     <div className="flex-1 space-y-4 mb-4">
                        {selectedCase.comments && selectedCase.comments.length > 0 ? (
                          selectedCase.comments.map(comment => (
                            <div key={comment.id} className={`p-4 rounded-2xl text-xs ${comment.authorRole === 'admin' ? 'bg-amber-50 mr-8 rounded-tr-none' : 'bg-slate-100 ml-8 rounded-tl-none'}`}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-black text-slate-600">{comment.authorName}</span>
                                <span className="text-[10px] text-slate-400">{comment.date}</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed">{comment.text}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 bg-slate-50 rounded-3xl">
                             <p className="text-slate-400 text-xs">لا توجد ملاحظات مسجلة.</p>
                          </div>
                        )}
                     </div>
                     <div className="flex gap-2 bg-white p-2 border border-slate-100 rounded-2xl shadow-sm">
                        <input 
                           className="flex-1 bg-transparent px-4 py-2 text-xs outline-none" 
                           placeholder="كتب ملاحظة..." 
                           value={commentInput}
                           onChange={(e) => setCommentInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        />
                        <button 
                          onClick={handleAddComment}
                          className="bg-[#1a1a2e] text-white px-4 py-2 rounded-xl text-xs font-bold"
                        >إرسال</button>
                     </div>
                  </div>
                )}

                {activeDetailTab === 'activities' && (
                  <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                      {selectedCase.activities && selectedCase.activities.length > 0 ? (
                        selectedCase.activities.map(activity => (
                           <div key={activity.id} className="relative flex gap-4 items-start">
                              <div className="z-10 bg-white p-1 rounded-full">
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                                 <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-black text-slate-500">{activity.userName}</span>
                                    <span className="text-[10px] text-slate-400">{activity.timestamp}</span>
                                 </div>
                                 <p className="text-xs font-bold text-slate-700">{activity.description}</p>
                              </div>
                           </div>
                        ))
                      ) : (
                        <p className="text-center text-xs text-slate-400 py-10">لا يوجد سجل نشاطات لهذا الملف.</p>
                      )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;
