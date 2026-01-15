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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d4af37] opacity-5 rounded-full -mr-32 -mt-32 blur-[120px] pointer-events-none"></div>
      
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 w-full max-w-md p-10 rounded-[3.5rem] shadow-2xl relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex justify-center mb-10">
            <div className="w-28 h-28">
                <ICONS.Logo />
            </div>
        </div>
        
        <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">نظام حلم الذكي</h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.4em]">أحمد حلمي للاستشارات القانونية</p>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 border border-white/5 shadow-inner">
            <button 
                onClick={() => { setActiveTab('admin'); setError(''); }}
                className={`flex-1 py-3.5 rounded-xl text-[10px] font-black transition-all duration-300 ${activeTab === 'admin' ? 'bg-[#d4af37] text-[#020617] shadow-lg shadow-[#d4af37]/40' : 'text-slate-400 hover:text-white'}`}
            >
                الإدارة
            </button>
            <button 
                onClick={() => { setActiveTab('client'); setError(''); }}
                className={`flex-1 py-3.5 rounded-xl text-[10px] font-black transition-all duration-300 ${activeTab === 'client' ? 'bg-[#d4af37] text-[#020617] shadow-lg shadow-[#d4af37]/40' : 'text-slate-400 hover:text-white'}`}
            >
                الموكلين
            </button>
            <button 
                onClick={() => { setActiveTab('visitor'); setError(''); }}
                className={`flex-1 py-3.5 rounded-xl text-[10px] font-black transition-all duration-300 ${activeTab === 'visitor' ? 'bg-[#d4af37] text-[#020617] shadow-lg shadow-[#d4af37]/40' : 'text-slate-400 hover:text-white'}`}
            >
                زائر
            </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            {(activeTab === 'client' || activeTab === 'admin') && (
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest text-right">البريد الإلكتروني</label>
                    <input 
                        type="text" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@legal.ae"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-center dir-ltr shadow-inner"
                    />
                </div>
            )}

            {(activeTab === 'admin' || activeTab === 'client') && (
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest text-right">
                        {activeTab === 'admin' ? 'كلمة المرور' : 'رقم الهوية الإماراتية'}
                    </label>
                    <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 transition-all text-center dir-ltr shadow-inner"
                    />
                </div>
            )}

            {error && <p className="text-red-400 text-[10px] font-black text-center mt-2 bg-red-400/10 py-3 rounded-2xl border border-red-400/20">{error}</p>}

            <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8960c] text-[#020617] py-5 rounded-2xl font-black text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-500"
            >
                دخول النظام
            </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-[9px] text-slate-600 font-bold tracking-[0.5em] uppercase">نظام حلم الذكي - HELM &copy; 2024</p>
        </div>
      </div>
    </div>
  );
};

export default Login;