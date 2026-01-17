
import React from 'react';
import { CaseStatus } from './types';

export const COLORS = {
  primary: '#0f172a', 
  secondary: '#d4af37', 
  accent: '#f8fafc',
  background: '#f1f5f9',
  white: '#ffffff',
  success: '#10b981',
  error: '#ef4444',
  info: '#3b82f6',
  warning: '#f59e0b',
  goldGradient: 'linear-gradient(135deg, #d4af37 0%, #fcd34d 50%, #b45309 100%)',
};

export const STATUS_COLORS: Record<CaseStatus, string> = {
  [CaseStatus.WON]: 'bg-green-100 text-green-700 border-green-200',
  [CaseStatus.PREP]: 'bg-blue-100 text-blue-700 border-blue-200',
  [CaseStatus.ACTIVE]: 'bg-amber-100 text-amber-700 border-amber-200',
  [CaseStatus.LOST]: 'bg-red-100 text-red-700 border-red-200',
  [CaseStatus.ARCHIVED]: 'bg-slate-100 text-slate-700 border-slate-200',
  [CaseStatus.JUDGMENT]: 'bg-purple-100 text-purple-700 border-purple-200',
  [CaseStatus.APPEAL]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  [CaseStatus.CLOSED]: 'bg-slate-200 text-slate-800 border-slate-300',
  [CaseStatus.LITIGATION]: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  [CaseStatus.PENDING]: 'bg-orange-100 text-orange-700 border-orange-200',
};

export const ICONS = {
  Logo: ({ className = "w-full h-full" }: { className?: string }) => (
    <div className={`${className} flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Shield Shape */}
        <path d="M50 90C50 90 85 75 85 35V15L50 5L15 15V35C15 75 50 90 50 90Z" fill="#0f172a" />
        <path d="M50 90C50 90 85 75 85 35V15L50 5L15 15V35C15 75 50 90 50 90Z" stroke="#d4af37" strokeWidth="2"/>
        
        {/* Central Pillar of Law */}
        <rect x="47" y="25" width="6" height="45" rx="1" fill="#d4af37" />
        <rect x="35" y="68" width="30" height="4" rx="1" fill="#d4af37" />
        <rect x="40" y="22" width="20" height="4" rx="1" fill="#d4af37" />

        {/* Scales Beams */}
        <path d="M50 32L30 42" stroke="#d4af37" strokeWidth="2" strokeLinecap="round"/>
        <path d="M50 32L70 42" stroke="#d4af37" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Scale Pans */}
        <path d="M30 42V55C30 58 26 58 26 55V42" stroke="#d4af37" strokeWidth="1.5" />
        <path d="M30 42V55C34 58 34 58 34 55V42" stroke="#d4af37" strokeWidth="1.5" />
        
        <path d="M70 42V55C70 58 66 58 66 55V42" stroke="#d4af37" strokeWidth="1.5" />
        <path d="M70 42V55C74 58 74 58 74 55V42" stroke="#d4af37" strokeWidth="1.5" />
      </svg>
    </div>
  ),
  Dashboard: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
  Cases: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Clients: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  AI: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Law: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
};
