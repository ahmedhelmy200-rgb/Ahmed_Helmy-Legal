
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

// Added missing CaseComment interface
export interface CaseComment {
  id: string;
  authorRole: UserRole;
  authorName: string;
  text: string;
  date: string;
}

// Added missing CaseActivity interface
export interface CaseActivity {
  id: string;
  type: 'status_change' | 'comment_added' | 'info_update';
  description: string;
  userRole: UserRole;
  userName: string;
  timestamp: string;
}

export interface LegalCase {
  id: string;
  caseNumber: string;
  title: string;
  category: CaseCategory;
  subCategory?: string; // Added subCategory field
  clientId: string;
  clientName: string;
  opponentName: string;
  court: string;
  status: CaseStatus;
  totalFee: number;
  paidAmount: number;
  createdAt: string;
  nextHearingDate?: string; // Added nextHearingDate field
  isArchived: boolean;
  documents: string[];
  comments?: CaseComment[]; // Updated to use CaseComment interface
  activities?: CaseActivity[]; // Updated to use CaseActivity interface
  assignedLawyer?: string; // Added assignedLawyer field
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
  documents: string[];
  totalCases?: number; // Added totalCases field
}

// Added missing Invoice interface
export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
  date: string;
  description?: string;
}

// Added missing ExpenseCategory enum
export enum ExpenseCategory {
  OFFICE = 'مكتب',
  PERSONAL = 'شخصي'
}

// Added missing Expense interface
export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

// Added missing PaymentReceipt interface
export interface PaymentReceipt {
  id: string;
  clientId: string;
  amount: number;
  date: string;
}

// Added missing FutureDebt interface
export interface FutureDebt {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  description: string;
}

// Added missing SystemSettings interface
export interface SystemSettings {
  logo?: string;
  stamp?: string;
  language: AppLanguage;
  primaryColor: string;
}
