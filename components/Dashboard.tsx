
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LegalCase, Client, Invoice, CaseStatus, UserRole } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  cases: LegalCase[];
  clients: Client[];
  invoices: Invoice[];
  userRole: UserRole;
  webLeads: any[];
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}

const data = [
  { name: 'يناير', cases: 5 },
  { name: 'فبراير', cases: 8 },
  { name: 'مارس', cases: 12 },
  { name: 'أبريل', cases: 15 },
  { name: 'مايو', cases: 20 },
  { name: 'يونيو', cases: 25 },
];

const MenuCard = ({ title, icon: Icon, onClick, color }: { title: string, icon: any, onClick: () => void, color: string }) => (
  <button 
    onClick={onClick}
    className="bg-white p-8 rounded-[3rem] shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center gap-6 group w-full h-full min-h-[220px]"
  >
    <div className={`w-20 h-20 rounded-3xl ${color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
       <Icon className="w-10 h-10" />
    </div>
    <h3 className="text-xl font-black text-slate-800 group-hover:text-[#d4af37] transition-colors">{title}</h3>
  </button>
);

const StatCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => (
  <div className={`p-6 rounded-[2.5rem] border border-white/10 ${color} shadow-lg text-white`}>
    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">{title}</p>
    <h3 className="text-3xl font-black">{value}</h3>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ cases, clients, invoices, userRole, webLeads, onNavigate, onLogout }) => {
  const activeCases = cases.filter(c => c.status !== CaseStatus.CLOSED && !c.isArchived).length;
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);

  const menuItems = [
    { id: 'cases', label: (userRole === 'admin' || userRole === 'staff') ? 'إدارة القضايا' : 'ملفات القضايا', icon: ICONS.Cases, roles: ['admin', 'staff', 'client'], color: 'bg-blue-50 text-blue-600' },
    { id: 'clients', label: 'إدارة الموكلين', icon: ICONS.Clients, roles: ['admin', 'staff'], color: 'bg-purple-50 text-purple-600' },
    { id: 'accounting', label: (userRole === 'admin' || userRole === 'staff') ? 'الشؤون المالية' : 'المدفوعات', icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ), roles: ['admin', 'staff', 'client'], color: 'bg-green-50 text-green-600' },
    { id: 'ai-consultant', label: 'المستشار الذكي', icon: ICONS.AI, roles: ['admin', 'staff', 'visitor', 'client'], color: 'bg-amber-50 text-amber-600' },
    { id: 'laws', label: 'مكتبة القوانين', icon: ICONS.Law, roles: ['admin', 'staff', 'visitor', 'client'], color: 'bg-slate-50 text-slate-600' },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      {/* Header Section with HELM Smart Branding */}
      <div className="bg-[#020617] text-white p-10 lg:p-14 rounded-b-[5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#d4af37] opacity-10 rounded-full -mr-32 -mt-32 blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-10 text-right">
              <div className="w-28 h-28 shrink-0">
                 <ICONS.Logo />
              </div>
              <div>
                 <h1 className="text-4xl lg:text-5xl font-black text-[#d4af37] mb-3 tracking-tighter">
                    {userRole === 'staff' ? 'المستشارة سمر أسامة' : 'أحمد حلمي للاستشارات'}
                 </h1>
                 <p className="text-slate-400 text-sm font-black tracking-[0.2em] uppercase">
                    {userRole === 'staff' ? 'المدير العام لبرنامج حُلم الذكي' : 'نظام حلم الذكي لإدارة مكاتب المحاماة المعتمد'}
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-5">
             <a 
               href="https://ahmed-helmy-legal.vercel.app/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="bg-[#d4af37]/10 hover:bg-[#d4af37] hover:text-[#020617] text-[#d4af37] border border-[#d4af37]/40 px-8 py-4 rounded-2xl font-black text-xs transition-all duration-300 flex items-center gap-3 shadow-2xl backdrop-blur-md"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" /></svg>
               الموقع الرسمي للمكتب
             </a>

             <button 
               onClick={onLogout}
               className="bg-red-950/40 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs transition-all flex items-center gap-2 border border-red-500/30 shadow-md"
             >
               خروج من النظام
             </button>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
           <StatCard title="القضايا قيد المتابعة" value={activeCases} color="bg-blue-600 shadow-blue-500/30" />
           <StatCard title="إجمالي الموكلين" value={clients.length} color="bg-purple-600 shadow-purple-500/30" />
           <StatCard title="إجمالي الإيرادات" value={`${totalRevenue.toLocaleString()} د.إ`} color="bg-green-600 shadow-green-500/30" />
           <StatCard title="طلبات الموقع" value={webLeads.length} color="bg-amber-600 shadow-amber-500/30" />
        </div>
      </div>

      <div className="flex-1 p-8 lg:p-12 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16 animate-in slide-in-from-bottom-12 duration-700">
           {filteredItems.map(item => (
             <MenuCard key={item.id} title={item.label} icon={item.icon} onClick={() => onNavigate(item.id)} color={item.color} />
           ))}
        </div>

        {(userRole === 'admin' || userRole === 'staff') && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
               <h3 className="text-2xl font-black text-slate-800 mb-12 flex items-center gap-4">
                  <span className="w-2.5 h-10 bg-[#d4af37] rounded-full"></span>
                  إحصائيات العمل - نظام حُلم الذكي
               </h3>
               <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                     <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 30px -5px rgba(0,0,0,0.1)' }} cursor={{fill: '#f8fafc'}} />
                     <Bar dataKey="cases" fill="#020617" radius={[15, 15, 0, 0]} barSize={55} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>

             <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
                <h3 className="text-2xl font-black text-slate-800 mb-12 flex items-center gap-4 text-right">
                   <span className="w-2.5 h-10 bg-amber-500 rounded-full"></span>
                   تواصل الموكلين الجدد
                </h3>
                <div className="space-y-6">
                   {webLeads.map(lead => (
                     <div key={lead.id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex justify-between items-center group hover:bg-[#020617] hover:text-white transition-all duration-500 cursor-pointer shadow-sm text-right">
                        <div>
                           <p className="text-[15px] font-black group-hover:text-white transition-colors">{lead.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{lead.type}</p>
                        </div>
                        <span className="text-[10px] font-black bg-white group-hover:bg-[#d4af37] group-hover:text-[#020617] px-4 py-2 rounded-full shadow-md transition-all">{lead.status}</span>
                     </div>
                   ))}
                   <a href="https://ahmed-helmy-legal.vercel.app/contact" target="_blank" rel="noopener noreferrer" className="block w-full text-center mt-10 text-[#d4af37] font-black text-xs hover:underline uppercase tracking-[0.2em]">إدارة طلبات التواصل الرسمية</a>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
