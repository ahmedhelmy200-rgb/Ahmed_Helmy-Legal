
import { GoogleGenAI } from "@google/genai";

/**
 * 1. استشارة قانونية ذكية (Gemini 3 Pro)
 * تستخدم وضع التفكير العميق للمسائل المعقدة.
 */
export const getLegalAdvice = async (prompt: string, isComplex: boolean = false) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const config: any = {};
    if (isComplex) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        ...config,
        systemInstruction: `أنت المستشار القانوني الذكي الفائق لنظام "حُلم" المخصص لمكتب "أحمد حلمي للاستشارات القانونية".
        أنت خبير في القانون الإماراتي لعام 2024-2025. 
        قدم إجابات رصينة، قانونية، واحترافية جداً.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Legal Advice Error:", error);
    return "حدث خطأ في استدعاء المستشار الذكي. يرجى المحاولة لاحقاً.";
  }
};

/**
 * 2. توليد صور قانونية احترافية (Gemini 3 Pro Image)
 */
export const generateLegalImage = async (prompt: string, aspectRatio: string = "1:1") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

/**
 * 3. تعديل الصور (Gemini 2.5 Flash Image)
 */
export const editLegalImage = async (base64Image: string, prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
};

/**
 * 4. تحليل المستندات المصورة (Gemini 3 Pro)
 */
export const analyzeLegalDocument = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: "قم بتحليل هذا المستند القانوني واستخرج المعلومات الأساسية (النوع، الأطراف، التاريخ، الملخص) بشكل نقاط منظمة." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Document Analysis Error:", error);
    return "فشل تحليل المستند.";
  }
};

/**
 * 5. استجابة سريعة جداً (Gemini 2.5 Flash Lite)
 */
export const getFastResponse = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite-latest",
    contents: prompt,
  });
  return response.text;
};

/**
 * 6. تحليل استراتيجية القضية (Gemini 3 Pro)
 */
export const analyzeCaseStrategy = async (title: string, court: string, status: string, opponent: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `قم بإجراء تحليل استراتيجي مفصل للقضية التالية لتقديم أفضل نصيحة قانونية:
      - العنوان: ${title}
      - المحكمة: ${court}
      - الحالة الحالية: ${status}
      - الخصم: ${opponent}`,
      config: {
        systemInstruction: "أنت مستشار قانوني خبير في القانون الإماراتي. قدم تحليلاً مهنياً للاستراتيجية القانونية والخطوات التالية الموصى بها.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Case Strategy Error:", error);
    return "فشل تحليل استراتيجية القضية.";
  }
};
