import { db } from './storage';
import { AccountType, Transaction, LedgerEntry } from '../types';

export const getAccountBalance = (accountId: string, endDate?: string): number => {
  const transactions = db.getTransactions();
  const accounts = db.getAccounts();
  const account = accounts.find(a => a.id === accountId);
  
  if (!account) return 0;

  let balance = 0;

  transactions.forEach(tx => {
    if (endDate && new Date(tx.date) > new Date(endDate)) return;

    const entry = tx.entries.find(e => e.accountId === accountId);
    if (entry) {
      if (account.type === AccountType.ASSET || account.type === AccountType.EXPENSE) {
        balance += (entry.debit - entry.credit);
      } else {
        balance += (entry.credit - entry.debit);
      }
    }
  });

  return balance;
};

export const getProfitAndLoss = () => {
  const accounts = db.getAccounts();
  const revenueAccounts = accounts.filter(a => a.type === AccountType.REVENUE);
  const expenseAccounts = accounts.filter(a => a.type === AccountType.EXPENSE);

  const totalRevenue = revenueAccounts.reduce((sum, acc) => sum + getAccountBalance(acc.id), 0);
  const totalExpenses = expenseAccounts.reduce((sum, acc) => sum + getAccountBalance(acc.id), 0);

  return {
    revenue: totalRevenue,
    expenses: totalExpenses,
    netProfit: totalRevenue - totalExpenses
  };
};

export const getBalanceSheet = () => {
  const accounts = db.getAccounts();
  const { netProfit } = getProfitAndLoss();

  const assets = accounts.filter(a => a.type === AccountType.ASSET)
    .reduce((sum, a) => sum + getAccountBalance(a.id), 0);

  const liabilities = accounts.filter(a => a.type === AccountType.LIABILITY)
    .reduce((sum, a) => sum + getAccountBalance(a.id), 0);

  // Equity includes Net Profit for the period
  const equity = accounts.filter(a => a.type === AccountType.EQUITY)
    .reduce((sum, a) => sum + getAccountBalance(a.id), 0) + netProfit;

  return { assets, liabilities, equity };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);