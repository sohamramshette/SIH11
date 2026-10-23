import React from 'react';
import { reviewAlertsData } from '../../data/adminDashboardData';
import StatusBadge from './StatusBadge';
import { ArrowRight, ShieldAlert } from 'lucide-react';

/**
 * ReviewAlertsPanel Component
 * Highlights applications requiring human attention with neutral, objective labels:
 * "Review Required", "Missing Information", and "Possible Inconsistency".
 */
const ReviewAlertsPanel = ({ onSelectApplication }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-bold text-[#102D52]">
            Review Alerts &amp; Items Requiring Attention
          </h2>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
          {reviewAlertsData.length} PENDING ATTENTION
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {reviewAlertsData.map((alert) => (
          <div
            key={alert.id}
            className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#102D52]">
                  {alert.applicationId}
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {alert.collegeName}
                </span>
                <StatusBadge status={alert.label} />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {alert.description}
              </p>

              <div className="text-[10px] text-slate-500 font-mono flex items-center space-x-2">
                <span>Norm: {alert.handbookNorm}</span>
                <span>·</span>
                <span>Flagged {alert.timestamp}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectApplication && onSelectApplication(alert.applicationId)}
              className="inline-flex items-center justify-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-md bg-white border border-slate-300 text-[#102D52] hover:bg-slate-100 hover:border-slate-400 shrink-0 transition-colors"
            >
              <span>Inspect</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Note: All alerts represent simulated assistive checks. Final decisions remain with authorized officers.</span>
      </div>
    </div>
  );
};

export default ReviewAlertsPanel;
