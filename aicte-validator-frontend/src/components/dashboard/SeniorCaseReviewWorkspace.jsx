import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  FileText,
  AlertOctagon,
  UserCheck,
  User,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  FileSignature,
  Eye,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * SeniorCaseReviewWorkspace Component (Phase 6)
 * Complete review workspace for senior officers with:
 * - Clear distinction between automated AI findings and human officer scrutiny
 * - Documents dossier
 * - College clarifications
 * - Escalation evidence summary
 * - Full simulated review timeline
 * - Direct decision action triggers
 */
const SeniorCaseReviewWorkspace = ({
  application,
  onBack,
  onOpenDecisionModal,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!application) return null;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Navigation & Status Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start space-x-3">
            <button
              type="button"
              onClick={onBack}
              className="mt-0.5 p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-[#102D52] hover:bg-slate-50 transition-colors"
              title="Return to review queue"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-mono font-black text-blue-900 text-base sm:text-lg">
                  {application.id}
                </span>
                <StatusBadge status={application.currentStatus} />
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {application.applicationType}
                </span>
                {application.urgency && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                      application.urgency === 'Critical'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : application.urgency === 'High'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}
                  >
                    {application.urgency} Urgency · {application.daysRemaining}d to SLA
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <div className="flex items-center space-x-1 font-bold text-slate-900">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{application.institutionName}</span>
                </div>
                <span>AISHE: <strong className="text-slate-800">{application.aisheCode}</strong></span>
                <span>Region: <strong className="text-slate-800">{application.region}</strong></span>
                <span>Cycle: <strong className="text-slate-800">{application.academicYear}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDecisionModal(application, 'return_review')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Return for Review</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenDecisionModal(application, 'clarification')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Ask Clarification</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenDecisionModal(application, 'recommendation')}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors shadow-2xs"
            >
              <FileSignature className="w-3.5 h-3.5 text-purple-600" />
              <span>Record Recommendation</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenDecisionModal(application, 'final_decision')}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>Final Demo Decision</span>
            </button>
          </div>
        </div>

        {/* Workspace Sub-Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 pt-3 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#102D52] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Case Overview &amp; Escalation
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'validation'
                ? 'bg-[#102D52] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Automated vs. Human Review
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'documents'
                ? 'bg-[#102D52] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Review Documents ({application.documents?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('clarifications')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'clarifications'
                ? 'bg-[#102D52] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Clarification History ({application.clarifications?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-[#102D52] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Simulated Audit Timeline
          </button>
        </div>
      </div>

      {/* TAB 1: Case Overview & Escalation Dossier */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Escalation Risk Banner (if applicable) */}
          {application.escalationReason && (
            <div className="bg-red-50/90 border border-red-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded">
                      ESCALATION REASON &amp; REGULATORY RISK
                    </span>
                    <span className="text-xs text-red-600 font-medium">
                      Escalated by {application.verificationOfficer?.name}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-red-950 mt-1">
                    {application.escalationReason}
                  </h3>
                  <p className="text-xs sm:text-sm text-red-900/90 mt-1.5 leading-relaxed">
                    {application.escalationSummary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Requested Program / Intake
              </span>
              <p className="text-sm font-black text-slate-900">{application.proposedIntake}</p>
              <p className="text-xs text-slate-500 mt-0.5">{application.stream}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Verification Desk
              </span>
              <p className="text-sm font-bold text-slate-900">{application.verificationOfficer?.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">ID: {application.verificationOfficer?.id} · {application.verificationOfficer?.desk}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Filing &amp; Deadline
              </span>
              <p className="text-sm font-bold text-slate-900">Submitted: {application.submissionDate}</p>
              <p className="text-xs text-amber-700 font-medium mt-0.5">Target SLA: {application.deadlineDate} ({application.daysRemaining} days left)</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Preliminary Check Verdict
              </span>
              <p className="text-sm font-black text-slate-900">{application.preliminaryOutcome}</p>
              <p className="text-xs text-slate-500 mt-0.5">{application.flaggedDocumentsCount} flagged documents</p>
            </div>
          </div>

          {/* Verification Officer Scrutiny Remarks Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center space-x-2.5 pb-3 mb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-900 flex items-center justify-center font-bold">
                <UserCheck className="w-4 h-4 text-indigo-700" />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#102D52]">
                  Verification Officer Scrutiny Observation
                </h4>
                <p className="text-[11px] text-slate-500">
                  Recorded by {application.verificationOfficer?.name} ({application.verificationOfficer?.desk})
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              "{application.officerNotes}"
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: Automated Preliminary Validation vs Human Review */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-900 flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <div>
              <strong>Multi-Tiered Inspection:</strong> AICTE regulatory validation uses a two-tier scrutiny architecture. First, automated optical and database engines execute rule checks. Second, human scrutiny officers inspect contextual evidence and discrepancies before senior escalation.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Column 1: Automated Preliminary Findings */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#102D52]">
                      Automated Preliminary Findings
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Machine / Algorithmic Rules Engine
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                  Automated OCR / GIS
                </span>
              </div>

              <div className="space-y-3">
                {application.preliminaryChecks?.map((chk) => (
                  <div
                    key={chk.ruleId}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {chk.ruleId}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{chk.title}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          chk.status === 'Passed'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : chk.status === 'Failed'
                            ? 'bg-red-100 text-red-900 border border-red-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {chk.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-1">{chk.details}</p>
                    <div className="text-[11px] text-blue-900 font-medium bg-blue-50/60 px-2 py-1 rounded border border-blue-100">
                      <strong>Automated Action:</strong> {chk.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Human Verification Review */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#102D52]">
                      Human Verification Officer Scrutiny
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Assigned Scrutiny Desk Audit
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                  Officer Certified
                </span>
              </div>

              {/* Officer Card */}
              <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-indigo-950">{application.verificationOfficer?.name}</p>
                  <p className="text-[11px] text-indigo-800">{application.verificationOfficer?.desk} · {application.verificationOfficer?.id}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-indigo-900 border border-indigo-200">
                  Assigned Examiner
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">Qualitative Officer Notes:</span>
                  <p className="text-slate-700 leading-relaxed italic">
                    "{application.officerNotes}"
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">Officer Preliminary Determination:</span>
                  <p className="text-slate-700">
                    Preliminary Outcome: <strong className="text-[#102D52]">{application.preliminaryOutcome}</strong>
                  </p>
                  {application.escalationReason && (
                    <p className="text-red-700 mt-1 font-medium">
                      Action Taken: Case flagged and escalated to Senior Directorate for statutory policy ruling.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Documents Listed for Review */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-[#102D52]">
                Uploaded Institutional Documents Dossier
              </h3>
              <p className="text-xs text-slate-500">
                Statutory uploads and optical extraction status for {application.id}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              {application.documents?.length || 0} Files Attached
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {application.documents?.map((doc) => (
              <div key={doc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {doc.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {doc.fileSize}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Optical Extraction / Findings:</strong> {doc.findings}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <StatusBadge status={doc.checkStatus} />
                  <button
                    type="button"
                    onClick={() => alert(`Simulated preview for: ${doc.name} (File ID: ${doc.id})`)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#102D52] hover:bg-slate-50 transition-colors"
                    title="Simulated Document Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Clarification Responses from College */}
      {activeTab === 'clarifications' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-[#102D52]">
                Scrutiny Clarifications &amp; Institutional Responses
              </h3>
              <p className="text-xs text-slate-500">
                Formal queries issued to {application.institutionName} and received replies
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenDecisionModal(application, 'clarification')}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Issue New Senior Query</span>
            </button>
          </div>

          {application.clarifications?.length > 0 ? (
            <div className="space-y-4">
              {application.clarifications.map((q) => (
                <div
                  key={q.queryId}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        {q.queryId}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{q.subject}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {q.status}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                      <span>Institutional Clarification Reply</span>
                      <span>Recorded: {q.replyDate}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      "{q.collegeReply}"
                    </p>
                    {q.attachment && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-blue-900 font-semibold">
                        <FileCheck2 className="w-3.5 h-3.5 text-blue-700" />
                        <span>Attached Evidence: {q.attachment}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No formal clarification queries recorded for this application dossier.
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Simulated Audit Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="pb-3 mb-4 border-b border-slate-100">
            <h3 className="text-sm font-black text-[#102D52]">
              Full Simulated Review Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Complete chronological audit trail of all regulatory actions on {application.id}
            </p>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {application.timeline?.map((step, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{step.stage}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{step.date}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Actor: {step.actor}
                  </div>
                  <p className="text-xs text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeniorCaseReviewWorkspace;
