import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SeniorOfficerHeader from '../../components/dashboard/SeniorOfficerHeader';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import SeniorCaseReviewWorkspace from '../../components/dashboard/SeniorCaseReviewWorkspace';
import SeniorDecisionModal from '../../components/dashboard/SeniorDecisionModal';
import EscalatedApplicationsView from '../../components/dashboard/EscalatedApplicationsView';
import OfficerPerformanceView from '../../components/dashboard/OfficerPerformanceView';
import ComplianceReportsView from '../../components/dashboard/ComplianceReportsView';
import DecisionHistoryView from '../../components/dashboard/DecisionHistoryView';
import AuditTrailView from '../../components/dashboard/AuditTrailView';

import { useDemoState } from '../../hooks/useDemoState';

import {
  seniorSummaryStats,
} from '../../data/seniorOfficerDashboardData';

import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  FileCheck2,
  X,
} from 'lucide-react';

/**
 * SeniorOfficerDashboard Component (Phase 6)
 * AICTE Senior Officer & Regional Directorate Approval Console
 * SIH Problem Statement ID: 26261
 */
const SeniorOfficerDashboard = () => {
  const navigate = useNavigate();
  const {
    applications,
    decisionHistory: historyList,
    auditEvents: auditList,
    updateApplicationNotes,
    recordSeniorDecision,
    logoutDemoUser,
  } = useDemoState();

  // Navigation state
  const [activeTab, setActiveTab] = useState('overview');

  // Selected case
  const [selectedCase, setSelectedCase] = useState(null);

  // Decision Modal state
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionModalApp, setDecisionModalApp] = useState(null);
  const [decisionModalDefaultAction, setDecisionModalDefaultAction] = useState('final_decision');

  // Search & Filters for Approval Review Queue
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Header global search
  const [headerSearch, setHeaderSearch] = useState('');

  // Confirmation feedback banner / toast
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const triggerFeedback = (message, type = 'success') => {
    setFeedbackMessage({ message, type });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  // Logout handler
  const handleLogout = () => {
    logoutDemoUser();
    navigate('/login');
  };

  // Open Case Review Workspace
  const handleOpenCase = (app) => {
    setSelectedCase(app);
    setActiveTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Decision Modal with specific action
  const handleOpenDecisionModal = (app, action = 'final_decision') => {
    setDecisionModalApp(app);
    setDecisionModalDefaultAction(action);
    setDecisionModalOpen(true);
  };

  // In-place note update
  const handleUpdateNotes = (appId, notes) => {
    updateApplicationNotes(appId, notes);
    if (selectedCase && selectedCase.id === appId) {
      setSelectedCase((prev) => ({ ...prev, officerNotes: notes, reviewNotes: notes }));
    }
    triggerFeedback(`Review notes updated for ${appId}.`, 'info');
  };

  // Handle Senior Officer Decision Submission
  const handleConfirmDecision = (appId, decisionPayload) => {
    recordSeniorDecision(appId, decisionPayload);

    if (selectedCase && selectedCase.id === appId) {
      setSelectedCase((prev) => ({
        ...prev,
        currentStatus: decisionPayload.newStatus,
        statusSeverity: decisionPayload.statusSeverity,
        officerNotes: decisionPayload.rationale || decisionPayload.instructions || prev.officerNotes,
      }));
    }

    triggerFeedback(
      `Simulated senior action successfully recorded for ${appId}. Updated in shared prototype state.`,
      'success'
    );
  };

  // Filtered applications for Approval Review Queue
  const effectiveSearch = headerSearch || searchTerm;
  const filteredQueue = useMemo(() => {
    return (applications || []).filter((app) => {
      const id = (app.id || '').toLowerCase();
      const institution = (app.institutionName || app.collegeName || '').toLowerCase();
      const officer = (app.verificationOfficer?.name || app.assignedOfficer || '').toLowerCase();
      const reason = (app.escalationReason || '').toLowerCase();
      const query = effectiveSearch.toLowerCase().trim();

      const matchesSearch =
        query === '' ||
        id.includes(query) ||
        institution.includes(query) ||
        officer.includes(query) ||
        reason.includes(query);

      const status = app.currentStatus || '';
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PENDING' && (status.includes('Pending') || status.includes('Under Review'))) ||
        (statusFilter === 'ESCALATED' && (status.includes('Escalated') || status.includes('Inconsistency'))) ||
        (statusFilter === 'CLARIFICATION' && (status.includes('Clarification') || status.includes('Required'))) ||
        (statusFilter === 'DECIDED' && (status.includes('Decision') || status.includes('Approved') || status.includes('Passed') || status.includes('Rejected')));

      const matchesType = typeFilter === 'ALL' || app.applicationType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [applications, effectiveSearch, statusFilter, typeFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredQueue.length / itemsPerPage) || 1;
  const paginatedQueue = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredQueue.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredQueue, currentPage]);

  // Applications approaching deadlines (<= 3 days)
  const deadlineApproachingApps = useMemo(() => {
    return applications.filter((a) => a.daysRemaining <= 3 && !a.currentStatus.includes('Decision Recorded'));
  }, [applications]);

  // Active escalated cases
  const escalatedOverviewApps = useMemo(() => {
    return applications.filter((a) => a.currentStatus === 'Escalated' || a.urgency === 'Critical');
  }, [applications]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* Top Horizontal Navigation Bar */}
      <SeniorOfficerHeader
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          if (tabId !== 'workspace') setSelectedCase(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleLogout}
        searchQuery={headerSearch}
        onSearchChange={setHeaderSearch}
        workspaceActive={activeTab === 'workspace'}
        caseId={selectedCase?.id}
      />

        {/* Global Feedback Banner */}
        {feedbackMessage && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 animate-fadeIn">
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-xs ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedbackMessage.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackMessage(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Page Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn pb-12">
              {/* Persistent Demonstration Notice */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-xs text-blue-950 flex items-start space-x-3 shadow-2xs">
                <ShieldAlert className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold uppercase tracking-wider block mb-0.5">
                    SIH Demonstration Prototype — All Records and Decisions are Simulated
                  </span>
                  <span>
                    This dashboard simulates the AICTE Senior Officer and Regional Directorate approval workflows for Problem Statement ID 26261. Numerical indicators and review determinations are synthetic demo records and must not be interpreted as actual AICTE national statistics or official gazetted orders.
                  </span>
                </div>
              </div>

              {/* 4 Summary Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {seniorSummaryStats.map((stat) => (
                  <StatCard
                    key={stat.id}
                    title={stat.title}
                    value={stat.value}
                    subtext={stat.subtext}
                    change={stat.trend}
                    iconName={stat.iconName}
                  />
                ))}
              </div>

              {/* 4 Overview Panels Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Panel 1: Recent Escalations */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                        <AlertOctagon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-black text-[#102D52]">
                        Recent Escalations Requiring Directive
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('escalated')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline"
                    >
                      View All Escalations →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {escalatedOverviewApps.slice(0, 3).map((app) => (
                      <div
                        key={app.id}
                        className="p-3 rounded-lg border border-red-100 bg-red-50/40 hover:bg-red-50/80 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-blue-900">{app.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-red-100 text-red-800">
                            {app.urgency} Escalation
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs mt-1">
                          {app.institutionName}
                        </div>
                        <p className="text-[11px] text-red-900 mt-0.5 line-clamp-1">
                          {app.escalationReason}
                        </p>
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-red-100/60 text-[11px]">
                          <span className="text-slate-500">
                            Officer: {app.verificationOfficer?.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenCase(app)}
                            className="font-bold text-purple-700 hover:text-purple-900 hover:underline"
                          >
                            Open Case →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel 2: Pending Senior Reviews */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                        <Clock className="w-4 h-4 text-blue-700" />
                      </div>
                      <h3 className="text-sm font-black text-[#102D52]">
                        Pending Senior Reviews
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('approval-queue')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline"
                    >
                      Open Queue →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {applications
                      .filter((a) => a.currentStatus.includes('Pending'))
                      .slice(0, 3)
                      .map((app) => (
                        <div
                          key={app.id}
                          className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-blue-900">{app.id}</span>
                            <StatusBadge status={app.currentStatus} />
                          </div>
                          <div className="font-bold text-slate-900 text-xs mt-1">
                            {app.institutionName}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                            <span>{app.applicationType}</span>
                            <span>{app.proposedIntake}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200/60 text-[11px]">
                            <span className="text-slate-500">
                              Deadline: {app.deadlineDate} ({app.daysRemaining}d)
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenCase(app)}
                              className="font-bold text-purple-700 hover:text-purple-900 hover:underline"
                            >
                              Review Dossier →
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Panel 3: Latest Officer Scrutiny Actions */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold">
                        <FileCheck2 className="w-4 h-4 text-indigo-700" />
                      </div>
                      <h3 className="text-sm font-black text-[#102D52]">
                        Latest Officer Actions &amp; Referrals
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('officer-performance')}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline"
                    >
                      Officer Performance →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="py-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{app.verificationOfficer?.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{app.submissionDate}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5 line-clamp-1 italic">
                          "{app.officerNotes}"
                        </p>
                        <div className="text-[11px] text-blue-900 font-medium mt-1 flex items-center space-x-1">
                          <span>Referred case: </span>
                          <span className="font-mono font-bold">{app.id}</span>
                          <span>({app.institutionName})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel 4: Applications Approaching Review Deadlines */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-700" />
                      </div>
                      <h3 className="text-sm font-black text-[#102D52]">
                        Approaching Review Deadlines
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                      Urgent SLA Queue
                    </span>
                  </div>

                  <div className="space-y-3">
                    {deadlineApproachingApps.map((app) => (
                      <div
                        key={app.id}
                        className="p-3 rounded-lg border border-amber-200 bg-amber-50/40 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-blue-900">{app.id}</span>
                            <span className="text-slate-400">·</span>
                            <span className="font-bold text-slate-900">{app.institutionName}</span>
                          </div>
                          <p className="text-[11px] text-amber-900 mt-0.5">
                            Target SLA: <strong>{app.deadlineDate}</strong> ({app.daysRemaining} days remaining)
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenCase(app)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-white border border-amber-300 hover:bg-amber-100 transition-colors shrink-0"
                        >
                          Expedite Review →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPROVAL REVIEW QUEUE */}
          {activeTab === 'approval-queue' && (
            <div className="space-y-6 animate-fadeIn pb-12">
              {/* Header and Controls */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#102D52]">
                      Statutory Approval Review Queue
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Search, inspect, and record senior determinations for institutional applications.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200 shrink-0 self-start sm:self-auto">
                    {filteredQueue.length} Applications in Queue
                  </span>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search application ID, institution or officer..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-purple-600"
                    >
                      <option value="ALL">Status: All Statuses</option>
                      <option value="PENDING">Pending Senior Review</option>
                      <option value="ESCALATED">Escalated Cases</option>
                      <option value="CLARIFICATION">Clarification Awaited</option>
                      <option value="DECIDED">Decisions Recorded</option>
                    </select>

                    <select
                      value={typeFilter}
                      onChange={(e) => {
                        setTypeFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-purple-600"
                    >
                      <option value="ALL">Application Type: All</option>
                      <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
                      <option value="Increase in Intake">Increase in Intake</option>
                      <option value="Addition of New Course">Addition of New Course</option>
                      <option value="New Program Introduction">New Program Introduction</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Applications Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700">
                      <th className="py-3 px-4 font-bold">Application ID</th>
                      <th className="py-3 px-4 font-bold">Synthetic Institution Name</th>
                      <th className="py-3 px-4 font-bold">Application Type</th>
                      <th className="py-3 px-4 font-bold">Verification Officer</th>
                      <th className="py-3 px-4 font-bold">Preliminary Outcome</th>
                      <th className="py-3 px-4 font-bold">Escalation Reason</th>
                      <th className="py-3 px-4 font-bold">Current Status</th>
                      <th className="py-3 px-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedQueue.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                          {app.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 leading-snug">
                            {app.institutionName}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            AISHE: {app.aisheCode} · {app.region}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {app.applicationType}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">
                            {app.verificationOfficer?.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {app.verificationOfficer?.id}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <StatusBadge status={app.preliminaryOutcome} />
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          {app.escalationReason ? (
                            <span className="text-red-700 font-semibold line-clamp-1 text-[11px]" title={app.escalationReason}>
                              {app.escalationReason}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Standard Review</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <StatusBadge status={app.currentStatus} />
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenCase(app)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#102D52] hover:bg-[#1D4ED8] transition-colors shadow-2xs"
                          >
                            <span>Open Case</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {paginatedQueue.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No applications match your active search and filter criteria.
                  </div>
                )}

                {/* Pagination Controls */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Showing Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({filteredQueue.length} records)
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CASE REVIEW WORKSPACE */}
          {activeTab === 'workspace' && (
            <SeniorCaseReviewWorkspace
              application={selectedCase}
              onBack={() => setActiveTab('approval-queue')}
              onOpenDecisionModal={handleOpenDecisionModal}
            />
          )}

          {/* TAB 3: ESCALATED APPLICATIONS */}
          {activeTab === 'escalated' && (
            <EscalatedApplicationsView
              applications={applications}
              onOpenCase={handleOpenCase}
              onOpenDecisionModal={handleOpenDecisionModal}
              onUpdateNotes={handleUpdateNotes}
            />
          )}

          {/* TAB 4: OFFICER PERFORMANCE */}
          {activeTab === 'officer-performance' && (
            <OfficerPerformanceView />
          )}

          {/* TAB 5: COMPLIANCE REPORTS */}
          {activeTab === 'reports' && (
            <ComplianceReportsView applications={applications} />
          )}

          {/* TAB 6: DECISION HISTORY */}
          {activeTab === 'decision-history' && (
            <DecisionHistoryView historyRecords={historyList} />
          )}

          {/* TAB 7: AUDIT TRAIL */}
          {activeTab === 'audit-trail' && (
            <AuditTrailView auditEvents={auditList} />
          )}
        </main>

      {/* Senior Officer Decision Workflow Modal */}
      {decisionModalOpen && (
        <SeniorDecisionModal
          isOpen={decisionModalOpen}
          onClose={() => setDecisionModalOpen(false)}
          application={decisionModalApp}
          defaultAction={decisionModalDefaultAction}
          onConfirmDecision={handleConfirmDecision}
        />
      )}
    </div>
  );
};

export default SeniorOfficerDashboard;
