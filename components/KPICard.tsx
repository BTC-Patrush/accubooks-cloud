import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon?: React.ReactNode;
  colorClass?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, trend, trendUp, colorClass = "bg-white" }) => {
  return (
    <div className={`${colorClass} p-6 rounded-xl shadow-sm border border-slate-100`}>
      <div className="flex justify-between items-start">
        <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">{value}</h3>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend}
          </span>
          <span className="text-xs text-slate-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};