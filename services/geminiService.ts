
import { GoogleGenAI } from "@google/genai";

// Initialize with process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLegalAdvice = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `أنت المساعد القانوني الذكي المخصص لمكتب "أحمد حلمي للاستشارات القانونية" في مدينة العين، دولة الإمارات العربية المتحدة. 
        تقدم استشارات دقيقة بناءً على التشريعات الإماراتية الحديثة.
        تحدث دائماً برصانة ومهنية قانونية عالية. 
        عند صياغة المذكرات، التزم بالنماذج المعتمدة في دائرة القضاء - أبوظبي ومحاكم العين.
        اجب دائماً باللغة العربية.`,
      },
    });
    // Accessing .text property directly.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "عذراً، حدث خطأ أثناء معالجة طلبك القانوني. يرجى المحاولة مرة أخرى لاحقاً.";
  }
};
