
import React from 'react';

export const COLORS = {
  primary: '#0f172a', // كحلي عميق جداً
  secondary: '#d4af37', // ذهبي ملكي
  accent: '#1e293b',
  background: '#f8fafc',
  white: '#ffffff',
  success: '#059669',
  error: '#dc2626',
  goldGradient: 'linear-gradient(135deg, #d4af37 0%, #fcd34d 50%, #b45309 100%)',
  glass: 'backdrop-blur-xl bg-white/70 border border-white/20 shadow-xl',
};

export const ICONS = {
  // الشعار المحدث: ميزان العدالة مع إكليل الغار (مطابق للهوية البصرية)
  Logo: () => (
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth="2">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="50%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      
      {/* العمود المركزي والقاعدة */}
      <path d="M50 25 V75" strokeLinecap="round" strokeWidth="3" />
      <path d="M40 75 H60" strokeLinecap="round" strokeWidth="3" />
      <path d="M45 72 H55" strokeLinecap="round" strokeWidth="1" />

      {/* العارضة الأفقية */}
      <path d="M25 35 H75" strokeLinecap="round" strokeWidth="2.5" />
      
      {/* السلاسل والكفات */}
      {/* اليسار */}
      <path d="M25 35 L18 55" strokeWidth="1" />
      <path d="M25 35 L32 55" strokeWidth="1" />
      <path d="M18 55 Q25 65 32 55 Z" fill="url(#goldGrad)" fillOpacity="0.2" />
      
      {/* اليمين */}
      <path d="M75 35 L68 55" strokeWidth="1" />
      <path d="M75 35 L82 55" strokeWidth="1" />
      <path d="M68 55 Q75 65 82 55 Z" fill="url(#goldGrad)" fillOpacity="0.2" />

      {/* الرأس */}
      <circle cx="50" cy="22" r="3" fill="currentColor" />

      {/* إكليل الغار (مبسط) */}
      <path d="M50 85 C 20 85, 10 60, 10 40" strokeLinecap="round" strokeDasharray="1 3" strokeWidth="3" opacity="0.6" />
      <path d="M50 85 C 80 85, 90 60, 90 40" strokeLinecap="round" strokeDasharray="1 3" strokeWidth="3" opacity="0.6" />
      
      {/* أوراق الغار (تمثيل تجريدي) */}
      <path d="M50 80 Q 30 80 20 50" strokeWidth="0.5" opacity="0.4" />
      <path d="M50 80 Q 70 80 80 50" strokeWidth="0.5" opacity="0.4" />
    </svg>
  ),
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Cases: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  Clients: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  AI: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  Law: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
};
