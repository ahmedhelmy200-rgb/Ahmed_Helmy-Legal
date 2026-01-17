
import React from 'react';
import { LegalCase, Client, Invoice, CaseStatus, UserRole } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  cases: LegalCase[];
  clients: Client[];
  invoices: Invoice[];
  userRole: UserRole;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
  logo?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ cases, clients, invoices, userRole, onNavigate, onLogout, logo }) => {
  const activeCases = cases.filter(c => c.status !== CaseStatus.WON && c.status !== CaseStatus.LOST).length;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Premium Hero Header */}
      <div className="bg-slate-50 p-12 lg:p-16 rounded-b-[4rem] border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
           <div className="flex items-center gap-12">
              <div className="w-24 h-24 shrink-0 p-4 bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-50 overflow-hidden">
                 <img src={logo || "https://img.icons8.com/fluency/240/scales.png"} className="w-full h-full object-contain" />
              </div>
              <div>
                 <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">نظام حلم الذكي <span className="text-[#d4af37]">3.0</span></h1>
                 <p className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">مركز المستشار أحمد حلمي للاستشارات القانونية</p>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
             <a 
               href="https://ahmed-helmy-legal.vercel.app/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-[1.5rem] font-black text-[10px] transition-all hover:border-[#d4af37] hover:text-[#d4af37] shadow-sm flex items-center gap-3"
             >
               الموقع الرسمي للمكتب
             </a>
             <button onClick={() => onNavigate('settings')} className="bg-slate-800 text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] hover:bg-[#d4af37] transition-all shadow-xl shadow-slate-200">الإعدادات</button>
           </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 animate-slide-up">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">قضايا متداولة</p>
              <h3 className="text-3xl font-black text-slate-800">{activeCases}</h3>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">الموكلين</p>
              <h3 className="text-3xl font-black text-slate-800">{clients.length}</h3>
           </div>
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">إجمالي الإيرادات</p>
              <h3 className="text-3xl font-black text-[#d4af37]">{invoices.filter(i => i.status === 'Paid').reduce((s,i) => s + i.amount, 0).toLocaleString()} <span className="text-xs">د.إ</span></h3>
           </div>
           <div className="bg-[#d4af37] p-8 rounded-[2rem] text-white shadow-xl shadow-amber-500/20">
              <p className="text-[10px] font-black uppercase text-white/70 mb-2 tracking-widest">الحالة الرقمية</p>
              <h3 className="text-xl font-black">جاهز للعمل <span className="animate-pulse">●</span></h3>
           </div>
        </div>
      </div>

      <div className="flex-1 p-12 lg:p-16">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
           نظام الوصول السريع 
           <span className="h-px flex-1 bg-slate-100"></span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <button onClick={() => onNavigate('cases')} className="premium-card p-10 rounded-[3rem] flex flex-col items-center gap-8 group">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all"><ICONS.Cases className="w-10 h-10" /></div>
            <span className="font-black text-slate-800 group-hover:text-[#d4af37] transition-colors">إدارة القضايا</span>
          </button>
          <button onClick={() => onNavigate('clients')} className="premium-card p-10 rounded-[3rem] flex flex-col items-center gap-8 group">
            <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all"><ICONS.Clients className="w-10 h-10" /></div>
            <span className="font-black text-slate-800 group-hover:text-[#d4af37] transition-colors">الموكلين</span>
          </button>
          <button onClick={() => onNavigate('accounting')} className="premium-card p-10 rounded-[3rem] flex flex-col items-center gap-8 group">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="font-black text-slate-800 group-hover:text-[#d4af37] transition-colors">الشؤون المالية</span>
          </button>
          <button onClick={() => onNavigate('ai-consultant')} className="bg-[#fdfbf7] p-10 rounded-[3rem] border border-amber-100 shadow-xl shadow-amber-500/5 flex flex-col items-center gap-8 group hover:-translate-y-2 transition-all">
            <div className="w-20 h-20 bg-amber-50 text-[#d4af37] rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all"><ICONS.AI className="w-10 h-10" /></div>
            <span className="font-black text-[#d4af37]">المستشار الذكي</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
