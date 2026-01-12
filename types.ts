
export enum CaseStatus {
  ACTIVE = 'نشط',
  PENDING = 'قيد الانتظار',
  CLOSED = 'مغلق',
  APPEAL = 'استئناف',
  JUDGMENT = 'حكم',
  LITIGATION = 'مرافعة'
}

export enum CourtType {
  DUBAI = 'محاكم دبي',
  ADJD = 'محاكم أبوظبي',
  FEDERAL = 'المحاكم الاتحادية',
  DIFC = 'محاكم مركز دبي المالي العالمي',
  SHARIAH = 'المحاكم الشرعية'
}

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
}

export interface LegalCase {
  id: string;
  caseNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  opponentName: string;
  court: CourtType;
  status: CaseStatus;
  nextHearingDate: string;
  assignedLawyer: string;
  createdAt: string;
  documents: CaseDocument[];
  totalFee: number; // المبلغ الإجمالي المتفق عليه
  paidAmount: number; // المبلغ المدفوع حتى الآن
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
  status: 'Paid' | 'Unpaid' | 'Partial';
  description: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  emiratesId: string;
  address?: string;
  dateOfBirth?: string;
  type: 'Individual' | 'Corporate';
  totalCases: number;
  createdAt: string; // تاريخ ووقت التسجيل
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  priority: 'High' | 'Medium' | 'Low';
}
