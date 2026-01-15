
import React from 'react';
import { CaseCategory } from './types';

export const COLORS = {
  primary: '#020617', 
  secondary: '#d4af37', 
  accent: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  success: '#10b981',
  error: '#ef4444',
  goldGradient: 'linear-gradient(135deg, #d4af37 0%, #fcd34d 50%, #b45309 100%)',
};

export const ICONS = {
  Logo: ({ className = "w-full h-full" }: { className?: string }) => (
    <div className={`${className} relative flex items-center justify-center group overflow-hidden rounded-[2.5rem] border-[4px] border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.3)] bg-[#020617] transition-all duration-700 hover:shadow-[0_0_70px_rgba(212,175,55,0.5)] hover:scale-[1.02]`}>
      {/* Advanced Royal Glassmorphism Effect */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[12px] z-10 border border-white/20"></div>
      
      {/* Animated Gold Aura Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/30 via-transparent to-[#b45309]/20 z-10 animate-pulse"></div>
      
      {/* Decorative Gold Inner Ring */}
      <div className="absolute inset-2 border border-[#d4af37]/30 rounded-[2rem] z-15 pointer-events-none"></div>

      {/* Main 3D Royal Scales Icon */}
      <img 
        src="https://img.icons8.com/3d-fluency/240/scales.png" 
        alt="أحمد حلمي للاستشارات القانونية" 
        className="relative z-20 w-[72%] h-[72%] object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-1000 ease-out"
      />
      
      {/* Branding Stripe with Glass Effect */}
      <div className="absolute bottom-3 z-30 w-[85%] py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-center">
         <span className="text-[8px] font-black text-[#d4af37] uppercase tracking-[0.4em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">HELM SMART SYSTEM</span>
      </div>
      
      {/* Reflection Shine Effect */}
      <div className="absolute top-[-100%] left-[-100%] w-[300%] h-[300%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 pointer-events-none transition-all duration-1000 group-hover:top-[-50%] group-hover:left-[-50%]"></div>
    </div>
  ),
  Dashboard: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Cases: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  Clients: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  AI: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Law: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
};

export const CASE_CATEGORIES_TREE: Record<CaseCategory, string[]> = {
  [CaseCategory.CIVIL]: ['مطالبة مالية', 'فسخ عقد ومطالبة بالتعويض', 'إلزام بتنفيذ التزام تعاقدي', 'مسؤولية تقصيرية', 'صحة توقيع', 'بطلان عقد'],
  [CaseCategory.CRIMINAL]: ['شيك بدون رصيد', 'خيانة أمانة', 'سرقة', 'سب وقذف', 'اعتداء بالضرب', 'جرائم إلكترونية'],
  [CaseCategory.FAMILY]: ['طلاق للضرر', 'خلع', 'نفقات', 'حضانة ورؤية', 'إثبات زواج/نسب', 'تركات ومواريث'],
  [CaseCategory.LABOR]: ['فصل تعسفي', 'مطالبة برواتب متأخرة', 'مكافأة نهاية الخدمة', 'إصابة عمل', 'بدل إجازات'],
  [CaseCategory.COMMERCIAL]: ['إفلاس وتصفية شركات', 'منازعات الشركاء', 'علامات تجارية', 'عقود توريد ومقاولات'],
  [CaseCategory.RENTAL]: ['إخلاء لعدم سداد الأجرة', 'تجديد عقد إيجار', 'إنقاص/زيادة القيمة الإيجارية', 'استرداد تأمين'],
  [CaseCategory.ADMINISTRATIVE]: ['إلغاء قرار إداري', 'تعويض عن قرار إداري', 'تسوية وضع وظيفي'],
  [CaseCategory.EXECUTION]: ['فتح ملف تنفيذ', 'إشكال في التنفيذ', 'منع من السفر', 'حجز ممتلكات'],
  [CaseCategory.ARCHIVED]: ['أرشيف مغلق']
};
