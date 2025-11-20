import React, { useEffect, useState } from 'react';
import { getProfitAndLoss, formatCurrency, getAccountBalance } from '../services/accountingService';
import { KPICard } from '../components/KPICard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    expenses: 0,
    netProfit: 0,
    cash: 0,
    bank: 0
  });

  useEffect(() => {
    const pl = getProfitAndLoss();
    // In a real app, fetch specific IDs. Here we guess based on default setup or logic
    // Cash is typically asset type, specific ID 'acc_cash'
    const cash = getAccountBalance('acc_cash'); 
    const bank = getAccountBalance('acc_bank'); 
    
    setMetrics({
      ...pl,
      cash,
      bank
    });
  }, []);

  const chartData = [
    { name: 'Revenue', amount: metrics.revenue },
    { name: 'Expenses', amount: metrics.expenses },
    { name: 'Profit', amount: metrics.netProfit },
  ];

  const liquidityData = [
    { name: 'Cash', value: metrics.cash },
    { name: 'Bank', value: metrics.bank },
  ];

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + New Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Revenue" value={formatCurrency(metrics.revenue)} trend="+12.5%" trendUp={true} />
        <KPICard title="Total Expenses" value={formatCurrency(metrics.expenses)} trend="+4.2%" trendUp={false} />
        <KPICard title="Net Profit" value={formatCurrency(metrics.netProfit)} trend="+24%" trendUp={true} />
        <KPICard title="Cash & Bank" value={formatCurrency(metrics.cash + metrics.bank)} colorClass="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-700 mb-6">Financial Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-700 mb-6">Liquidity Mix</h3>
           <div className="h-64 w-full flex items-center justify-center">
              {metrics.cash + metrics.bank > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={liquidityData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                        {liquidityData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
              ) : (
                  <p className="text-slate-400 text-sm">No liquidity data yet.</p>
              )}
           </div>
           <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-slate-600">Cash</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-slate-600">Bank</span>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};