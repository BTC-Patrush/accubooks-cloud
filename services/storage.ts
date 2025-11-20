import { Account, Contact, Invoice, InventoryItem, Transaction } from '../types';
import { DEFAULT_ACCOUNTS } from '../constants';

const KEYS = {
  ACCOUNTS: 'ab_accounts',
  TRANSACTIONS: 'ab_transactions',
  CONTACTS: 'ab_contacts',
  INVOICES: 'ab_invoices',
  ITEMS: 'ab_items',
};

// Helper to delay for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class StorageService {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(KEYS.ACCOUNTS)) {
      const accounts = DEFAULT_ACCOUNTS.map(a => ({ ...a, balance: 0 } as Account));
      localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
    }
    if (!localStorage.getItem(KEYS.TRANSACTIONS)) localStorage.setItem(KEYS.TRANSACTIONS, '[]');
    if (!localStorage.getItem(KEYS.CONTACTS)) localStorage.setItem(KEYS.CONTACTS, '[]');
    if (!localStorage.getItem(KEYS.INVOICES)) localStorage.setItem(KEYS.INVOICES, '[]');
    if (!localStorage.getItem(KEYS.ITEMS)) localStorage.setItem(KEYS.ITEMS, '[]');
  }

  getAccounts(): Account[] {
    return JSON.parse(localStorage.getItem(KEYS.ACCOUNTS) || '[]');
  }

  getTransactions(): Transaction[] {
    return JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');
  }

  getContacts(): Contact[] {
    return JSON.parse(localStorage.getItem(KEYS.CONTACTS) || '[]');
  }

  getInvoices(): Invoice[] {
    return JSON.parse(localStorage.getItem(KEYS.INVOICES) || '[]');
  }

  getItems(): InventoryItem[] {
    return JSON.parse(localStorage.getItem(KEYS.ITEMS) || '[]');
  }

  saveTransaction(tx: Transaction) {
    const txs = this.getTransactions();
    txs.push(tx);
    // Sort by date desc
    txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
    
    // Update account balances cache (simple incremental approach)
    const accounts = this.getAccounts();
    tx.entries.forEach(entry => {
        const acc = accounts.find(a => a.id === entry.accountId);
        if (acc) {
            // Normal balance logic
            // Asset/Expense: Debit increases, Credit decreases
            // Liability/Equity/Revenue: Credit increases, Debit decreases
            // We will store raw debits and credits in history but balance is usually net.
            // Let's keep it simple: store the net effect? 
            // Actually, calculating on fly is safer for small data sets. 
        }
    });
    // We won't cache balance in account object permanently to avoid sync issues, we calculate on fly.
  }

  saveInvoice(inv: Invoice) {
    const invs = this.getInvoices();
    const idx = invs.findIndex(i => i.id === inv.id);
    if (idx >= 0) invs[idx] = inv;
    else invs.push(inv);
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invs));
  }

  saveContact(contact: Contact) {
    const contacts = this.getContacts();
    contacts.push(contact);
    localStorage.setItem(KEYS.CONTACTS, JSON.stringify(contacts));
  }
}

export const db = new StorageService();