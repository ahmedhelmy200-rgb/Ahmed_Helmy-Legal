
export type UserRole = 'admin' | 'visitor' | 'client' | 'staff';
export type AppLanguage = 'ar' | 'en';

export enum CaseStatus {
  WON = 'ربح',
  PREP = 'قيد التحضير',
  ACTIVE = 'متداولة',
  LOST = 'خسارة',
  ARCHIVED = 'مؤرشف',
  JUDGMENT = 'حكم',
  APPEAL = 'استئناف',
  CLOSED = 'مغلق',
  LITIGATION = 'تقاضي',
  PENDING = 'معلق'
}

export enum CaseCategory {
  CIVIL = 'مدني',
  CRIMINAL = 'جزائي',
  LABOR = 'عمالي',
  COMMERCIAL = 'تجاري',
  FAMILY = 'أحوال شخصية',
  RENTAL = 'إيجاري',
  ADMINISTRATIVE = 'إداري',
  EXECUTION = 'تنفيذ',
  ARCHIVED = 'أرشيف'
}

export interface GroundingLink {
  title: string;
  uri: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  image?: string;
  video?: string;
  links?: GroundingLink[];
  isAudio?: boolean;
}

export interface CaseComment {
  id: string;
  authorRole: UserRole;
  authorName: string;
  text: string;
  date: string;
}

export interface CaseActivity {
  id: string;
  type: 'status_change' | 'comment_added' | 'info_update' | 'document_added';
  description: string;
  userRole: UserRole;
  userName: string;
  timestamp: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  category: 'Contract' | 'Judgment' | 'Memo' | 'Receipt' | 'Other';
  uri: string;
  uploadDate: string;
  caseId?: string;
  clientId: string;
}

export interface LegalCase {
  id: string;
  caseNumber: string;
  title: string;
  category: CaseCategory;
  subCategory?: string;
  clientId: string;
  clientName: string;
  opponentName: string;
  court: string;
  status: CaseStatus;
  totalFee: number;
  paidAmount: number;
  createdAt: string;
  nextHearingDate?: string;
  isArchived: boolean;
  documents: string[];
  comments?: CaseComment[];
  activities?: CaseActivity[];
  assignedLawyer?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  emiratesId: string;
  address: string;
  type: 'Individual' | 'Corporate';
  createdAt: string;
  totalCases?: number;
  profileImage?: string;
  balance?: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  caseId?: string; // Optional for general revenue
  amount: number;
  paidAmount: number;
  status: 'Paid' | 'Unpaid' | 'Partially Paid';
  date: string;
  description?: string;
  branch?: string;
}

export enum ExpenseCategory {
  OFFICE = 'مكتب',
  PERSONAL = 'شخصي'
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  caseId?: string;
}

export interface FutureDebt {
  id: string;
  clientName: string;
  clientId?: string;
  amount: number;
  dueDate: string;
  description: string;
  isReminded?: boolean;
}

export interface SystemSettings {
  logo?: string;
  stamp?: string;
  signature?: string;
  language: AppLanguage;
  primaryColor: string;
}
