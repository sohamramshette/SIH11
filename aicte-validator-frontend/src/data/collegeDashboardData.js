/**
 * Synthetic Demo Data for AICTE College Dashboard (Phase 4)
 * SIH Problem Statement ID: 26261
 * 
 * NOTE: All records, application details, and validation flags herein
 * are strictly simulated for prototype demonstration.
 */

export const collegeSidebarNavItems = [
  { id: 'overview', label: 'Overview', iconName: 'LayoutDashboard' },
  { id: 'my-applications', label: 'My Applications', iconName: 'FileSpreadsheet', badge: '3' },
  { id: 'submit-application', label: 'Submit Application', iconName: 'FilePlus2' },
  { id: 'document-uploads', label: 'Document Uploads', iconName: 'UploadCloud', badge: '7' },
  { id: 'validation-results', label: 'Validation Results', iconName: 'CheckCircle2', badge: '4', badgeColor: 'bg-amber-400 text-slate-950' },
  { id: 'queries', label: 'Queries & Clarifications', iconName: 'HelpCircle', badge: '1', badgeColor: 'bg-red-500 text-white' },
  { id: 'profile', label: 'College Profile', iconName: 'Building2' },
];

export const demoCollegeProfile = {
  institutionName: 'Bhartiya Institute of Technology & Science',
  shortName: 'BITS Bhopal',
  aisheCode: 'C-49210',
  permanentId: '1-49210492',
  institutionType: 'Private Self-Financing Technical Institute',
  establishedYear: '2008',
  affiliatedUniversity: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)',
  region: 'Central Region (Bhopal)',
  state: 'Madhya Pradesh',
  district: 'Bhopal',
  pinCode: '462036',
  campusAddress: 'Sector 4, Gandhinagar Bypass Road, Bhopal - 462036, Madhya Pradesh',
  nodalOfficer: {
    name: 'Dr. Arvind Joshi',
    designation: 'Principal & Authorized Institutional Signatory',
    email: 'principal@engg-college.demo.edu.in',
    phone: '+91 755 2490123',
    mobile: '+91 98260 12345',
  },
  approvedPrograms: [
    { program: 'B.Tech Computer Science & Engineering', intake: 60, approvedYear: '2008' },
    { program: 'B.Tech Electronics & Communication', intake: 60, approvedYear: '2008' },
    { program: 'B.Tech Mechanical Engineering', intake: 60, approvedYear: '2010' },
    { program: 'B.Tech Civil Engineering', intake: 60, approvedYear: '2012' },
    { program: 'M.Tech Computer Science', intake: 18, approvedYear: '2015' },
  ],
  totalApprovedIntake: 258,
  landAreaAcres: 7.5,
  builtUpAreaSqM: 14200,
};

export const collegeSummaryStats = [
  {
    id: 'stat-total',
    title: 'Total Applications',
    value: '5',
    subtext: 'Cumulative historical & active submissions',
    iconName: 'FileText',
    trend: 'AY 2026-27 Active',
  },
  {
    id: 'stat-draft',
    title: 'Draft Applications',
    value: '1',
    subtext: 'Unsubmitted application in progress',
    iconName: 'Edit3',
    trend: 'Incomplete',
  },
  {
    id: 'stat-review',
    title: 'Applications Under Review',
    value: '2',
    subtext: 'Scrutiny committee inspection active',
    iconName: 'Clock',
    trend: '2 In Queue',
  },
  {
    id: 'stat-attention',
    title: 'Requiring Attention',
    value: '1',
    subtext: 'Clarification query pending college reply',
    iconName: 'AlertTriangle',
    trend: 'Action Required',
  },
];

