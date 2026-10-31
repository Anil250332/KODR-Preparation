import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: 'emerald' | 'rose' | 'amber' | 'blue' | 'teal';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'teal',
}) => {
  const colorMap = {
    teal: {
      iconBg: 'bg-[#0d9488]/10 text-[#0d9488]',
    },
    emerald: {
      iconBg: 'bg-[#10b981]/10 text-[#10b981]',
    },
    rose: {
      iconBg: 'bg-[#ef4444]/10 text-[#ef4444]',
    },
    amber: {
      iconBg: 'bg-[#f59e0b]/10 text-[#f59e0b]',
    },
    blue: {
      iconBg: 'bg-[#3b82f6]/10 text-[#3b82f6]',
    },
  };

  const scheme = colorMap[color];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all duration-200">
      <div>
        <span className="text-xs font-semibold text-slate-500 tracking-wide">{title}</span>
        <div className="mt-2">
          <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
        </div>
        {subtitle && (
          <p className="mt-1 text-[11px] text-slate-400 font-medium">{subtitle}</p>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${scheme.iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
