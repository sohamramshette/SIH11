/**
 * Data store for AICTE Application Validation, Document Authentication
 * and Regulatory Compliance Verification System (SIH Problem Statement ID: 26261)
 */

export const tickerAnnouncements = [
  {
    id: 'ann-1',
    tag: 'REGULATORY UPDATE',
    text: 'AICTE Approval Process Handbook (APH) 2026-27 compliance matrices active for preliminary audit.',
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
    label: 'Applications Submitted',
    value: '14,820+',
    subtext: 'Institutional submissions in demo environment',
    metricType: 'Cumulative',
  },
  {
    id: 'stat-2',
    label: 'Validations Completed',
    value: '12,450+',
    subtext: 'Automated multi-point compliance checks',
    metricType: 'Processed',
  },
  {
    id: 'stat-3',
    label: 'Documents Flagged for Review',
    value: '860',
    subtext: 'Evidence anomalies requiring scrutiny officer attention',
    metricType: 'Exceptions',
  },
  {
    id: 'stat-4',
    label: 'Cases Awaiting Review',
    value: '1,510',
    subtext: 'In queue for authorized human committee scrutiny',
    metricType: 'Pending',
  },
];

export const features = [
  {
    id: 'feat-1',
    title: 'Intelligent Application Validation',
    badge: 'Automated Screening',
    description:
      'Instantly parses multi-page institutional applications, land deeds, and building plans against AICTE regulatory requirements with structured semantic extraction.',
    iconName: 'FileCheck2',
    referenceNorm: 'APH 2026-27 § 2.4.1',
    highlights: ['Multi-page document parsing', 'Auto-fill compliance matrix', 'Entity cross-referencing'],
  },
  {
    id: 'feat-2',
    title: 'Document Authentication & Anomaly Detection',
    badge: 'Integrity Engine',
    description:
      'Identifies document tampering, altered stamps, mismatched signatures, forged NOCs, and duplicated faculty credentials across participating institutions.',
    iconName: 'ShieldAlert',
    referenceNorm: 'APH 2026-27 § 4.1.2',
    highlights: ['Stamp & signature tamper checks', 'Faculty Aadhaar/PAN deduplication', 'Metadata integrity audit'],
  },
  {
    id: 'feat-3',
    title: 'Regulatory Compliance Assistance',
    badge: 'Rule Engine',
    description:
      'Performs deterministic evaluations for land area requirements, built-up space norms, student-faculty ratios (SFR), and laboratory equipment benchmarks.',
    iconName: 'Scale',
    referenceNorm: 'AICTE Act 1987 § 10(k)',
    highlights: ['Cadre ratio verification', 'Built-up area calculus', 'Geospatial boundary verification'],
  },
  {
    id: 'feat-4',
    title: 'Evidence-Linked Reports & Audit Trails',
    badge: 'Accountability',
    description:
      'Provides scrutiny committees with pixel-level coordinate citations for any detected variance, backed by tamper-evident cryptographic audit logs.',
    iconName: 'FileSpreadsheet',
    referenceNorm: 'CVC Audit Directives',
    highlights: ['Coordinate-linked citations', 'Immutable decision logs', 'Executive compliance summary'],
  },
];

export const workflowSteps = [
  {
    step: 1,
    number: '01',
    title: 'Application Submission',
    badge: 'Institutional Portal',
    badgeColor: 'blue',
    timeline: 'Initial Filing',
    description:
      'Technical institutions upload statutory documents including land ownership deeds, building approvals, structural safety certificates, and faculty rosters.',
    status: 'Digital Ingestion',
    keyAction: 'Cryptographic hashing on upload to ensure document immutability.',
  },
  {
    step: 2,
    number: '02',
    title: 'Automated Validation',
    badge: 'AI & Rule Engine',
    badgeColor: 'amber',
    timeline: 'Instant Analysis',
    description:
      'Multi-engine pipeline performs high-accuracy OCR, spatial verification, anomaly detection, and cross-checks data against AICTE handbook matrices.',
    status: 'Automated Processing',
    keyAction: 'Cross-checks faculty across all state databases to prevent ghost faculty.',
  },
  {
    step: 3,
    number: '03',
    title: 'Authorized Officer Review',
    badge: 'Scrutiny Committee',
    badgeColor: 'indigo',
    timeline: 'Human Oversight',
    description:
      'Designated AICTE scrutiny officers inspect evidence-linked flags, review highlighted discrepancies, and record formal verification remarks.',
    status: 'Officer Evaluation',
    keyAction: 'Officers examine direct side-by-side evidence before submitting evaluation.',
  },
  {
    step: 4,
    number: '04',
    title: 'Regulatory Decision',
    badge: 'Competent Authority',
    badgeColor: 'emerald',
    timeline: 'Final Order',
    description:
      'Competent statutory authorities review synthesized scrutiny reports to grant institutional approval, request clarifications, or issue deficiency notices.',
    status: 'Statutory Order',
    keyAction: 'Final decisions remain exclusively with empowered AICTE authorities.',
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
    securityLevel: '100% Traceable',
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
