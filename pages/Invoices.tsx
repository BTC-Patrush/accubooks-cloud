import React, { useState } from 'react';
import { db } from '../services/storage';
import { generateId, formatCurrency } from '../services/accountingService';
import { Invoice, InvoiceItem, Transaction, TransactionType } from '../types';

export const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(db.getInvoices());
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'VIEW'>('LIST');
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  // Create Form State
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [currentItem, setCurrentItem] = useState({ name: '', qty: 1, rate: 0 });

  const addItem = () => {
    if (!currentItem.name || currentItem.rate <= 0) return;
    setItems([...items, { 
        itemId: generateId(), 
        itemName: currentItem.name, 
        quantity: currentItem.qty, 
        rate: currentItem.rate, 
        amount: currentItem.qty * currentItem.rate 
    }]);
    setCurrentItem({ name: '', qty: 1, rate: 0 });
  };

  const handleSaveInvoice = () => {
    const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
    const tax = subtotal * 0.1; // Flat 10% tax demo
    const total = subtotal + tax;

    const newInv: Invoice = {
        id: generateId(),
        number: `INV-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        contactId: 'temp_cust',
        contactName: customerName,
        items,
        subtotal,
        tax,
        total,
        status: 'SENT'
    };

    // Also create accounting record: Dr AR, Cr Sales
    const tx: Transaction = {
        id: generateId(),
        date: newInv.date,
        type: TransactionType.SALES,
        description: `Invoice #${newInv.number} for ${newInv.contactName}`,
        entries: [
            { accountId: 'acc_ar', debit: total, credit: 0 },
            { accountId: 'acc_sales', debit: 0, credit: subtotal },
            { accountId: 'acc_sales_tax', debit: 0, credit: tax }
        ]
    };

    db.saveTransaction(tx);
    db.saveInvoice(newInv);
    setInvoices(db.getInvoices());
    setViewMode('LIST');
  };

  const handlePrint = () => {
    window.print();
  };

  if (viewMode === 'VIEW' && activeInvoice) {
    return (
        <div className="p-8 max-w-4xl mx-auto bg-white min-h-screen print:p-0">
            <div className="flex justify-between mb-8 no-print">
                <button onClick={() => setViewMode('LIST')} className="text-slate-500 hover:text-slate-800">← Back to List</button>
                <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Download/Print PDF</button>
            </div>

            {/* Invoice Template */}
            <div className="border p-12 bg-white print:border-0" id="printable-invoice">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800">INVOICE</h1>
                        <p className="text-slate-500 mt-2">#{activeInvoice.number}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="font-bold text-xl text-slate-800">My Business Inc.</h2>
                        <p className="text-sm text-slate-500">123 Business Rd</p>
                        <p className="text-sm text-slate-500">New York, NY 10001</p>
                    </div>
                </div>

                <div className="flex justify-between mb-12">
                    <div>
                        <p className="text-xs uppercase font-bold text-slate-400 mb-1">Bill To</p>
                        <h3 className="text-lg font-bold text-slate-800">{activeInvoice.contactName}</h3>
                    </div>
                    <div className="text-right">
                         <p className="text-xs uppercase font-bold text-slate-400 mb-1">Date</p>
                         <p className="font-medium mb-2">{activeInvoice.date}</p>
                         <p className="text-xs uppercase font-bold text-slate-400 mb-1">Due Date</p>
                         <p className="font-medium">{activeInvoice.dueDate}</p>
                    </div>
                </div>

                <table className="w-full mb-8">
                    <thead className="bg-slate-50 border-y border-slate-200">
                        <tr>
                            <th className="text-left py-3 px-2 font-bold text-slate-600">Item</th>
                            <th className="text-right py-3 px-2 font-bold text-slate-600">Qty</th>
                            <th className="text-right py-3 px-2 font-bold text-slate-600">Rate</th>
                            <th className="text-right py-3 px-2 font-bold text-slate-600">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {activeInvoice.items.map((item, i) => (
                            <tr key={i} className="border-b border-slate-100">
                                <td className="py-4 px-2 font-medium">{item.itemName}</td>
                                <td className="py-4 px-2 text-right">{item.quantity}</td>
                                <td className="py-4 px-2 text-right">{formatCurrency(item.rate)}</td>
                                <td className="py-4 px-2 text-right font-bold">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <div className="w-1/2 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-medium">{formatCurrency(activeInvoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Tax (10%)</span>
                            <span className="font-medium">{formatCurrency(activeInvoice.tax)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4 text-slate-800">
                            <span>Total</span>
                            <span>{formatCurrency(activeInvoice.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t text-center text-slate-400 text-sm">
                    <p>Thank you for your business!</p>
                </div>
            </div>
        </div>
    );
  }

  if (viewMode === 'CREATE') {
      return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Create Invoice</h2>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                    <input className="w-full border rounded-lg p-2" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Enter client name" />
                </div>

                <div className="mb-6">
                    <h3 className="font-bold text-sm text-slate-500 uppercase mb-2">Items</h3>
                    {items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded mb-2">
                            <span>{item.itemName} x {item.quantity}</span>
                            <span className="font-bold">{formatCurrency(item.amount)}</span>
                        </div>
                    ))}
                    
                    <div className="flex gap-2 mt-4 p-4 border rounded-lg bg-slate-50">
                        <input className="flex-1 border rounded px-2 py-1 text-sm" placeholder="Item name" value={currentItem.name} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} />
                        <input className="w-20 border rounded px-2 py-1 text-sm" type="number" placeholder="Qty" value={currentItem.qty} onChange={e => setCurrentItem({...currentItem, qty: parseInt(e.target.value)})} />
                        <input className="w-24 border rounded px-2 py-1 text-sm" type="number" placeholder="Price" value={currentItem.rate} onChange={e => setCurrentItem({...currentItem, rate: parseFloat(e.target.value)})} />
                        <button onClick={addItem} className="bg-slate-800 text-white px-3 rounded text-sm font-medium">Add</button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <button onClick={() => setViewMode('LIST')} className="px-4 py-2 text-slate-600">Cancel</button>
                    <button onClick={handleSaveInvoice} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Generate Invoice</button>
                </div>
            </div>
        </div>
      )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Invoices</h2>
        <button onClick={() => setViewMode('CREATE')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoices.map(inv => (
              <div key={inv.id} onClick={() => { setActiveInvoice(inv); setViewMode('VIEW'); }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex justify-between mb-4">
                      <span className="font-bold text-slate-800">#{inv.number}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{inv.status}</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">{inv.contactName}</h3>
                  <p className="text-slate-500 text-sm mb-4">{inv.date}</p>
                  <div className="flex justify-between items-end border-t pt-4">
                      <span className="text-xs text-slate-400 uppercase">Total Amount</span>
                      <span className="text-xl font-bold text-slate-800">{formatCurrency(inv.total)}</span>
                  </div>
              </div>
          ))}
          {invoices.length === 0 && <p className="text-slate-400 col-span-3 text-center py-12">No invoices found.</p>}
      </div>
    </div>
  );
};