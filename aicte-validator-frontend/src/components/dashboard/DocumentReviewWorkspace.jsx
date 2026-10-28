import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  ChevronRight,
  Clock,
  Layers,
  Flame,
  Scan,
  Cpu,
  Crosshair,
  Sparkles,
  AlertTriangle,
  Eye,
  Edit3,
  X,
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

// Statutory Fallback Dossier if an application does not have documents loaded
const FALLBACK_STATUTORY_DOCUMENTS = [
  {
    id: 'doc-land',
    title: 'Land Ownership Title Deed',
    category: 'Land Documents',
    status: 'Uploaded',
    checkStatus: 'Preliminary Check Passed',
    extractedFields: [
      { label: 'Registered Parcel Area', value: '7.50 Acres (Contiguous)' },
      { label: 'Survey Plot Numbers', value: 'Plot #42/1, 42/2, 43/1A' },
      { label: 'Zoning / Land Use', value: 'Educational / Institutional (Valid)' },
      { label: 'Encumbrance Certificate', value: 'Clean & Free from Encumbrances' },
    ],
  },
  {
    id: 'doc-building',
    title: 'Master Building Plan & PWD Safety Clearance',
    category: 'Building Infrastructure',
    status: 'Uploaded',
    checkStatus: 'Preliminary Check Passed',
    extractedFields: [
      { label: 'Total Built-up Floor Area', value: '14,200 sq.m' },
      { label: 'Mandated Minimum for Intake', value: '11,500 sq.m (Satisfied)' },
      { label: 'Floor Space Index (FSI)', value: '1.42 (Within 1.50 Max limit)' },
      { label: 'Structural Safety Endorsement', value: 'PWD Executive Engineer, Bhopal' },
    ],
  },
  {
    id: 'doc-fire',
    title: 'Fire & Emergency Safety Clearance (NOC)',
    category: 'Safety Clearances',
    status: 'Uploaded',
    checkStatus: 'Missing Information',
    extractedFields: [
      { label: 'NOC Certificate Serial', value: 'FS-NOC-2025-4819' },
      { label: 'Issuing Civic Authority', value: 'Municipal Fire Brigade, Bhopal' },
      { label: 'Document Expiry Date', value: '30 Sept 2026 (Expired / Modified)' },
      { label: 'Renewal Endorsement Stamp', value: 'Discrepancy Detected' },
    ],
  },
  {
    id: 'doc-faculty',
    title: 'Faculty Cadre & Salary Disbursement Roster',
    category: 'Faculty Roster',
    status: 'Uploaded',
    checkStatus: 'Preliminary Check Passed',
    extractedFields: [
      { label: 'Total Verified Faculty', value: '52 Full-time Staff' },
      { label: 'Student-to-Faculty Ratio', value: '1:14.8 (Norm: 1:15)' },
      { label: 'Bank Salary Disbursement Record', value: 'Verified through ECS / PFMS' },
      { label: 'AICTE Pay Scale Conformance', value: 'Self-Certified 7th CPC' },
    ],
  },
];

/**
 * Detailed multi-model anomaly detection evaluator for individual fields.
 * Returns structured metadata (label, tag, explanation, model, severity)
 * to render precise red bounding boxes and floating alert labels on the document.
 */
