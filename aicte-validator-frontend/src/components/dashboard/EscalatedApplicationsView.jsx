import React, { useState } from 'react';
import {
  AlertOctagon,
  ArrowRight,
  RotateCcw,
  FileSignature,
  CheckCircle2,
  Edit3,
  Building2,
  Clock,
  Search,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * EscalatedApplicationsView Component (Phase 7)
 * Dedicated queue for high-risk escalated cases with reasons,
 * previous review actions, pending information, and senior actions.
 */
const EscalatedApplicationsView = ({
  applications,
  onOpenCase,
  onOpenDecisionModal,
  onUpdateNotes,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Filter only escalated cases or cases requiring senior attention
  const escalatedList = applications.filter((app) => {
    const isEscalated =
      app.currentStatus === 'Escalated' ||
      app.urgency === 'Critical' ||
      (app.escalationReason && !app.currentStatus.includes('Decision Recorded'));

    const matchesSearch =
      app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.escalationReason && app.escalationReason.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'ALL' ||
      (categoryFilter === 'FACULTY' && app.escalationReason?.toLowerCase().includes('faculty')) ||
      (categoryFilter === 'SAFETY' && (app.escalationReason?.toLowerCase().includes('structural') || app.escalationReason?.toLowerCase().includes('fire'))) ||
      (categoryFilter === 'CADRE' && (app.escalationReason?.toLowerCase().includes('cadre') || app.escalationReason?.toLowerCase().includes('sfr')));

    return isEscalated && matchesSearch && matchesCategory;
  });

  const handleStartEditNotes = (app) => {
    setEditingNotesId(app.id);
    setNoteText(app.officerNotes || '');
  };

  const handleSaveNotes = (appId) => {
    onUpdateNotes(appId, noteText);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* View Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#102D52]">
                Escalated Applications &amp; Regulatory Anomalies
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Applications referred by scrutiny officers for policy exception, statutory violation inquiry, or executive ruling.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-900 border border-red-200 shrink-0 self-start sm:self-auto">
            {escalatedList.length} Active Escalated Cases
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search escalated cases or institutions..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto text-xs font-bold">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider hidden sm:inline">Filter:</span>
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                categoryFilter === 'ALL'
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Anomalies
            </button>
            <button
              onClick={() => setCategoryFilter('FACULTY')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                categoryFilter === 'FACULTY'
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Duplicate Faculty
            </button>
            <button
              onClick={() => setCategoryFilter('SAFETY')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                categoryFilter === 'SAFETY'
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Safety / PWD Seals
            </button>
            <button
              onClick={() => setCategoryFilter('CADRE')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                categoryFilter === 'CADRE'
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cadre &amp; SFR Deficiencies
            </button>
          </div>
        </div>
      </div>

      {/* Escalated Cases List */}
      <div className="space-y-4">
        {escalatedList.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-xl border border-red-200/80 shadow-xs hover:border-red-300 transition-all p-5"
          >
            {/* Top row: App ID, Institution, Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-black text-blue-900 text-sm">{app.id}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-700">{app.applicationType}</span>
                <StatusBadge status={app.currentStatus} />
                {app.urgency && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-200">
                    {app.urgency} Escalation
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Review SLA: {app.deadlineDate} ({app.daysRemaining}d remaining)</span>
              </div>
            </div>

            {/* Institution Header */}
            <div className="pt-3 pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>{app.institutionName}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AISHE: {app.aisheCode} · {app.region} · Proposed Intake: <strong>{app.proposedIntake}</strong>
                </p>
              </div>

              <div className="hidden md:block text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Assigned Reviewer
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {app.verificationOfficer?.name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {app.verificationOfficer?.desk}
                </span>
              </div>
            </div>

            {/* Escalation Risk Detail Banner */}
            <div className="bg-red-50/70 border border-red-200 rounded-lg p-3.5 my-3">
              <div className="flex items-start space-x-2.5">
                <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-black text-red-950">
                    Escalation Cause: {app.escalationReason}
                  </h4>
                  <p className="text-xs text-red-900/90 mt-1 leading-relaxed">
                    {app.escalationSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Previous Review Actions & Pending Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">
                  Previous Review Actions Taken:
                </span>
                <p className="text-slate-600">
                  {app.clarifications?.length > 0
                    ? `Issued Clarification Query ${app.clarifications[0].queryId} regarding ${app.clarifications[0].subject}. Response: ${app.clarifications[0].status}.`
                    : 'Scrutiny officer completed preliminary automated checks and immediately flagged for senior policy review.'}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-1">
                  Pending Information / Deficiencies:
                </span>
                <p className="text-slate-600">
                  {app.clarifications?.length > 0 && app.clarifications[0].attachment
                    ? `Received "${app.clarifications[0].attachment}", awaiting senior validation of statutory sufficiency.`
                    : 'Awaiting certified government evidence, relieving order, or institutional undertaking.'}
                </p>
              </div>
            </div>

            {/* Editable Notes Section */}
            <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 text-xs mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800">Review Notes:</span>
                {editingNotesId !== app.id ? (
                  <button
                    type="button"
                    onClick={() => handleStartEditNotes(app)}
                    className="inline-flex items-center space-x-1 text-[11px] font-bold text-purple-700 hover:text-purple-900"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Notes</span>
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingNotesId(null)}
                      className="text-[11px] text-slate-500 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveNotes(app.id)}
                      className="text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      Save Notes
                    </button>
                  </div>
                )}
              </div>

              {editingNotesId === app.id ? (
                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-2 text-xs border border-purple-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              ) : (
                <p className="text-slate-700 italic">
                  "{app.officerNotes || 'No additional senior notes recorded.'}"
                </p>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onOpenCase(app)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#102D52] hover:bg-[#1D4ED8] transition-colors shadow-2xs"
              >
                <span>Open in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenDecisionModal(app, 'return_review')}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Return to Queue</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenDecisionModal(app, 'recommendation')}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <FileSignature className="w-3.5 h-3.5 text-purple-600" />
                  <span>Recommendation</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenDecisionModal(app, 'final_decision')}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Record Decision</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {escalatedList.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            No escalated cases match your active filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default EscalatedApplicationsView;
