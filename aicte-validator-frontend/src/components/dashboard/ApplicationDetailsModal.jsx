import React from 'react';
import StatusBadge from './StatusBadge';
import {
  X,
  Building2,
  FileText,
  UserCheck,
  Printer,
} from 'lucide-react';

/**
 * ApplicationDetailsModal Component
 * Full inspection modal for an institutional application dossier.
 */
const ApplicationDetailsModal = ({ application, onClose }) => {
  if (!application) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-app-title"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 text-slate-800 animate-fadeIn overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#102D52] text-white p-5 flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center font-bold text-amber-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                Application Scrutiny Dossier
              </div>
              <h2 id="modal-app-title" className="text-base sm:text-lg font-black text-white leading-tight">
                {application.id}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-900 focus:outline-none"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Headline Banner */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#102D52]">
              {application.collegeName}
            </h3>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              AISHE Code: {application.aisheCode} · Region: {application.region}
            </div>
          </div>
          <StatusBadge status={application.currentStatus} />
        </div>

        {/* Main Content Body */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {/* Key Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Application Type</span>
              <span className="font-semibold text-slate-800">{application.applicationType}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Submission Date</span>
              <span className="font-semibold text-slate-800">{application.submissionDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Academic Session</span>
              <span className="font-semibold text-slate-800">{application.academicYear}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Approved Stream</span>
              <span className="font-semibold text-slate-800">{application.stream}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Documents Uploaded</span>
              <span className="font-semibold text-slate-800">{application.documentsCount} Files</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Assigned Scrutiny Officer</span>
              <span className="font-semibold text-slate-800">{application.assignedOfficer}</span>
            </div>
          </div>

          {/* Compliance Calculus Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-800" />
              <span>APH Handbook Compliance Parameters</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 block font-semibold">Titled Land Area</span>
                <span className="text-sm font-bold text-[#102D52]">{application.landAreaAcres} Acres</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Norm: ≥ 7.0 Acres (Valid)</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 block font-semibold">Built-Up Floor Space</span>
                <span className="text-sm font-bold text-[#102D52]">{application.builtUpAreaSqM.toLocaleString()} sq.m</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">FSI Compliance Verified</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 block font-semibold">Faculty Cadre Ratio</span>
                <span className="text-sm font-bold text-[#102D52]">{application.cadreRatioReported}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Norm: 1:15 Cadre Matrix</span>
              </div>
            </div>
          </div>

          {/* Summary Remarks */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg">
            <span className="text-xs font-bold text-[#102D52] block mb-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-800" />
              <span>Scrutiny Committee Observations &amp; Verification Remarks</span>
            </span>
            <p className="text-xs text-blue-950 leading-relaxed">
              {application.summaryRemarks}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-[11px] text-slate-500">
            Simulated record for SIH 26261 prototype demonstration.
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#102D52] text-white font-bold hover:bg-[#1D4ED8]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
