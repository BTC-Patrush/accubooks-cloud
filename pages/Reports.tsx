import React, { useEffect, useState } from 'react';
import { getProfitAndLoss, getBalanceSheet, formatCurrency, getAccountBalance } from '../services/accountingService';
import { db } from '../services/storage';
import { Account } from '../types';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PL' | 'BS' | 'TB'>('PL');
  const [plData, setPlData] = useState<any>(null);
  const [bsData, setBsData] = useState<any>(null);
  const [tbData, setTbData] = useState<{account: Account, balance: number}[]>([]);

  useEffect(() => {
    setPlData(getProfitAndLoss());
    setBsData(getBalanceSheet());
    
    const accounts = db.getAccounts();
    const tb = accounts.map(a => ({
        account: a,
        balance: getAccountBalance(a.id)
    })).filter(item => item.balance !== 0);
    setTbData(tb);
  }, []);

  if (!plData || !bsData) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Financial Reports</h2>
            <div className="flex bg-slate-200 p-1 rounded-lg">
                <button onClick={() => setActiveTab('PL')} className={`px-4 py-1 text-sm font-medium rounded-md transition ${activeTab === 'PL' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}>Profit & Loss</button>
                <button onClick={() => setActiveTab('BS')} className={`px-4 py-1 text-sm font-medium rounded-md transition ${activeTab === 'BS' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}>Balance Sheet</button>
                <button onClick={() => setActiveTab('TB')} className={`px-4 py-1 text-sm font-medium rounded-md transition ${activeTab === 'TB' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}>Trial Balance</button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 min-h-[500px]">
            
            {/* Profit & Loss View */}
            {activeTab === 'PL' && (
                <div>
                    <h3 className="text-center text-2xl font-bold mb-2 text-slate-800">Statement of Profit & Loss</h3>
                    <p className="text-center text-slate-500 mb-12">As of {new Date().toLocaleDateString()}</p>
                    
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div>
                            <h4 className="text-sm uppercase font-bold text-slate-400 border-b pb-2 mb-4">Revenue</h4>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-700">Total Sales & Income</span>
                                <span className="font-medium">{formatCurrency(plData.revenue)}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm uppercase font-bold text-slate-400 border-b pb-2 mb-4">Expenses</h4>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-700">Total Operating Expenses</span>
                                <span className="font-medium">{formatCurrency(plData.expenses)}</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg flex justify-between items-center border-t-2 border-slate-200">
                            <span className="text-xl font-bold text-slate-800">Net Profit</span>
                            <span className={`text-xl font-bold ${plData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(plData.netProfit)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Balance Sheet View */}
            {activeTab === 'BS' && (
                 <div>
                    <h3 className="text-center text-2xl font-bold mb-2 text-slate-800">Balance Sheet</h3>
                    <p className="text-center text-slate-500 mb-12">As of {new Date().toLocaleDateString()}</p>

                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-lg font-bold text-blue-600 border-b-2 border-blue-100 pb-2 mb-4">Assets</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Current Assets (Cash, Bank, AR)</span>
                                    <span className="font-mono">{formatCurrency(bsData.assets)}</span>
                                </div>
                                <div className="flex justify-between pt-4 font-bold text-lg border-t">
                                    <span>Total Assets</span>
                                    <span>{formatCurrency(bsData.assets)}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                             <h4 className="text-lg font-bold text-red-600 border-b-2 border-red-100 pb-2 mb-4">Liabilities & Equity</h4>
                             <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Total Liabilities</span>
                                    <span className="font-mono">{formatCurrency(bsData.liabilities)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Owner's Equity (Includes Current Profit)</span>
                                    <span className="font-mono">{formatCurrency(bsData.equity)}</span>
                                </div>
                                <div className="flex justify-between pt-4 font-bold text-lg border-t">
                                    <span>Total Liabilities & Equity</span>
                                    <span>{formatCurrency(bsData.liabilities + bsData.equity)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

             {/* Trial Balance View */}
             {activeTab === 'TB' && (
                 <div>
                    <h3 className="text-center text-2xl font-bold mb-2 text-slate-800">Trial Balance</h3>
                    <p className="text-center text-slate-500 mb-12">Consolidated View</p>

                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-3 font-bold text-slate-600">Account</th>
                                <th className="p-3 font-bold text-slate-600 text-right">Debit</th>
                                <th className="p-3 font-bold text-slate-600 text-right">Credit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {tbData.map((row, i) => {
                                // Normally TB separates Dr and Cr columns explicitly.
                                // Here, positive balance for Asset/Expense is Dr.
                                // Positive balance for Liab/Equity/Rev is Cr.
                                let dr = 0;
                                let cr = 0;
                                
                                // A simplified view:
                                // If balance is positive, where does it go?
                                // Assets/Expenses normally Dr.
                                // Liab/Eq/Rev normally Cr.
                                // If Asset is negative, it's Cr.
                                
                                // Let's stick to the raw math from getAccountBalance which handles direction
                                // But for TB display, we usually want absolute values in respective columns
                                // based on account type norm + sign.
                                
                                // Simplifying for UI demo:
                                const isDrType = ['ASSET', 'EXPENSE'].includes(row.account.type);
                                
                                if (isDrType) {
                                    if (row.balance >= 0) dr = row.balance;
                                    else cr = Math.abs(row.balance);
                                } else {
                                    if (row.balance >= 0) cr = row.balance;
                                    else dr = Math.abs(row.balance);
                                }

                                return (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="p-3">
                                            <span className="font-medium block">{row.account.name}</span>
                                            <span className="text-xs text-slate-400">{row.account.code} - {row.account.type}</span>
                                        </td>
                                        <td className="p-3 text-right font-mono text-slate-600">{dr > 0 ? formatCurrency(dr) : '-'}</td>
                                        <td className="p-3 text-right font-mono text-slate-600">{cr > 0 ? formatCurrency(cr) : '-'}</td>
                                    </tr>
                                );
                            })}
                            <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                                <td className="p-3">TOTAL</td>
                                <td className="p-3 text-right">{formatCurrency(tbData.reduce((acc, curr) => {
                                     const isDrType = ['ASSET', 'EXPENSE'].includes(curr.account.type);
                                     return acc + (isDrType && curr.balance > 0 ? curr.balance : (!isDrType && curr.balance < 0 ? Math.abs(curr.balance) : 0));
                                }, 0))}</td>
                                <td className="p-3 text-right">{formatCurrency(tbData.reduce((acc, curr) => {
                                     const isDrType = ['ASSET', 'EXPENSE'].includes(curr.account.type);
                                     return acc + (!isDrType && curr.balance > 0 ? curr.balance : (isDrType && curr.balance < 0 ? Math.abs(curr.balance) : 0));
                                }, 0))}</td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
             )}
        </div>
    </div>
  );
};