import React, { useState } from 'react';
import { db } from '../services/storage';
import { generateId, formatCurrency } from '../services/accountingService';
import { Transaction, TransactionType, Account, LedgerEntry } from '../types';

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(db.getTransactions());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts] = useState<Account[]>(db.getAccounts());
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [drAccount, setDrAccount] = useState('');
  const [crAccount, setCrAccount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.JOURNAL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || !drAccount || !crAccount) return;

    const newTx: Transaction = {
      id: generateId(),
      date,
      type,
      description,
      entries: [
        { accountId: drAccount, debit: val, credit: 0 },
        { accountId: crAccount, debit: 0, credit: val }
      ]
    };

    db.saveTransaction(newTx);
    setTransactions(db.getTransactions());
    setIsModalOpen(false);
    setDescription('');
    setAmount('');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Transactions</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + New Transaction
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Description</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Type</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Account (Dr)</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Account (Cr)</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">Amount</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {transactions.map(tx => {
                    const dr = tx.entries.find(e => e.debit > 0);
                    const cr = tx.entries.find(e => e.credit > 0);
                    const drName = accounts.find(a => a.id === dr?.accountId)?.name || 'Unknown';
                    const crName = accounts.find(a => a.id === cr?.accountId)?.name || 'Unknown';
                    
                    return (
                        <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 text-sm text-slate-600">{tx.date}</td>
                            <td className="p-4 text-sm font-medium text-slate-800">{tx.description}</td>
                            <td className="p-4 text-sm">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                    {tx.type}
                                </span>
                            </td>
                            <td className="p-4 text-sm text-slate-600">{drName}</td>
                            <td className="p-4 text-sm text-slate-600">{crName}</td>
                            <td className="p-4 text-sm font-bold text-slate-800 text-right">
                                {formatCurrency(dr ? dr.debit : 0)}
                            </td>
                        </tr>
                    );
                })}
                {transactions.length === 0 && (
                    <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">No transactions recorded yet.</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Record Transaction</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
                            <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border rounded-lg p-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
                            <select value={type} onChange={e => setType(e.target.value as TransactionType)} className="w-full border rounded-lg p-2 text-sm">
                                {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                        <input required type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded-lg p-2 text-sm" placeholder="e.g., Office Supplies" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div>
                            <label className="block text-xs font-bold text-blue-600 mb-1">Debit Account</label>
                            <select required value={drAccount} onChange={e => setDrAccount(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-white">
                                <option value="">Select...</option>
                                {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.type})</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-red-600 mb-1">Credit Account</label>
                             <select required value={crAccount} onChange={e => setCrAccount(e.target.value)} className="w-full border rounded-lg p-2 text-sm bg-white">
                                <option value="">Select...</option>
                                {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.type})</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Amount</label>
                        <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border rounded-lg p-2 text-sm font-bold text-right" placeholder="0.00" />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancel</button>
                        <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Entry</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};