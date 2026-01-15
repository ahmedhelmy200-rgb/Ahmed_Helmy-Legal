
import React, { useState, useRef, useEffect } from 'react';
import { getLegalAdvice, generateLegalImage, editLegalImage, analyzeLegalDocument } from '../services/geminiService';

interface AIConsultantProps {
  onBack: () => void;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'image' | 'analysis'>('chat');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, image?: string }[]>([
    { role: 'ai', text: 'مرحباً بك في مركز "حُلم" للذكاء القانوني المطور. أنا مستشارك الرقمي المعتمد لمكتب أحمد حلمي.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [thinkingMode, setThinkingMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    if (activeMode === 'chat') {
      const response = await getLegalAdvice(userMsg, thinkingMode);
      setMessages(prev => [...prev, { role: 'ai', text: response || 'عذراً، لم أتمكن من الحصول على إجابة.' }]);
    } else if (activeMode === 'image') {
      const imageUrl = await generateLegalImage(userMsg, aspectRatio);
      if (imageUrl) {
        setMessages(prev => [...prev, { role: 'ai', text: 'تم توليد الصورة القانونية المطلوبة:', image: imageUrl }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'فشل توليد الصورة.' }]);
      }
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'user', text: 'تم رفع مستند/صورة للتحليل', image: base64 }]);
      
      const analysis = await analyzeLegalDocument(base64);
      setMessages(prev => [...prev, { role: 'ai', text: analysis || 'فشل التحليل.' }]);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] font-sans">
      {/* Header */}
      <div className="bg-[#020617] p-8 lg:p-10 text-white rounded-b-[4rem] shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[#d4af37] opacity-5 animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
             <button onClick={onBack} className="bg-white/10 p-4 rounded-2xl hover:bg-[#d4af37] hover:text-[#020617] transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
             <div>
                <h2 className="text-3xl font-black text-[#d4af37] tracking-tighter">مركز حُلم الذكي (HELM)</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">أحمد حلمي للاستشارات القانونية - الإصدار الفائق</p>
             </div>
          </div>
          
          <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10">
             {(['chat', 'image', 'analysis'] as const).map(mode => (
               <button 
                key={mode} 
                onClick={() => setActiveMode(mode)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${activeMode === mode ? 'bg-[#d4af37] text-[#020617]' : 'text-slate-400 hover:text-white'}`}
               >
                 {mode === 'chat' ? 'مستشار قانوني' : mode === 'image' ? 'مصمم جرافيك' : 'محلل مستندات'}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 lg:p-12 gap-6">
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scroll space-y-8 px-4">
           {messages.map((m, idx) => (
             <div key={idx} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4`}>
                <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-sm relative border ${
                  m.role === 'user' 
                  ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white rounded-tr-none border-white/10' 
                  : 'bg-white text-slate-800 rounded-tl-none border-slate-100'
                }`}>
                   {m.image && (
                     <img src={m.image} className="w-full max-w-sm rounded-2xl mb-4 border-2 border-[#d4af37]/20 shadow-lg" alt="Generated content" />
                   )}
                   <p className="text-sm lg:text-[15px] leading-[1.8] font-medium whitespace-pre-wrap">{m.text}</p>
                </div>
             </div>
           ))}
           {isLoading && (
             <div className="flex justify-end">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-3">
                   <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المعالج الذكي يعمل...</span>
                </div>
             </div>
           )}
        </div>

        {/* Input Controls */}
        <div className="bg-white p-6 lg:p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative">
           {activeMode === 'image' && (
             <div className="flex gap-4 mb-6 overflow-x-auto pb-2 no-print">
                {['1:1', '16:9', '9:16', '4:3', '3:2', '21:9'].map(ratio => (
                   <button 
                    key={ratio} 
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black border transition-all ${aspectRatio === ratio ? 'bg-[#d4af37] border-[#d4af37] text-[#020617]' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                   >الأبعاد {ratio}</button>
                ))}
             </div>
           )}

           <div className="flex gap-4 items-center">
              {activeMode === 'analysis' && (
                <button onClick={() => fileInputRef.current?.click()} className="bg-slate-100 p-4 rounded-2xl text-slate-600 hover:bg-[#d4af37] hover:text-[#020617] transition-all">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" />
              
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={activeMode === 'chat' ? 'اسأل المستشار القانوني...' : activeMode === 'image' ? 'صف الصورة التي تود توليدها...' : 'صف التعديل المطلوب على المستند المرفوع...'}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm outline-none focus:ring-2 focus:ring-[#d4af37] shadow-inner transition-all"
                />
              </div>

              {activeMode === 'chat' && (
                <button 
                  onClick={() => setThinkingMode(!thinkingMode)}
                  className={`p-4 rounded-2xl transition-all ${thinkingMode ? 'bg-[#d4af37] text-[#020617] shadow-lg' : 'bg-slate-100 text-slate-400'}`}
                  title="وضع التفكير العميق للقضايا المعقدة"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </button>
              )}

              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#d4af37] to-[#b8960c] text-[#020617] px-10 py-5 rounded-2xl font-black text-xs shadow-2xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
              >
                إرسال الطلب
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
