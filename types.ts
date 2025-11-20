export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export enum TransactionType {
  SALES = 'SALES',
  PURCHASE = 'PURCHASE',
  PAYMENT = 'PAYMENT',
  RECEIPT = 'RECEIPT',
  JOURNAL = 'JOURNAL',
  CONTRA = 'CONTRA',
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  code: string;
  description?: string;
  balance: number; // Cached balance
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'CUSTOMER' | 'SUPPLIER';
  address?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
  salesPrice: number;
  quantity: number;
}

// Double Entry Core
export interface LedgerEntry {
  accountId: string;
  debit: number;
  credit: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO Date
  type: TransactionType;
  description: string;
  entries: LedgerEntry[];
  referenceId?: string; // e.g., Invoice ID
  attachmentUrl?: string;
}

export interface InvoiceItem {
  itemId: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  contactId: string;
  contactName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  transactionId?: string; // Linked transaction
}

export interface ReportData {
  label: string;
  value: number;
}