
import { GoogleGenAI } from "@google/genai";

// Initialize with process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLegalAdvice = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `أنت المساعد القانوني الذكي المخصص لمكتب "أحمد حلمي للاستشارات القانونية". 
        مهمتك هي تقديم استشارات دقيقة بناءً على قوانين دولة الإمارات.
        تحدث بمهنية واختصار مفيد.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "عذراً، حدث خطأ في الاتصال بالمساعد الذكي.";
  }
};

export const analyzeCaseStrategy = async (caseTitle: string, court: string, status: string, opponent: string) => {
  try {
    const prompt = `بصفتك مستشاراً قانونياً خبيراً في الإمارات، قم بتحليل القضية التالية:
    - العنوان: ${caseTitle}
    - المحكمة: ${court}
    - الحالة الحالية: ${status}
    - الخصم: ${opponent}

    المطلوب تقديم تقرير استراتيجي موجز يحتوي على:
    1. تقييم مبدئي لموقف القضية (نقاط القوة).
    2. 3 خطوات قانونية استراتيجية يُنصح باتخاذها فوراً.
    3. قائمة بأهم 3 مستندات يجب التأكد من وجودها في الملف.
    
    نسق الإجابة بتنسيق HTML بسيط (استخدم <ul> و <li> و <strong>) ليكون قابلاً للعرض داخل التطبيق، دون كتابة مقدمات طويلة.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Analysis Error:", error);
    return "لا يمكن إجراء التحليل الاستراتيجي حالياً.";
  }
};
