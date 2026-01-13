
import React from 'react';
import { ICONS, COLORS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: ICONS.Dashboard },
    { id: 'cases', label: 'إدارة القضايا', icon: ICONS.Cases },
    { id: 'clients', label: 'الموكلين', icon: ICONS.Clients },
    { id: 'accounting', label: 'الحسابات والفواتير', icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2-2v14a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'ai-consultant', label: 'المستشار الذكي', icon: ICONS.AI },
    { id: 'laws', label: 'القوانين واللوائح', icon: ICONS.Law },
  ];

  return (
    <div className="h-screen w-72 bg-[#0f172a] text-white flex flex-col fixed right-0 top-0 shadow-2xl z-20 border-l border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37] opacity-5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>

      <div className="p-10 flex flex-col items-center gap-6 border-b border-white/5 relative z-10">
        <div className="relative group cursor-pointer">
           <div className="w-24 h-24 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl flex items-center justify-center shadow-2xl border border-white/5 group-hover:border-[#d4af37]/30 transition-all duration-500 group-hover:rotate-3 group-hover:scale-105 p-5">
              <ICONS.Logo />
           </div>
           <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-tr from-[#d4af37] to-[#fcd34d] rounded-full flex items-center justify-center shadow-lg border-2 border-[#0f172a]">
              <svg className="w-4 h-4 text-[#0f172a]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
           </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fcd34d] leading-tight tracking-tight mb-1">أحمد حلمي</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold">Legal Consultations</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-[9px] text-slate-500 font-semibold bg-white/5 py-1 px-3 rounded-full">
            <span>Al Ain</span>
            <span className="w-1 h-1 rounded-full bg-[#d4af37]"></span>
            <span>Abu Dhabi</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 overflow-y-auto custom-scroll relative z-10">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  activeTab === item.id
                    ? 'text-[#0f172a] font-black shadow-xl shadow-[#d4af37]/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#fcd34d] opacity-100"></div>
                )}
                <span className={`relative z-10 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110 text-[#d4af37]'}`}>
                  <item.icon />
                </span>
                <span className="relative z-10 text-sm tracking-wide">{item.label}</span>
                {activeTab === item.id && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-white/5 bg-[#0b1120] relative z-10">
        <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl p-4 border border-white/5 hover:border-[#d4af37]/20 transition-colors cursor-pointer group">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#b45309] flex items-center justify-center text-[#0f172a] font-black text-sm shadow-lg group-hover:scale-105 transition-transform">
                أ ح
             </div>
             <div>
               <p className="text-[11px] font-bold text-white group-hover:text-[#d4af37] transition-colors">المستشار أحمد حلمي</p>
               <p className="text-[9px] text-slate-500 font-mono mt-0.5">0544144149</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
