import React, { useState } from 'react';
import { useDemoState } from '../../hooks/useDemoState';
import { initialQueriesData, demoCollegeProfile } from '../../data/collegeDashboardData';
import StatusBadge from './StatusBadge';
import {
  Send,
  CheckCircle2,
  UserCheck,
  HelpCircle,
  Clock,
  FileText,
} from 'lucide-react';

/**
 * QueriesClarificationsView Component
 * Displays queries from AICTE scrutiny officers and allows college representative
 * to enter and submit responses that update the shared demo state.
 */
const QueriesClarificationsView = () => {
  const { queries, respondToQuery } = useDemoState();
  const [activeResponses, setActiveResponses] = useState({});
  const [localSubmitted, setLocalSubmitted] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  // Reconcile shared state queries with initial baseline queries
  const allQueries = queries && queries.length > 0 ? queries : initialQueriesData;
  const collegeQueries = allQueries.filter(
    (q) =>
      !q.collegeName ||
      q.collegeName.includes('Bhartiya') ||
      (q.targetApp || q.applicationId || '').includes('104')
  );
  const displayQueries = collegeQueries.length > 0 ? collegeQueries : initialQueriesData;

  const handleResponseChange = (queryId, text) => {
    setActiveResponses((prev) => ({ ...prev, [queryId]: text }));
  };

  const handleApplyPreset = (queryId, presetText) => {
    setActiveResponses((prev) => ({ ...prev, [queryId]: presetText }));
  };

  const handleSubmitResponse = (queryId) => {
    const text = activeResponses[queryId]?.trim();
    if (!text) return;

    const timeStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' IST';

    // Update local state immediately for instant feedback
    setLocalSubmitted((prev) => ({
      ...prev,
      [queryId]: {
        response: text,
        submittedAt: `${timeStr} (Recorded)`,
      },
    }));

    // Update global demo state
    if (respondToQuery) {
      respondToQuery(queryId, text);
    }

    setActiveResponses((prev) => ({ ...prev, [queryId]: '' }));
    setSuccessMessage(`Institutional response for Query #${queryId} has been successfully recorded and submitted to the AICTE Scrutiny Cell.`);
    setTimeout(() => setSuccessMessage(null), 6000);
  };

  const pendingCount = displayQueries.filter(
    (q) => !localSubmitted[q.id] && q.status === 'Pending College Response'
  ).length;

  const quickPresets = [
    'Board appointment order for designated Professor in CSE (Dr. Manoj Verma, joined 01-July-2026) has been verified and uploaded under Faculty Cadre Roster.',
    'Updated Fire Safety NOC renewal acknowledgment receipt (#BPL-FIRE-2026-992) from Bhopal Municipal Corporation has been uploaded to the Safety Clearances repository.',
    'Governing Council resolution #GC-2026/04 ratifying department cadre ratios has been signed by the Principal and uploaded under Statutory Affidavits.',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-bold shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-[#102D52]">
                Official Scrutiny Queries &amp; Clarifications
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {demoCollegeProfile.shortName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and respond to formal inquiries raised by assigned AICTE scrutiny officers.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
            pendingCount > 0
              ? 'bg-amber-50 text-amber-900 border-amber-300'
              : 'bg-emerald-50 text-emerald-900 border-emerald-300'
          }`}>
            {pendingCount > 0 ? `${pendingCount} Action Required` : 'All Queries Responded'}
          </span>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-start sm:items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-start sm:items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-800 font-bold hover:underline shrink-0 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Queries List */}
      <div className="space-y-5">
        {displayQueries.map((q) => {
          const isLocalDone = !!localSubmitted[q.id];
          const isPending = !isLocalDone && q.status === 'Pending College Response';
          const draftText = activeResponses[q.id] || '';
          const recordedResponse = isLocalDone ? localSubmitted[q.id].response : q.collegeResponse;
          const recordedTime = isLocalDone ? localSubmitted[q.id].submittedAt : q.submittedAt;
          const officerName = typeof q.officer === 'object' ? q.officer?.name : (q.officer || 'Dr. R. K. Sharma (Scrutiny Officer - Gr. I)');

          return (
            <div
              key={q.id}
              className={`bg-white rounded-xl border p-5 sm:p-6 shadow-2xs transition-all space-y-4 ${
                isPending
                  ? 'border-amber-300 ring-2 ring-amber-100'
                  : 'border-slate-200'
              }`}
            >
              {/* Query Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#102D52] bg-slate-100 px-2 py-0.5 rounded">
                      Query #{q.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-xs font-bold text-slate-600">
                      Ref: {q.applicationId || q.targetApp}
                    </span>
                    <StatusBadge status={isLocalDone ? 'Response Submitted' : q.status} />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {q.subject}
                  </h3>
                </div>

                <div className="text-[11px] text-slate-500 font-mono shrink-0 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Issued: {q.date || q.dateIssued || '22 Oct 2026'}</span>
                  <span>·</span>
                  <span className="text-amber-800 font-semibold">Due: {q.deadline || '26 Oct 2026'}</span>
                </div>
              </div>

              {/* Scrutiny Officer Inquiry Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center space-x-2 text-[#102D52] font-bold">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <span>Officer Inquiry from {officerName}</span>
                </div>
                <p className="text-slate-700 leading-relaxed pl-6">
                  {q.queryText || q.description}
                </p>
                {q.responseRequired && (
                  <div className="pl-6 pt-1 text-[11px] text-slate-600">
                    <strong className="text-slate-800">Required Document/Proof: </strong>
                    <span>{q.responseRequired}</span>
                  </div>
                )}
              </div>

              {/* Recorded Institutional Response (if submitted) */}
              {recordedResponse && (
                <div className="bg-emerald-50/80 rounded-xl p-4 border border-emerald-200 text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-emerald-950 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Institutional Response Submitted</span>
                    </span>
                    {recordedTime && (
                      <span className="text-[10px] text-emerald-800 font-mono font-normal">
                        {recordedTime}
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-900 leading-relaxed pl-5 font-medium">
                    {recordedResponse}
                  </p>
                </div>
              )}

              {/* Response Form (if pending) */}
              {isPending && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label
                      htmlFor={`response-${q.id}`}
                      className="block text-xs font-bold text-slate-800"
                    >
                      Enter College Clarification / Document Reference:
                    </label>
                  </div>

                  {/* Quick Preset Response Options */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <FileText className="w-3 h-3 text-slate-500" />
                      <span>Quick Presets:</span>
                    </span>
                    {quickPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(q.id, preset)}
                        className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-200 transition-colors text-left"
                      >
                        Option {idx + 1}
                      </button>
                    ))}
                  </div>

                  <textarea
                    id={`response-${q.id}`}
                    rows={3}
                    value={draftText}
                    onChange={(e) => handleResponseChange(q.id, e.target.value)}
                    placeholder="Provide specific institutional explanations, reference numbers of uploaded documents, or committee resolution details..."
                    className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#102D52] bg-white text-slate-800"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-slate-500">
                      Submitting will update the query status and notify the scrutiny officer desk.
                    </span>

                    <button
                      type="button"
                      disabled={!draftText.trim()}
                      onClick={() => handleSubmitResponse(q.id)}
                      className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#102D52] hover:bg-[#1D4ED8] text-white shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Clarification Response</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QueriesClarificationsView;
