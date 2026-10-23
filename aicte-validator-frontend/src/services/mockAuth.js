/**
 * Mock Authentication Service
 * 
 * DEVELOPMENT & PROTOTYPE USE ONLY.
 * This service provides isolated mock-authentication logic for frontend navigation testing
 * and role-based redirect simulation during Phase 2.
 * 
 * IMPORTANT:
 * - No real sessions or tokens are generated.
 * - No passwords are stored in localStorage or sessionStorage.
 * - This will be replaced by services/api.js when backend auth is available.
 */

export const DEMO_ROLES = [
  {
    id: 'admin',
    roleName: 'System Admin',
    description: 'System Administration, RBAC & Regulatory Rule Engine',
    email: 'admin.sih@aicte-demo.gov.in',
    defaultUserId: 'AICTE-ADM-001',
    targetRoute: '/admin',
    badge: 'Administrator',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  {
    id: 'college',
    roleName: 'College Representative',
    description: 'Institutional Compliance Filing & Document Submission',
    email: 'principal@engg-college.demo.edu.in',
    defaultUserId: 'COLLEGE-INST-104',
    targetRoute: '/college',
    badge: 'Educational Institution',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  {
    id: 'verification',
    roleName: 'Verification Officer',
    description: 'Document Scrutiny Queue & Evidence Inspection',
    email: 'scrutiny.officer@aicte-demo.gov.in',
    defaultUserId: 'SCRUTINY-OFF-202',
    targetRoute: '/verification',
    badge: 'Scrutiny Committee',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
  },
  {
    id: 'senior-officer',
    roleName: 'Senior AICTE Officer',
    description: 'Regional Directorate & Statutory Approval Sign-off',
    email: 'regional.director@aicte-demo.gov.in',
    defaultUserId: 'AICTE-DIR-303',
    targetRoute: '/senior-officer',
    badge: 'Approval Authority',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
  },
];

/**
 * Validate input fields for login
 * @param {string} identifier - Email or User ID
 * @param {string} password - Password string
 * @returns {{ isValid: boolean, errors: { identifier?: string, password?: string } }}
 */
export const validateLoginForm = (identifier, password) => {
  const errors = {};

  const trimmedIdentifier = identifier ? identifier.trim() : '';

  if (!trimmedIdentifier) {
    errors.identifier = 'Email or User ID is required.';
  } else if (trimmedIdentifier.includes('@')) {
    // If user attempted to enter an email, validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedIdentifier)) {
      errors.identifier = 'Please enter a valid email address (e.g., officer@aicte.gov.in).';
    }
  } else if (trimmedIdentifier.length < 3) {
    errors.identifier = 'User ID must be at least 3 characters long.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters for demo mode.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Simulate authentication and resolve target route based on selected demo role.
 * 
 * @param {Object} credentials
 * @param {string} credentials.identifier
 * @param {string} credentials.password
 * @param {string} credentials.roleId
 * @returns {Promise<{ success: boolean, targetRoute: string, user: Object }>}
 */
export const mockLogin = async ({ identifier, password, roleId }) => {
  // Validate credentials first
  const { isValid, errors } = validateLoginForm(identifier, password);
  if (!isValid) {
    const errorMsg = errors.identifier || errors.password || 'Invalid credentials.';
    return Promise.reject(new Error(errorMsg));
  }

  // Simulate network latency (350ms) for realistic loading feedback
  await new Promise((resolve) => setTimeout(resolve, 350));

  const role = DEMO_ROLES.find((r) => r.id === roleId) || DEMO_ROLES[0];

  return {
    success: true,
    targetRoute: role.targetRoute,
    user: {
      name: role.roleName,
      identifier: identifier.trim(),
      roleId: role.id,
      roleName: role.roleName,
      isDemo: true,
    },
  };
};
