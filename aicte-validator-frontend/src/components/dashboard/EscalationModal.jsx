import React, { useState } from 'react';
import {
  X,
  AlertOctagon,
  AlertTriangle,
  Building2,
  ShieldAlert,
} from 'lucide-react';

const ESCALATION_REASONS = [
  'Possible Inconsistency: Duplicate Faculty Profile Detected Across Institutions',
  'Missing Information: Statutory Structural Stability Endorsement Missing',
  'Possible Inconsistency: Land Survey Plot Boundary Mismatch with Registry',
  'Severe Cadre Ratio Deficit in Technical Program Intake Expansion',
  'Expired Civic Safety Clearance Prior to Academic Year Session',
  'Other Critical Scrutiny Discrepancy Requiring Senior Evaluation',
];

const SENIOR_AUTHORITIES = [
  'Regional Director (Central Region) & Scrutiny Board',
  'Directorate Approval Committee (AICTE HQ)',
  'Standing Hearing Committee (SHC)',
  'Executive Committee Review Panel',
];

/**
 * EscalationModal Component
 * Allows a scrutiny officer to formally escalate an application with suspected discrepancies
 * or missing mandatory endorsements to senior regional authorities.
 */
const EscalationModal = ({
  isOpen,
  onClose,
  onSubmitEscalation,
  applications = [],
  initialApplication = null,
}) => {
  const [selectedAppId, setSelectedAppId] = useState('');
  const [reason, setReason] = useState(ESCALATION_REASONS[0]);
  const [evidenceSummary, setEvidenceSummary] = useState('');
  const [recommendedNextStep, setRecommendedNextStep] = useState('');
  const [seniorAuthority, setSeniorAuthority] = useState(SENIOR_AUTHORITIES[0]);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const currentAppId = selectedAppId || initialApplication?.id || applications[0]?.id || '';
  const currentApp = applications.find((a) => a.id === currentAppId) || initialApplication;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentAppId) {
      setFormError('Please select an application to escalate.');
      return;
    }
    if (!evidenceSummary.trim()) {
      setFormError('Please summarize the evidence or discrepancy details.');
      return;
    }
    if (!recommendedNextStep.trim()) {
      setFormError('Please propose a recommended regulatory next step.');
      return;
    }

    const newEscalation = {
      id: `ESC-${Math.floor(400 + Math.random() * 599)}`,
      applicationId: currentAppId,
      collegeName: currentApp ? currentApp.collegeName : 'Selected Institution',
      reason,
      evidenceSummary: evidenceSummary.trim(),
      recommendedNextStep: recommendedNextStep.trim(),
      seniorAuthority,
      status: `Escalated to ${seniorAuthority.split(' ')[0]} ${seniorAuthority.split(' ')[1] || ''}`,
      timestamp: 'Just now (Simulated)',
    };

    onSubmitEscalation(newEscalation);
    setSelectedAppId('');
    setEvidenceSummary('');
    setRecommendedNextStep('');
    setFormError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-escalation-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-red-950 text-white px-6 py-4 flex items-center justify-between border-b border-red-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold shadow-xs">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-escalation-title" className="text-base font-bold text-white">
                Escalate Application to Senior Authority
              </h2>
              <p className="text-[11px] text-red-200">
                Formal referral for unresolved discrepancies or policy non-compliance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-red-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{formError}</span>
            </div>
          )}

          {/* Application Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Application for Senior Escalation
            </label>
            <select
              value={currentAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.id} — {app.collegeName} ({app.applicationType})
                </option>
              ))}
            </select>
            {currentApp && (
              <div className="mt-1.5 flex items-center text-[11px] text-slate-500 space-x-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>AISHE: {currentApp.aisheCode}</span>
                <span>·</span>
                <span>Current Status: {currentApp.currentStatus}</span>
              </div>
            )}
          </div>

          {/* Escalation Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Primary Reason for Escalation
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            >
              {ESCALATION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Target Senior Authority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Refer to Senior Regulatory Authority
            </label>
            <select
              value={seniorAuthority}
              onChange={(e) => setSeniorAuthority(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white"
            >
              {SENIOR_AUTHORITIES.map((auth) => (
                <option key={auth} value={auth}>
                  {auth}
                </option>
              ))}
            </select>
          </div>

          {/* Evidence Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Evidence Summary & Inconsistency Findings
            </label>
            <textarea
              rows={3}
              value={evidenceSummary}
              onChange={(e) => setEvidenceSummary(e.target.value)}
              placeholder="Provide specific document references, optical extraction mismatches, or rule violation details..."
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Recommended Next Step */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Recommended Scrutiny Next Step
            </label>
            <input
              type="text"
              value={recommendedNextStep}
              onChange={(e) => setRecommendedNextStep(e.target.value)}
              placeholder="e.g. Conduct Joint Regional Physical Inspection or withhold intake expansion until personal hearing"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Prototype Simulation Notice */}
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-300/40 text-[11px] text-red-950 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Simulated Escalation Workflow:</span>
              <span className="ml-1 text-slate-700">
                This logs an escalation event in the local demonstration audit ledger. No actual regulatory proceedings or penalties are initiated.
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-sm transition-colors"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Submit Formal Escalation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EscalationModal;
