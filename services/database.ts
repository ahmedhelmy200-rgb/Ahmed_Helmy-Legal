
import { Client, LegalCase, CaseStatus, CaseCategory } from '../types';

/**
 * خدمة إدارة قاعدة البيانات السحابية - مكتب المستشار أحمد حلمي
 * تتضمن الآن نظام التغذية التلقائية (Seeding) لبيانات العرض
 */

const SEED_CLIENTS: Client[] = [
  { id: 'c1', name: 'محمد سعيد المنصوري', type: 'Individual', email: 'm.almansoori@email.com', phone: '0501234567', emiratesId: '784-1980-1234567-1', totalCases: 2, createdAt: '2024-01-15', documents: [] },
  { id: 'c2', name: 'شركة الاتحاد للمقاولات', type: 'Corporate', email: 'info@etihad-cont.ae', phone: '026789012', emiratesId: 'CN-123456', totalCases: 5, createdAt: '2024-02-01', documents: [] },
  { id: 'c3', name: 'فاطمة علي الظاهري', type: 'Individual', email: 'f.aldhaheri@email.com', phone: '0559876543', emiratesId: '784-1990-7654321-2', totalCases: 1, createdAt: '2024-03-10', documents: [] },
  { id: 'c4', name: 'سالم راشد الكتبي', type: 'Individual', email: 's.alketbi@email.com', phone: '0561122334', emiratesId: '784-1985-1122334-3', totalCases: 3, createdAt: '2024-01-20', documents: [] },
  { id: 'c5', name: 'مجموعة الأفق للاستثمار', type: 'Corporate', email: 'legal@horizon-inv.ae', phone: '043344556', emiratesId: 'CN-987654', totalCases: 4, createdAt: '2024-04-05', documents: [] },
  { id: 'c6', name: 'خالد عبدالله الشامسي', type: 'Individual', email: 'k.alshamsi@email.com', phone: '0505566778', emiratesId: '784-1988-5566778-4', totalCases: 1, createdAt: '2024-05-12', documents: [] },
  { id: 'c7', name: 'أمل يوسف الحمادي', type: 'Individual', email: 'amal.y@email.com', phone: '0529988776', emiratesId: '784-1992-9988776-5', totalCases: 1, createdAt: '2024-06-18', documents: [] },
  { id: 'c8', name: 'سلطان أحمد الجابري', type: 'Individual', email: 'sultan.j@email.com', phone: '0543322110', emiratesId: '784-1975-3322110-6', totalCases: 2, createdAt: '2024-02-25', documents: [] },
  { id: 'c9', name: 'شركة دبي للتقنية', type: 'Corporate', email: 'contact@dubai-tech.ae', phone: '048877665', emiratesId: 'CN-112233', totalCases: 3, createdAt: '2024-07-01', documents: [] },
  { id: 'c10', name: 'مريم حسن العلي', type: 'Individual', email: 'maryam.h@email.com', phone: '0504455669', emiratesId: '784-1995-4455669-7', totalCases: 1, createdAt: '2024-08-14', documents: [] },
  { id: 'c11', name: 'عمر فاروق (مستثمر أجنبي)', type: 'Individual', email: 'omar.f@email.com', phone: '0567788990', emiratesId: '784-1982-7788990-8', totalCases: 2, createdAt: '2024-03-30', documents: [] },
  { id: 'c12', name: 'مؤسسة النور التعليمية', type: 'Corporate', email: 'admin@alnoor-edu.ae', phone: '037665544', emiratesId: 'CN-445566', totalCases: 1, createdAt: '2024-09-05', documents: [] },
  { id: 'c13', name: 'جاسم محمد البلوشي', type: 'Individual', email: 'j.albaloushi@email.com', phone: '0552233445', emiratesId: '784-1987-2233445-9', totalCases: 1, createdAt: '2024-10-10', documents: [] },
  { id: 'c14', name: 'هدى إبراهيم السويدي', type: 'Individual', email: 'huda.s@email.com', phone: '0509988776', emiratesId: '784-1991-9988776-0', totalCases: 1, createdAt: '2024-11-20', documents: [] },
  { id: 'c15', name: 'سيف خليفة المزروعي', type: 'Individual', email: 'saif.m@email.com', phone: '0526655443', emiratesId: '784-1983-6655443-1', totalCases: 2, createdAt: '2024-05-05', documents: [] },
  { id: 'c16', name: 'شركة الفجر للعقارات', type: 'Corporate', email: 'sales@alfajr-re.ae', phone: '024455667', emiratesId: 'CN-778899', totalCases: 6, createdAt: '2024-01-10', documents: [] },
  { id: 'c17', name: 'علياء راشد المهيري', type: 'Individual', email: 'alya.m@email.com', phone: '0541122339', emiratesId: '784-1994-1122339-2', totalCases: 1, createdAt: '2024-12-01', documents: [] },
  { id: 'c18', name: 'ماجد سلطان العويس', type: 'Individual', email: 'majid.o@email.com', phone: '0569988771', emiratesId: '784-1979-9988771-3', totalCases: 1, createdAt: '2024-06-25', documents: [] },
  { id: 'c19', name: 'نورة محمد الكعبي', type: 'Individual', email: 'nora.k@email.com', phone: '0507766552', emiratesId: '784-1993-7766552-4', totalCases: 1, createdAt: '2024-04-15', documents: [] },
  { id: 'c20', name: 'حمدان زايد العامري', type: 'Individual', email: 'hamdan.z@email.com', phone: '0553344558', emiratesId: '784-1986-3344558-5', totalCases: 3, createdAt: '2024-02-12', documents: [] },
  { id: 'c21', name: 'مركز التميز الطبي', type: 'Corporate', email: 'info@excellence-med.ae', phone: '037667788', emiratesId: 'CN-001122', totalCases: 2, createdAt: '2024-08-20', documents: [] },
  { id: 'c22', name: 'لطيفة عبدالله القبيسي', type: 'Individual', email: 'latifa.q@email.com', phone: '0528877664', emiratesId: '784-1996-8877664-6', totalCases: 1, createdAt: '2024-09-15', documents: [] },
  { id: 'c23', name: 'راشد سعيد النيادي', type: 'Individual', email: 'rashed.n@email.com', phone: '0545566773', emiratesId: '784-1981-5566773-7', totalCases: 1, createdAt: '2024-10-30', documents: [] },
  { id: 'c24', name: 'شركة الواحة للخدمات', type: 'Corporate', email: 'services@oasis.ae', phone: '042233445', emiratesId: 'CN-334455', totalCases: 2, createdAt: '2024-11-10', documents: [] },
  { id: 'c25', name: 'عبدالرحمن صالح الهاشمي', type: 'Individual', email: 'a.alhashmi@email.com', phone: '0501122998', emiratesId: '784-1989-1122998-8', totalCases: 1, createdAt: '2024-12-20', documents: [] }
];

