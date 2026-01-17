
import React, { useState, useRef, useEffect } from 'react';
import { getAdvancedLegalChat, editImageWithGemini, generateVeoVideo, generateProImage } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIConsultantProps {
  onBack: () => void;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'creative' | 'voice'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'مرحباً بك في مركز أحمد حلمي للذكاء القانوني. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Creative Mode Settings
  const [mediaTask, setMediaTask] = useState<'pro-image' | 'veo-video' | 'edit-image'>('pro-image');
  const [proSize, setProSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  
  // Chat Settings
  const [useSearch, setUseSearch] = useState(true);
  const [useMaps, setUseMaps] = useState(false);
  const [useThinking, setUseThinking] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProcessRequest = async () => {
    if (!input.trim() && !uploadedImage) return;
    const currentInput = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: currentInput, image: uploadedImage || undefined }]);
    setIsLoading(true);

    try {
      if (activeTab === 'chat') {
        const result = await getAdvancedLegalChat(currentInput, { useSearch, useMaps, useThinking, image: uploadedImage || undefined });
        setMessages(prev => [...prev, { role: 'ai', text: result.text, links: result.links }]);
      } 
      else if (activeTab === 'creative') {
        let resultMedia = null;
        if (mediaTask === 'pro-image') {
          resultMedia = await generateProImage(currentInput, proSize, aspectRatio);
          setMessages(prev => [...prev, { role: 'ai', text: 'تم توليد الصورة الاحترافية بنجاح:', image: resultMedia || undefined }]);
        } else if (mediaTask === 'veo-video') {
          resultMedia = await generateVeoVideo(currentInput, uploadedImage || undefined, aspectRatio as any);
          setMessages(prev => [...prev, { role: 'ai', text: 'تم توليد الفيديو باستخدام Veo:', video: resultMedia }]);
        } else if (mediaTask === 'edit-image' && uploadedImage) {
          resultMedia = await editImageWithGemini(uploadedImage, currentInput);
          setMessages(prev => [...prev, { role: 'ai', text: 'تم تعديل الصورة وفقاً لطلبك:', image: resultMedia || undefined }]);
        }
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'ai', text: `عذراً، حدث خطأ: ${error.message}` }]);
    }
    
    setIsLoading(false);
    setUploadedImage(null);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
      {/* Premium Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-[#d4af37]">المستشار الذكي (حُلم 3.0)</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Advanced Legal Intelligence</p>
          </div>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {['chat', 'creative', 'voice'].map((t: any) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${activeTab === t ? 'bg-[#d4af37] text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-600'}`}>
              {t === 'chat' ? 'المحادثة الذكية' : t === 'creative' ? 'الاستوديو الإبداعي' : 'المحادثة الصوتية'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scroll">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} animate-slide-up`}>
              <div className={`max-w-[85%] lg:max-w-[70%] p-8 rounded-[2.5rem] shadow-sm border ${m.role === 'user' ? 'bg-slate-50 border-slate-100 rounded-tr-none' : 'bg-white border-amber-100 text-slate-800 rounded-tl-none'}`}>
                {m.image && <img src={m.image} className="w-full rounded-3xl mb-4 border border-slate-200 shadow-xl" alt="Legal Data" />}
                {m.video && <video src={m.video} controls className="w-full rounded-3xl mb-4 shadow-xl border border-slate-200" />}
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{m.text}</p>
                {m.links && m.links.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                    {m.links.map((link, li) => (
                      <a key={li} href={link.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-amber-50 text-[#d4af37] px-4 py-1.5 rounded-full font-bold border border-amber-100 hover:bg-amber-100 transition-colors">
                        {link.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-end">
              <div className="bg-white p-8 rounded-[2.5rem] border border-amber-100 flex items-center gap-4 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-[#d4af37] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] font-black uppercase text-[#d4af37]">جاري التفكير بعمق...</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Control Panel */}
        <div className="p-8 bg-slate-50/80 backdrop-blur-2xl border-t border-slate-100">
          {activeTab === 'chat' && (
            <div className="flex gap-4 mb-6">
              <button onClick={() => setUseSearch(!useSearch)} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black border transition-all ${useSearch ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                جوجل سيرش
              </button>
              <button onClick={() => setUseMaps(!useMaps)} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black border transition-all ${useMaps ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                خرائط جوجل
              </button>
              <button onClick={() => setUseThinking(!useThinking)} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black border transition-all ${useThinking ? 'bg-amber-600 border-amber-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400'}`}>
                وضع التفكير (Pro Thinking)
              </button>
            </div>
          )}

          {activeTab === 'creative' && (
            <div className="flex flex-wrap gap-4 mb-6">
              <select value={mediaTask} onChange={(e: any) => setMediaTask(e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-2.5 text-[10px] font-black outline-none focus:ring-2 focus:ring-[#d4af37]">
                <option value="pro-image">توليد صورة (Gemini Pro)</option>
                <option value="veo-video">توليد فيديو (Veo 3)</option>
                <option value="edit-image">تعديل صورة (Flash Image)</option>
              </select>
              {mediaTask === 'pro-image' && (
                <select value={proSize} onChange={(e: any) => setProSize(e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-2.5 text-[10px] font-black outline-none">
                  <option value="1K">دقة 1K</option>
                  <option value="2K">دقة 2K</option>
                  <option value="4K">دقة 4K الفائقة</option>
                </select>
              )}
              <select value={aspectRatio} onChange={(e: any) => setAspectRatio(e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-5 py-2.5 text-[10px] font-black outline-none">
                <option value="16:9">أبعاد 16:9</option>
                <option value="9:16">أبعاد 9:16</option>
                <option value="1:1">أبعاد 1:1</option>
              </select>
            </div>
          )}

          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              {uploadedImage && (
                <div className="absolute -top-16 right-0 bg-white p-2 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-3">
                  <img src={uploadedImage} className="w-10 h-10 rounded-xl object-cover" />
                  <span className="text-[9px] font-bold text-slate-500">مستند مرفق</span>
                  <button onClick={() => setUploadedImage(null)} className="text-red-500 p-1 hover:bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              )}
              <div className="flex gap-3 bg-white border border-slate-200 rounded-[2rem] p-3 shadow-inner shadow-slate-50">
                <label className="p-4 bg-slate-50 text-slate-400 rounded-[1.5rem] hover:bg-[#d4af37] hover:text-white transition-all cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleProcessRequest()}
                  placeholder={activeTab === 'chat' ? 'اسأل المستشار عن موقف قانوني...' : 'صف المحتوى المرئي المطلوب...'}
                  className="flex-1 bg-transparent px-4 text-sm outline-none font-medium placeholder:text-slate-300"
                />
              </div>
            </div>
            <button 
              onClick={handleProcessRequest} 
              disabled={isLoading || (!input.trim() && !uploadedImage)} 
              className="bg-[#d4af37] text-white h-[68px] px-10 rounded-[2rem] font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/30 disabled:opacity-50 disabled:scale-100"
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
