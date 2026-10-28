import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for attaching JWT auth token
api.interceptors.request.use(
  (config) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('aicte_auth_token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // localStorage unavailable in SSR
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling centralized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem('aicte_auth_token');
        localStorage.removeItem('aicte_user_profile');
      } catch {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

// Default passwords map for seamless 1-click prototype role switching
export const ROLE_DEFAULT_PASSWORDS = {
  admin: 'admin123',
  college: 'college123',
  verification: 'officer123',
  'senior-officer': 'director123',
};

/**
 * Authentication service wrapping live FastAPI endpoints with graceful fallback
 */
export const authService = {
  async login(identifier, password, roleId) {
    try {
      const response = await api.post('/auth/login', {
        identifier: identifier.trim(),
        password: password || ROLE_DEFAULT_PASSWORDS[roleId] || 'password123',
        role_id: roleId,
      });

      if (response.data && response.data.access_token) {
        localStorage.setItem('aicte_auth_token', response.data.access_token);
        localStorage.setItem('aicte_user_profile', JSON.stringify(response.data.user));
      }
      return { success: true, data: response.data, isLive: true };
    } catch (err) {
      console.warn('Backend API login encountered an issue. Falling back to local state:', err.message);
      return { success: false, error: err, isLive: false };
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch {
      return null;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('aicte_auth_token');
      localStorage.removeItem('aicte_user_profile');
    }
  },
};

/**
 * Document service wrapping live ingestion, Sarvam Document AI OCR and Extracted Fields
 */
export const documentService = {
  async uploadDocument(appId, file, category, title, syncProcess = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('title', title);

    const response = await api.post(
      `/applications/${appId}/documents/upload?sync_process=${syncProcess}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  async listDocuments(appId) {
    const response = await api.get(`/applications/${appId}/documents`);
    return response.data;
  },

  async getDocument(docId) {
    const response = await api.get(`/documents/${docId}`);
    return response.data;
  },

  async getDocumentOcr(docId) {
    const response = await api.get(`/documents/${docId}/ocr`);
    return response.data;
  },

  async getDocumentFields(docId) {
    const response = await api.get(`/documents/${docId}/fields`);
    return response.data;
  },

  async reprocessDocument(docId, syncProcess = false) {
    const response = await api.post(`/documents/${docId}/reprocess?sync_process=${syncProcess}`);
    return response.data;
  },

  async overrideField(docId, fieldId, value, reason) {
    const response = await api.patch(`/documents/${docId}/fields/${fieldId}`, {
      field_value: value,
      override_reason: reason,
    });
    return response.data;
  },

  async getDocumentForensics(docId) {
    const response = await api.get(`/documents/${docId}/forensics`);
    return response.data;
  },

  async getDocumentFindings(docId) {
    const response = await api.get(`/documents/${docId}/findings`);
    return response.data;
  },
};

/**
 * Compliance service for APH 2026-27 rules and cross-institutional faculty deduplication
 */
export const complianceService = {
  async listRules() {
    const response = await api.get('/rules');
    return response.data;
  },

  async getApplicationRules(appId) {
    const response = await api.get(`/applications/${appId}/rules`);
    return response.data;
  },

  async evaluateRules(appId) {
    const response = await api.post(`/applications/${appId}/rules/evaluate`);
    return response.data;
  },

  async getDeduplication(appId) {
    const response = await api.get(`/applications/${appId}/deduplication`);
    return response.data;
  },
};

/**
 * Application & Scrutiny Workflow Service
 */
export const applicationService = {
  async listApplications(params = {}) {
    const response = await api.get('/applications', { params });
    return response.data;
  },

  async getApplication(appId) {
    const response = await api.get(`/applications/${appId}`);
    return response.data;
  },

  async createApplication(data) {
    const response = await api.post('/applications', data);
    return response.data;
  },

  async getTimeline(appId) {
    const response = await api.get(`/applications/${appId}/timeline`);
    return response.data;
  },

  async issueQuery(appId, data) {
    const response = await api.post(`/applications/${appId}/queries`, data);
    return response.data;
  },

  async listQueries(appId) {
    const response = await api.get(`/applications/${appId}/queries`);
    return response.data;
  },

  async respondQuery(queryId, data) {
    const response = await api.post(`/queries/${queryId}/respond`, data);
    return response.data;
  },

  async escalateApplication(appId, data) {
    const response = await api.post(`/applications/${appId}/escalate`, data);
    return response.data;
  },

  async listEscalations(appId) {
    const response = await api.get(`/applications/${appId}/escalations`);
    return response.data;
  },

  async recordDecision(appId, data) {
    const response = await api.post(`/applications/${appId}/decisions`, data);
    return response.data;
  },

  async listDecisions(appId) {
    const response = await api.get(`/applications/${appId}/decisions`);
    return response.data;
  },
};

/**
 * Cryptographic Audit Ledger Service
 */
export const auditService = {
  async getTrail(params = {}) {
    const response = await api.get('/audit/trail', { params });
    return response.data;
  },

  async verifyChain() {
    const response = await api.get('/audit/verify-chain');
    return response.data;
  },

  async getApplicationTrail(appId) {
    const response = await api.get(`/audit/applications/${appId}`);
    return response.data;
  },
};

/**
 * Compliance Reports & Analytics Service
 */
export const reportService = {
  async getComplianceMetrics() {
    const response = await api.get('/reports/compliance');
    return response.data;
  },

  getExportCsvUrl(params = {}) {
    const query = new URLSearchParams(params).toString();
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    return `${base}/reports/export-csv${query ? `?${query}` : ''}`;
  },

  async downloadExportCsv(params = {}) {
    const response = await api.get('/reports/export-csv', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;




