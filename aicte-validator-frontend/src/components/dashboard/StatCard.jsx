import React from 'react';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';

const iconMap = {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
};

/**
 * StatCard Component
 * Displays individual metric summary with clear DEMO DATA tagging.
 */
const StatCard = ({ title, value, change, subtext, iconName }) => {
  const Icon = iconMap[iconName] || FileText;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#102D52] flex items-center justify-center border border-blue-100">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline space-x-2.5 mb-1.5">
        <span className="text-2xl sm:text-3xl font-black text-[#102D52] tracking-tight">
          {value}
        </span>
        {change && (
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            {change}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <span className="truncate">{subtext}</span>
        <span className="text-[9px] font-mono font-bold px-1 rounded bg-amber-100 text-amber-900 border border-amber-200 shrink-0 ml-1">
          DEMO
        </span>
      </div>
    </div>
  );
};

export default StatCard;
