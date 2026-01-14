
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'يناير', cases: 40 },
  { name: 'فبراير', cases: 30 },
  { name: 'مارس', cases: 20 },
  { name: 'أبريل', cases: 27 },
  { name: 'مايو', cases: 18 },
  { name: 'يونيو', cases: 23 },
];

const StatCard = ({ title, value, icon, color, accentColor }: { title: string, value: string | number, icon: any, color: string, accentColor: string }) => (
  <div className={`bg-white p-7 rounded-[2rem] shadow-sm border-r-8 ${accentColor} flex items-center justify-between hover:shadow-xl hover:-translate-y-1 transition-all group duration-300`}>
    <div>
      <p className="text-[11px] text-slate-400 font-black mb-1 uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
    </div>
    <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-10">
      {/* Welcome Banner - Premium Look */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a] rounded-[3rem] p-12 mb-10 text-white shadow-2xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#d4af37]/20">
              نظام الإدارة المتكامل
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
              أهلاً بك، المستشار <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fde68a]">أحمد حلمي</span>
            </h2>
            <p className="text-slate-400 max-w-xl text-lg leading-relaxed font-medium">
              مرحباً بك في مكتبكم بمدينة العين. نظام LegalMaster جاهز لإدارة كافة القضايا والتحصيلات المالية بدقة متناهية.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-10">
               <button className="bg-gradient-to-r from-[#d4af37] to-[#b8960c] text-[#1a1a2e] px-8 py-3.5 rounded-2xl font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                  تسجيل قضية جديدة
               </button>
               <a 
                 href="https://ahmedhelmy-law.com" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-white/5 backdrop-blur-xl text-white px-8 py-3.5 rounded-2xl font-black border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
               >
                  <span>زيارة الموقع الرسمي</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
               </a>
            </div>
          </div>
          <div className="opacity-40 transform scale-125 rotate-6 hover:rotate-0 transition-transform duration-700 hidden lg:block">
             <svg className="w-64 h-64 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 9h3v12h10V9h3L12 2zm0 5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM9 19v-2h6v2H9z" />
             </svg>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37] opacity-[0.03] rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-[0.03] rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <StatCard 
          title="إجمالي القضايا" 
          value="124" 
          accentColor="border-[#d4af37]"
          color="bg-[#d4af37]/10 text-[#d4af37]"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>}
        />
        <StatCard 
          title="إيرادات الشهر" 
          value="45,000 د.إ" 
          accentColor="border-[#1a1a2e]"
          color="bg-[#1a1a2e]/10 text-[#1a1a2e]"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
        <StatCard 
          title="الموكلين النشطين" 
          value="86" 
          accentColor="border-blue-600"
          color="bg-blue-50 text-blue-700"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
        />
        <StatCard 
          title="جلسات اليوم" 
          value="03" 
          accentColor="border-red-600"
          color="bg-red-50 text-red-600"
          icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
             <div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">تحليل النشاط القضائي</h3>
               <p className="text-sm text-slate-400 font-medium">مقارنة شهرية لعدد القضايا المسجلة</p>
             </div>
             <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">إحصائيات 2024</span>
             </div>
          </div>
          <div className="h-80 w-full" style={{ minHeight: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  cursor={{ fill: '#f8fafc', radius: 12 }}
                />
                <Bar dataKey="cases" fill="#d4af37" radius={[12, 12, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-[#d4af37]">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">جلسات اليوم</h3>
          </div>
          
          <div className="space-y-5">
            {[
              { time: '09:00 ص', court: "محكمة العين الابتدائية", title: 'نزاع تجاري - عقود' },
              { time: '11:30 ص', court: "دائرة القضاء أبوظبي", title: 'دعوى تعويض عمالي' },
              { time: '01:00 م', court: "محاكم العين الابتدائية", title: 'استئناف حكم مدني' },
            ].map((hearing, idx) => (
              <div key={idx} className="group flex items-center gap-5 p-5 rounded-[1.5rem] border border-slate-50 bg-slate-50 hover:bg-white hover:border-[#d4af37]/30 hover:shadow-xl hover:shadow-amber-900/5 transition-all cursor-pointer">
                <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 group-hover:bg-[#1a1a2e] group-hover:border-[#1a1a2e] transition-colors">
                  <span className="text-[11px] font-black text-[#1a1a2e] group-hover:text-[#d4af37]">{hearing.time}</span>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 leading-tight group-hover:text-[#1a1a2e] transition-colors">{hearing.title}</p>
                  <p className="text-[10px] text-[#d4af37] font-black uppercase tracking-wider mt-1.5">{hearing.court}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-[#1a1a2e] text-white font-black text-xs rounded-2xl hover:bg-[#16213e] transition-all shadow-xl shadow-blue-900/20 active:scale-95">
            عرض الأجندة القضائية الكاملة
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