const SEED_CASES: LegalCase[] = [
  // 2024 Cases (Closed/Archived or Advanced)
  { id: 'case1', caseNumber: '2024/102', title: 'دعوى عمالية - مستحقات متأخرة', category: CaseCategory.LABOR, subCategory: 'مطالبة برواتب متأخرة', clientId: 'c1', clientName: 'محمد سعيد المنصوري', opponentName: 'شركة البناء الحديث', court: 'محكمة العين الابتدائية', status: CaseStatus.JUDGMENT, nextHearingDate: '2024-05-15', createdAt: '2024-01-15', documents: [], comments: [], activities: [], totalFee: 15000, paidAmount: 15000, isArchived: true, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case2', caseNumber: '2024/305', title: 'فسخ عقد مقاولة', category: CaseCategory.COMMERCIAL, subCategory: 'عقود توريد ومقاولات', clientId: 'c2', clientName: 'شركة الاتحاد للمقاولات', opponentName: 'المطور العقاري', court: 'محكمة أبوظبي التجارية', status: CaseStatus.APPEAL, nextHearingDate: '2025-02-10', createdAt: '2024-02-20', documents: [], comments: [], activities: [], totalFee: 50000, paidAmount: 25000, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case3', caseNumber: '2024/55', title: 'حضانة ونفقة', category: CaseCategory.FAMILY, subCategory: 'حضانة ورؤية', clientId: 'c3', clientName: 'فاطمة علي الظاهري', opponentName: 'الزوج السابق', court: 'محكمة العين للأحوال الشخصية', status: CaseStatus.CLOSED, nextHearingDate: '', createdAt: '2024-03-12', documents: [], comments: [], activities: [], totalFee: 20000, paidAmount: 20000, isArchived: true, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case4', caseNumber: '2024/889', title: 'شيك بدون رصيد', category: CaseCategory.CRIMINAL, subCategory: 'شيك بدون رصيد (سوء نية)', clientId: 'c4', clientName: 'سالم راشد الكتبي', opponentName: 'المشتكى عليه', court: 'نيابة العين', status: CaseStatus.CLOSED, nextHearingDate: '', createdAt: '2024-04-01', documents: [], comments: [], activities: [], totalFee: 10000, paidAmount: 10000, isArchived: true, assignedLawyer: 'المستشار أحمد حلمي' },
  
  // 2025 Cases (Active)
  { id: 'case5', caseNumber: '2025/12', title: 'تأسيس شركة ذات مسؤولية محدودة', category: CaseCategory.COMMERCIAL, subCategory: 'تأسيس شركات', clientId: 'c5', clientName: 'مجموعة الأفق للاستثمار', opponentName: 'الدائرة الاقتصادية', court: 'خدمات قانونية', status: CaseStatus.ACTIVE, nextHearingDate: '2025-01-20', createdAt: '2025-01-05', documents: [], comments: [], activities: [], totalFee: 12000, paidAmount: 6000, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case6', caseNumber: '2025/45', title: 'منازعة إيجارية - إخلاء', category: CaseCategory.RENTAL, subCategory: 'إخلاء لعدم سداد الأجرة', clientId: 'c16', clientName: 'شركة الفجر للعقارات', opponentName: 'المستأجر', court: 'لجنة المنازعات الإيجارية', status: CaseStatus.LITIGATION, nextHearingDate: '2025-01-25', createdAt: '2025-01-10', documents: [], comments: [], activities: [], totalFee: 8000, paidAmount: 4000, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case7', caseNumber: '2025/78', title: 'تعويض عن حادث سير', category: CaseCategory.CIVIL, subCategory: 'مسؤولية تقصيرية (تعويض عن ضرر)', clientId: 'c6', clientName: 'خالد عبدالله الشامسي', opponentName: 'شركة التأمين', court: 'محكمة العين المدنية', status: CaseStatus.PENDING, nextHearingDate: '2025-02-01', createdAt: '2025-01-15', documents: [], comments: [], activities: [], totalFee: 15000, paidAmount: 0, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case8', caseNumber: '2025/90', title: 'طلب طلاق للضرر', category: CaseCategory.FAMILY, subCategory: 'طلاق للضرر', clientId: 'c7', clientName: 'أمل يوسف الحمادي', opponentName: 'الزوج', court: 'التوجيه الأسري', status: CaseStatus.ACTIVE, nextHearingDate: '2025-01-22', createdAt: '2025-01-18', documents: [], comments: [], activities: [], totalFee: 25000, paidAmount: 10000, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  
  // More 2024/2025 Mixed
  { id: 'case9', caseNumber: '2024/999', title: 'استئناف حكم عمالي', category: CaseCategory.LABOR, subCategory: 'فصل تعسفي', clientId: 'c8', clientName: 'سلطان أحمد الجابري', opponentName: 'الشركة السابقة', court: 'محكمة الاستئناف', status: CaseStatus.APPEAL, nextHearingDate: '2025-01-30', createdAt: '2024-11-15', documents: [], comments: [], activities: [], totalFee: 18000, paidAmount: 18000, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case10', caseNumber: '2025/05', title: 'تسجيل علامة تجارية', category: CaseCategory.COMMERCIAL, subCategory: 'علامات تجارية وملكية فكرية', clientId: 'c9', clientName: 'شركة دبي للتقنية', opponentName: 'وزارة الاقتصاد', court: 'إجراءات إدارية', status: CaseStatus.ACTIVE, nextHearingDate: '', createdAt: '2025-01-02', documents: [], comments: [], activities: [], totalFee: 7000, paidAmount: 7000, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case11', caseNumber: '2025/101', title: 'دعوى صحة توقيع', category: CaseCategory.CIVIL, subCategory: 'صحة توقيع', clientId: 'c15', clientName: 'سيف خليفة المزروعي', opponentName: 'البائع', court: 'محكمة العين', status: CaseStatus.LITIGATION, nextHearingDate: '2025-02-15', createdAt: '2025-01-12', documents: [], comments: [], activities: [], totalFee: 10000, paidAmount: 5000, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case12', caseNumber: '2024/112', title: 'تنفيذ حكم تجاري', category: CaseCategory.EXECUTION, subCategory: 'فتح ملف تنفيذ', clientId: 'c2', clientName: 'شركة الاتحاد للمقاولات', opponentName: 'المنفذ ضده', court: 'محكمة التنفيذ', status: CaseStatus.ACTIVE, nextHearingDate: '2025-01-28', createdAt: '2024-12-01', documents: [], comments: [], activities: [], totalFee: 5000, paidAmount: 5000, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case13', caseNumber: '2025/200', title: 'دفاع في جنحة مرورية', category: CaseCategory.CRIMINAL, subCategory: 'قيادة تحت تأثير الكحول', clientId: 'c11', clientName: 'عمر فاروق', opponentName: 'النيابة العامة', court: 'محكمة المرور', status: CaseStatus.LITIGATION, nextHearingDate: '2025-01-19', createdAt: '2025-01-14', documents: [], comments: [], activities: [], totalFee: 20000, paidAmount: 10000, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case14', caseNumber: '2025/22', title: 'مراجعة عقود موظفين', category: CaseCategory.LABOR, subCategory: 'عقود عمل', clientId: 'c21', clientName: 'مركز التميز الطبي', opponentName: '-', court: 'استشارة', status: CaseStatus.ACTIVE, nextHearingDate: '', createdAt: '2025-01-08', documents: [], comments: [], activities: [], totalFee: 3000, paidAmount: 0, isArchived: false, assignedLawyer: 'المستشار أحمد حلمي' },
  { id: 'case15', caseNumber: '2024/77', title: 'قسمة تركة رضائية', category: CaseCategory.FAMILY, subCategory: 'تركات ومواريث', clientId: 'c20', clientName: 'حمدان زايد العامري', opponentName: 'الورثة', court: 'خارج المحكمة', status: CaseStatus.CLOSED, nextHearingDate: '', createdAt: '2024-09-10', documents: [], comments: [], activities: [], totalFee: 30000, paidAmount: 30000, isArchived: true, assignedLawyer: 'المستشار أحمد حلمي' }
];

export const db = {
  // جلب كافة البيانات من السحابة (أو التخزين المحلي كنسخة احتياطية)
  async fetchAll(table: string) {
    // محاكاة تأخير الشبكة لإضفاء الطابع السحابي الاحترافي
    await new Promise(resolve => setTimeout(resolve, 300)); // تسريع المحاكاة قليلاً
    try {
      const saved = localStorage.getItem(`legal_master_${table}`);
      
      // نظام التغذية (Seeding)
      if (!saved) {
        if (table === 'clients') {
          localStorage.setItem(`legal_master_${table}`, JSON.stringify(SEED_CLIENTS));
          return SEED_CLIENTS;
        }
        if (table === 'cases') {
          localStorage.setItem(`legal_master_${table}`, JSON.stringify(SEED_CASES));
          return SEED_CASES;
        }
        return [];
      }
      
      return JSON.parse(saved);
    } catch (e) {
      console.error(`خطأ في جلب بيانات ${table}:`, e);
      return [];
    }
  },

  // حفظ سجل جديد ومزامنته فوراً
  async save(table: string, data: any) {
    const current = await this.fetchAll(table);
    const updated = [data, ...current];
    localStorage.setItem(`legal_master_${table}`, JSON.stringify(updated));
    return data;
  },

  // تحديث سجل موجود في السحابة
  async update(table: string, id: string, updatedData: any) {
    const current = await this.fetchAll(table);
    const updated = current.map((item: any) => item.id === id ? updatedData : item);
    localStorage.setItem(`legal_master_${table}`, JSON.stringify(updated));
    return updatedData;
  },

  // حذف سجل من النظام السحابي
  async delete(table: string, id: string) {
    const current = await this.fetchAll(table);
    const updated = current.filter((item: any) => item.id !== id);
    localStorage.setItem(`legal_master_${table}`, JSON.stringify(updated));
  }
};
