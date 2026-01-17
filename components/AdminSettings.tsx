
import React, { useState } from 'react';
import { SystemSettings } from '../types';

interface AdminSettingsProps {
  settings: SystemSettings;
  onUpdateSettings: (s: SystemSettings) => void;
  onBack: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onUpdateSettings, onBack }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleFileUpload = (field: keyof SystemSettings, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-6">
           <button onClick={onBack} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:bg-[#d4af37] transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
           </button>
           <h2 className="text-4xl font-black text-slate-800">إعدادات الإدارة الفائقة</h2>
        </div>
        <button onClick={() => onUpdateSettings(localSettings)} className="bg-[#020617] text-[#d4af37] px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">حفظ الإعدادات بالكامل</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Visual Branding Section */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
           <h3 className="text-xl font-black mb-8 border-b pb-4">الهوية البصرية</h3>
           <div className="space-y-8">
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">شعار المكتب (Logo)</label>
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-slate-50 border-2 border-dashed rounded-2xl flex items-center justify-center overflow-hidden">
                       {localSettings.logo ? <img src={localSettings.logo} className="w-full h-full object-contain" /> : <span className="text-slate-300">No Image</span>}
                    </div>
                    <input type="file" onChange={(e) => handleFileUpload('logo', e)} className="text-xs font-bold text-blue-600 cursor-pointer" />
                 </div>
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">الختم الرسمي (Stamp)</label>
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-red-50 border-2 border-dashed border-red-200 rounded-full flex items-center justify-center overflow-hidden">
                       {localSettings.stamp ? <img src={localSettings.stamp} className="w-full h-full object-contain opacity-50" /> : <span className="text-red-200">No Stamp</span>}
                    </div>
                    <input type="file" onChange={(e) => handleFileUpload('stamp', e)} className="text-xs font-bold text-red-600 cursor-pointer" />
                 </div>
              </div>
           </div>
        </div>

        {/* System Controls Section */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
           <h3 className="text-xl font-black mb-8 border-b pb-4">التحكم في النظام</h3>
           <div className="space-y-8">
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">لغة النظام الافتراضية</label>
                 <div className="flex gap-4">
                    <button onClick={() => setLocalSettings(prev => ({...prev, language: 'ar'}))} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${localSettings.language === 'ar' ? 'bg-[#d4af37] text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>اللغة العربية</button>
                    <button onClick={() => setLocalSettings(prev => ({...prev, language: 'en'}))} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${localSettings.language === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>English Language</button>
                 </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">اللون الرئيسي للبرنامج</label>
                <div className="flex gap-4">
                   {['#020617', '#1e3a8a', '#14532d', '#7c2d12'].map(color => (
                     <button key={color} onClick={() => setLocalSettings(prev => ({...prev, primaryColor: color}))} className={`w-12 h-12 rounded-xl transition-all ${localSettings.primaryColor === color ? 'ring-4 ring-offset-4 ring-[#d4af37]' : ''}`} style={{ backgroundColor: color }} />
                   ))}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
