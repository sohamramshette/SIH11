import React from 'react';
import { simulatedValidationResults } from '../../data/collegeDashboardData';
import StatusBadge from './StatusBadge';
import {
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

/**
 * ValidationResultsView Component
 * Displays simulated automated verification findings with statuses:
 * - Passed Preliminary Check
 * - Review Required
 * - Missing Information
 * - Possible Inconsistency
 * 
 * Explicitly states that all outputs are preliminary assistive checks.
 */
const ValidationResultsView = ({ onNavigateToUploads, onNavigateToQueries }) => {
  return (
    <div className="space-y-6">
      {/* Mandatory Regulatory Assistive Scope Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 text-blue-950 text-xs shadow-xs">
        <div className="flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-[11px] bg-blue-200 px-2 py-0.5 rounded text-blue-950 inline-block mb-1">
              PRELIMINARY ASSISTIVE STATUS NOTICE
            </span>
            <p className="leading-relaxed">
              Automated validation results displayed below are <strong>preliminary assistive indicators</strong> generated to help institutions spot formatting discrepancies and data gaps before formal scrutiny.
              <strong> Under no circumstances do these checks constitute official document authentication or statutory compliance clearance.</strong> Final regulatory decisions remain strictly with authorized AICTE scrutiny committees under the AICTE Act 1987.
            </p>
          </div>
        </div>
      </div>

      {/* Validation Results Cards */}
      <div className="space-y-4">
        {simulatedValidationResults.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
          >
            {/* Header: Field / Document + Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {item.normReference}
                </div>
                <h3 className="text-sm font-bold text-[#102D52] mt-0.5">
                  {item.documentOrField}
                </h3>
              </div>

              <StatusBadge status={item.status} />
            </div>

            {/* Explanation */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Automated Check Finding
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {item.explanation}
              </p>
            </div>

            {/* Suggested Next Action */}
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-amber-950 block">Suggested Next Action:</span>
                <span className="text-amber-900">{item.suggestedAction}</span>
              </div>

              {item.status !== 'Passed Preliminary Check' && (
                <div className="shrink-0">
                  {item.documentOrField.includes('Fire') ? (
                    <button
                      type="button"
                      onClick={onNavigateToUploads}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-md bg-[#102D52] text-white hover:bg-[#1D4ED8]"
                    >
                      <span>Upload Document</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onNavigateToQueries}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-md bg-[#102D52] text-white hover:bg-[#1D4ED8]"
                    >
                      <span>Respond in Queries</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationResultsView;