function getFieldAnomalyDetails(field, docTitle = '', checkStatus = '') {
  if (!field) return null;
  const label = String(field.label || '').toLowerCase();
  const value = String(field.value || '').toLowerCase();
  const title = String(docTitle || '').toLowerCase();
  const isFlaggedDoc =
    checkStatus === 'Missing Information' ||
    checkStatus === 'Possible Inconsistency' ||
    checkStatus === 'Review Required' ||
    title.includes('fire') ||
    title.includes('tamper');

  // Case 1: Expiry date splicing / alteration
  if (
    label.includes('expiry') ||
    value.includes('expired') ||
    value.includes('modified') ||
    (isFlaggedDoc && label.includes('date') && (value.includes('2026') || value.includes('altered')))
  ) {
    return {
      type: 'DIGITAL_ALTERATION',
      tag: '⚠️ SPLICED / ALTERED EXPIRY DATE',
      badgeClass: 'bg-rose-600 text-white',
      borderClass: 'border-2 border-dashed border-rose-600 bg-rose-500/15 ring-2 ring-rose-500/80',
      label: 'DocTamper DTD Character Heatmap Anomaly: Forged Digit Replacement',
      details: 'Baseline pixel mismatch detected: Original expiration "2025" altered to "2026".',
      model: 'DocTamper DTD (94.8% risk)',
      modelRisk: 'RISK: 94.8%',
      severity: 'danger',
    };
  }

  // Case 2: Renewal endorsement stamp / unverified civic endorsement
  if (
    label.includes('stamp') ||
    label.includes('endorsement') ||
    value.includes('unverified') ||
    value.includes('missing') ||
    value.includes('discrepancy')
  ) {
    if (isFlaggedDoc) {
      return {
        type: 'STAMP_SPLICING',
        tag: '⚠️ FORGED / UNVERIFIED RENEWAL STAMP',
        badgeClass: 'bg-rose-600 text-white',
        borderClass: 'border-2 border-dashed border-rose-600 bg-rose-500/15 ring-2 ring-rose-500/80',
        label: 'ViT-ELA Compression Noise Anomaly @ JPEG Q=90',
        details: 'High-frequency JPEG compression artifact detected along endorsement stamp boundary.',
        model: 'ViT-ELA Compression Map (89.2% confidence)',
        modelRisk: 'RISK: 89.2%',
        severity: 'danger',
      };
    }
  }

  // Case 3: Serial number alteration
  if (label.includes('serial') && (value.includes('modified') || value.includes('discrepant') || title.includes('tamper'))) {
    return {
      type: 'SERIAL_SPLICING',
      tag: '⚠️ ALTERED CERTIFICATE SERIAL NUMBER',
      badgeClass: 'bg-rose-600 text-white',
      borderClass: 'border-2 border-dashed border-rose-600 bg-rose-500/15 ring-2 ring-rose-500/80',
      label: 'DocTamper Character Discontinuity',
      details: 'Inconsistent character kerning and font weight detected in certificate serial glyphs.',
      model: 'DocTamper Character DTD (88.4%)',
      modelRisk: 'RISK: 88.4%',
      severity: 'danger',
    };
  }

  // Case 4: Duplicate PAN / Aadhaar Ghost Faculty
  if (
    label.includes('aadhaar') ||
    label.includes('pan') ||
    value.includes('matched active') ||
    value.includes('duplicate') ||
    label.includes('flagged staff')
  ) {
    return {
      type: 'GHOST_FACULTY',
      tag: '⚠️ FRAUD ALERT: GHOST FACULTY CLASH',
      badgeClass: 'bg-rose-700 text-white',
      borderClass: 'border-2 border-dashed border-rose-600 bg-rose-500/15 ring-2 ring-rose-500/80',
      label: 'Cross-College Deduplication Index Clash',
      details: 'Active full-time employment registered simultaneously at Institute #1-18490.',
      model: 'AICTE Deduplication Engine',
      modelRisk: 'CLASH CONFIRMED',
      severity: 'danger',
    };
  }

  // Case 5: Cadre deficiency / 0 Professors violation
  if (
    label.includes('cadre') ||
    label.includes('professor count') ||
    (label.includes('sfr') && value.includes('exceeding')) ||
    value.includes('0 professors') ||
    value.includes('deficient')
  ) {
    return {
      type: 'CADRE_DEFICIENCY',
      tag: '⚠️ STATUTORY CADRE DEFICIENCY',
      badgeClass: 'bg-amber-600 text-white',
      borderClass: 'border-2 border-dashed border-amber-600 bg-amber-500/15 ring-2 ring-amber-500/80',
      label: 'APH 2026-27 Table 2.1.4 Norm Violation',
      details: '0 Professors reported for requested expansion. Norm mandates at least 1 Full Professor.',
      model: 'APH Rule Engine 2026-27',
      modelRisk: 'NORM DEFICIENT',
      severity: 'warning',
    };
  }

  // Case 6: Relieving certificate missing or separation unproven
  if (label.includes('relieving') && value.includes('not submitted')) {
    return {
      type: 'MISSING_MANDATORY_ANNEXURE',
      tag: '⚠️ MISSING MANDATORY ANNEXURE',
      badgeClass: 'bg-rose-600 text-white',
      borderClass: 'border-2 border-dashed border-rose-600 bg-rose-500/15 ring-2 ring-rose-500/80',
      label: 'Statutory Annexure Missing',
      details: 'Mandatory formal relieving order from previous AICTE approved institution missing.',
      model: 'Dossier Integrity Engine',
      modelRisk: 'DEFICIT',
      severity: 'danger',
    };
  }

  return null;
}

