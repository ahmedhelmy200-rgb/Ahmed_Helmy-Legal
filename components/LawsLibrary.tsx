
import React, { useState } from 'react';

interface LawsLibraryProps {
  onBack: () => void;
}

const LAWS_DATA = [
  {
    id: 1,
    title: 'قانون العقوبات الاتحادي (مرسوم بقانون اتحادي رقم 31 لسنة 2021)',
    category: 'جنائي',
    description: 'يحدد الجرائم والعقوبات المقررة لها في دولة الإمارات العربية المتحدة.',
    articles: [
      { number: '1', text: 'لا جريمة ولا عقوبة إلا بنص قانوني، ولا عقوبة على الفعل إلا إذا كان مجرماً وقت ارتكابه.' },
      { number: '52', text: 'تسري أحكام هذا القانون على كل من يرتكب جريمة في إقليم الدولة.' }
    ]
  },
  {
    id: 2,
    title: 'قانون الأحوال الشخصية (قانون اتحادي رقم 28 لسنة 2005)',
    category: 'أحوال شخصية',
    description: 'ينظم مسائل الزواج، الطلاق، الحضانة، المواريث، والوصايا.',
    articles: [
      { number: '18', text: 'الزواج عقد يفيد حل استمتاع كل من الزوجين بالآخر شرعاً، وغايته الإحصان وبناء أسرة مستقرة.' },
      { number: '146', text: 'الحضانة حفظ الولد وتربيته ورعايته بما لا يتعارض مع حق الولي في الولاية على النفس.' }
    ]
  },
  {
    id: 3,
    title: 'قانون تنظيم علاقات العمل (مرسوم بقانون اتحادي رقم 33 لسنة 2021)',
    category: 'عمالي',
    description: 'ينظم العلاقة بين أصحاب العمل والعمال في القطاع الخاص.',
    articles: [
      { number: '8', text: 'تحدد أنواع عقود العمل (الدوام الكامل، الجزئي، المؤقت، المرن) وفق اللائحة التنفيذية.' },
      { number: '51', text: 'يستحق العامل الأجنبي الذي يعمل بنمط الدوام الكامل مكافأة نهاية الخدمة عند انتهاء خدمته.' }
    ]
  },
  {
    id: 4,
    title: 'قانون المعاملات المدنية (قانون اتحادي رقم 5 لسنة 1985)',
    category: 'مدني',
    description: 'القانون الأساسي الذي ينظم الالتزامات والعقود والحقوق العينية.',
    articles: [
      { number: '125', text: 'العقد هو ارتباط الإيجاب الصادر من أحد المتعاقدين بقبول الآخر وتوافقهما على وجه يثبت أثره في المعقود عليه.' },
      { number: '282', text: 'كل إضرار بالغير يلزم فاعله ولو غير مميز بضمان الضرر.' }
    ]
  },
  {
    id: 5,
    title: 'قانون الإجراءات المدنية (مرسوم بقانون اتحادي رقم 42 لسنة 2022)',
    category: 'إجراءات',
    description: 'ينظم إجراءات التقاضي أمام المحاكم المدنية وطرق الطعن في الأحكام.',
    articles: []
  },
  {
    id: 6,
    title: 'قانون الشركات التجارية (مرسوم بقانون اتحادي رقم 32 لسنة 2021)',
    category: 'تجاري',
    description: 'ينظم تأسيس الشركات التجارية وإدارتها وحوكمتها.',
    articles: []
  }
];

const LawsLibrary: React.FC<LawsLibraryProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedLaw, setExpandedLaw] = useState<number | null>(null);

  const categories = Array.from(new Set(LAWS_DATA.map(l => l.category)));

  const filteredLaws = LAWS_DATA.filter(law => {
    const matchesSearch = law.title.includes(searchTerm) || law.description.includes(searchTerm);
    const matchesCategory = selectedCategory ? law.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors group">
          <svg className="w-6 h-6 text-slate-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">مكتبة القوانين الإماراتية</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">المرجع القانوني الشامل والمحدث</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-slate-100 mb-8 animate-in slide-in-from-top-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="ابحث عن قانون، مرسوم، أو مادة قانونية..." 
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-12 text-sm focus:ring-2 focus:ring-[#d4af37] outline-none shadow-inner transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scroll">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-6 h-14 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${!selectedCategory ? 'bg-[#1a1a2e] text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              الكل
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 h-14 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[#d4af37] text-[#1a1a2e] shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Laws Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredLaws.length > 0 ? (
          filteredLaws.map(law => (
            <div key={law.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div 
                className="p-6 cursor-pointer flex justify-between items-center bg-gradient-to-l from-white to-slate-50"
                onClick={() => setExpandedLaw(expandedLaw === law.id ? null : law.id)}
              >
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-[#1a1a2e] text-[#d4af37] rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-[#b45309] transition-colors">{law.title}</h3>
                      <p className="text-sm text-slate-500 mt-2">{law.description}</p>
                      <span className="inline-block mt-3 bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200">{law.category}</span>
                   </div>
                </div>
                <div className={`transform transition-transform duration-300 ${expandedLaw === law.id ? 'rotate-180' : ''}`}>
                   <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              
              {expandedLaw === law.id && (
                <div className="bg-slate-50 p-6 border-t border-slate-100 animate-in slide-in-from-top-2">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">أبرز المواد القانونية</h4>
                   <div className="space-y-3">
                      {law.articles.length > 0 ? law.articles.map((art, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-[#d4af37] transition-colors">
                           <p className="text-xs font-black text-[#d4af37] mb-1">المادة ({art.number})</p>
                           <p className="text-sm font-medium text-slate-700 leading-relaxed">{art.text}</p>
                        </div>
                      )) : (
                        <p className="text-center text-slate-400 text-xs py-4">سيتم إضافة نصوص المواد قريباً.</p>
                      )}
                   </div>
                   <button className="w-full mt-6 bg-[#1a1a2e] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#d4af37] hover:text-[#1a1a2e] transition-all shadow-lg">
                      عرض النص الكامل للقانون (PDF)
                   </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-slate-400 font-bold">لا توجد نتائج مطابقة لبحثك.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawsLibrary;
