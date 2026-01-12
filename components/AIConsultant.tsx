
import React, { useState, useRef, useEffect } from 'react';
import { getLegalAdvice } from '../services/geminiService';

const AIConsultant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'مرحباً بك في المستشار الذكي لمكتب المستشار أحمد حلمي. كيف يمكنني مساعدتك في القوانين الإماراتية اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const aiResponse = await getLegalAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || 'عذراً، لم أتمكن من الحصول على إجابة.' }]);
    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] p-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">المستشار القانوني الذكي</h2>
          <p className="text-slate-500 font-medium mt-1">مدعوم بالذكاء الاصطناعي ومحدث بتشريعات دولة الإمارات 2024</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة: متصل</span>
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col border border-slate-100 relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 custom-scroll">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-sm relative group ${
                m.role === 'user' 
                ? 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white rounded-tr-none' 
                : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <p className="text-[15px] whitespace-pre-wrap leading-[1.8] font-medium">{m.text}</p>
                <div className={`absolute top-0 ${m.role === 'user' ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                   </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-end">
              <div className="bg-slate-50 p-6 rounded-[2rem] shadow-sm border border-slate-100">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <div className="flex gap-4 max-w-5xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اسأل عن أي مادة قانونية أو استشر في قضية..."
                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#d4af37] outline-none shadow-sm transition-all pr-12"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#d4af37] to-[#b8960c] text-[#1a1a2e] px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 active:scale-95"
            >
              استشارة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
