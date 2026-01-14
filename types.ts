
export type UserRole = 'admin' | 'visitor' | 'client';

export enum CaseStatus {
  ACTIVE = 'نشط',
  PENDING = 'قيد الانتظار',
  CLOSED = 'مغلق',
  APPEAL = 'استئناف',
  JUDGMENT = 'حكم',
  LITIGATION = 'مرافعة',
  ARCHIVED = 'مؤرشف'
}

export enum CaseCategory {
  CIVIL = 'بلاغ مدني',
  CRIMINAL = 'بلاغ جنائي',
  LABOR = 'بلاغ عمالي',
  COMMERCIAL = 'بلاغ تجاري',
  FAMILY = 'أحوال شخصية',
  RENTAL = 'منازعات إيجارية'
}

export enum ExpenseCategory {
  OFFICE = 'مصاريف المكتب',
  BROKER = 'عمولة وسطاء',
  STAFF = 'مصاريف موظفين',
  GOV = 'رسوم حكومية',
  POA = 'رسوم وكالة',
  CASE = 'مصاريف قضايا'
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
  caseId?: string; // اختياري إذا كانت مرتبطة بقضية
}

export interface CaseActivity {
  id: string;
  type: 'status_change' | 'document_added' | 'comment_added' | 'info_update';
  description: string;
  userRole: UserRole;
  userName: string;
  timestamp: string;
}

export interface CaseComment {
  id: string;
  authorRole: UserRole;
  authorName: string;
  text: string;
  date: string;
}

export interface CaseDocument {
  id: string;
  name: string;
  type: 'EmiratesID' | 'Passport' | 'Photo' | 'Judgment' | 'Support' | 'Other';
  uploadDate: string;
  fileUrl?: string;
}

export interface LegalCase {
  id: string;
  caseNumber: string;
  title: string;
  category: CaseCategory; // تصنيف البلاغ
  clientId: string;
  clientName: string;
  opponentName: string;
  court: string;
  status: CaseStatus;
  nextHearingDate: string;
  assignedLawyer: string;
  createdAt: string;
  documents: CaseDocument[];
  comments: CaseComment[];
  activities: CaseActivity[];
  totalFee: number;
  paidAmount: number;
  isArchived: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  caseId: string;
  caseTitle: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Partial';
  description: string;
  payments: any[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  emiratesId: string;
  address?: string;
  type: 'Individual' | 'Corporate';
  brokerName?: string; // اسم الوسيط
  commissionAmount?: number; // عمولة الوسيط
  documents: CaseDocument[]; // مستندات الموكل (هوية، جواز...)
  totalCases: number;
  createdAt: string;
}
