/**
 * Data store for AICTE Application Validation, Document Authentication
 * and Regulatory Compliance Verification System (SIH Problem Statement ID: 26261)
 */

export const tickerAnnouncements = [
  {
    id: 'ann-1',
    tag: 'PROTOTYPE NOTICE',
    text: 'Student prototype evaluation model for AICTE application validation and compliance assistance.',
    link: '#features',
    external: false,
  },
  {
    id: 'ann-2',
    tag: 'SYSTEM NOTICE',
    text: 'Document Verification Engine v2.4 initialized with multi-layer OCR & geospatial boundary cross-checks.',
    link: '#workflow',
    external: false,
  },
  {
    id: 'ann-3',
    tag: 'STUDENT PROTOTYPE',
    text: 'Smart India Hackathon demonstration model — strictly for evaluation and prototype testing.',
    link: '#safeguards',
    external: false,
  },
  {
    id: 'ann-4',
    tag: 'GUIDELINE',
    text: 'All AI-flagged discrepancies require mandatory verification by authorized AICTE scrutiny officers.',
    link: '#safeguards',
    external: false,
  },
];

export const statistics = [
  {
    id: 'stat-1',
    label: 'Applications in Demo Queue',
    value: '14',
    subtext: 'Mock applications loaded in prototype state',
    metricType: 'Mock Dataset',
  },
  {
    id: 'stat-2',
    label: 'Scrutiny Reviews Completed',
    value: '5',
    subtext: 'Simulated applications with completed validations',
    metricType: 'Processed',
  },
  {
    id: 'stat-3',
    label: 'Documents Flagged for Review',
    value: '5',
    subtext: 'Discrepancy anomalies identified for officer inspection',
    metricType: 'Exceptions',
  },
  {
    id: 'stat-4',
    label: 'Cases Awaiting Review',
    value: '4',
    subtext: 'Applications in queue for authorized scrutiny sign-off',
    metricType: 'Pending',
  },
];

export const features = [
  {
    id: 'feat-1',
    title: 'Application Validation',
    badge: 'Form Checks',
    description:
      'Checks application fields for missing information, incomplete entries, and inconsistencies.',
    iconName: 'FileCheck2',
    referenceNorm: 'Input Validation',
    highlights: [
      'Required-field checks',
      'Application completeness',
      'Inconsistent information flags',
    ],
  },
  {
    id: 'feat-2',
    title: 'Document Verification Assistance',
    badge: 'Document Review',
    description:
      'Helps review uploaded documents and highlights items that may need further verification.',
    iconName: 'ShieldAlert',
    referenceNorm: 'Simulated / Prototype',
    highlights: [
      'Document type and field extraction',
      'Missing or expired document checks, where supported',
      'Potential anomaly flags',
    ],
  },
  {
    id: 'feat-3',
    title: 'Compliance Assistance',
    badge: 'Compliance Rules',
    description:
      'Compares available application information against configured compliance rules.',
    iconName: 'Scale',
    referenceNorm: 'Configured Rules',
    highlights: [
      'Rule-based checks',
      'Possible compliance gaps',
      'Evidence-linked findings',
    ],
  },
  {
    id: 'feat-4',
    title: 'Review & Audit Trail',
    badge: 'Officer Workflow',
    description:
      'Helps officers review findings, record remarks, and track case progress.',
    iconName: 'FileSpreadsheet',
    referenceNorm: 'Review Workflow',
    highlights: [
      'Review status',
      'Officer remarks',
      'Case history, where implemented',
    ],
  },
];

export const workflowSteps = [
  {
    step: 1,
    number: '01',
    title: 'Application Submission',
    badge: 'College Portal',
    badgeColor: 'blue',
    timeline: 'Stage 01',
    description: 'College submits application and documents.',
    status: 'Submission',
    keyAction: 'Institutions upload required statutory records and application forms.',
  },
  {
    step: 2,
    number: '02',
    title: 'Automated Checking',
    badge: 'Automated Engine',
    badgeColor: 'amber',
    timeline: 'Stage 02',
    description: 'System checks completeness, extracts information, and flags possible inconsistencies.',
    status: 'Automated Screening',
    keyAction: 'Parses document completeness and flags potential discrepancies.',
  },
  {
    step: 3,
    number: '03',
    title: 'Officer Review & Clarification',
    badge: 'Scrutiny Officer',
    badgeColor: 'indigo',
    timeline: 'Stage 03',
    description: 'Verification officer reviews findings and requests clarification when necessary.',
    status: 'Officer Evaluation',
    keyAction: 'Scrutiny officers examine evidence and request clarifications as needed.',
  },
  {
    step: 4,
    number: '04',
    title: 'Final Authority Decision',
    badge: 'Competent Authority',
    badgeColor: 'emerald',
    timeline: 'Stage 04',
    description: 'Authorized authority makes the final decision.',
    status: 'Authority Decision',
    keyAction: 'Empowered authorities review verified findings to issue final orders.',
  },
];

export const trustPillars = [
  {
    id: 'trust-1',
    title: 'Role-Based Access Control',
    shortTitle: 'Strict RBAC Isolation',
    description:
      'Strict separation of permissions between College Applicants, Document Scrutiny Officers, Regional Officers, and AICTE Directorate with multi-factor authentication.',
    icon: 'Lock',
    securityLevel: 'Enterprise Tier',
  },
  {
    id: 'trust-2',
    title: 'Secure Document Handling',
    shortTitle: 'Tamper-Evident Storage',
    description:
      'Uploaded institutional records are timestamped with SHA-256 cryptographic hashes and encrypted at rest using AES-256 government-grade standards.',
    icon: 'ShieldCheck',
    securityLevel: 'Cryptographic Seal',
  },
  {
    id: 'trust-3',
    title: 'Evidence-Linked Findings',
    shortTitle: 'Coordinate Citations',
    description:
      'The system never makes black-box claims. Every flagged discrepancy cites the specific document page, paragraph, and the corresponding AICTE handbook clause.',
    icon: 'FileSearch',
    securityLevel: 'Evidence-Linked',
  },
  {
    id: 'trust-4',
    title: 'Human Review & Oversight',
    shortTitle: 'Authority Oversight',
    description:
      'AI findings are strictly assistive indicators. All regulatory determinations, deficiency letters, and approvals require the formal sign-off of authorized human officers.',
    icon: 'UserCheck',
    securityLevel: 'Statutory Safeguard',
  },
];

export const sampleRegions = [
  { code: 'NR', name: 'Northern Regional Office (Kanpur)' },
  { code: 'NW', name: 'North-Western Regional Office (Chandigarh)' },
  { code: 'CR', name: 'Central Regional Office (Bhopal)' },
  { code: 'WR', name: 'Western Regional Office (Mumbai)' },
  { code: 'SR', name: 'Southern Regional Office (Chennai)' },
  { code: 'SWR', name: 'South-Western Regional Office (Bangalore)' },
  { code: 'ER', name: 'Eastern Regional Office (Kolkata)' },
  { code: 'SCRO', name: 'South-Central Regional Office (Hyderabad)' },
];

export const complianceStreams = [
  'Engineering & Technology (Undergraduate/Postgraduate)',
  'Management & Business Administration (MBA/PGDM)',
  'Pharmacy Institutions',
  'Architecture & Town Planning',
  'Applied Arts & Crafts and Hotel Management',
  'Polytechnic & Diploma Institutions',
];
