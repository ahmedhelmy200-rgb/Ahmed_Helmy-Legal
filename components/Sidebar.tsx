
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
    <div className="h-screen w-72 bg-[#1a1a2e] text-white flex flex-col fixed right-0 top-0 shadow-2xl z-20 border-l border-slate-800">
      <div className="p-10 flex flex-col items-center gap-4 border-b border-slate-800/50">
        <div className="relative">
           <div className="w-20 h-20 bg-gradient-to-tr from-[#d4af37] to-[#b8960c] rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#1a1a2e]" fill="currentColor">
                <path d="M12 2L4 9h3v12h10V9h3L12 2zm0 5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zM9 19v-2h6v2H9z" />
              </svg>
           </div>
           <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-[#d4af37] rounded-full"></div>
           </div>
        </div>
        
        <div className="text-center mt-2">
          <h1 className="text-xl font-black text-[#d4af37] leading-tight tracking-tight">أحمد حلمي</h1>
          <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em] font-bold mt-1">Ahmed Helmy</p>
          <div className="h-[1px] w-12 bg-[#d4af37] mx-auto my-3 opacity-50"></div>
          <p className="text-[9px] text-slate-400 font-semibold">للاستشارات القانونية</p>
          <p className="text-[8px] text-amber-500/70 mt-1">Al Ain, Abu Dhabi</p>
        </div>
      </div>

      <nav className="flex-1 px-5 py-8 overflow-y-auto custom-scroll">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b8960c] text-[#1a1a2e] shadow-xl shadow-amber-600/10 font-black scale-[1.02]'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                }`}
              >
                <span className={`${activeTab === item.id ? 'text-[#1a1a2e]' : 'text-[#d4af37] group-hover:scale-110 transition-transform'}`}>
                  <item.icon />
                </span>
                <span className="text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-8 border-t border-slate-800/50 bg-[#16213e]/50">
        <div className="flex flex-col gap-4">
           <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center text-[#1a1a2e] font-black text-xs shadow-inner">أ ح</div>
                <div>
                  <p className="text-[10px] font-black text-white">المستشار أحمد حلمي</p>
                  <p className="text-[8px] text-slate-500">المدير العام</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#d4af37] font-bold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>0544144149</span>
              </div>
           </div>
           <p className="text-[8px] text-slate-600 text-center uppercase tracking-widest font-bold">LegalMaster UAE v2.5</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