export const collegeApplications = [
  {
    id: 'APP-2026-ENG-1042',
    applicationType: 'Extension of Approval (EoA)',
    submissionDate: '18 Oct 2026',
    currentStatus: 'Under Review',
    statusSeverity: 'info',
    lastUpdated: '22 Oct 2026',
    academicYear: '2026-27',
    assignedOfficer: 'Dr. R. K. Sharma (Scrutiny Officer - Gr. I)',
    documentsCount: 16,
    flaggedCount: 0,
    requestedIntake: 258,
    summary: 'Annual Extension of Approval filing for existing B.Tech & M.Tech engineering programs.',
    remarks: 'Preliminary semantic extractions passed. Queued for scrutiny committee committee review.',
  },
  {
    id: 'APP-2026-ENG-1043',
    applicationType: 'Increase in Intake',
    submissionDate: '19 Oct 2026',
    currentStatus: 'Review Required',
    statusSeverity: 'warning',
    lastUpdated: '23 Oct 2026',
    academicYear: '2026-27',
    assignedOfficer: 'Dr. R. K. Sharma (Scrutiny Officer - Gr. I)',
    documentsCount: 14,
    flaggedCount: 1,
    requestedIntake: 318,
    summary: 'Request for 60-seat expansion in B.Tech Computer Science & Engineering (from 60 to 120 seats).',
    remarks: 'Scrutiny query CQ-104 issued regarding Faculty Cadre Ratio for requested CSE intake expansion.',
  },
  {
    id: 'APP-2026-ENG-DRAFT',
    applicationType: 'Addition of New Course',
    submissionDate: 'Not Submitted',
    currentStatus: 'Draft Mode',
    statusSeverity: 'draft',
    lastUpdated: '21 Oct 2026',
    academicYear: '2026-27',
    assignedOfficer: 'Unassigned (Draft)',
    documentsCount: 8,
    flaggedCount: 0,
    requestedIntake: 60,
    summary: 'Introduction of new 4-year undergraduate program: B.Tech in Artificial Intelligence & Machine Learning.',
    remarks: 'Draft application saved. Laboratory equipment rosters and syllabus approval pending final review.',
  },
  {
    id: 'APP-2025-ENG-0891',
    applicationType: 'Extension of Approval (EoA)',
    submissionDate: '12 Nov 2024',
    currentStatus: 'Completed',
    statusSeverity: 'success',
    lastUpdated: '20 Dec 2024',
    academicYear: '2025-26',
    assignedOfficer: 'Prof. Ananya Sen',
    documentsCount: 16,
    flaggedCount: 0,
    requestedIntake: 258,
    summary: 'Annual EoA approval for AY 2025-26. Approved with zero regulatory deficiencies.',
    remarks: 'Statutory approval letter AICTE/CRO/2025/1-49210492 issued and archived.',
  },
];

export const pendingCollegeActions = [
  {
    id: 'act-1',
    title: 'Respond to Clarification Query #Q-104',
    category: 'Scrutiny Query',
    deadline: '26 Oct 2026 (3 Days Left)',
    targetApp: 'APP-2026-ENG-1043',
    priority: 'High',
    description: 'Provide explanation or appointment order regarding Professor cadre in Computer Science & Engineering.',
  },
  {
    id: 'act-2',
    title: 'Upload Fire Safety Renewal Endorsement',
    category: 'Document Compliance',
    deadline: '28 Oct 2026 (5 Days Left)',
    targetApp: 'APP-2026-ENG-1042',
    priority: 'Medium',
    description: 'Submit civic municipality endorsement receipt for renewal of building fire safety certificate.',
  },
  {
    id: 'act-3',
    title: 'Finalize Draft Application for B.Tech AI & ML',
    category: 'Application Draft',
    deadline: '31 Oct 2026 (8 Days Left)',
    targetApp: 'APP-2026-ENG-DRAFT',
    priority: 'Normal',
    description: 'Complete Steps 4 to 6 of the new course application before the Phase 1 submission window closes.',
  },
];

