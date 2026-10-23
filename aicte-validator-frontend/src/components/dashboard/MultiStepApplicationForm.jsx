import React, { useState } from 'react';
import { demoCollegeProfile } from '../../data/collegeDashboardData';
import {
  Building2,
  FileSpreadsheet,
  BookOpen,
  Users,
  Layers,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  Printer,
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Institution Details', shortTitle: 'Institution', icon: Building2 },
  { id: 2, title: 'Application Type', shortTitle: 'Type', icon: FileSpreadsheet },
  { id: 3, title: 'Course & Intake', shortTitle: 'Courses', icon: BookOpen },
  { id: 4, title: 'Faculty Cadre', shortTitle: 'Faculty', icon: Users },
  { id: 5, title: 'Infrastructure', shortTitle: 'Infra', icon: Layers },
  { id: 6, title: 'Declaration & Review', shortTitle: 'Review', icon: CheckCircle2 },
];

/**
 * MultiStepApplicationForm Component
 * 6-step institutional compliance and approval application form.
 */
const MultiStepApplicationForm = ({ onApplicationCreated, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [draftSavedNotice, setDraftSavedNotice] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [errors, setErrors] = useState({});

  // Consolidated form state across all 6 steps
  const [formData, setFormData] = useState({
    // Step 1: Institution Details (prefilled with college profile)
    institutionName: demoCollegeProfile.institutionName,
    aisheCode: demoCollegeProfile.aisheCode,
    permanentId: demoCollegeProfile.permanentId,
    affiliatedUniversity: demoCollegeProfile.affiliatedUniversity,
    region: demoCollegeProfile.region,
    campusAddress: demoCollegeProfile.campusAddress,
    nodalOfficerName: demoCollegeProfile.nodalOfficer.name,
    nodalOfficerEmail: demoCollegeProfile.nodalOfficer.email,
    nodalOfficerPhone: demoCollegeProfile.nodalOfficer.phone,

    // Step 2: Application Type
    applicationType: 'Extension of Approval (EoA)',
    academicYear: '2026-27',
    applicationCategory: 'Engineering & Technology',
    modeOfStudy: 'Regular Full-Time',

    // Step 3: Course & Intake Details
    courseName: 'B.Tech in Artificial Intelligence & Machine Learning',
    department: 'Computer Science & Engineering',
    existingIntake: '0',
    proposedIntake: '60',
    intakeJustification: 'High industry demand and availability of specialized computing laboratories.',

    // Step 4: Faculty Information
    totalFaculty: '18',
    professorsCount: '2',
    associateProfessorsCount: '4',
    assistantProfessorsCount: '12',
    cadreRatioDeclaration: true,

    // Step 5: Infrastructure
    totalLandAreaAcres: '7.5',
    totalBuiltUpAreaSqM: '14200',
    classroomsCount: '24',
    laboratoriesCount: '18',
    fireSafetyNocNumber: 'FSC-BPL-2026-REV',
    barrierFreeCompliant: true,

    // Step 6: Declaration
    statutoryDeclaration: false,
    penalClauseAccepted: false,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Step-by-step validator
  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.institutionName.trim()) errs.institutionName = 'Institution name is required.';
      if (!formData.aisheCode.trim()) errs.aisheCode = 'AISHE code is required.';
      if (!formData.nodalOfficerName.trim()) errs.nodalOfficerName = 'Nodal officer name is required.';
    } else if (step === 2) {
      if (!formData.applicationType) errs.applicationType = 'Please select application type.';
      if (!formData.academicYear) errs.academicYear = 'Academic session is required.';
    } else if (step === 3) {
      if (!formData.courseName.trim()) errs.courseName = 'Program / Course name is required.';
      if (!formData.proposedIntake || Number(formData.proposedIntake) <= 0) {
        errs.proposedIntake = 'Proposed intake must be greater than zero.';
      }
    } else if (step === 4) {
      if (!formData.totalFaculty || Number(formData.totalFaculty) <= 0) {
        errs.totalFaculty = 'Total faculty count is required.';
      }
      if (!formData.professorsCount) errs.professorsCount = 'Professor count is required.';
    } else if (step === 5) {
      if (!formData.totalLandAreaAcres || Number(formData.totalLandAreaAcres) < 1.0) {
        errs.totalLandAreaAcres = 'Minimum land requirement must be specified.';
      }
      if (!formData.totalBuiltUpAreaSqM || Number(formData.totalBuiltUpAreaSqM) < 1000) {
        errs.totalBuiltUpAreaSqM = 'Valid built-up floor area is required.';
      }
      if (!formData.fireSafetyNocNumber.trim()) {
        errs.fireSafetyNocNumber = 'Fire Safety NOC reference is required.';
      }
    } else if (step === 6) {
      if (!formData.statutoryDeclaration) {
        errs.statutoryDeclaration = 'You must confirm the statutory accuracy declaration.';
      }
      if (!formData.penalClauseAccepted) {
        errs.penalClauseAccepted = 'You must acknowledge the regulatory compliance terms.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = () => {
    setDraftSavedNotice(true);
    setTimeout(() => setDraftSavedNotice(false), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(6)) return;

    // Generate new local application
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const instName = formData.institutionName || demoCollegeProfile.institutionName;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newApp = {
      id: `APP-2026-ENG-${randomNum}`,
      collegeName: instName,
      institutionName: instName,
      aisheCode: formData.aisheCode || demoCollegeProfile.aisheCode,
      region: formData.region || demoCollegeProfile.region,
      state: demoCollegeProfile.state,
      applicationType: formData.applicationType,
      submissionDate: todayStr,
      currentStatus: 'Under Review',
      statusSeverity: 'info',
      priority: 'Normal',
      prioritySeverity: 'info',
      lastUpdated: 'Just now',
      academicYear: formData.academicYear || '2026-27',
      assignedOfficer: 'Dr. R. K. Sharma (Scrutiny Officer - Gr. I)',
      verificationOfficer: {
        name: 'Dr. R. K. Sharma',
        id: 'AICTE-SCR-202',
        desk: 'Central Desk #4',
      },
      stream: formData.courseName || formData.applicationCategory || 'Engineering & Technology',
      documentsCount: 12,
      flaggedCount: 0,
      flaggedDocumentsCount: 0,
      preliminaryOutcome: 'In Scrutiny Queue',
      preliminarySeverity: 'info',
      requestedIntake: Number(formData.proposedIntake) || 60,
      proposedIntake: `${formData.proposedIntake || 60} Seats (${formData.courseName})`,
      summary: `${formData.applicationType} proposal for ${formData.courseName} (Proposed Intake: ${formData.proposedIntake}).`,
      remarks: 'Application submitted successfully. Automated OCR semantic ingestion initialized.',
      reviewNotes: 'Newly submitted institutional application. OCR semantic parsing initialized.',
      officerNotes: '',
      documents: [
        {
          id: 'doc-auto-1',
          title: 'Master Building Plan & Municipal Approval',
          category: 'Building Infrastructure',
          status: 'Uploaded',
          checkStatus: 'Preliminary Check Passed',
          extractedFields: [
            { label: 'Built-up Area', value: `${formData.totalBuiltUpAreaSqM || demoCollegeProfile.builtUpAreaSqM} sq.m` },
            { label: 'Approval Status', value: 'Municipally Endorsed' },
          ],
        },
        {
          id: 'doc-auto-2',
          title: 'Land Ownership Title & Contiguity Deed',
          category: 'Land Documents',
          status: 'Uploaded',
          checkStatus: 'Preliminary Check Passed',
          extractedFields: [
            { label: 'Plot Area', value: `${formData.totalLandAreaAcres || demoCollegeProfile.landAreaAcres} Acres` },
            { label: 'Contiguity', value: 'Single Contiguous Plot' },
          ],
        },
      ],
      timeline: [
        {
          stage: 'Application Filed',
          date: todayStr,
          actor: `${formData.nodalOfficerName || demoCollegeProfile.nodalOfficer.name} (Authorized Signatory)`,
          details: `Submitted ${formData.applicationType} proposal for ${formData.proposedIntake || 60} seats.`,
        },
      ],
    };

    setSubmittedApp(newApp);
    if (onApplicationCreated) {
      onApplicationCreated(newApp);
    }
  };

  // Confirmation View when submitted
  if (submittedApp) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 text-center max-w-2xl mx-auto animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-200 inline-block mb-3">
          SIMULATED SUBMISSION · PROTOTYPE ACKNOWLEDGMENT
        </span>

        <h2 className="text-2xl font-black text-[#102D52] mb-2">
          Application Submitted Successfully
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
          Your compliance application has been ingested into the demonstration scrutiny queue.
        </p>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6 text-left space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-semibold">Application Reference ID:</span>
            <span className="font-mono font-bold text-[#102D52] text-sm">{submittedApp.id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-semibold">Application Type:</span>
            <span className="font-semibold text-slate-800">{submittedApp.applicationType}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-semibold">Institution Name:</span>
            <span className="font-semibold text-slate-800">{formData.institutionName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">Current Queue Status:</span>
            <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Under Review (Automated Ingestion)
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold"
          >
            <Printer className="w-4 h-4" />
            <span>Print Acknowledgment Slip</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-6 py-2.5 rounded-lg bg-[#102D52] text-white hover:bg-[#1D4ED8] text-xs font-bold shadow-xs"
          >
            <span>View in My Applications</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="bg-[#102D52] text-white p-5 sm:p-6 border-b border-blue-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
              Institutional Compliance Portal · AY 2026-27
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              AICTE Regulatory Approval &amp; Extension Filing Form
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
          </div>
        </div>
      </div>

      {/* Draft Saved Flash Notice */}
      {draftSavedNotice && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-900 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span className="font-bold">Draft Saved Locally:</span>
            <span>All entered form values have been preserved for this demonstration session.</span>
          </div>
        </div>
      )}

      {/* Progress Indicator (6 Steps) */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
          {STEPS.map((s) => {
            const isCompleted = s.id < currentStep;
            const isCurrent = s.id === currentStep;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (s.id < currentStep || validateStep(currentStep)) {
                    setCurrentStep(s.id);
                  }
                }}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'bg-white border-[#102D52] ring-2 ring-[#102D52]/20 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-white/60 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold">
                    0{s.id}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <div className="text-xs font-bold truncate text-[#102D52]">
                  {s.shortTitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Body Steps */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: INSTITUTION DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#102D52]">Step 1: Institutional Identification</h3>
              <p className="text-xs text-slate-500">Verify your college credentials registered with AICTE.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Institution Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => handleChange('institutionName', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#102D52]"
                />
                {errors.institutionName && <p className="text-red-600 text-[11px] mt-1">{errors.institutionName}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  AISHE Code <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.aisheCode}
                  onChange={(e) => handleChange('aisheCode', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
                {errors.aisheCode && <p className="text-red-600 text-[11px] mt-1">{errors.aisheCode}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Permanent Institute ID</label>
                <input
                  type="text"
                  value={formData.permanentId}
                  disabled
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-mono text-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Affiliated University</label>
                <input
                  type="text"
                  value={formData.affiliatedUniversity}
                  onChange={(e) => handleChange('affiliatedUniversity', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Campus Physical Address</label>
                <input
                  type="text"
                  value={formData.campusAddress}
                  onChange={(e) => handleChange('campusAddress', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nodal Officer / Principal Name <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  value={formData.nodalOfficerName}
                  onChange={(e) => handleChange('nodalOfficerName', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
                {errors.nodalOfficerName && <p className="text-red-600 text-[11px] mt-1">{errors.nodalOfficerName}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Nodal Email Address</label>
                <input
                  type="email"
                  value={formData.nodalOfficerEmail}
                  onChange={(e) => handleChange('nodalOfficerEmail', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: APPLICATION TYPE */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#102D52]">Step 2: Category of Approval Requested</h3>
              <p className="text-xs text-slate-500">Select the regulatory clause as per APH 2026-27 guidelines.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Application Type <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.applicationType}
                  onChange={(e) => handleChange('applicationType', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Extension of Approval (EoA)">Extension of Approval (EoA) - Annual Maintenance</option>
                  <option value="Increase in Intake">Increase in Intake in Existing Program</option>
                  <option value="Addition of New Course">Introduction of New Undergraduate / PG Course</option>
                  <option value="New Technical Institution">Setting up New Technical Institution</option>
                  <option value="Closure / Merger">Progressive Program Closure</option>
                </select>
                {errors.applicationType && <p className="text-red-600 text-[11px] mt-1">{errors.applicationType}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Academic Session <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  disabled
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-bold font-mono text-[#102D52]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Technical Discipline Category</label>
                <select
                  value={formData.applicationCategory}
                  onChange={(e) => handleChange('applicationCategory', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Engineering & Technology">Engineering &amp; Technology</option>
                  <option value="Management">Management (MBA/PGDM)</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Architecture & Planning">Architecture &amp; Town Planning</option>
                  <option value="Applied Arts">Applied Arts &amp; Crafts</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mode of Study</label>
                <input
                  type="text"
                  value={formData.modeOfStudy}
                  disabled
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: COURSE & INTAKE */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#102D52]">Step 3: Course &amp; Intake Details</h3>
              <p className="text-xs text-slate-500">Provide course naming and student seating capacity.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Program / Course Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => handleChange('courseName', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
                {errors.courseName && <p className="text-red-600 text-[11px] mt-1">{errors.courseName}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Existing Approved Intake (Seats)</label>
                <input
                  type="number"
                  value={formData.existingIntake}
                  onChange={(e) => handleChange('existingIntake', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Proposed Intake Capacity (Seats) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  value={formData.proposedIntake}
                  onChange={(e) => handleChange('proposedIntake', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
                {errors.proposedIntake && <p className="text-red-600 text-[11px] mt-1">{errors.proposedIntake}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Justification for Program / Expansion</label>
                <textarea
                  rows={2}
                  value={formData.intakeJustification}
                  onChange={(e) => handleChange('intakeJustification', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: FACULTY CADRE */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#102D52]">Step 4: Teaching Faculty Cadre Matrix</h3>
              <p className="text-xs text-slate-500">Provide faculty count satisfying the 1:15 or 1:20 SFR norms.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Full-Time Faculty <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  value={formData.totalFaculty}
                  onChange={(e) => handleChange('totalFaculty', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold"
                />
                {errors.totalFaculty && <p className="text-red-600 text-[11px] mt-1">{errors.totalFaculty}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professors <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  value={formData.professorsCount}
                  onChange={(e) => handleChange('professorsCount', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
                {errors.professorsCount && <p className="text-red-600 text-[11px] mt-1">{errors.professorsCount}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Associate Professors</label>
                <input
                  type="number"
                  value={formData.associateProfessorsCount}
                  onChange={(e) => handleChange('associateProfessorsCount', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assistant Professors</label>
                <input
                  type="number"
                  value={formData.assistantProfessorsCount}
                  onChange={(e) => handleChange('assistantProfessorsCount', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 mt-4">
              <span className="font-bold">Norm Rule (APH 2026-27 Cadre Ratio): </span>
              <span>Cadre ratio (Professor : Associate Professor : Assistant Professor) should conform to 1 : 2 : 6 in all technical departments.</span>
            </div>
          </div>
        )}

        {/* STEP 5: INFRASTRUCTURE */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#102D52]">Step 5: Land, Built-Up Space &amp; Safety Compliance</h3>
              <p className="text-xs text-slate-500">Provide verified carpet area and civic safety records.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Contiguous Land Area (Acres) <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.totalLandAreaAcres}
                  onChange={(e) => handleChange('totalLandAreaAcres', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
                {errors.totalLandAreaAcres && <p className="text-red-600 text-[11px] mt-1">{errors.totalLandAreaAcres}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Built-Up Floor Area (Sq. Metres) <span className="text-red-600">*</span></label>
                <input
                  type="number"
                  value={formData.totalBuiltUpAreaSqM}
                  onChange={(e) => handleChange('totalBuiltUpAreaSqM', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
                {errors.totalBuiltUpAreaSqM && <p className="text-red-600 text-[11px] mt-1">{errors.totalBuiltUpAreaSqM}</p>}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Number of Equipped Classrooms</label>
                <input
                  type="number"
                  value={formData.classroomsCount}
                  onChange={(e) => handleChange('classroomsCount', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Number of Technical Laboratories</label>
                <input
                  type="number"
                  value={formData.laboratoriesCount}
                  onChange={(e) => handleChange('laboratoriesCount', e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Civic Fire &amp; Safety NOC Certificate Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fireSafetyNocNumber}
                  onChange={(e) => handleChange('fireSafetyNocNumber', e.target.value)}
                  placeholder="e.g. FSC-BPL-2026-REV"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                />
                {errors.fireSafetyNocNumber && <p className="text-red-600 text-[11px] mt-1">{errors.fireSafetyNocNumber}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: DECLARATION & REVIEW */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-[#102D52]">Step 6: Statutory Review &amp; Digital Submission</h3>
              <p className="text-xs text-slate-500">Review all entered data and accept statutory compliance clauses.</p>
            </div>

            {/* Summary Review Card */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs space-y-3">
              <div className="font-bold text-[#102D52] uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>Application Summary Preview</span>
                <span className="font-mono text-[10px] text-slate-500">DEMO RECORD</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block">Institution:</span>
                  <span className="font-semibold text-slate-800">{formData.institutionName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">AISHE Code:</span>
                  <span className="font-mono font-semibold text-slate-800">{formData.aisheCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Application Type:</span>
                  <span className="font-semibold text-slate-800">{formData.applicationType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Target Program:</span>
                  <span className="font-semibold text-slate-800">{formData.courseName} ({formData.proposedIntake} Seats)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Faculty Cadre:</span>
                  <span className="font-semibold text-slate-800">{formData.totalFaculty} Total (P: {formData.professorsCount}, Asc: {formData.associateProfessorsCount}, Ast: {formData.assistantProfessorsCount})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Infrastructure:</span>
                  <span className="font-semibold text-slate-800">{formData.totalLandAreaAcres} Acres · {formData.totalBuiltUpAreaSqM} sq.m</span>
                </div>
              </div>
            </div>

            {/* Statutory Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start space-x-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={formData.statutoryDeclaration}
                  onChange={(e) => handleChange('statutoryDeclaration', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#102D52] mt-0.5"
                />
                <span className="text-slate-700 leading-relaxed">
                  I hereby certify on behalf of the Governing Board that all information, land deeds, and faculty rosters submitted herein are authentic and strictly comply with the AICTE Approval Process Handbook 2026-27 norms.
                </span>
              </label>
              {errors.statutoryDeclaration && <p className="text-red-600 text-[11px] ml-6">{errors.statutoryDeclaration}</p>}

              <label className="flex items-start space-x-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={formData.penalClauseAccepted}
                  onChange={(e) => handleChange('penalClauseAccepted', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#102D52] mt-0.5"
                />
                <span className="text-slate-700 leading-relaxed">
                  I understand that this is a simulated submission in the Smart India Hackathon prototype environment (Problem ID: 26261). No real AICTE approval is generated.
                </span>
              </label>
              {errors.penalClauseAccepted && <p className="text-red-600 text-[11px] ml-6">{errors.penalClauseAccepted}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Form Navigation Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 font-bold text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold"
          >
            Cancel
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-[#102D52] hover:bg-[#1D4ED8] text-white font-bold shadow-xs"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center space-x-1.5 px-6 py-2 rounded-lg bg-[#E05A18] hover:bg-[#C2410C] text-white font-bold shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Submit Application (Simulated)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepApplicationForm;
