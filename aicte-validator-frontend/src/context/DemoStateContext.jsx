import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';

// Import base datasets
import { demoApplications } from '../data/adminDashboardData';
import {
  collegeApplications,
  initialQueriesData as collegeInitialQueries,
  demoCollegeProfile,
} from '../data/collegeDashboardData';
import {
  assignedApplicationsData,
  officerClarificationQueries,
  officerEscalationsData,
  officerReviewHistory,
} from '../data/verificationDashboardData';
import {
  seniorApplicationsData,
  seniorDecisionHistoryData,
  seniorAuditTrailData,
  demoSeniorOfficerProfile,
} from '../data/seniorOfficerDashboardData';

export const SESSION_STORAGE_KEY = 'aicte_sih_demo_shared_state_v1';

/**
 * Builds normalized master application dataset by merging and reconciling
 * records from all 4 role datasets to eliminate conflicting statuses/IDs.
 */
function buildInitialMasterApplications() {
  const map = new Map();

  // Helper to upsert with field reconciliation
  const upsert = (app) => {
    const existing = map.get(app.id) || {};
    const collegeName = app.collegeName || app.institutionName || existing.collegeName || existing.institutionName || 'Technical Institution';
    const institutionName = collegeName;

    const merged = {
      ...existing,
      ...app,
      collegeName,
      institutionName,
      aisheCode: app.aisheCode || existing.aisheCode || 'C-00000',
      region: app.region || existing.region || 'Central Region',
      priority: app.priority || existing.priority || 'Normal',
      prioritySeverity: app.prioritySeverity || existing.prioritySeverity || 'info',
      currentStatus: app.currentStatus || existing.currentStatus || 'Under Review',
      statusSeverity: app.statusSeverity || existing.statusSeverity || 'info',
      academicYear: app.academicYear || existing.academicYear || '2026-27',
      applicationType: app.applicationType || existing.applicationType || 'Extension of Approval (EoA)',
      assignedOfficer: app.assignedOfficer || existing.assignedOfficer || 'Dr. R. K. Sharma (Scrutiny Officer - Gr. I)',
      verificationOfficer: app.verificationOfficer || existing.verificationOfficer || {
        name: 'Dr. R. K. Sharma',
        id: 'AICTE-SCR-202',
        desk: 'Central Desk #4',
      },
      documentsCount: app.documentsCount ?? existing.documentsCount ?? 14,
      flaggedCount: app.flaggedCount ?? app.flaggedDocuments ?? app.flaggedDocumentsCount ?? existing.flaggedCount ?? 0,
      preliminaryOutcome: app.preliminaryOutcome || existing.preliminaryOutcome || 'In Scrutiny Queue',
      preliminarySeverity: app.preliminarySeverity || existing.preliminarySeverity || 'info',
      reviewNotes: app.reviewNotes || app.officerNotes || existing.reviewNotes || existing.officerNotes || '',
      officerNotes: app.officerNotes || app.reviewNotes || existing.officerNotes || existing.reviewNotes || '',
      documents: app.documents || existing.documents || [],
      timeline: app.timeline || existing.timeline || [
        {
          stage: 'Application Filed',
          date: app.submissionDate || '18 Oct 2026',
          actor: 'Institutional Representative',
          details: 'Application submitted with preliminary documents.',
        },
      ],
    };

    map.set(app.id, merged);
  };

  // Populate from all datasets in order
  demoApplications.forEach(upsert);
  assignedApplicationsData.forEach(upsert);
  seniorApplicationsData.forEach(upsert);
  collegeApplications.forEach(upsert);

  return Array.from(map.values());
}

/**
 * Builds initial queries list reconciling college and verification officer queues
 */
function buildInitialQueries() {
  const map = new Map();
  [...officerClarificationQueries, ...collegeInitialQueries].forEach((q) => {
    map.set(q.id, {
      ...q,
      collegeName: q.collegeName || 'Bhartiya Institute of Technology & Science',
      status: q.status || 'Pending College Response',
    });
  });
  return Array.from(map.values());
}

export const DemoStateContext = createContext(null);

