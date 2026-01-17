
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
  logo?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, isOpen, onClose, onLogout, logo }) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: ICONS.Dashboard, roles: ['admin', 'staff'] },
    { id: 'cases', label: (userRole === 'admin' || userRole === 'staff') ? 'إدارة القضايا' : 'قضاياي', icon: ICONS.Cases, roles: ['admin', 'staff', 'client'] },
    { id: 'clients', label: 'الموكلين', icon: ICONS.Clients, roles: ['admin', 'staff'] },
    { id: 'accounting', label: (userRole === 'admin' || userRole === 'staff') ? 'القسم المالي' : 'حساباتي', icon: ICONS.Law, roles: ['admin', 'staff', 'client'] },
    { id: 'ai-consultant', label: 'المستشار الذكي', icon: ICONS.AI, roles: ['admin', 'staff', 'visitor', 'client'] },
    { id: 'laws', label: 'المكتبة القانونية', icon: ICONS.Law, roles: ['admin', 'staff', 'visitor', 'client'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden" onClick={onClose}></div>
      )}

      <div className={`h-screen w-72 bg-white flex flex-col fixed right-0 top-0 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)] z-50 border-l border-slate-50 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-12 flex flex-col items-center gap-6 border-b border-slate-50 bg-slate-50/20">
          <div className="w-24 h-24 relative flex items-center justify-center rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200 overflow-hidden group border border-white p-3">
             <img 
               src={logo || "https://img.icons8.com/fluency/240/scales.png"} 
               alt="Logo" 
               className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
             />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-tight">
              {userRole === 'staff' ? 'مساعد المستشار' : 'أحمد حلمي'}
            </h1>
            <p className="text-[10px] text-[#d4af37] uppercase tracking-[0.2em] font-black mt-1">المركز القانوني الذكي</p>
          </div>
        </div>

        <nav className="flex-1 px-6 py-10 overflow-y-auto custom-scroll">
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => { setActiveTab(item.id); onClose(); }}
                  className={`w-full flex items-center gap-5 px-6 py-4 rounded-[1.8rem] transition-all duration-300 group ${activeTab === item.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className={`w-5 h-5 ${activeTab === item.id ? 'text-[#d4af37]' : 'text-slate-300 group-hover:text-slate-400'}`}><item.icon /></span>
                  <span className="text-xs font-black">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-10 border-t border-slate-50 bg-slate-50/30">
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-red-100 hover:bg-red-50 text-slate-400 hover:text-red-500 px-6 py-4 rounded-2xl transition-all duration-500 text-[10px] font-black shadow-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                خروج آمن
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
