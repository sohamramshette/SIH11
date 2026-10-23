import React, { useState } from 'react';
import {
  X,
  Send,
  HelpCircle,
  AlertTriangle,
  Building2,
  FileText,
} from 'lucide-react';

const QUERY_CATEGORIES = [
  'Faculty Cadre Deficiency',
  'Fire Safety Certificate Renewal',
  'Land Title & Ownership Clarification',
  'Student-to-Faculty Ratio (SFR)',
  'Built-up Space / Floor Space Index',
  'Mandatory Affidavits & Notary',
  'Other Scrutiny Query',
];

/**
 * ClarificationQueryModal Component
 * Allows a scrutiny officer to compose and issue a clarification query to an educational institution.
 */
const ClarificationQueryModal = ({
  isOpen,
  onClose,
  onSubmitQuery,
  applications = [],
  initialApplication = null,
}) => {
  const [selectedAppId, setSelectedAppId] = useState('');
  const [category, setCategory] = useState(QUERY_CATEGORIES[0]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [responseRequired, setResponseRequired] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const currentAppId = selectedAppId || initialApplication?.id || applications[0]?.id || '';
  const currentApp = applications.find((a) => a.id === currentAppId) || initialApplication;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentAppId) {
      setFormError('Please select a valid application.');
      return;
    }
    if (!subject.trim()) {
      setFormError('Please enter a query subject.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide a detailed scrutiny observation.');
      return;
    }
    if (!responseRequired.trim()) {
      setFormError('Please specify the required institutional response or document.');
      return;
    }

    const newQuery = {
      id: `CQ-${Math.floor(100 + Math.random() * 900)}`,
      applicationId: currentAppId,
      collegeName: currentApp ? currentApp.collegeName : 'Selected Educational Institution',
      category,
      subject: subject.trim(),
      officer: 'Dr. R. K. Sharma',
      dateIssued: 'Today (Simulated)',
      status: 'Pending College Response',
      description: description.trim(),
      responseRequired: responseRequired.trim(),
    };

    onSubmitQuery(newQuery);
    // Reset form fields
    setSelectedAppId('');
    setSubject('');
    setDescription('');
    setResponseRequired('');
    setFormError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-query-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#102D52] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-query-title" className="text-base font-bold text-white">
                Issue Scrutiny Clarification Query
              </h2>
              <p className="text-[11px] text-blue-200">
                Official institutional query regarding regulatory documentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
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
              Target Application & Institution
            </label>
            <div className="relative">
              <select
                value={currentAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.id} — {app.collegeName} ({app.applicationType})
                  </option>
                ))}
              </select>
            </div>
            {currentApp && (
              <div className="mt-1.5 flex items-center text-[11px] text-slate-500 space-x-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>AISHE: {currentApp.aisheCode}</span>
                <span>·</span>
                <span>Region: {currentApp.region}</span>
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Query Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            >
              {QUERY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Query Subject / Headline
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Cadre ratio deficiency in CSE department intake expansion"
              className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Scrutiny Observation / Deficit Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the exact deficiency observed under AICTE Approval Process Handbook (APH) 2026-27 norms..."
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Specific Response / Document Required */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Required Response / Mandatory Document to Submit
            </label>
            <div className="relative">
              <input
                type="text"
                value={responseRequired}
                onChange={(e) => setResponseRequired(e.target.value)}
                placeholder="e.g. Appointment letter and joining report for 1 Full Professor, signed by Governing Body"
                className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <FileText className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Prototype disclaimer */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-300/50 text-[11px] text-amber-900 flex items-start space-x-2">
            <span className="font-bold uppercase text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded mt-0.5">
              Simulated Query
            </span>
            <span>
              This form updates the local demonstration state for this prototype. No real communication is dispatched to external institutions.
            </span>
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
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Issue Query to College</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClarificationQueryModal;
