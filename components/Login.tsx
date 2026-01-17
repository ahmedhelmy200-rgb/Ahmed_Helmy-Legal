
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, clientId?: string) => void;
  clients: any[];
}

const Login: React.FC<LoginProps> = ({ onLogin, clients }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'visitor') {
      window.location.href = 'https://ahmed-helmy-legal.vercel.app/';
      return;
    } 
    
    if (activeTab === 'admin') {
      if (password === 'admin123') {
        onLogin('admin');
      } else if (email === 'samarelabed90@gmail.com' && password === '123456') {
        onLogin('staff');
      } else {
        setError('خطأ في بيانات الدخول');
      }
    } else if (activeTab === 'client') {
      const client = clients.find(c => (c.email === email || c.phone === email) && c.emiratesId === password);
      if (client) {
        onLogin('client', client.id);
      } else {
        setError('البيانات غير متطابقة مع سجلات الموكلين');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-200/50 rounded-full -ml-32 -mb-32 blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-lg bg-white border border-slate-200 p-10 rounded-[3rem] shadow-xl relative z-10 animate-fade-in">
        <div className="flex justify-center mb-8">
            <div className="w-24 h-24 transform hover:scale-105 transition-transform duration-500">
                <ICONS.Logo />
            </div>
        </div>
        
        <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">نظام حُلم الذكي <span className="text-[#d4af37]">3.5</span></h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">أحمد حلمي للمحاماة والاستشارات</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200">
            {(['admin', 'client', 'visitor'] as const).map((role) => (
               <button 
                  key={role}
                  onClick={() => { setActiveTab(role); setError(''); }}
                  className={`flex-1 py-3.5 rounded-xl text-[11px] font-black transition-all duration-300 ${
                    activeTab === role 
                    ? 'bg-white text-slate-800 shadow-md scale-[1.02]' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                  }`}
               >
                  {role === 'admin' ? 'الإدارة' : role === 'client' ? 'الموكلين' : 'زائر'}
               </button>
            ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            {activeTab !== 'visitor' && (
                <>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">البريد الإلكتروني / الهاتف</label>
                        <input 
                            type="text" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@legal.ae"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 text-sm outline-none focus:bg-white focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/5 transition-all text-center dir-ltr font-bold placeholder:text-slate-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">كلمة المرور / الهوية</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 text-sm outline-none focus:bg-white focus:border-[#d4af37] focus:ring-4 focus:ring-[#d4af37]/5 transition-all text-center dir-ltr font-bold placeholder:text-slate-300"
                        />
                    </div>
                </>
            )}

            {activeTab === 'visitor' && (
                <div className="text-center py-6 bg-slate-50 rounded-3xl border border-slate-200 mb-4">
                    <p className="text-slate-500 font-bold text-sm leading-relaxed">أهلاً بك في نظام حُلم.<br/>سيتم تحويلك الآن لاستعراض خدماتنا في الموقع الرسمي.</p>
                </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-[10px] font-black p-4 rounded-xl text-center flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-4.5 rounded-2xl font-black text-xs shadow-lg hover:bg-[#d4af37] hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
                {activeTab === 'visitor' ? 'زيارة الموقع الرسمي للمكتب' : 'دخول النظام الآمن'}
            </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 font-bold tracking-[0.3em] uppercase">AHMED HELMY ADVOCATES &copy; 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
