import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  FileCheck2,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { preliminaryValidationChecklistRules as initialRules } from '../../data/verificationDashboardData';

/**
 * PreliminaryValidationChecklist Component
 * Interactive rule-based validation engine interface for Scrutiny Officers.
 * Distinguishes simulated rule-based logic from external database verifications.
 */
const PreliminaryValidationChecklist = ({ onOpenClarificationQuery }) => {
  const [rules, setRules] = useState(initialRules);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Toggle rule status for demonstration purposes
  const handleToggleRule = (ruleId) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          const nextStatus = r.status === 'Passed' ? 'Review Required' : 'Passed';
          return {
            ...r,
            status: nextStatus,
            reason:
              nextStatus === 'Passed'
                ? 'Officer marked manual override: statutory condition verified.'
                : 'Officer marked for further departmental investigation.',
          };
        }
        return r;
      })
    );
    setFeedbackMessage(`Rule ${ruleId} status toggled in demo session.`);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleResetRules = () => {
    setRules(initialRules);
    setFeedbackMessage('Rule set reset to baseline simulated evaluations.');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const filteredRules = rules.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const passedCount = rules.filter((r) => r.status === 'Passed').length;
  const reviewCount = rules.filter((r) => r.status === 'Review Required').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
              <CheckSquare className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-[#102D52]">
                  Preliminary Validation Rules Engine
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full">
                  Handbook APH 2026-27 Norms
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Simulated rule-based validation evaluating completeness, structure, and internal consistency prior to expert scrutiny.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetRules}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Reset rules to initial demonstration values"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Rules</span>
            </button>
          </div>
        </div>

        {/* Persistent Technical Disclaimer */}
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-300/40 text-xs text-amber-950 flex items-start space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold">Simulated Rule Evaluation Notice:</span> The results displayed below are generated via local algorithmic rule simulations. These checks inspect structural formatting and mathematical reconciliation. They do not represent live AI models querying external government revenue records, land registries, or university databases.
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Metrics Strip & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-800">{passedCount} Passed</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="font-bold text-slate-800">{reviewCount} Review Required</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-slate-500 text-xs mr-1 font-medium">Filter:</span>
          {['ALL', 'Passed', 'Review Required'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                statusFilter === tab
                  ? 'bg-[#102D52] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Rules (5)' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.map((rule, idx) => {
          const isPassed = rule.status === 'Passed';

          return (
            <div
              key={rule.id}
              className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-xs ${
                isPassed ? 'border-slate-200' : 'border-amber-300 bg-amber-50/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">{rule.name}</h3>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {rule.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{rule.description}</p>
                  </div>
                </div>

                {/* Status Badge & Toggle Action */}
                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isPassed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    )}
                    <span>{rule.status}</span>
                  </span>

                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className="text-[11px] font-medium text-blue-700 hover:text-blue-900 hover:underline px-2 py-1"
                    title="Click to toggle check outcome for demonstration"
                  >
                    Toggle Demo
                  </button>
                </div>
              </div>

              {/* Reason & Next Action Grid */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center space-x-1.5 text-slate-700 font-bold mb-1">
                    <Info className="w-3.5 h-3.5 text-blue-700" />
                    <span>Rule Evaluation Reason</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{rule.reason}</p>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isPassed
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <FileCheck2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Suggested Next Action</span>
                    </div>

                    {!isPassed && onOpenClarificationQuery && (
                      <button
                        onClick={onOpenClarificationQuery}
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-800 hover:underline"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Issue Query</span>
                      </button>
                    )}
                  </div>
                  <p className="leading-relaxed">{rule.suggestedAction}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreliminaryValidationChecklist;
