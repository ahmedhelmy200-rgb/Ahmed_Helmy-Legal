
import React from 'react';
import { ICONS } from '../constants';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, isOpen, onClose, onLogout }) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: ICONS.Dashboard, roles: ['admin'] },
    { id: 'cases', label: userRole === 'admin' ? 'إدارة القضايا' : 'قضاياي', icon: ICONS.Cases, roles: ['admin', 'client'] },
    { id: 'clients', label: 'الموكلين', icon: ICONS.Clients, roles: ['admin'] },
    { id: 'accounting', label: userRole === 'admin' ? 'الحسابات والفواتير' : 'حساباتي', icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2-2v14a2 2 0 002 2z" />
      </svg>
    ), roles: ['admin', 'client'] },
    { id: 'ai-consultant', label: 'المستشار الذكي', icon: ICONS.AI, roles: ['admin', 'visitor', 'client'] },
    { id: 'laws', label: 'القوانين واللوائح', icon: ICONS.Law, roles: ['admin', 'visitor', 'client'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" onClick={onClose}></div>
      )}

      <div className={`h-screen w-72 bg-[#0f172a] text-white flex flex-col fixed right-0 top-0 shadow-2xl z-40 border-l border-white/5 overflow-hidden transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex flex-col items-center gap-4 border-b border-white/5 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-3xl flex items-center justify-center shadow-2xl border border-white/5 p-4">
             <ICONS.Logo />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black text-[#d4af37] leading-tight">أحمد حلمي</h1>
            <p className="text-[8px] text-slate-400 uppercase tracking-[0.3em] font-bold">Legal Portal</p>
            <div className="mt-2 inline-block px-3 py-1 rounded-full bg-white/5 text-[9px] text-slate-400 font-bold">
              {userRole === 'admin' ? 'مدير النظام' : userRole === 'client' ? 'بوابة الموكل' : 'وضع الزائر'}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scroll relative z-10">
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => { setActiveTab(item.id); if (window.innerWidth < 1024) onClose(); }}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-[#d4af37] text-[#0f172a] font-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <span className={`${activeTab === item.id ? 'text-[#0f172a]' : 'text-[#d4af37]'}`}><item.icon /></span>
                  <span className="text-xs tracking-wide">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/5 bg-[#0b1120] relative z-10">
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-red-900/40 text-slate-300 hover:text-white p-3 rounded-xl transition-all text-[10px] font-bold"
            >
                تسجيل الخروج
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
