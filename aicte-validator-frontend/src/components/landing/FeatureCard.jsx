import React from 'react';
import {
  FileCheck2,
  ShieldAlert,
  Scale,
  FileSpreadsheet,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react';

/**
 * Map icon names to Lucide icon components
 */
const iconMap = {
  FileCheck2,
  ShieldAlert,
  Scale,
  FileSpreadsheet,
};

/**
 * FeatureCard Component
 * Reusable card designed in the formal institutional style of the reference portal.
 */
const FeatureCard = ({
  title,
  badge,
  description,
  iconName,
  referenceNorm,
  highlights = [],
}) => {
  const IconComponent = iconMap[iconName] || FileCheck2;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-400 transition-all group">
      <div>
        {/* Top: Icon & Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#102D52] flex items-center justify-center group-hover:bg-[#102D52] group-hover:text-white transition-colors border border-blue-100">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {badge}
          </span>
        </div>

        {/* Feature Title */}
        <h3 className="text-lg font-bold text-[#102D52] group-hover:text-[#1D4ED8] transition-colors leading-snug mb-2">
          {title}
        </h3>

        {/* Feature Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          {description}
        </p>

        {/* Highlight Bullets */}
        {highlights && highlights.length > 0 && (
          <ul className="space-y-1.5 pt-3 border-t border-slate-100 mb-4 text-xs text-slate-700">
            {highlights.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer: Handbook Reference & Action Link */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-mono text-[10px] text-slate-500 font-medium">
          {referenceNorm}
        </span>
        <a
          href="#workflow"
          className="font-bold text-[#1D4ED8] hover:text-[#102D52] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Workflow Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default FeatureCard;
