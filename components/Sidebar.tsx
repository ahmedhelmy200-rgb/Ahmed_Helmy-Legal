
import React from 'react';
import { ICONS, COLORS } from '../constants';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> & { LogoIcon: React.FC } = ({ activeTab, setActiveTab, userRole, isOpen, onClose, onLogout }) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'لوحة التحكم المركزية', icon: ICONS.Dashboard, roles: ['admin', 'staff'] },
    { id: 'cases', label: (userRole === 'admin' || userRole === 'staff') ? 'إدارة القضايا والملفات' : 'ملفات قضاياي', icon: ICONS.Cases, roles: ['admin', 'staff', 'client'] },
    { id: 'clients', label: 'إدارة الموكلين والشركاء', icon: ICONS.Clients, roles: ['admin', 'staff'] },
    { id: 'accounting', label: (userRole === 'admin' || userRole === 'staff') ? 'الحسابات والفواتير' : 'كشف حسابي المالي', icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2-2v14a2 2 0 002 2z" />
      </svg>
    ), roles: ['admin', 'staff', 'client'] },
    { id: 'ai-consultant', label: 'المستشار الذكي الفائق', icon: ICONS.AI, roles: ['admin', 'staff', 'visitor', 'client'] },
    { id: 'laws', label: 'موسوعة القوانين واللوائح', icon: ICONS.Law, roles: ['admin', 'staff', 'visitor', 'client'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm z-40 lg:hidden" onClick={onClose}></div>
      )}

      {/* Sidebar Container */}
      <div className={`h-screen w-80 bg-[#020617] text-white flex flex-col fixed right-0 top-0 shadow-[25px_0_50px_rgba(0,0,0,0.5)] z-50 border-l border-white/5 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        
        {/* Animated Background Decoration */}
        <div className="absolute top-[-10%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-[#d4af37]/5 via-transparent to-transparent rotate-12 pointer-events-none"></div>

        {/* Sidebar Header / Branding */}
        <div className="p-10 flex flex-col items-center gap-6 border-b border-white/5 relative z-10 bg-black/20">
          <div className="w-28 h-28 transform hover:scale-110 transition-transform duration-700">
             <ICONS.Logo />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black text-[#d4af37] leading-tight tracking-tight drop-shadow-md">
              {userRole === 'staff' ? 'سمر أسامة العبد' : 'المستشار أحمد حلمي'}
            </h1>
            <p className="text-[7px] text-slate-500 uppercase tracking-[0.4em] font-black mt-1">THE ELITE LEGAL PORTAL</p>
            <div className="mt-4 inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] text-[#d4af37] font-black shadow-inner uppercase tracking-widest">
              {userRole === 'admin' ? 'صلاحية الإدارة العليا' : userRole === 'staff' ? 'مدير المكتب التنفيذي' : userRole === 'client' ? 'حساب الموكل الشخصي' : 'وضع المعاينة المحدود'}
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button onClick={onClose} className="lg:hidden absolute top-6 left-6 p-2 text-slate-500 hover:text-white transition-all bg-white/5 rounded-full">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-6 py-10 overflow-y-auto custom-scroll relative z-10">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => { setActiveTab(item.id); onClose(); }}
                    className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-[1.5rem] transition-all duration-500 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#d4af37] via-[#fcd34d] to-[#b45309] text-[#020617] font-black shadow-[0_10px_25px_rgba(212,175,55,0.3)] scale-[1.02]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-[-5px]'
                    }`}
                  >
                    {/* Active Indicator Glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    )}
                    
                    <span className={`shrink-0 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-[#020617] drop-shadow-sm' : 'text-[#d4af37]'}`}>
                      <item.icon className="w-5 h-5" />
                    </span>
                    
                    <span className={`text-[11px] uppercase tracking-wide transition-all ${isActive ? 'font-black scale-105' : 'font-bold'}`}>
                      {item.label}
                    </span>

                    {/* Left Active border bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-black/30 rounded-r-full"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          
          {/* Official Site Link */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <a 
              href="https://ahmed-helmy-legal.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-6 py-5 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/[0.02] text-[#d4af37] border border-white/5 font-black hover:border-[#d4af37]/40 hover:bg-white/10 transition-all text-[11px] group shadow-xl"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" /></svg>
                <span>الموقع الرسمي للمكتب</span>
              </div>
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-[-5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </a>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-10 border-t border-white/5 bg-black/40 relative z-10">
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 bg-red-950/20 hover:bg-red-600 hover:text-white text-red-500 py-5 rounded-[1.5rem] transition-all duration-500 text-[10px] font-black border border-red-500/20 shadow-lg group"
            >
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                خروج آمن من النظام
            </button>
            <div className="mt-6 text-center">
              <p className="text-[6px] text-slate-600 font-black uppercase tracking-[0.5em]">HELM v4.0.0 - PRO EDITION</p>
            </div>
        </div>

        <style>{`
          .animate-spin-slow {
            animation: spin 8s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
};

Sidebar.LogoIcon = ICONS.Logo;

export default Sidebar;
