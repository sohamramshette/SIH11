import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  Info,
  Search,
} from 'lucide-react';
import StatusBadge from '../dashboard/StatusBadge';

/**
 * SystemPreviewSection Component
 * Compact preview of the actual implemented scrutiny interface for the landing page.
 * Displays:
 * 1. Application record with review status
 * 2. Document checklist (verified, review-required, missing)
 * 3. Flagged inconsistency for human review
 * 4. Synthetic demonstration data notice
 */
const SystemPreviewSection = () => {
  const sampleRecord = {
    id: 'APP-2026-ENG-1042',
    collegeName: 'Bhartiya Institute of Technology & Science',
    aisheCode: 'C-49210',
    region: 'Central Region (Bhopal)',
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2026-27',
    stream: 'Engineering & Technology',
    status: 'Under Review',
  };

  const documentChecklist = [
    {
      id: 'doc-1',
      title: 'Land Ownership Title Deed',
      category: 'Land Documents',
      summary: '7.50 Acres (Contiguous Plot) · Encumbrance-Free',
      status: 'Verified',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    {
      id: 'doc-2',
      title: 'Master Building Plan & FSI Occupancy',
      category: 'Infrastructure',
      summary: '14,200 sq.m Built-up Area · FSI 1.42 (Within Limit)',
      status: 'Verified',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    {
      id: 'doc-3',
      title: 'Fire & Emergency Safety Clearance',
      category: 'Safety Clearances',
      summary: 'Certificate FSC-BPL-2025/890 · Renewal Stamp Pending',
      status: 'Review Required',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
    },
    {
      id: 'doc-4',
      title: 'Structural Stability & Soundness Certificate',
      category: 'Safety Clearances',
      summary: 'Mandatory endorsement not detected in uploaded packet',
      status: 'Missing Item',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: XCircle,
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <section id="system-preview" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-b border-slate-200 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-[#102D52] text-xs font-bold uppercase tracking-wider mb-3 border border-blue-200">
            <Search className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Interactive Prototype Walkthrough</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#102D52] tracking-tight leading-tight mb-3">
            See How the System Works
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            A realistic preview showing how institutional applications, uploaded documents, and automated validation flags are organized for authorized officer scrutiny.
          </p>
        </div>

        {/* Compact System Preview Console Card */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
          {/* Top Application Record Bar */}
          <div className="bg-[#102D52] text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-950">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-blue-900/60 border border-blue-700/60 text-amber-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-blue-200 tracking-wider">
                    {sampleRecord.id}
                  </span>
                  <span className="text-xs text-blue-300">·</span>
                  <span className="text-xs font-semibold text-blue-100">
                    AISHE: {sampleRecord.aisheCode}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {sampleRecord.collegeName}
                </h3>
                <div className="text-xs text-blue-200 flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                  <span>{sampleRecord.region}</span>
                  <span>·</span>
                  <span>{sampleRecord.stream}</span>
                  <span>·</span>
                  <span>{sampleRecord.applicationType} ({sampleRecord.academicYear})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-start md:self-center">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                  Application Status
                </div>
                <div className="text-xs text-blue-100">
                  Scrutiny in progress
                </div>
              </div>
              <StatusBadge status={sampleRecord.status} className="bg-white/10 text-white border-white/20" />
            </div>
          </div>

          {/* Scrutiny Preview Body: 2 Columns */}
          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/40">
            {/* Left: Document Verification Checklist (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#102D52]" />
                    <h4 className="text-sm font-bold text-[#102D52]">
                      Document Submission Checklist
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    4 Core Mandatory Records
                  </span>
                </div>

                <div className="space-y-2.5">
                  {documentChecklist.map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <div
                        key={doc.id}
                        className="bg-white p-3 rounded-lg border border-slate-200 flex items-start justify-between gap-3 shadow-xs hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start space-x-2.5 min-w-0">
                          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${doc.iconColor}`} />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 truncate">
                              {doc.title}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {doc.summary}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${doc.badgeClass}`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Verification progress: 2 Verified · 1 Review Required · 1 Missing</span>
                <span className="font-semibold text-[#102D52]">Automated Scrutiny Assist</span>
              </div>
            </div>

            {/* Right: Flagged Potential Inconsistency (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-lg border border-amber-200 p-4 sm:p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-100">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h4 className="text-sm font-bold text-amber-950">
                      Flagged for Human Review
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                    Potential Inconsistency
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-amber-50/70 p-3 rounded-md border border-amber-200/80">
                    <div className="text-[11px] font-bold text-amber-900 mb-1">
                      Safety Clearance: Expiration &amp; Endorsement
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed">
                      Fire Safety Clearance (FSC-BPL-2025/890) recorded an expiration date of 30 Sept 2026. A current renewal endorsement stamp was not detected in the document scan.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                    <div className="text-[11px] font-bold text-slate-700 mb-1">
                      Assigned Scrutiny Officer Action
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Officer can inspect the original file, issue a clarification query to the institution, or confirm manual endorsement before final committee evaluation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample Action Indicators */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-500">
                  Officer Review Options:
                </span>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                    Raise Query
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    Verify Manual Scan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Synthetic Demo Notice Banner */}
          <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-start sm:items-center space-x-2.5 text-xs text-slate-600">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5 sm:mt-0" />
            <p className="leading-snug">
              <strong>Synthetic Demonstration Data:</strong> The application record, document status entries, and inconsistency flags shown above are illustrative test data generated for hackathon evaluation. No live AICTE databases or official government records are queried.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemPreviewSection;