export const recentCollegeActivity = [
  {
    id: 'c-act-1',
    title: 'Scrutiny Query Received (#Q-104)',
    time: '2 hours ago',
    description: 'Dr. R. K. Sharma issued a query on Faculty Cadre Ratio for APP-2026-ENG-1043.',
    type: 'query',
  },
  {
    id: 'c-act-2',
    title: 'Automated OCR Semantic Validation Completed',
    time: '1 day ago',
    description: '16 documents in APP-2026-ENG-1042 successfully validated against APH 2026-27 format matrices.',
    type: 'validation',
  },
  {
    id: 'c-act-3',
    title: 'Draft Application Saved',
    time: '2 days ago',
    description: 'Step 3 (Course & Intake Details) updated for new B.Tech AI & ML program proposal.',
    type: 'draft',
  },
  {
    id: 'c-act-4',
    title: 'Intake Expansion Application Filed',
    time: '4 days ago',
    description: 'Application APP-2026-ENG-1043 submitted and cryptographically timestamped on portal.',
    type: 'submission',
  },
];

export const initialDocumentChecklist = [
  {
    id: 'doc-affil',
    category: 'Institution Approval & Affiliation',
    name: 'University Affiliation & AICTE Previous Approval Letter',
    requirement: 'Mandatory',
    handbookNorm: 'APH 2026-27 § 1.3',
    status: 'Uploaded',
    fileName: 'RGPV_Affiliation_2026_27_Certified.pdf',
    fileSize: '2.4 MB',
    uploadedDate: '18 Oct 2026',
  },
  {
    id: 'doc-land',
    category: 'Land Ownership & Lease Documents',
    name: 'Registered Land Ownership Deed & Non-Encumbrance Certificate',
    requirement: 'Mandatory',
    handbookNorm: 'APH 2026-27 § 2.1',
    status: 'Uploaded',
    fileName: 'Land_Title_Deed_7_5_Acres_Signed.pdf',
    fileSize: '4.8 MB',
    uploadedDate: '18 Oct 2026',
  },
  {
    id: 'doc-building',
    category: 'Building & Infrastructure Certificates',
    name: 'Approved Master Building Plan & Structural Stability Certificate',
    requirement: 'Mandatory',
    handbookNorm: 'APH 2026-27 § 2.3',
    status: 'Uploaded',
    fileName: 'Master_Building_Plan_PWD_Endorsed.pdf',
    fileSize: '6.1 MB',
    uploadedDate: '18 Oct 2026',
  },
  {
    id: 'doc-fire',
    category: 'Fire Safety Certificate',
    name: 'Civic Fire & Emergency Safety No Objection Certificate (NOC)',
    requirement: 'Mandatory',
    handbookNorm: 'APH 2026-27 § 2.4',
    status: 'Renewal Required',
    fileName: 'Fire_Safety_NOC_Bhopal_Municipal.pdf',
    fileSize: '1.8 MB',
    uploadedDate: '18 Oct 2026',
  },
  {
    id: 'doc-faculty',
    category: 'Faculty Details',
    name: 'Staff Roster, Qualifications & Bank Salary Disbursement Statement',
    requirement: 'Mandatory',
    handbookNorm: 'AICTE Act 1987 § 10(k)',
    status: 'Uploaded',
    fileName: 'Faculty_Cadre_Roster_AY2026_27.pdf',
    fileSize: '3.2 MB',
    uploadedDate: '19 Oct 2026',
  },
  {
    id: 'doc-affidavits',
    category: 'Statutory Affidavits',
    name: 'Anti-Ragging, Non-Capitation & Grievance Redressal Affidavits',
    requirement: 'Mandatory',
    handbookNorm: 'APH 2026-27 § 4.2',
    status: 'Uploaded',
    fileName: 'Statutory_Affidavits_Stamp_Paper.pdf',
    fileSize: '2.1 MB',
    uploadedDate: '19 Oct 2026',
  },
  {
    id: 'doc-barrier-free',
    category: 'Barrier-Free Environment',
    name: 'Divyangjan Accessibility, Lifts & Ramp Certificate',
    requirement: 'Mandatory',
    handbookNorm: 'RPwD Act 2016',
    status: 'Uploaded',
    fileName: 'Accessibility_Audit_Certificate.pdf',
    fileSize: '1.5 MB',
    uploadedDate: '19 Oct 2026',
  },
];

