import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  MessageSquare,
  FileSignature,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building2,
  Info,
} from 'lucide-react';

/**
 * SeniorDecisionModal Component (Phase 6)
 * Handles the 4 core Senior Officer workflows:
 * 1. Return for Further Review
 * 2. Request Additional Clarification
 * 3. Record Recommendation
 * 4. Record Final Demo Decision
 */
const SeniorDecisionModal = ({
  isOpen,
  onClose,
  application,
  defaultAction = 'final_decision',
  onConfirmDecision,
}) => {
  const [activeAction, setActiveAction] = useState(defaultAction);

  // Form fields
  const [returnInstructions, setReturnInstructions] = useState('');
  const [returnTurnaround, setReturnTurnaround] = useState('48 Hours (Standard)');
  const [reassignOfficer, setReassignOfficer] = useState(
    application?.verificationOfficer?.name || 'Dr. R. K. Sharma'
  );

  const [clarificationSubject, setClarificationSubject] = useState(
    application?.escalationReason ? `Clarification on: ${application.escalationReason}` : ''
  );
  const [clarificationDetails, setClarificationDetails] = useState('');
  const [mandatoryDocument, setMandatoryDocument] = useState('');
  const [clarificationDeadline, setClarificationDeadline] = useState('3 Days');

  const [recommendationType, setRecommendationType] = useState('Recommended for Scrutiny Board Approval');
  const [recommendationNotes, setRecommendationNotes] = useState('');
  const [targetBoardMeeting, setTargetBoardMeeting] = useState('Regional Scrutiny Board (28 Oct 2026)');

  const [verdict, setVerdict] = useState('Recommended for Provisional Approval (Demo)');
  const [decisionRationale, setDecisionRationale] = useState(
    application
      ? `Senior review conducted for ${application.institutionName}. Rationale based on evaluation of ${application.applicationType} dossier.`
      : ''
  );
  const [statutoryConditions, setStatutoryConditions] = useState('');
  const [ackDemo, setAckDemo] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen || !application) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    let payload = {};

    if (activeAction === 'return_review') {
      if (!returnInstructions.trim()) {
        setFormError('Please enter detailed re-scrutiny instructions for the verification officer.');
        return;
      }
      payload = {
        actionType: 'return_review',
        title: 'Returned for Further Review',
        newStatus: 'Returned to Verification Queue',
        statusSeverity: 'warning',
        assignedOfficer: reassignOfficer,
        instructions: returnInstructions,
        turnaround: returnTurnaround,
      };
    } else if (activeAction === 'clarification') {
      if (!clarificationSubject.trim() || !clarificationDetails.trim()) {
        setFormError('Please provide both the subject and specific clarification details required from the institution.');
        return;
      }
      payload = {
        actionType: 'clarification',
        title: 'Additional Clarification Requested',
        newStatus: 'Clarification Awaited',
        statusSeverity: 'warning',
        subject: clarificationSubject,
        details: clarificationDetails,
        mandatoryDocument: mandatoryDocument || 'Official Attested Clarification Affidavit',
        deadline: clarificationDeadline,
      };
    } else if (activeAction === 'recommendation') {
      if (!recommendationNotes.trim()) {
        setFormError('Please provide advisory notes and recommendation rationale.');
        return;
      }
      payload = {
        actionType: 'recommendation',
        title: 'Senior Recommendation Recorded',
        newStatus: 'Recommendation Recorded',
        statusSeverity: 'info',
        recommendationType,
        notes: recommendationNotes,
        targetBoardMeeting,
      };
    } else if (activeAction === 'final_decision') {
      if (!decisionRationale.trim()) {
        setFormError('Formal decision rationale is required to record the simulated verdict.');
        return;
      }
      if (!ackDemo) {
        setFormError('You must acknowledge the prototype simulation notice.');
        return;
      }
      payload = {
        actionType: 'final_decision',
        title: 'Final Demo Decision Recorded',
        newStatus: verdict.includes('Approved')
          ? 'Provisional Approval Granted (Demo)'
          : verdict.includes('Withheld')
          ? 'Approval Withheld (Demo)'
          : 'Decision Recorded',
        statusSeverity: verdict.includes('Approved')
          ? 'success'
          : verdict.includes('Withheld')
          ? 'warning'
          : 'danger',
        verdict,
        rationale: decisionRationale,
        conditions: statutoryConditions,
      };
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmDecision(application.id, payload);
      onClose();
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="decision-modal-title"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 text-slate-800 animate-fadeIn my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold shadow-xs">
              <FileSignature className="w-5 h-5 text-purple-800" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Senior Directorate Decision Workflow
              </span>
              <h2 id="decision-modal-title" className="text-lg font-black text-[#102D52] mt-0.5">
                Take Senior Action on Application
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Case Context Card */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-5 flex items-start justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-blue-900 text-xs sm:text-sm">{application.id}</span>
              <span className="text-slate-400">·</span>
              <span className="font-semibold text-slate-700">{application.applicationType}</span>
            </div>
            <div className="font-bold text-slate-900 mt-0.5 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{application.institutionName}</span>
              <span className="text-slate-500 font-normal">({application.aisheCode})</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 shrink-0">
            {application.currentStatus}
          </span>
        </div>

        {/* Action Type Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setActiveAction('return_review')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-center border text-xs font-bold transition-all ${
              activeAction === 'return_review'
                ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <RotateCcw className="w-4 h-4 mb-1 text-amber-600" />
            <span>Return for Review</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAction('clarification')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-center border text-xs font-bold transition-all ${
              activeAction === 'clarification'
                ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4 mb-1 text-blue-600" />
            <span>Request Clarification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAction('recommendation')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-center border text-xs font-bold transition-all ${
              activeAction === 'recommendation'
                ? 'bg-purple-50 border-purple-400 text-purple-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileSignature className="w-4 h-4 mb-1 text-purple-700" />
            <span>Record Recommendation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAction('final_decision')}
            className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-center border text-xs font-bold transition-all ${
              activeAction === 'final_decision'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 mb-1 text-emerald-600" />
            <span>Final Demo Decision</span>
          </button>
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-semibold">{formError}</span>
          </div>
        )}

        {/* Dynamic Action Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ACTION 1: Return for Further Review */}
          {activeAction === 'return_review' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900">
                <strong>Handoff Notice:</strong> Returning this dossier sends it back to the scrutiny desk with senior instructions for re-examination of specific physical evidence or calculations.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Re-Scrutiny Directives &amp; Focus Areas <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={returnInstructions}
                  onChange={(e) => setReturnInstructions(e.target.value)}
                  placeholder="e.g. Scrutinize original Discom electricity bills to verify connected transformer load matches declared 250 kVA capacity. Request certified physical inspection challan."
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Assign To Verification Officer
                  </label>
                  <select
                    value={reassignOfficer}
                    onChange={(e) => setReassignOfficer(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Dr. R. K. Sharma (AICTE-SCR-202)">Dr. R. K. Sharma (Central Desk #4)</option>
                    <option value="Dr. Ananya Sen (AICTE-SCR-205)">Dr. Ananya Sen (Western Desk #2)</option>
                    <option value="Prof. V. K. Iyer (AICTE-SCR-208)">Prof. V. K. Iyer (Central Desk #7)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Turnaround SLA
                  </label>
                  <select
                    value={returnTurnaround}
                    onChange={(e) => setReturnTurnaround(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="24 Hours (Urgent SLA)">24 Hours (Urgent SLA)</option>
                    <option value="48 Hours (Standard)">48 Hours (Standard)</option>
                    <option value="72 Hours (Detailed Inquest)">72 Hours (Detailed Inquest)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ACTION 2: Request Additional Clarification */}
          {activeAction === 'clarification' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900">
                <strong>Institutional Query:</strong> Directs a senior inquiry to the college nodal officer. The application status will update to <em>Clarification Awaited</em>.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Clarification Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clarificationSubject}
                  onChange={(e) => setClarificationSubject(e.target.value)}
                  placeholder="e.g. Formal Show-Cause on Relieving Certificate for CSE Cadre"
                  className="w-full p-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Specific Query Details &amp; Legal Mandate <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={clarificationDetails}
                  onChange={(e) => setClarificationDetails(e.target.value)}
                  placeholder="Specify the regulatory clause from AICTE Approval Process Handbook (APH 2026-27) and the exact evidence required."
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Mandatory Attachment Required
                  </label>
                  <input
                    type="text"
                    value={mandatoryDocument}
                    onChange={(e) => setMandatoryDocument(e.target.value)}
                    placeholder="e.g. Relieving Order / Certified PWD Certificate"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Response Window
                  </label>
                  <select
                    value={clarificationDeadline}
                    onChange={(e) => setClarificationDeadline(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="3 Days">3 Calendar Days (Strict Deadline)</option>
                    <option value="5 Days">5 Calendar Days (Standard)</option>
                    <option value="7 Days">7 Calendar Days (Statutory Affidavits)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ACTION 3: Record Recommendation */}
          {activeAction === 'recommendation' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg text-xs text-purple-900">
                <strong>Advisory Note:</strong> Records an executive senior advisory opinion for placement before the Regional Scrutiny Board or National Executive Committee.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Recommendation Category
                </label>
                <select
                  value={recommendationType}
                  onChange={(e) => setRecommendationType(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Recommended for Scrutiny Board Approval">Recommended for Scrutiny Board Approval</option>
                  <option value="Conditional Approval Subject to Time-Bound Undertaking">Conditional Approval Subject to Time-Bound Undertaking</option>
                  <option value="Refer to Physical Expert Visit Committee (EVC)">Refer to Physical Expert Visit Committee (EVC)</option>
                  <option value="Refer to Standing Hearing Committee (SHC)">Refer to Standing Hearing Committee (SHC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Advisory Notes &amp; Risk Assessment <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={recommendationNotes}
                  onChange={(e) => setRecommendationNotes(e.target.value)}
                  placeholder="Record formal appraisal notes, mitigation measures, and recommended board actions..."
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Target Statutory Forum
                </label>
                <input
                  type="text"
                  value={targetBoardMeeting}
                  onChange={(e) => setTargetBoardMeeting(e.target.value)}
                  placeholder="e.g. Regional Scrutiny Board Meeting on 28 Oct 2026"
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* ACTION 4: Record Final Demo Decision */}
          {activeAction === 'final_decision' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-950">
                <strong>Simulated Final Verdict:</strong> Record the simulated senior determination for this application dossier within the SIH prototype workflow.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Simulated Determination
                </label>
                <select
                  value={verdict}
                  onChange={(e) => setVerdict(e.target.value)}
                  className="w-full p-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white font-bold text-[#102D52] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Recommended for Provisional Approval (Demo)">
                    Recommended for Provisional Approval (Demo)
                  </option>
                  <option value="Approval Withheld Pending Compliance (Demo)">
                    Approval Withheld Pending Compliance (Demo)
                  </option>
                  <option value="Rejected for Regulatory Non-Compliance (Demo)">
                    Rejected for Regulatory Non-Compliance (Demo)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Decision Rationale &amp; Evidence Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={decisionRationale}
                  onChange={(e) => setDecisionRationale(e.target.value)}
                  placeholder="Enter substantive rationale referencing verified documents, cadre ratios, and safety NOCs..."
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Compliance Conditions / Undertaking Requirements (Optional)
                </label>
                <input
                  type="text"
                  value={statutoryConditions}
                  onChange={(e) => setStatutoryConditions(e.target.value)}
                  placeholder="e.g. Subject to submission of permanent Municipal Fire Safety endorsement within 60 days."
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Prototype Notice & Checkbox */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="ackDemoDecision"
                  checked={ackDemo}
                  onChange={(e) => setAckDemo(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-amber-400 text-purple-900 focus:ring-purple-900"
                />
                <label htmlFor="ackDemoDecision" className="text-[11px] text-amber-950 leading-snug cursor-pointer select-none">
                  <strong>Prototype Simulation Acknowledgment:</strong> I understand that this decision is strictly simulated for SIH 26261 prototype demonstration. No legal or official AICTE regulatory order has been issued.
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Simulated state update</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-all disabled:opacity-60 ${
                  activeAction === 'return_review'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : activeAction === 'clarification'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : activeAction === 'recommendation'
                    ? 'bg-purple-700 hover:bg-purple-800'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Record...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Record Action</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeniorDecisionModal;
