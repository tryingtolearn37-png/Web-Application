export type TransactionType = 'expense' | 'income';

export type TransactionCategory =
  | 'Food & Dining'
  | 'Rent & Housing'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Transportation'
  | 'Salary & Wages'
  | 'Freelance & Bonus'
  | 'Investments'
  | 'Healthcare';

export type PaymentMethod =
  | 'Apple Pay · Chase'
  | 'Chase Sapphire (••8492)'
  | 'Amex Gold (••3014)'
  | 'Visa Debit · Checking (••4190)'
  | 'Apple Card (••5521)'
  | 'Bank Transfer (ACH)'
  | 'Cash';

export type TransactionStatus = 'Completed' | 'Pending' | 'Scheduled';

export interface Transaction {
  id: string;
  title: string;
  merchant: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  date: string; // ISO string or YYYY-MM-DD HH:mm
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  note?: string;
}

export interface BudgetCategory {
  category: TransactionCategory;
  budgeted: number;
  spent: number;
  color: string;
}

export interface CashFlowPoint {
  date: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

export interface AccountItem {
  id: string;
  name: string;
  institution: string;
  type: 'Checking' | 'Credit' | 'Savings' | 'Investment';
  balance: number;
  accountNumberMasked: string;
  color: string;
  changeRate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'success' | 'info';
}
