import { Account, AccountType } from './types';

export const DEFAULT_ACCOUNTS: Partial<Account>[] = [
  { id: 'acc_cash', name: 'Cash on Hand', type: AccountType.ASSET, code: '1001' },
  { id: 'acc_bank', name: 'Bank Account', type: AccountType.ASSET, code: '1002' },
  { id: 'acc_ar', name: 'Accounts Receivable', type: AccountType.ASSET, code: '1200' },
  { id: 'acc_inventory', name: 'Inventory Asset', type: AccountType.ASSET, code: '1300' },
  { id: 'acc_ap', name: 'Accounts Payable', type: AccountType.LIABILITY, code: '2000' },
  { id: 'acc_sales_tax', name: 'Sales Tax Payable', type: AccountType.LIABILITY, code: '2100' },
  { id: 'acc_equity', name: 'Owner\'s Equity', type: AccountType.EQUITY, code: '3000' },
  { id: 'acc_sales', name: 'Sales Revenue', type: AccountType.REVENUE, code: '4000' },
  { id: 'acc_cogs', name: 'Cost of Goods Sold', type: AccountType.EXPENSE, code: '5000' },
  { id: 'acc_rent', name: 'Rent Expense', type: AccountType.EXPENSE, code: '6001' },
  { id: 'acc_utilities', name: 'Utilities', type: AccountType.EXPENSE, code: '6002' },
  { id: 'acc_general', name: 'General Expenses', type: AccountType.EXPENSE, code: '6003' },
];

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Invoices', path: '/invoices' },
  { label: 'Ledger', path: '/ledger' },
  { label: 'Reports', path: '/reports' },
  { label: 'Contacts', path: '/contacts' },
];