export const simulatedValidationResults = [
  {
    id: 'val-1',
    documentOrField: 'Land Ownership Title Deed (Contiguous Campus Plot)',
    normReference: 'APH 2026-27 § 2.1 (Land Norms)',
    status: 'Passed Preliminary Check',
    statusSeverity: 'success',
    explanation:
      'Automated semantic check verifies 7.50 acres contiguous titled land parcel. Exceeds the mandated minimum of 7.00 acres for central technical institutions.',
    suggestedAction:
      'No institutional action required. Document hash verified against state registration format; queued for officer review.',
  },
  {
    id: 'val-2',
    documentOrField: 'Faculty Cadre Ratio (B.Tech Computer Science)',
    normReference: 'AICTE Act 1987 § 10(k) & APH Table 2.1',
    status: 'Review Required',
    statusSeverity: 'warning',
    explanation:
      'Proposed intake increase from 60 to 120 seats requires 1 Professor, 2 Associate Professors, and 6 Assistant Professors. Current verified roster contains 0 full Professors in CSE.',
    suggestedAction:
      'Upload appointment order, promotion notification, or governing board resolution for designated Professor in CSE under Queries & Clarifications.',
  },
  {
    id: 'val-3',
    documentOrField: 'Civic Fire & Emergency Safety NOC',
    normReference: 'APH 2026-27 § 2.4.1 (Safety Clearances)',
    status: 'Missing Information',
    statusSeverity: 'warning',
    explanation:
      'Uploaded fire clearance certificate shows expiry date of 30 September 2026. Official renewal endorsement stamp from Municipal Fire Officer is unverified.',
    suggestedAction:
      'Upload the latest renewal endorsement certificate or official municipal acknowledgment receipt under Document Uploads.',
  },
  {
    id: 'val-4',
    documentOrField: 'Faculty Cross-Institutional Deduplication',
    normReference: 'APH 2026-27 § 4.1.2 (Cadre Integrity)',
    status: 'Possible Inconsistency',
    statusSeverity: 'danger',
    explanation:
      'Assistant Professor in Electrical Engineering (Faculty ID: FAC-MP-8419) matched active employment records in another regional institute database.',
    suggestedAction:
      'Submit formal relieving order, resignation acceptance, and Form 16 from previous institution to verify exclusive faculty appointment.',
  },
];

export const initialQueriesData = [
  {
    id: 'CQ-104',
    applicationId: 'APP-2026-ENG-1043',
    subject: 'Clarification regarding Professor Cadre in CSE for 60-seat Intake Expansion',
    officer: 'Dr. R. K. Sharma (Scrutiny Officer - Gr. I)',
    date: '22 Oct 2026',
    deadline: '26 Oct 2026',
    status: 'Pending College Response',
    queryText:
      'With reference to application APP-2026-ENG-1043 requesting intake expansion in B.Tech CSE (60 to 120 seats): As per APH 2026-27 Table 2.1.4, an intake of 120 students in Computer Science requires at least one full Professor in the department cadre. Kindly provide a verified copy of the appointment order and joining report of the Professor in CSE.',
    collegeResponse: '',
    submittedAt: null,
  },
  {
    id: 'CQ-102',
    applicationId: 'APP-2026-ENG-1042',
    subject: 'Non-Encumbrance Certificate Validity Period',
    officer: 'Dr. R. K. Sharma (Scrutiny Officer - Gr. I)',
    date: '19 Oct 2026',
    deadline: '23 Oct 2026',
    status: 'Response Submitted',
    queryText:
      'The uploaded non-encumbrance certificate covers the period up to December 2025. Please confirm if an updated certificate up to current fiscal year has been registered with Sub-Registrar Office Bhopal.',
    collegeResponse:
      'Updated Non-Encumbrance Certificate issued by the Sub-Registrar Office Bhopal (Serial #NEC-2026-9041) covering period up to 30 September 2026 has been uploaded to the document repository under Land Ownership Deed.',
    submittedAt: '20 Oct 2026, 14:30 IST',
  },
];