export const DemoStateProvider = ({ children }) => {
  // Try loading initial state from sessionStorage if available in environment
  const [state, setState] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const saved = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } else if (typeof sessionStorage !== 'undefined') {
        const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      }
    } catch {
      // sessionStorage unavailable or parse error; fallback to defaults
    }

    return {
      applications: buildInitialMasterApplications(),
      queries: buildInitialQueries(),
      escalations: officerEscalationsData,
      reviewHistory: officerReviewHistory,
      decisionHistory: seniorDecisionHistoryData || [],
      auditEvents: seniorAuditTrailData || [],
      currentUser: null,
    };
  });

  const stateRef = useRef(state);

  // Sync state to sessionStorage whenever it changes
  useEffect(() => {
    stateRef.current = state;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
      } else if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
      }
    } catch {
      // ignore storage quota errors in demo
    }
  }, [state]);

  // Synchronous initial sync for storage
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      if (!window.sessionStorage.getItem(SESSION_STORAGE_KEY)) {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
      }
    } else if (typeof sessionStorage !== 'undefined') {
      if (!sessionStorage.getItem(SESSION_STORAGE_KEY)) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
      }
    }
  } catch {
    // ignore
  }

  const updateStateAndSync = (updater) => {
    const next = typeof updater === 'function' ? updater(stateRef.current) : updater;
    stateRef.current = next;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
      } else if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {
      // ignore
    }
    setState(next);
  };

  // Actions
  const loginDemoUser = (user) => {
    updateStateAndSync((prev) => ({ ...prev, currentUser: user }));
  };

  const logoutDemoUser = () => {
    updateStateAndSync((prev) => ({ ...prev, currentUser: null }));
  };

  // 1. College creates a new application
  const createCollegeApplication = (newApp) => {
    const fullApp = {
      ...newApp,
      id: newApp.id || `APP-2026-ENG-${Math.floor(1000 + Math.random() * 9000)}`,
      collegeName: newApp.collegeName || demoCollegeProfile.institutionName,
      institutionName: newApp.institutionName || demoCollegeProfile.institutionName,
      aisheCode: newApp.aisheCode || demoCollegeProfile.aisheCode,
      region: newApp.region || demoCollegeProfile.region,
      state: demoCollegeProfile.state,
      priority: newApp.priority || 'Normal',
      prioritySeverity: 'info',
      currentStatus: 'Under Review',
      statusSeverity: 'info',
      academicYear: newApp.academicYear || '2026-27',
      assignedOfficer: 'Dr. R. K. Sharma (Scrutiny Officer - Gr. I)',
      verificationOfficer: {
        name: 'Dr. R. K. Sharma',
        id: 'AICTE-SCR-202',
        desk: 'Central Desk #4',
      },
      documentsCount: 12,
      flaggedCount: 0,
      flaggedDocumentsCount: 0,
      preliminaryOutcome: 'In Scrutiny Queue',
      preliminarySeverity: 'info',
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
            { label: 'Built-up Area', value: `${demoCollegeProfile.builtUpAreaSqM} sq.m` },
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
            { label: 'Plot Area', value: `${demoCollegeProfile.landAreaAcres} Acres` },
            { label: 'Contiguity', value: 'Single Contiguous Plot' },
          ],
        },
      ],
      timeline: [
        {
          stage: 'Application Filed',
          date: newApp.submissionDate || 'Just now',
          actor: `${demoCollegeProfile.nodalOfficer.name} (Authorized Signatory)`,
          details: `Submitted ${newApp.applicationType} proposal for ${newApp.requestedIntake || 60} seats.`,
        },
      ],
    };

    updateStateAndSync((prev) => ({
      ...prev,
      applications: [fullApp, ...prev.applications],
    }));

    return fullApp;
  };

  // 2. Verification Officer updates notes
  const updateApplicationNotes = (appId, notes) => {
    updateStateAndSync((prev) => ({
      ...prev,
      applications: prev.applications.map((a) =>
        a.id === appId ? { ...a, reviewNotes: notes, officerNotes: notes } : a
      ),
    }));
  };

  // 3. Verification Officer completes scrutiny review
  const completeOfficerReview = (appId, outcome, notes) => {
    const isPassing = outcome === 'Preliminary Check Passed';
    const nextStatus = isPassing ? 'Scrutiny Passed' : outcome;

    const timeStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' IST';

    updateStateAndSync((prev) => {
      const targetApp = prev.applications.find((a) => a.id === appId);
      const updatedApps = prev.applications.map((a) => {
        if (a.id === appId) {
          return {
            ...a,
            currentStatus: nextStatus,
            statusSeverity: isPassing ? 'success' : 'warning',
            preliminaryOutcome: outcome,
            preliminarySeverity: isPassing ? 'success' : 'warning',
            reviewNotes: notes,
            officerNotes: notes,
            timeline: [
              ...(a.timeline || []),
              {
                stage: 'Scrutiny Completed',
                date: timeStr,
                actor: 'Dr. R. K. Sharma (Scrutiny Officer - Gr. I)',
                details: notes || `Preliminary scrutiny marked as "${outcome}".`,
              },
            ],
          };
        }
        return a;
      });

      const newHistoryEntry = {
        id: `REV-${Math.floor(8000 + Math.random() * 1999)}`,
        applicationId: appId,
        collegeName: targetApp ? targetApp.collegeName : 'Selected Institution',
        applicationType: targetApp ? targetApp.applicationType : 'Regulatory Application',
        outcome,
        outcomeSeverity: isPassing ? 'success' : 'warning',
        officerRemarks: notes || `Preliminary scrutiny marked as "${outcome}".`,
        completedDate: `${timeStr} (Simulated)`,
      };

      return {
        ...prev,
        applications: updatedApps,
        reviewHistory: [newHistoryEntry, ...prev.reviewHistory],
      };
    });
  };

  // 4. Verification Officer issues clarification query to College
  const issueClarificationQuery = (newQuery) => {
    updateStateAndSync((prev) => {
      const updatedQueries = [newQuery, ...prev.queries];
      const updatedApps = prev.applications.map((a) =>
        a.id === newQuery.applicationId
          ? {
              ...a,
              currentStatus: 'Review Required',
              statusSeverity: 'warning',
              flaggedCount: (a.flaggedCount || 0) + 1,
            }
          : a
      );
      return {
        ...prev,
        queries: updatedQueries,
        applications: updatedApps,
      };
    });
  };

  // 5. College responds to clarification query
  const respondToQuery = (queryId, responseText) => {
    const timeStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' IST';

    updateStateAndSync((prev) => {
      const targetQuery = prev.queries.find((q) => q.id === queryId);
      const updatedQueries = prev.queries.map((q) => {
        if (q.id === queryId) {
          return {
            ...q,
            status: 'Response Submitted',
            collegeResponse: responseText,
            submittedAt: `${timeStr} (Simulated)`,
          };
        }
        return q;
      });

      // Update target application notes if found
      const updatedApps = targetQuery
        ? prev.applications.map((a) => {
            if (a.id === targetQuery.applicationId) {
              return {
                ...a,
                currentStatus: 'Under Review',
                statusSeverity: 'info',
                timeline: [
                  ...(a.timeline || []),
                  {
                    stage: 'Clarification Responded',
                    date: timeStr,
                    actor: `${demoCollegeProfile.nodalOfficer.name} (College)`,
                    details: `Submitted response to query ${queryId}: "${responseText.slice(0, 80)}..."`,
                  },
                ],
              };
            }
            return a;
          })
        : prev.applications;

      return {
        ...prev,
        queries: updatedQueries,
        applications: updatedApps,
      };
    });
  };

  // 6. Verification Officer escalates application to Senior Officer
  const escalateApplication = (newEscalation) => {
    const timeStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' IST';

    updateStateAndSync((prev) => {
      const updatedEscalations = [newEscalation, ...prev.escalations];
      const updatedApps = prev.applications.map((a) => {
        if (a.id === newEscalation.applicationId) {
          return {
            ...a,
            currentStatus: 'Escalated',
            statusSeverity: 'danger',
            urgency: 'Critical',
            escalationReason: newEscalation.reason || 'Escalated to Senior Regional Directorate',
            escalationSummary: newEscalation.notes || 'Referred for senior administrative evaluation.',
            preliminaryOutcome: 'Inconsistency Detected',
            preliminarySeverity: 'danger',
            timeline: [
              ...(a.timeline || []),
              {
                stage: 'Escalated to Directorate',
                date: timeStr,
                actor: 'Dr. R. K. Sharma (Scrutiny Officer - Gr. I)',
                details: newEscalation.reason || 'Case escalated for senior evaluation.',
              },
            ],
          };
        }
        return a;
      });

      return {
        ...prev,
        escalations: updatedEscalations,
        applications: updatedApps,
      };
    });
  };

  // 7. Senior Officer records statutory decision or recommendation
  const recordSeniorDecision = (appId, decisionPayload) => {
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + ' IST';

    updateStateAndSync((prev) => {
      const targetApp = prev.applications.find((a) => a.id === appId);
      const appName = targetApp?.institutionName || targetApp?.collegeName || 'Technical Institution';

      const updatedApps = prev.applications.map((a) => {
        if (a.id === appId) {
          const updatedTimeline = [
            ...(a.timeline || []),
            {
              stage: decisionPayload.title,
              date: nowStr,
              actor: `${demoSeniorOfficerProfile.name} (${demoSeniorOfficerProfile.officerId})`,
              details: decisionPayload.rationale || decisionPayload.instructions || decisionPayload.notes || decisionPayload.details || '',
            },
          ];

          return {
            ...a,
            currentStatus: decisionPayload.newStatus,
            statusSeverity: decisionPayload.statusSeverity,
            timeline: updatedTimeline,
            officerNotes: decisionPayload.rationale || decisionPayload.instructions || a.officerNotes,
            reviewNotes: decisionPayload.rationale || decisionPayload.instructions || a.reviewNotes,
          };
        }
        return a;
      });

      const updatedHistory = [...(prev.decisionHistory || [])];
      if (decisionPayload.actionType === 'final_decision' || decisionPayload.actionType === 'recommendation') {
        updatedHistory.unshift({
          id: `DEC-2026-${Math.floor(100 + Math.random() * 900)}`,
          applicationId: appId,
          institutionName: appName,
          applicationType: targetApp?.applicationType || 'Regulatory Application',
          decisionType: decisionPayload.actionType === 'final_decision' ? 'Final Demo Approval' : 'Recommendation Recorded',
          outcome: decisionPayload.newStatus,
          outcomeSeverity: decisionPayload.statusSeverity,
          decisionDate: nowStr,
          seniorOfficer: demoSeniorOfficerProfile.name,
          rationale: decisionPayload.rationale || decisionPayload.notes || 'Senior review determination recorded.',
          notes: decisionPayload.conditions || decisionPayload.targetBoardMeeting || 'Simulated compliance conditions recorded.',
        });
      }

      const updatedAudit = [
        {
          id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: nowStr,
          applicationId: appId,
          action: decisionPayload.title,
          actor: `${demoSeniorOfficerProfile.name} (${demoSeniorOfficerProfile.officerId})`,
          desk: demoSeniorOfficerProfile.office,
          hash: Math.random().toString(36).substring(2, 12) + '88fe2',
          details: `${decisionPayload.title} recorded for ${appName}: ${decisionPayload.newStatus}`,
        },
        ...(prev.auditEvents || []),
      ];

      return {
        ...prev,
        applications: updatedApps,
        decisionHistory: updatedHistory,
        auditEvents: updatedAudit,
      };
    });
  };

  // Reset to initial prototype data
  const resetDemoState = () => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } else if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
    setState({
      applications: buildInitialMasterApplications(),
      queries: buildInitialQueries(),
      escalations: officerEscalationsData,
      reviewHistory: officerReviewHistory,
      decisionHistory: seniorDecisionHistoryData || [],
      auditEvents: seniorAuditTrailData || [],
      currentUser: null,
    });
  };

  const contextValue = useMemo(() => ({
    ...state,
    loginDemoUser,
    logoutDemoUser,
    createCollegeApplication,
    updateApplicationNotes,
    completeOfficerReview,
    issueClarificationQuery,
    respondToQuery,
    escalateApplication,
    recordSeniorDecision,
    resetDemoState,
  }), [state]);

  return (
    <DemoStateContext.Provider value={contextValue}>
      {children}
    </DemoStateContext.Provider>
  );
};

export const useDemoState = () => {
  const context = useContext(DemoStateContext);
  if (!context) {
    throw new Error('useDemoState must be used within a DemoStateProvider');
  }
  return context;
};
