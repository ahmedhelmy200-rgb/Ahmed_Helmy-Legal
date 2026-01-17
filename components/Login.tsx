
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
      onLogin('visitor');
    } else if (activeTab === 'admin') {
      if (password === 'admin123') {
        onLogin('admin');
      } else if (email === 'samarelabed90@gmail.com' && password === '123456') {
        onLogin('staff');
      } else {
        setError('بيانات الدخول غير صحيحة');
      }
    } else if (activeTab === 'client') {
      const client = clients.find(c => c.email === email && c.emiratesId === password);
      if (client) {
        onLogin('client', client.id);
      } else {
        setError('البريد الإلكتروني أو رقم الهوية غير مطابق');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full -mr-40 -mt-40 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-lg bg-white/60 backdrop-blur-3xl border border-slate-100 p-12 rounded-[4rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] relative z-10 animate-fade-in">
        <div className="flex justify-center mb-12">
            <div className="w-24 h-24">
                <ICONS.Logo />
            </div>
        </div>
        
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-800 mb-3 tracking-tighter">نظام حلم الذكي <span className="text-[#d4af37]">3.5</span></h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">أحمد حلمي للاستشارات القانونية</p>
        </div>

        <div className="flex bg-slate-50 p-1.5 rounded-[2rem] mb-10 border border-slate-100 shadow-inner">
            {(['admin', 'client', 'visitor'] as const).map((role) => (
               <button 
                  key={role}
                  onClick={() => { setActiveTab(role); setError(''); }}
                  className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black transition-all duration-500 ${activeTab === role ? 'bg-white text-slate-900 shadow-xl shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  {role === 'admin' ? 'الإدارة' : role === 'client' ? 'الموكلين' : 'زائر'}
               </button>
            ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
            {(activeTab === 'client' || activeTab === 'admin') && (
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 mr-4 uppercase tracking-widest">البريد الإلكتروني</label>
                    <input 
                        type="text" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@legal.ae"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl px-8 py-5 text-slate-700 text-sm outline-none focus:bg-white focus:border-[#d4af37] focus:ring-4 focus:ring-amber-500/5 transition-all text-center dir-ltr"
                    />
                </div>
            )}

            {(activeTab === 'admin' || activeTab === 'client') && (
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 mr-4 uppercase tracking-widest">
                        {activeTab === 'admin' ? 'كلمة المرور' : 'رقم الهوية الإماراتية'}
                    </label>
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-3xl px-8 py-5 text-slate-700 text-sm outline-none focus:bg-white focus:border-[#d4af37] focus:ring-4 focus:ring-amber-500/5 transition-all text-center dir-ltr"
                    />
                </div>
            )}

            {error && <div className="bg-red-50 border border-red-100 text-red-500 text-[10px] font-black p-4 rounded-2xl text-center animate-shake">{error}</div>}

            <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xs shadow-2xl shadow-slate-200 hover:bg-[#d4af37] hover:scale-[1.02] active:scale-95 transition-all duration-500"
            >
                دخول النظام الآمن
            </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-[9px] text-slate-300 font-bold tracking-[0.5em] uppercase">HELM &copy; PREMIUM LEGAL SYSTEM 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
