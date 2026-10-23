import React, { useState } from 'react';
import {
  FileCheck2,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  AlertOctagon,
  Save,
  Check,
  ShieldAlert,
  ChevronRight,
  Clock,
  Layers,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

// Neutral Scrutiny Outcome Choices
const REVIEW_OUTCOMES = [
  {
    id: 'Preliminary Check Passed',
    label: 'Preliminary Check Passed',
    description: 'Document structure, declared figures, and mandatory fields satisfy initial APH guidelines.',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'Missing Information',
    label: 'Missing Information',
    description: 'Mandatory endorsement, renewal stamp, or supporting annexure is missing from dossier.',
    color: 'amber',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'Possible Inconsistency',
    label: 'Possible Inconsistency',
    description: 'Reconciled figures or extracted credentials conflict with statutory norms or rosters.',
    color: 'rose',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    id: 'Manual Verification Required',
    label: 'Manual Verification Required',
    description: 'Complex technical parameters or site boundary drawings require Senior Board inspection.',
    color: 'indigo',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
];

/**
 * DocumentReviewWorkspace Component
 * Specialized scrutiny workspace for examining application dossiers, synthetic OCR extractions,
 * recording notes, and selecting neutral review outcomes.
 */
const DocumentReviewWorkspace = ({
  applications = [],
  selectedApp = null,
  onSelectApp,
  onSaveNotes,
  onCompleteReview,
  onOpenClarification,
  onOpenEscalation,
}) => {
  // If no application selected, default to the first one
  const currentApp = selectedApp || applications[0] || null;

  // Selected document within the application
  const [selectedDocId, setSelectedDocId] = useState(
    currentApp?.documents?.[0]?.id || ''
  );
  const [reviewNotes, setReviewNotes] = useState(currentApp?.reviewNotes || '');
  const [selectedOutcome, setSelectedOutcome] = useState(
    currentApp?.currentStatus === 'Possible Inconsistency'
      ? 'Possible Inconsistency'
      : currentApp?.currentStatus === 'Scrutiny Passed'
      ? 'Preliminary Check Passed'
      : 'Preliminary Check Passed'
  );
  const [notesSavedFeedback, setNotesSavedFeedback] = useState(false);
  const [reviewActionFeedback, setReviewActionFeedback] = useState('');

  if (!currentApp) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-semibold">No assigned application available for review.</p>
      </div>
    );
  }

  const selectedDoc =
    currentApp.documents?.find((d) => d.id === selectedDocId) ||
    currentApp.documents?.[0] ||
    null;

  const handleSaveNotesClick = () => {
    if (onSaveNotes) {
      onSaveNotes(currentApp.id, reviewNotes);
    }
    setNotesSavedFeedback(true);
    setTimeout(() => setNotesSavedFeedback(false), 2500);
  };

  const handleFinalizeOutcome = () => {
    if (onCompleteReview) {
      onCompleteReview(currentApp.id, selectedOutcome, reviewNotes);
    }
    setReviewActionFeedback(`Scrutiny review recorded as: "${selectedOutcome}"`);
    setTimeout(() => setReviewActionFeedback(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Application Switcher & Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {currentApp.id}
                </span>
                <span className="text-sm font-extrabold text-[#102D52]">
                  {currentApp.collegeName}
                </span>
                <StatusBadge status={currentApp.currentStatus} />
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>AISHE: <strong className="text-slate-700">{currentApp.aisheCode}</strong></span>
                <span>·</span>
                <span>Type: <strong className="text-slate-700">{currentApp.applicationType}</strong></span>
                <span>·</span>
                <span>Academic Cycle: <strong className="text-slate-700">{currentApp.academicYear}</strong></span>
                <span>·</span>
                <span>Region: <strong className="text-slate-700">{currentApp.region}</strong></span>
              </div>
            </div>
          </div>

          {/* Application Selector Dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <label className="text-xs font-semibold text-slate-600 hidden sm:block">
              Switch Application:
            </label>
            <select
              value={currentApp.id}
              onChange={(e) => {
                const target = applications.find((a) => a.id === e.target.value);
                if (target && onSelectApp) onSelectApp(target);
              }}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} — {app.collegeName.split(' ')[0]} ({app.priority} Priority)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Feedback Message */}
        {reviewActionFeedback && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{reviewActionFeedback}</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded">
              Updated in Local Demo State
            </span>
          </div>
        )}

        {/* Persistent Non-Authentication Disclaimer */}
        <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-300/40 text-xs text-amber-950 flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span className="font-bold">Regulatory Prototype Notice:</span> Document previews and extracted fields are generated using synthetic demonstration data. This interface does not claim that files are authentic, signatures are genuine, or certificates have been verified against official municipal, state, or central databases.
          </div>
        </div>
      </div>

      {/* Main Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Document Checklist */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-900" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Submitted Documents ({currentApp.documents?.length || 0})
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">
                APH 2026-27 Dossier
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {currentApp.documents?.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                const isPassed = doc.checkStatus === 'Preliminary Check Passed';
                const isWarning = doc.checkStatus === 'Review Required' || doc.checkStatus === 'Missing Information';

                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-l-blue-700'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-700' : 'text-slate-400'}`} />
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                          {doc.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mb-1.5">
                        Category: {doc.category}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isPassed
                              ? 'bg-emerald-100 text-emerald-800'
                              : isWarning
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {doc.checkStatus}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 mt-1 shrink-0 ${isSelected ? 'text-blue-700' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Regulatory Checklist Summary */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Submission Timeline</span>
            </h4>
            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Submitted Date:</span>
                <strong className="text-slate-800">{currentApp.submissionDate}</strong>
              </div>
              <div className="flex justify-between">
                <span>Review Priority:</span>
                <span className="font-bold text-amber-800">{currentApp.priority}</span>
              </div>
              <div className="flex justify-between">
                <span>Mandatory Documents:</span>
                <strong className="text-slate-800">{currentApp.documentsCount} Files Attached</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Document Inspection & Review Actions */}
        <div className="lg:col-span-8 space-y-6">
          {selectedDoc ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {selectedDoc.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {selectedDoc.id}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#102D52] mt-1">
                    {selectedDoc.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500 font-medium">Status:</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {selectedDoc.status}
                  </span>
                </div>
              </div>

              {/* Extracted Fields Table (Synthetic Data) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-700" />
                    <span>Extracted Fields Preview (Simulated Extraction)</span>
                  </h4>
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    Synthetic Demo OCR
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="px-4 py-2.5 w-1/3">Extracted Parameter</th>
                        <th className="px-4 py-2.5">Extracted Value / Scrutiny Indicator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedDoc.extractedFields?.map((field, fIdx) => (
                        <tr key={fIdx} className="hover:bg-white transition-colors">
                          <td className="px-4 py-2.5 font-semibold text-slate-700">
                            {field.label}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-slate-900">
                            {field.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Review Notes Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="review-notes-textarea"
                    className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-blue-700" />
                    <span>Scrutiny Officer Review Notes</span>
                  </label>
                  {notesSavedFeedback && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded animate-fadeIn flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Notes Saved Locally</span>
                    </span>
                  )}
                </div>

                <textarea
                  id="review-notes-textarea"
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Record scrutiny observations, discrepancies noted, or statutory references for this application..."
                  className="w-full text-xs p-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNotesClick}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-300 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-600" />
                    <span>Save Scrutiny Notes</span>
                  </button>
                </div>
              </div>

              {/* Neutral Scrutiny Outcomes Selector */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Preliminary Scrutiny Outcome:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {REVIEW_OUTCOMES.map((outcome) => {
                    const isSelected = selectedOutcome === outcome.id;

                    return (
                      <button
                        key={outcome.id}
                        type="button"
                        onClick={() => setSelectedOutcome(outcome.id)}
                        className={`text-left p-3 rounded-lg border text-xs transition-all ${
                          isSelected
                            ? 'ring-2 ring-blue-700 border-transparent shadow-xs bg-blue-50/50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{outcome.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-700" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {outcome.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Primary Officer Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenClarification && onOpenClarification(currentApp)}
                      className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Request Clarification</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenEscalation && onOpenEscalation(currentApp)}
                      className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-red-900 bg-red-100 hover:bg-red-200 rounded-lg border border-red-300 transition-colors"
                    >
                      <AlertOctagon className="w-3.5 h-3.5 text-red-700" />
                      <span>Escalate to Senior Officer</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinalizeOutcome}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Review as Completed</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              <p className="text-xs">Select a document from the checklist on the left to examine extracted fields.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentReviewWorkspace;
