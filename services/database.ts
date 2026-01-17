
import { Client, LegalCase, CaseStatus, CaseCategory, Invoice, Expense, ExpenseCategory, FutureDebt } from '../types';

/**
 * خدمة إدارة قاعدة البيانات السحابية - مكتب المستشار أحمد حلمي
 * الإصدار المطور 3.5 مع نظام مالي شامل
 */

const SEED_CLIENTS: Client[] = [
  { id: 'c1', name: 'محمد سعيد المنصوري', type: 'Individual', email: 'm.almansoori@email.com', phone: '0501234567', emiratesId: '784-1980-1234567-1', totalCases: 2, createdAt: '2024-01-15', address: 'العين، الإمارات', documents: [] },
  { id: 'c2', name: 'شركة الاتحاد للمقاولات', type: 'Corporate', email: 'info@etihad-cont.ae', phone: '026789012', emiratesId: 'CN-123456', totalCases: 5, createdAt: '2024-02-01', address: 'أبوظبي، الإمارات', documents: [] },
  { id: 'c3', name: 'فاطمة علي الظاهري', type: 'Individual', email: 'f.aldhaheri@email.com', phone: '0559876543', emiratesId: '784-1990-7654321-2', totalCases: 1, createdAt: '2024-03-10', address: 'العين، الإمارات', documents: [] }
];

const SEED_CASES: LegalCase[] = [
  { id: 'case1', caseNumber: '2024/102', title: 'دعوى عمالية - مستحقات متأخرة', category: CaseCategory.LABOR, clientId: 'c1', clientName: 'محمد سعيد المنصوري', opponentName: 'شركة البناء الحديث', court: 'محكمة العين الابتدائية', status: CaseStatus.JUDGMENT, createdAt: '2024-01-15', documents: [], totalFee: 15000, paidAmount: 15000, isArchived: true },
  { id: 'case2', caseNumber: '2025/305', title: 'فسخ عقد مقاولة', category: CaseCategory.COMMERCIAL, clientId: 'c2', clientName: 'شركة الاتحاد للمقاولات', opponentName: 'المطور العقاري', court: 'محكمة أبوظبي التجارية', status: CaseStatus.ACTIVE, createdAt: '2025-01-10', documents: [], totalFee: 50000, paidAmount: 25000, isArchived: false }
];

const SEED_INVOICES: Invoice[] = [
  { id: 'inv1', clientId: 'c1', amount: 15000, status: 'Paid', date: '2024-05-20', description: 'أتعاب نهائية - قضية 2024/102' },
  { id: 'inv2', clientId: 'c2', amount: 25000, status: 'Paid', date: '2025-01-12', description: 'دفعة أولى - قضية فسخ عقد' },
  { id: 'inv3', clientId: 'c2', amount: 25000, status: 'Unpaid', date: '2025-02-15', description: 'الدفعة الثانية المستحقة' },
  { id: 'inv4', clientId: 'c3', amount: 5000, status: 'Paid', date: '2025-01-20', description: 'استشارة قانونية - أحوال شخصية' }
];

const SEED_EXPENSES: Expense[] = [
  { id: 'exp1', amount: 12000, category: ExpenseCategory.OFFICE, description: 'إيجار المكتب - الربع الأول', date: '2025-01-01' },
  { id: 'exp2', amount: 2500, category: ExpenseCategory.OFFICE, description: 'رسوم تراخيص ورقية', date: '2025-01-05' },
  { id: 'exp3', amount: 1500, category: ExpenseCategory.PERSONAL, description: 'مصاريف وقود وانتقالات', date: '2025-01-10' }
];

const SEED_DEBTS: FutureDebt[] = [
  { id: 'debt1', clientName: 'شركة المجد', amount: 35000, dueDate: '2025-03-01', description: 'أتعاب متفق عليها عند صدور الحكم' },
  { id: 'debt2', clientName: 'أحمد صالح', amount: 12000, dueDate: '2025-02-28', description: 'مؤخر أتعاب قضية عمالية' }
];

export const db = {
  async fetchAll(table: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    try {
      const saved = localStorage.getItem(`legal_master_${table}`);
      if (!saved) {
        let seed = [];
        if (table === 'clients') seed = SEED_CLIENTS;
        if (table === 'cases') seed = SEED_CASES;
        if (table === 'invoices') seed = SEED_INVOICES;
        if (table === 'expenses') seed = SEED_EXPENSES;
        if (table === 'future_debts') seed = SEED_DEBTS;
        localStorage.setItem(`legal_master_${table}`, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  },

  async save(table: string, data: any) {
    const current = await this.fetchAll(table);
    const updated = [data, ...current];
    localStorage.setItem(`legal_master_${table}`, JSON.stringify(updated));
    return data;
  },

  async update(table: string, id: string, updatedData: any) {
    const current = await this.fetchAll(table);
    const updated = current.map((item: any) => item.id === id ? updatedData : item);
    localStorage.setItem(`legal_master_${table}`, JSON.stringify(updated));
    return updatedData;
  }
};
