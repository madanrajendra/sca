import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon,
  iconBgColor = 'bg-neutral-900 text-neutral-300',
}) => {
  return (
    <div className="bg-[#0b0b0b] p-5 rounded-2xl border border-neutral-800 shadow-md flex flex-col justify-between transition-all hover:border-red-600/40 text-neutral-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-black text-white mt-1 tracking-tight">{value}</h4>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBgColor} shrink-0 border border-neutral-800`}>{icon}</div>
      </div>
      {(subtitle || change) && (
        <div className="mt-4 flex items-center justify-between text-xs border-t border-neutral-900 pt-3">
          {change && (
            <span
              className={`inline-flex items-center font-bold ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {change}
            </span>
          )}
          {subtitle && <span className="text-neutral-400 text-[11px] font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
