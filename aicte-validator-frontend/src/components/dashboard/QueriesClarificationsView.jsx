import { useDemoState } from '../../hooks/useDemoState';
import StatusBadge from './StatusBadge';
import {
  Send,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';

/**
 * QueriesClarificationsView Component
 * Displays queries from AICTE scrutiny officers and allows college representative
 * to enter and submit responses that update the shared demo state.
 */
const QueriesClarificationsView = () => {
  const { queries, respondToQuery } = useDemoState();
  const [activeResponses, setActiveResponses] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  // Filter queries relevant to this college institution
  const collegeQueries = (queries || []).filter(
    (q) => !q.collegeName || q.collegeName.includes('Bhartiya') || (q.targetApp || q.applicationId || '').includes('104')
  );

  const handleResponseChange = (queryId, text) => {
    setActiveResponses((prev) => ({ ...prev, [queryId]: text }));
  };

  const handleSubmitResponse = (queryId) => {
    const text = activeResponses[queryId]?.trim();
    if (!text) return;

    respondToQuery(queryId, text);
    setActiveResponses((prev) => ({ ...prev, [queryId]: '' }));
    setSuccessMessage(`Response to Query ${queryId} has been recorded and submitted to the AICTE Scrutiny Cell.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Description */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#102D52]">
            Official Scrutiny Queries &amp; Clarifications
          </h2>
          <p className="text-xs text-slate-500">
            Formal inquiries raised by assigned AICTE scrutiny officers during application audit.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
          {collegeQueries.filter((q) => q.status === 'Pending College Response').length} Pending Action
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Queries List */}
      <div className="space-y-5">
        {collegeQueries.map((q) => {
          const isPending = q.status === 'Pending College Response';
          const draftText = activeResponses[q.id] || '';

          return (
            <div
              key={q.id}
              className={`bg-white rounded-xl border p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                isPending ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
              }`}
            >
              {/* Query Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#102D52]">
                      Query #{q.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-xs text-slate-500">
                      Ref: {q.applicationId}
                    </span>
                    <StatusBadge status={q.status} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {q.subject}
                  </h3>
                </div>

                <div className="text-[11px] text-slate-500 font-mono shrink-0">
                  Issued: {q.date} · Response Due: {q.deadline}
                </div>
              </div>

              {/* Scrutiny Officer Inquiry Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex items-center space-x-2 text-slate-700 font-bold">
                  <UserCheck className="w-4 h-4 text-blue-800" />
                  <span>Officer Inquiry from {q.officer}</span>
                </div>
                <p className="text-slate-700 leading-relaxed pl-6">
                  {q.queryText}
                </p>
              </div>

              {/* Existing Response (if submitted) */}
              {q.collegeResponse && (
                <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200 text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-emerald-950 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Institutional Response Recorded</span>
                    </span>
                    {q.submittedAt && (
                      <span className="text-[10px] text-emerald-800 font-mono font-normal">
                        Submitted: {q.submittedAt}
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-900 leading-relaxed pl-5">
                    {q.collegeResponse}
                  </p>
                </div>
              )}

              {/* Response Input Form (if pending) */}
              {isPending && (
                <div className="space-y-3 pt-2">
                  <label htmlFor={`response-${q.id}`} className="block text-xs font-bold text-slate-800">
                    Enter College Clarification / Upload Reference:
                  </label>
                  <textarea
                    id={`response-${q.id}`}
                    rows={3}
                    value={draftText}
                    onChange={(e) => handleResponseChange(q.id, e.target.value)}
                    placeholder="Provide specific institutional explanations, reference numbers of uploaded documents, or committee resolution details..."
                    className="w-full p-3 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#102D52] bg-white text-slate-800"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={!draftText.trim()}
                      onClick={() => handleSubmitResponse(q.id)}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#102D52] hover:bg-[#1D4ED8] text-white shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Response &amp; Mark Ready for Scrutiny</span>
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
