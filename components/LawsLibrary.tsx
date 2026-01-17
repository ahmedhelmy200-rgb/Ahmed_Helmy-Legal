
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
    <div className="p-8 lg:p-14 min-h-screen bg-[#0f172a] animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12">
        <button onClick={onBack} className="bg-[#1e293b] p-4 rounded-2xl shadow-sm border border-white/5 hover:bg-white/5 transition-colors group">
          <svg className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">مكتبة القوانين الإماراتية</h2>
          <p className="text-slate-400 font-bold text-sm mt-1">المرجع القانوني الشامل والمحدث</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[#1e293b] p-8 rounded-[3rem] shadow-sm border border-white/5 mb-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="ابحث عن قانون، مرسوم، أو مادة قانونية..." 
              className="w-full h-16 bg-[#0f172a] border border-white/5 rounded-3xl px-12 text-sm font-bold focus:ring-4 focus:ring-amber-500/10 focus:bg-[#0f172a] outline-none transition-all placeholder:text-slate-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 custom-scroll">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`px-8 h-16 rounded-3xl text-sm font-black whitespace-nowrap transition-all ${!selectedCategory ? 'bg-[#d4af37] text-[#0f172a] shadow-lg' : 'bg-[#0f172a] text-slate-400 hover:bg-white/5'}`}
            >
              الكل
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 h-16 rounded-3xl text-sm font-black whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-[#d4af37] text-[#0f172a] shadow-lg' : 'bg-[#0f172a] text-slate-400 hover:bg-white/5'}`}
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
            <div key={law.id} className="bg-[#1e293b] rounded-[2.5rem] border border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div 
                className="p-8 cursor-pointer flex justify-between items-center bg-[#1e293b] group-hover:bg-[#252f46] transition-colors"
                onClick={() => setExpandedLaw(expandedLaw === law.id ? null : law.id)}
              >
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-[#0f172a] text-slate-400 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-[#d4af37] group-hover:text-[#0f172a] transition-all">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-white leading-tight group-hover:text-[#d4af37] transition-colors">{law.title}</h3>
                      <p className="text-sm text-slate-400 font-bold mt-2">{law.description}</p>
                      <span className="inline-block mt-3 bg-[#0f172a] text-slate-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-white/5">{law.category}</span>
                   </div>
                </div>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full bg-[#0f172a] text-slate-400 transform transition-transform duration-300 ${expandedLaw === law.id ? 'rotate-180 bg-[#d4af37] text-[#0f172a]' : ''}`}>
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              
              {expandedLaw === law.id && (
                <div className="bg-[#0f172a]/30 p-8 border-t border-white/5 animate-in slide-in-from-top-2">
                   <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">أبرز المواد القانونية</h4>
                   <div className="space-y-4">
                      {law.articles.length > 0 ? law.articles.map((art, idx) => (
                        <div key={idx} className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-sm hover:border-[#d4af37]/30 transition-colors">
                           <p className="text-xs font-black text-[#d4af37] mb-2">المادة ({art.number})</p>
                           <p className="text-sm font-bold text-slate-300 leading-relaxed">{art.text}</p>
                        </div>
                      )) : (
                        <p className="text-center text-slate-500 text-sm font-bold py-4">سيتم إضافة نصوص المواد قريباً.</p>
                      )}
                   </div>
                   <button className="w-full mt-8 bg-white text-[#0f172a] py-4 rounded-2xl font-black text-xs hover:bg-[#d4af37] transition-all shadow-lg">
                      عرض النص الكامل للقانون (PDF)
                   </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-[#1e293b] rounded-[3rem] border border-white/5 border-dashed">
             <div className="w-16 h-16 bg-[#0f172a] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-slate-500 font-black">لا توجد نتائج مطابقة لبحثك.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawsLibrary;