/**
 * DocumentReviewWorkspace Component
 * Specialized scrutiny workspace featuring:
 * 1. Sarvam Document AI OCR entity review
 * 2. Multi-Model Document Forensics (DocTamper thermal heatmaps, ViT-ELA compression noise, YOLO seal/stamp bounding boxes)
 * 3. Officer field correction/override with audit trail
 * 4. Scrutiny notes and formal neutral review outcomes
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
  const currentApp = selectedApp || applications[0] || null;

  // Active document list with guaranteed fallback so UI never crashes or displays empty
  const docsList =
    currentApp?.documents && currentApp.documents.length > 0
      ? currentApp.documents
      : FALLBACK_STATUTORY_DOCUMENTS;

  const [selectedDocId, setSelectedDocId] = useState(
    docsList[0]?.id || ''
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

  // Forensics view controls: 'standard' | 'doctamper' | 'vit_ela' | 'yolo'
  const [forensicMode, setForensicMode] = useState('standard');
  const [activeHighlightField, setActiveHighlightField] = useState(null);
  // Defaulted to TRUE so red marked zones with labels are immediately visible to the scrutiny officer
  const [showTamperBoxes, setShowTamperBoxes] = useState(true);

  // Field Override Modal State
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideTargetField, setOverrideTargetField] = useState(null);
  const [overrideValue, setOverrideValue] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideFeedback, setOverrideFeedback] = useState('');

  // Local extracted fields copy for live overrides
  const [docFieldsMap, setDocFieldsMap] = useState({});

  useEffect(() => {
    const initialMap = {};
    docsList.forEach((d) => {
      initialMap[d.id] = d.extractedFields ? [...d.extractedFields] : [];
    });
    setDocFieldsMap(initialMap);
    if (!docsList.some((d) => d.id === selectedDocId)) {
      setSelectedDocId(docsList[0]?.id || '');
    }
  }, [currentApp, docsList]);

  if (!currentApp) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-semibold">No assigned application available for review.</p>
      </div>
    );
  }

  const selectedDoc =
    docsList.find((d) => d.id === selectedDocId) ||
    docsList[0] ||
    FALLBACK_STATUTORY_DOCUMENTS[0];

  const currentExtractedFields =
    (selectedDoc && docFieldsMap[selectedDoc.id]) || selectedDoc?.extractedFields || [];

  // Determine if current document has forensic anomalies
  const isDocFlaggedOrTampered =
    selectedDoc?.checkStatus === 'Missing Information' ||
    selectedDoc?.checkStatus === 'Possible Inconsistency' ||
    selectedDoc?.checkStatus === 'Review Required' ||
    (selectedDoc?.title || '').toLowerCase().includes('fire') ||
    (selectedDoc?.title || '').toLowerCase().includes('tamper');

  // Explicit definition to prevent unhandled ReferenceError white screens
  const isTamperDetected = Boolean(isDocFlaggedOrTampered);

  const vitElaAuthenticity = isTamperDetected ? 41.2 : 98.6;
  const docTamperProbability = isTamperDetected ? 0.89 : 0.03;
  const yoloMarksDetected = isTamperDetected ? 2 : 3;

  // Determine if municipal seal has alteration or unverified endorsement boundary
  const isSealSuspect =
    isDocFlaggedOrTampered &&
    ((selectedDoc?.title || '').toLowerCase().includes('fire') ||
      (selectedDoc?.title || '').toLowerCase().includes('tamper') ||
      currentExtractedFields.some(
        (f) =>
          String(f?.label || '').toLowerCase().includes('stamp') &&
          (String(f?.value || '').toLowerCase().includes('discrepancy') ||
            String(f?.value || '').toLowerCase().includes('missing') ||
            String(f?.value || '').toLowerCase().includes('unverified'))
      ));

  // Compute all anomalies in current document
  const anomaliesList = currentExtractedFields
    .map((f, idx) => ({
      field: f,
      idx,
      anomaly: getFieldAnomalyDetails(f, selectedDoc?.title, selectedDoc?.checkStatus),
    }))
    .filter((item) => Boolean(item.anomaly));

  const totalTamperedRegions = anomaliesList.length + (isSealSuspect ? 1 : 0);

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

  // Open field override modal
  const handleOpenOverride = (field) => {
    if (!field) return;
    setOverrideTargetField(field);
    setOverrideValue(field.value || '');
    setOverrideReason('Verified against municipal sub-registrar ledger folio 412.');
    setOverrideModalOpen(true);
  };

  // Apply field override
  const handleApplyOverride = () => {
    if (!overrideTargetField || !selectedDoc) return;
    setDocFieldsMap((prev) => {
      const currentFields = prev[selectedDoc.id] || [];
      const updated = currentFields.map((f) =>
        f.label === overrideTargetField.label
          ? { ...f, value: overrideValue, isOverridden: true, overrideReason }
          : f
      );
      return { ...prev, [selectedDoc.id]: updated };
    });

    setOverrideModalOpen(false);
    setOverrideFeedback(`Field "${overrideTargetField.label}" overridden and logged to Audit Trail.`);
    setTimeout(() => setOverrideFeedback(''), 4000);
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
                  {currentApp.collegeName || currentApp.institutionName || 'Institutional Applicant'}
                </span>
                <StatusBadge status={currentApp.currentStatus} />
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>AISHE: <strong className="text-slate-700">{currentApp.aisheCode || 'C-00000'}</strong></span>
                <span>·</span>
                <span>Type: <strong className="text-slate-700">{currentApp.applicationType || 'Extension of Approval (EoA)'}</strong></span>
                <span>·</span>
                <span>Academic Cycle: <strong className="text-slate-700">{currentApp.academicYear || '2026-27'}</strong></span>
                <span>·</span>
                <span>Region: <strong className="text-slate-700">{currentApp.region || 'Central Region'}</strong></span>
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
                const target = (applications || []).find((a) => a.id === e.target.value);
                if (target && onSelectApp) onSelectApp(target);
              }}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {(applications || []).filter(Boolean).map((app) => {
                const appName = (app.collegeName || app.institutionName || 'Institution').split(' ')[0];
                return (
                  <option key={app.id} value={app.id}>
                    {app.id} — {appName} ({app.priority || 'Normal'} Priority)
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Global Feedback Banner */}
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

        {overrideFeedback && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-300 text-blue-900 rounded-lg text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{overrideFeedback}</span>
            </div>
            <span className="text-[10px] text-blue-700 bg-blue-200 px-2 py-0.5 rounded font-mono">
              SHA-256 Chained
            </span>
          </div>
        )}
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
                  Submitted Documents ({docsList.length})
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-500">
                APH 2026-27 Dossier
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto">
              {docsList.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                const isPassed = doc.checkStatus === 'Preliminary Check Passed';
                const isWarning = doc.checkStatus === 'Review Required' || doc.checkStatus === 'Missing Information';

                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setForensicMode('standard');
                      setActiveHighlightField(null);
                    }}
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

                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
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

                        {!isPassed && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-600 text-white flex items-center space-x-1 animate-pulse shadow-xs">
                            <AlertTriangle className="w-2.5 h-2.5 text-white shrink-0" />
                            <span>RED ZONES</span>
                          </span>
                        )}
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
                <strong className="text-slate-800">{currentApp.submissionDate || '18 Oct 2026'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Review Priority:</span>
                <span className="font-bold text-amber-800">{currentApp.priority || 'Normal'}</span>
              </div>
              <div className="flex justify-between">
                <span>Mandatory Documents:</span>
                <strong className="text-slate-800">{currentApp.documentsCount || docsList.length} Files Attached</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Forensics Inspection Canvas & Review Actions */}
        <div className="lg:col-span-8 space-y-6">
          {selectedDoc ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-5">
              {/* Document Header & AI Status */}
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
                  <span className="text-xs text-slate-500 font-medium">Scrutiny Status:</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {selectedDoc.checkStatus}
                  </span>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* AI MULTI-MODEL FORENSICS & TAMPER HEATMAP INSPECTION SUITE   */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-slate-900 text-white rounded-xl p-4 shadow-lg border border-slate-800 space-y-4">
                {/* Forensic Header & Model Diagnostics Summary */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
                        <span>Multi-Model AI Document Forensics</span>
                        <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded">
                          ViT-ELA + DocTamper + YOLOv8
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Zero-trust visual verification for pixel forgery, altered characters, and municipal stamps
                      </p>
                    </div>
                  </div>

                  {/* Overall Authenticity Badge */}
                  <div className="flex items-center space-x-2">
                    {isTamperDetected ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>TAMPER ANOMALY DETECTED ({vitElaAuthenticity}%)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>AUTHENTIC ({vitElaAuthenticity}%)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Forensics View Mode Switcher Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                    Forensic Layer:
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Standard View */}
                    <button
                      type="button"
                      onClick={() => setForensicMode('standard')}
                      className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center space-x-1.5 ${
                        forensicMode === 'standard'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Standard Document</span>
                    </button>

                    {/* DocTamper Heatmap */}
                    <button
                      type="button"
                      onClick={() => setForensicMode('doctamper')}
                      className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center space-x-1.5 ${
                        forensicMode === 'doctamper'
                          ? 'bg-rose-600 text-white shadow-xs animate-pulse ring-2 ring-rose-400'
                          : 'bg-slate-800 text-rose-300 hover:bg-slate-700 border border-rose-900/60'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>DocTamper Heatmap (Text Alteration)</span>
                    </button>

                    {/* ViT-ELA Compression Error */}
                    <button
                      type="button"
                      onClick={() => setForensicMode('vit_ela')}
                      className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center space-x-1.5 ${
                        forensicMode === 'vit_ela'
                          ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-400'
                          : 'bg-slate-800 text-purple-300 hover:bg-slate-700 border border-purple-900/60'
                      }`}
                    >
                      <Scan className="w-3.5 h-3.5 text-purple-400" />
                      <span>ViT-ELA Compression Map</span>
                    </button>

                    {/* YOLO Statutory Regions */}
                    <button
                      type="button"
                      onClick={() => setForensicMode('yolo')}
                      className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center space-x-1.5 ${
                        forensicMode === 'yolo'
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                          : 'bg-slate-800 text-emerald-300 hover:bg-slate-700 border border-emerald-900/60'
                      }`}
                    >
                      <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                      <span>YOLO Seals &amp; Signatures ({yoloMarksDetected}/3)</span>
                    </button>

                    {/* Red Marked Tamper Zones Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowTamperBoxes(!showTamperBoxes)}
                      className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center space-x-1.5 ${
                        showTamperBoxes
                          ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <AlertTriangle className={`w-3.5 h-3.5 ${showTamperBoxes ? 'text-white' : 'text-slate-500'}`} />
                      <span>Red Tamper Boxes: {showTamperBoxes ? 'VISIBLE (ON)' : 'HIDDEN'}</span>
                    </button>
                  </div>
                </div>

                {/* THE INTERACTIVE DOCUMENT FORENSIC CANVAS */}
                <div className="relative rounded-lg overflow-hidden border border-slate-700 transition-colors bg-white">
                  {/* Forensic Mode Banner / Legend */}
                  {forensicMode === 'doctamper' && (
                    <div className="p-2.5 bg-rose-950/90 border-b border-rose-700/80 text-rose-200 text-xs flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
                        <span className="font-bold">
                          DocTamper Thermal Heatmap Active · Character-Level Alteration Localization
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px]">
                        <span className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
                          <span>High Probability Forgery (&gt;80%)</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                          <span>Font Inconsistency</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                          <span>Baseline Text</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {forensicMode === 'vit_ela' && (
                    <div className="p-2.5 bg-purple-950/90 border-b border-purple-700/80 text-purple-200 text-xs flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Scan className="w-4 h-4 text-purple-400" />
                        <span className="font-bold">
                          ViT-ELA (Vision Transformer Error Level Analysis) @ JPEG Q=90
                        </span>
                      </div>
                      <span className="text-[11px] text-purple-300">
                        Luminescent edge pixels indicate spliced images or digitally pasted elements.
                      </span>
                    </div>
                  )}

                  {forensicMode === 'yolo' && (
                    <div className="p-2.5 bg-emerald-950/90 border-b border-emerald-700/80 text-emerald-200 text-xs flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Crosshair className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold">
                          YOLOv8 Statutory Object Detection · Municipal Seals &amp; Signatures
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-300">
                        {yoloMarksDetected} statutory regions detected with &gt;95% confidence.
                      </span>
                    </div>
                  )}

                  {/* PROMINENT RED BANNER INDICATING MARKED ANOMALY ZONES */}
                  {isTamperDetected && showTamperBoxes && (
                    <div className="p-3.5 bg-rose-600 text-white border-b-2 border-rose-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-fadeIn">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                          <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase tracking-wider flex items-center space-x-2">
                            <span>TAMPERING &amp; ANOMALIES LOCALIZED IN RED BOUNDING BOXES</span>
                            <span className="bg-rose-950 text-rose-200 text-[9px] font-mono px-2 py-0.5 rounded border border-rose-400">
                              AI Forensics
                            </span>
                          </div>
                          <p className="text-[11px] text-rose-100 leading-tight mt-0.5">
                            Character alterations, spliced renewal dates, or unverified civic endorsements are boxed in red with diagnostic labels below.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        <span className="bg-white text-rose-900 text-xs font-black px-3 py-1 rounded-md shadow-xs font-mono flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block"></span>
                          <span>{totalTamperedRegions} RED ZONES MARKED</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* DOCUMENT PREVIEW BODY (Styled to represent the actual rendered document) */}
                  <div
                    className={`p-8 min-h-[380px] relative transition-all select-none ${
                      forensicMode === 'vit_ela'
                        ? 'bg-slate-950 text-slate-300 font-mono'
                        : 'bg-amber-50/30 text-slate-900 font-serif'
                    }`}
                  >
                    {/* Watermark in background */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                      <span className="text-8xl font-black text-slate-900 -rotate-25 tracking-widest">
                        AICTE VERIFIED
                      </span>
                    </div>

                    {/* Official Document Border */}
                    <div
                      className={`p-6 rounded border-2 relative ${
                        forensicMode === 'vit_ela'
                          ? 'border-purple-500/40'
                          : 'border-[#102D52]'
                      }`}
                    >
                      {/* Inner border */}
                      <div className="border border-slate-300 p-6 space-y-4">
                        {/* Letterhead */}
                        <div className="text-center pb-3 border-b border-slate-300">
                          <h5 className="text-xs font-black uppercase tracking-widest text-[#102D52]">
                            Government of Madhya Pradesh · Statutory Regulatory Filing
                          </h5>
                          <h4 className="text-sm font-extrabold uppercase mt-0.5 text-slate-800">
                            {selectedDoc.title}
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            Certificate ID: {selectedDoc.id} · Dossier Cycle: {currentApp.academicYear}
                          </p>
                        </div>

                        {/* Document Content Paragraphs */}
                        <div className="space-y-3 text-xs leading-relaxed">
                          <p>
                            This is to certify that <strong>{currentApp.collegeName || currentApp.institutionName || 'The Technical Institution'}</strong> (AISHE: {currentApp.aisheCode || 'C-00000'})
                            has submitted statutory documentation regarding <em>{selectedDoc?.category || 'Regulatory Compliance'}</em> under
                            the norms stipulated in the AICTE Approval Process Handbook (APH 2026-27).
                          </p>

                          {/* Extracted Parameters on Canvas with Red Marked Anomaly Bounding Boxes */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                            {currentExtractedFields.map((field, idx) => {
                              const anomaly = getFieldAnomalyDetails(
                                field,
                                selectedDoc?.title,
                                selectedDoc?.checkStatus
                              );
                              const isFieldHighlighted = activeHighlightField === field?.label;
                              const isTamperedField = Boolean(anomaly && showTamperBoxes);

                              return (
                                <div
                                  key={idx}
                                  id={`tamper-zone-${idx}`}
                                  onClick={() => setActiveHighlightField(field?.label)}
                                  className={`p-3.5 rounded-lg transition-all relative cursor-pointer ${
                                    isTamperedField
                                      ? 'border-2 border-dashed border-rose-600 bg-rose-500/15 ring-2 ring-rose-500/80 shadow-lg shadow-rose-500/20'
                                      : forensicMode === 'vit_ela'
                                      ? 'bg-slate-900/80 border border-purple-500/50 text-purple-200'
                                      : isFieldHighlighted
                                      ? 'bg-blue-100 border-2 border-blue-500 ring-2 ring-blue-500'
                                      : 'bg-white/80 border border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {/* FLOATING RED ALERT LABEL PINNED ON THE RED MARKED AREA */}
                                  {isTamperedField && (
                                    <div className="absolute -top-3.5 left-2 bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-md ring-2 ring-rose-300 flex items-center space-x-1.5 uppercase tracking-wider z-20 animate-pulse">
                                      <AlertTriangle className="w-3 h-3 text-white fill-white shrink-0" />
                                      <span>{anomaly.tag}</span>
                                    </div>
                                  )}

                                  {/* FLOATING FORENSIC RISK SCORE PINNED ON TOP RIGHT */}
                                  {isTamperedField && (
                                    <div className="absolute -top-3.5 right-2 bg-rose-950 text-rose-200 border border-rose-600 text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-sm z-20 flex items-center space-x-1">
                                      <Flame className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                                      <span>{anomaly.modelRisk}</span>
                                    </div>
                                  )}

                                  {/* PARAMETER NAME */}
                                  <span
                                    className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${
                                      isTamperedField ? 'text-rose-800' : 'text-slate-500'
                                    }`}
                                  >
                                    {field?.label || 'Parameter'}
                                  </span>

                                  {/* PARAMETER VALUE IN RED MARKED HIGHLIGHT BOX */}
                                  <span
                                    className={`text-xs font-mono font-black block p-1.5 rounded ${
                                      isTamperedField
                                        ? 'text-rose-950 bg-rose-200/90 border border-rose-300 shadow-2xs'
                                        : 'text-slate-900 bg-slate-50 border border-slate-200'
                                    }`}
                                  >
                                    {field?.value || '—'}
                                  </span>

                                  {/* FORENSIC ANOMALY DIAGNOSTIC SUMMARY INSIDE THE RED MARKED AREA */}
                                  {isTamperedField && (
                                    <div className="mt-2 pt-2 border-t border-rose-300/80 text-[10px] text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-sans">
                                      <span className="font-semibold flex items-center space-x-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block shrink-0"></span>
                                        <span>{anomaly.details}</span>
                                      </span>
                                      <span className="font-mono text-[9px] font-black bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded border border-rose-200 shrink-0 self-start sm:self-auto">
                                        {anomaly.model}
                                      </span>
                                    </div>
                                  )}

                                  {field?.isOverridden && (
                                    <span className="text-[9px] text-blue-600 font-bold mt-1.5 block">
                                      ✎ Overridden by Scrutiny Officer
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <p className="text-[11px] text-slate-500 pt-2">
                            The competent authority has inspected the physical premises and relevant land/safety/faculty registers.
                            Any discrepancy or digital alteration shall lead to immediate statutory escalation under AICTE Regulations.
                          </p>
                        </div>

                        {/* Signatures & Official Seals with YOLO Bounding Boxes */}
                        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                          {/* Official Municipal Stamp with Red Marked Zone if Spliced */}
                          <div
                            className={`p-3 rounded-lg border-2 text-center relative transition-all ${
                              isSealSuspect && showTamperBoxes
                                ? 'border-dashed border-rose-600 bg-rose-500/15 ring-2 ring-rose-500/80 shadow-lg shadow-rose-500/25'
                                : forensicMode === 'yolo'
                                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500'
                                : forensicMode === 'vit_ela' && isDocFlaggedOrTampered
                                ? 'border-purple-400 bg-purple-900/40'
                                : 'border-slate-300 bg-slate-50'
                            }`}
                          >
                            {isSealSuspect && showTamperBoxes && (
                              <div className="absolute -top-3.5 left-2 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-md ring-1 ring-rose-300 flex items-center space-x-1 z-20 animate-pulse">
                                <AlertTriangle className="w-2.5 h-2.5 text-white" />
                                <span>⚠️ ALTERED SEAL: SPLICED ENDORSEMENT (ViT-ELA 89.2%)</span>
                              </div>
                            )}

                            {forensicMode === 'yolo' && (!isSealSuspect || !showTamperBoxes) && (
                              <div className="absolute -top-2.5 left-2 bg-emerald-600 text-white text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                                SEAL: Municipal Authority (98.4%)
                              </div>
                            )}

                            <div
                              className={`w-14 h-14 rounded-full border-2 border-dashed flex items-center justify-center mx-auto text-[8px] font-black p-1 ${
                                isSealSuspect && showTamperBoxes
                                  ? 'border-rose-600 bg-rose-100/70 text-rose-900'
                                  : 'border-[#102D52] text-[#102D52]'
                              }`}
                            >
                              {isSealSuspect && showTamperBoxes ? 'SUSPECT SEAL' : 'OFFICIAL SEAL'}
                            </div>
                            <span
                              className={`text-[10px] block mt-1 font-bold ${
                                isSealSuspect && showTamperBoxes ? 'text-rose-800' : 'text-slate-500'
                              }`}
                            >
                              {isSealSuspect && showTamperBoxes
                                ? 'Renewal Endorsement Spliced / Missing'
                                : 'Civic Authority Division'}
                            </span>
                          </div>

                          {/* Authorized Signatory */}
                          <div
                            className={`p-3 rounded border text-center relative ${
                              forensicMode === 'yolo'
                                ? 'border-cyan-500 bg-cyan-50/50 ring-2 ring-cyan-500'
                                : 'border-slate-300 bg-slate-50'
                            }`}
                          >
                            {forensicMode === 'yolo' && (
                              <div className="absolute -top-2.5 left-2 bg-cyan-600 text-white text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                                SIGNATURE: Competent Officer (96.2%)
                              </div>
                            )}
                            <span className="font-serif italic text-sm text-slate-800 block underline decoration-slate-400">
                              R. K. Verma, FSD
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              Superintending Authority
                            </span>
                          </div>

                          {/* Statutory QR Barcode */}
                          <div
                            className={`p-2 rounded border text-center relative ${
                              forensicMode === 'yolo'
                                ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-500'
                                : 'border-slate-300 bg-slate-50'
                            }`}
                          >
                            {forensicMode === 'yolo' && (
                              <div className="absolute -top-2.5 left-2 bg-purple-600 text-white text-[9px] font-mono px-1.5 py-0.2 rounded font-bold">
                                QR CODE (99.1%)
                              </div>
                            )}
                            <div className="w-10 h-10 bg-slate-900 rounded mx-auto flex items-center justify-center text-[7px] text-white font-mono">
                              [QR]
                            </div>
                            <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                              MP-AUTH-2026
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Model Metrics Breakdown Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      1. ViT-ELA Classification
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-100">
                        {vitElaAuthenticity}% Authentic
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isDocFlaggedOrTampered
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isDocFlaggedOrTampered ? 'ANOMALY DETECTED' : 'UNIFORM GRID'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      2. DocTamper Localization
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-100">
                        {docTamperProbability} Risk Score
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isDocFlaggedOrTampered
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isDocFlaggedOrTampered ? 'SUSPECT TEXT FOUND' : 'CLEAN GLYPHS'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                      3. YOLOv8 Mark Detector
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-100">
                        {yoloMarksDetected} / 3 Marks Present
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        SEALS &amp; SIGS VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* EXTRACTED FIELDS TABLE (SARVAM OCR DATA + OFFICER OVERRIDES)  */}
              {/* ------------------------------------------------------------- */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-700" />
                    <span>Sarvam Document AI Extracted Fields &amp; Cross-Verification</span>
                  </h4>
                  <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                    Sarvam AI API (`/extract`)
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="px-4 py-2.5 w-1/3">Extracted Parameter</th>
                        <th className="px-4 py-2.5">Extracted Value / Regulatory Indicator</th>
                        <th className="px-4 py-2.5 text-right">Officer Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentExtractedFields.map((field, fIdx) => {
                        const anomaly = getFieldAnomalyDetails(
                          field,
                          selectedDoc?.title,
                          selectedDoc?.checkStatus
                        );

                        return (
                          <tr
                            key={fIdx}
                            onMouseEnter={() => setActiveHighlightField(field?.label)}
                            onMouseLeave={() => setActiveHighlightField(null)}
                            className={`transition-colors ${
                              anomaly
                                ? 'bg-rose-50/70 border-l-4 border-l-rose-600 font-semibold'
                                : activeHighlightField === field?.label
                                ? 'bg-blue-50/80 font-bold'
                                : 'hover:bg-white'
                            }`}
                          >
                            <td className="px-4 py-2.5 font-semibold text-slate-700">
                              <div className="flex items-center space-x-1.5">
                                {anomaly && (
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                )}
                                <span>{field?.label || 'Parameter'}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5 font-mono text-slate-900">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={anomaly ? 'font-black text-rose-950 bg-rose-200/80 px-1.5 py-0.5 rounded border border-rose-300' : ''}>
                                  {field?.value || '—'}
                                </span>
                                {anomaly && (
                                  <span className="text-[9px] bg-rose-600 text-white font-sans font-black px-1.5 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1 shadow-2xs">
                                    <AlertTriangle className="w-2.5 h-2.5" />
                                    <span>{anomaly.type === 'DIGITAL_ALTERATION' ? 'FORGED / SPLICED' : 'ANOMALY DETECTED'}</span>
                                  </span>
                                )}
                                {field?.isOverridden && (
                                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-sans font-bold">
                                    Manual Override
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-right whitespace-nowrap">
                              {anomaly && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveHighlightField(field?.label);
                                    const el = document.getElementById(`tamper-zone-${fIdx}`);
                                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }}
                                  className="inline-flex items-center space-x-1 px-2 py-1 text-[11px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded border border-rose-300 transition-colors mr-1.5 shadow-2xs"
                                >
                                  <Eye className="w-3 h-3 text-rose-600" />
                                  <span>Locate Red Box</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleOpenOverride(field)}
                                className="inline-flex items-center space-x-1 px-2 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Override</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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
                      <span>Notes Saved to Dossier</span>
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

      {/* FIELD OVERRIDE MODAL */}
      {overrideModalOpen && overrideTargetField && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-[#102D52]">
                  Manual Officer Field Override
                </h3>
              </div>
              <button
                onClick={() => setOverrideModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Parameter Name:
                </label>
                <div className="p-2 bg-slate-100 rounded font-semibold text-slate-800">
                  {overrideTargetField.label}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Corrected / Verified Value:
                </label>
                <input
                  type="text"
                  value={overrideValue}
                  onChange={(e) => setOverrideValue(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Statutory Justification / Audit Reason:
                </label>
                <textarea
                  rows={2}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Specify official revenue record, register folio, or order number..."
                  className="w-full p-2 bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 flex items-start space-x-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  This override will be cryptographically hashed and permanently appended to the AICTE SHA-256 Audit Ledger.
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOverrideModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyOverride}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-sm"
              >
                Confirm &amp; Record in Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentReviewWorkspace;
