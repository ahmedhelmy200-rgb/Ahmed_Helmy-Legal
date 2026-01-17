
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
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: ICONS.Dashboard, roles: ['admin', 'staff'] },
    { id: 'cases', label: 'إدارة القضايا', icon: ICONS.Cases, roles: ['admin', 'staff', 'client'] },
    { id: 'clients', label: 'الموكلين', icon: ICONS.Clients, roles: ['admin', 'staff'] },
    { id: 'accounting', label: 'الحسابات والمالية', icon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, roles: ['admin', 'staff', 'client'] },
    { id: 'ai-consultant', label: 'المستشار الذكي', icon: ICONS.AI, roles: ['admin', 'staff', 'visitor', 'client'] },
    { id: 'laws', label: 'المكتبة القانونية', icon: ICONS.Law, roles: ['admin', 'staff', 'visitor', 'client'] },
  ].filter(item => item.roles.includes(userRole));

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose}></div>
      )}

      <div className={`h-screen w-72 bg-white text-slate-600 flex flex-col fixed right-0 top-0 shadow-2xl z-50 border-l border-slate-200 overflow-hidden transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-10 flex flex-col items-center gap-4 border-b border-slate-100 bg-slate-50/50">
          <div className="w-24 h-24 flex items-center justify-center p-2 relative group">
             {logo ? <img src={logo} className="w-full h-full object-contain" /> : <ICONS.Logo />}
          </div>
          <div className="text-center">
            <h1 className="text-lg font-black text-slate-800 leading-tight">
              {userRole === 'staff' ? 'سمر العبد' : 'أحمد حلمي'}
            </h1>
            <p className="text-[9px] text-[#d4af37] uppercase tracking-[0.2em] font-bold mt-1">Law & Consultation</p>
            <div className="mt-3 inline-block px-4 py-1 rounded-full bg-white text-[9px] text-slate-400 font-bold border border-slate-200 shadow-sm uppercase tracking-widest">
              {userRole === 'admin' ? 'Super Admin' : userRole === 'staff' ? 'Manager' : 'User Access'}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 overflow-y-auto custom-scroll">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => { setActiveTab(item.id); onClose(); }}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                    activeTab === item.id 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-[1.02]' 
                      : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className={`${activeTab === item.id ? 'text-[#d4af37]' : 'text-slate-300 group-hover:text-[#d4af37]'}`}>
                    <item.icon className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-black tracking-wide">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-slate-100">
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white p-4 rounded-2xl transition-all duration-300 text-[11px] font-black border border-red-100 hover:border-red-500 shadow-sm"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                تسجيل الخروج
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
