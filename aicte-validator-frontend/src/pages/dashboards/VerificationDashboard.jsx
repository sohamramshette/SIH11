import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import VerificationSidebar from '../../components/dashboard/VerificationSidebar';
import VerificationHeader from '../../components/dashboard/VerificationHeader';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import DocumentReviewWorkspace from '../../components/dashboard/DocumentReviewWorkspace';
import PreliminaryValidationChecklist from '../../components/dashboard/PreliminaryValidationChecklist';
import ClarificationQueryModal from '../../components/dashboard/ClarificationQueryModal';
import EscalationModal from '../../components/dashboard/EscalationModal';

import { useDemoState } from '../../hooks/useDemoState';

import {
  verificationSidebarNavItems,
  verificationSummaryStats,
} from '../../data/verificationDashboardData';

import {
  FileSpreadsheet,
  FileCheck2,
  CheckSquare,
  MessageSquare,
  History,
  AlertOctagon,
  Search,
  Filter,
  ArrowRight,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

/**
 * VerificationDashboard Component (Phase 5)
 * AICTE Scrutiny & Verification Officer Portal for SIH 26261.
 */
const VerificationDashboard = () => {
  const navigate = useNavigate();
  const {
    applications,
    queries: queriesList,
    escalations: escalationsList,
    reviewHistory: historyList,
    updateApplicationNotes,
    completeOfficerReview,
    issueClarificationQuery,
    escalateApplication,
    logoutDemoUser,
  } = useDemoState();

  // Navigation state
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Selected application in review
  const [selectedApp, setSelectedApp] = useState(null);
  const activeSelectedApp = selectedApp || applications[0] || null;

  // Modals state
  const [queryModalOpen, setQueryModalOpen] = useState(false);
  const [escalationModalOpen, setEscalationModalOpen] = useState(false);
  const [modalTargetApp, setModalTargetApp] = useState(null);

  // Search & Filter state for Assigned Applications table
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Global search input in header
  const [headerSearch, setHeaderSearch] = useState('');

  // Toast / Feedback message
  const [globalFeedback, setGlobalFeedback] = useState('');

  const triggerFeedback = (msg) => {
    setGlobalFeedback(msg);
    setTimeout(() => setGlobalFeedback(''), 4000);
  };

  // Logout handler
  const handleLogout = () => {
    logoutDemoUser();
    navigate('/login');
  };

  // Open Document Review Workspace for a specific application
  const handleOpenReview = (app) => {
    setSelectedApp(app);
    setActiveTab('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save notes from workspace
  const handleSaveNotes = (appId, notes) => {
    updateApplicationNotes(appId, notes);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp((prev) => ({ ...prev, reviewNotes: notes, officerNotes: notes }));
    }
    triggerFeedback(`Scrutiny notes for ${appId} saved to local session.`);
  };

  // Complete review from workspace
  const handleCompleteReview = (appId, outcome, notes) => {
    completeOfficerReview(appId, outcome, notes);
    const isPassing = outcome === 'Preliminary Check Passed';
    const nextStatus = isPassing ? 'Scrutiny Passed' : outcome;

    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp((prev) => ({
        ...prev,
        currentStatus: nextStatus,
        statusSeverity: isPassing ? 'success' : 'warning',
        preliminaryOutcome: outcome,
        preliminarySeverity: isPassing ? 'success' : 'warning',
        reviewNotes: notes,
      }));
    }

    triggerFeedback(`Scrutiny review completed for ${appId} with outcome: "${outcome}".`);
  };

  // Issue query handler
  const handleOpenQueryModal = (app = null) => {
    setModalTargetApp(app || activeSelectedApp);
    setQueryModalOpen(true);
  };

  const handleSubmitQuery = (newQuery) => {
    issueClarificationQuery(newQuery);
    triggerFeedback(`Query ${newQuery.id} issued to ${newQuery.collegeName || 'Institution'}.`);
  };

  // Escalation handler
  const handleOpenEscalationModal = (app = null) => {
    setModalTargetApp(app || activeSelectedApp);
    setEscalationModalOpen(true);
  };

  const handleSubmitEscalation = (newEscalation) => {
    escalateApplication(newEscalation);
    triggerFeedback(`Application ${newEscalation.applicationId} escalated to senior authorities.`);
  };

  // Filtered applications for Assigned Applications table
  const filteredApplications = useMemo(() => {
    return (applications || []).filter((app) => {
      const query = (searchTerm || headerSearch).toLowerCase().trim();
      const id = (app.id || '').toLowerCase();
      const college = (app.collegeName || app.institutionName || '').toLowerCase();
      const aishe = (app.aisheCode || '').toLowerCase();
      const appType = (app.applicationType || '').toLowerCase();

      const matchesSearch =
        query === '' ||
        id.includes(query) ||
        college.includes(query) ||
        aishe.includes(query) ||
        appType.includes(query);

      const status = (app.currentStatus || '').toLowerCase();
      const matchesStatus =
        statusFilter === 'ALL' || status === statusFilter.toLowerCase();

      const priority = (app.priority || '').toLowerCase();
      const matchesPriority =
        priorityFilter === 'ALL' || priority === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [applications, searchTerm, headerSearch, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage) || 1;
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage, itemsPerPage]);

  const currentTabItem =
    verificationSidebarNavItems.find((item) => item.id === activeTab) ||
    verificationSidebarNavItems[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800">
      {/* 1. Fixed Navy Sidebar */}
      <VerificationSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Body Content (offset on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <VerificationHeader
          activeTabTitle={currentTabItem.label}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          searchQuery={headerSearch}
          onSearchChange={setHeaderSearch}
        />

        {/* Persistent Sub-Header Notice Bar */}
        <div className="bg-amber-500/10 border-b border-amber-200/80 px-4 sm:px-6 lg:px-8 py-2 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 px-1.5 py-0.5 rounded text-amber-950">
              SIMULATED SCRUTINY CONSOLE
            </span>
            <span className="text-slate-700">
              Smart India Hackathon Prototype (ID: 26261) · All records, document OCR extractions, and validation outcomes are simulated demonstration data.
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Handbooks: APH 2026-27 | Central Region Desk
          </span>
        </div>

        {/* Global Toast / Action Feedback Banner */}
        {globalFeedback && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn shadow-2xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{globalFeedback}</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-200/60 text-emerald-950 px-2 py-0.5 rounded">
              Local Demo Session
            </span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Summary Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {verificationSummaryStats.map((stat) => (
                  <StatCard
                    key={stat.id}
                    title={stat.title}
                    value={stat.value}
                    subtext={stat.subtext}
                    iconName={stat.iconName}
                    change={stat.trend}
                  />
                ))}
              </div>

              {/* Review Queue & Desk Priorities */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Active Review Queue (2 cols) */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-[#102D52] flex items-center space-x-2">
                        <FileCheck2 className="w-4 h-4 text-blue-700" />
                        <span>Assigned Scrutiny Review Queue</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        High-priority institutional applications allocated for document verification
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('assigned')}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
                    >
                      <span>View All ({applications.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Queue Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="px-4 py-3">Application ID</th>
                          <th className="px-4 py-3">Educational Institution</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Priority</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {applications.slice(0, 4).map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-blue-900">
                              {app.id}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-900 line-clamp-1">
                                {app.collegeName}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                AISHE: {app.aisheCode}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              <span className="truncate block max-w-[130px]">{app.applicationType}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  app.priority === 'High'
                                    ? 'bg-rose-100 text-rose-800'
                                    : app.priority === 'Medium'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {app.priority}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={app.currentStatus} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleOpenReview(app)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors shadow-2xs"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Open Review</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Side Column: Officer Desk Guidelines & Regional Alerts */}
                <div className="space-y-4">
                  {/* Scrutiny Notice Card */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
                      <span>Regional Scrutiny Directive</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      All applications for <strong>Increase in Intake</strong> must have faculty cadre ratios verified against <em>APH 2026-27 Table 2.1.4</em> before submitting recommendations.
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Regional Meeting: 28 Oct 2026</span>
                      <span className="font-bold text-blue-700">Norms Active</span>
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Quick Scrutiny Actions
                    </h4>
                    <button
                      onClick={() => handleOpenQueryModal()}
                      className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                    >
                      <div className="flex items-center space-x-2">
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>Issue Clarification Query</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleOpenEscalationModal()}
                      className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:border-red-400 hover:bg-red-50/50 transition-all"
                    >
                      <div className="flex items-center space-x-2">
                        <AlertOctagon className="w-4 h-4 text-red-600" />
                        <span>Escalate to Senior Officer</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('preliminary-validation')}
                      className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        <span>Run Preliminary Validation Checks</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ASSIGNED APPLICATIONS */}
          {activeTab === 'assigned' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header & Filters */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-[#102D52] flex items-center space-x-2">
                      <FileSpreadsheet className="w-5 h-5 text-blue-700" />
                      <span>Assigned Applications Directory</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Comprehensive list of institutional dossiers assigned to your scrutiny desk
                    </p>
                  </div>

                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
                    {filteredApplications.length} Applications Loaded
                  </span>
                </div>

                {/* Search & Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search ID, college, AISHE..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="ALL">All Application Statuses</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Review Required">Review Required</option>
                      <option value="Possible Inconsistency">Possible Inconsistency</option>
                      <option value="Scrutiny Passed">Scrutiny Passed</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <select
                      value={priorityFilter}
                      onChange={(e) => {
                        setPriorityFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="ALL">All Review Priorities</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Normal">Normal Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Applications Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="px-4 py-3">Application ID</th>
                        <th className="px-4 py-3">College & AISHE</th>
                        <th className="px-4 py-3">Type & AY</th>
                        <th className="px-4 py-3">Submission Date</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedApplications.length > 0 ? (
                        paginatedApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-blue-900">
                              {app.id}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-900">{app.collegeName}</div>
                              <div className="text-[11px] text-slate-400">
                                {app.aisheCode} · {app.region}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-700">
                              <div className="font-semibold">{app.applicationType}</div>
                              <div className="text-[11px] text-slate-400">{app.academicYear}</div>
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {app.submissionDate}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  app.priority === 'High'
                                    ? 'bg-rose-100 text-rose-800'
                                    : app.priority === 'Medium'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {app.priority}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={app.currentStatus} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleOpenReview(app)}
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Open Review</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                            No applications matched your filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50"
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT REVIEW WORKSPACE */}
          {activeTab === 'workspace' && (
            <div className="animate-fadeIn">
              <DocumentReviewWorkspace
                key={activeSelectedApp?.id}
                applications={applications}
                selectedApp={activeSelectedApp}
                onSelectApp={setSelectedApp}
                onSaveNotes={handleSaveNotes}
                onCompleteReview={handleCompleteReview}
                onOpenClarification={() => handleOpenQueryModal(activeSelectedApp)}
                onOpenEscalation={() => handleOpenEscalationModal(activeSelectedApp)}
              />
            </div>
          )}

          {/* TAB 4: PRELIMINARY VALIDATION */}
          {activeTab === 'preliminary-validation' && (
            <div className="animate-fadeIn">
              <PreliminaryValidationChecklist
                onOpenClarificationQuery={() => handleOpenQueryModal(selectedApp)}
              />
            </div>
          )}

          {/* TAB 5: QUERIES TO COLLEGES */}
          {activeTab === 'queries' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header with New Query Button */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#102D52] flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-700" />
                    <span>Clarification Queries to Colleges</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official queries issued to technical institutions regarding documentation deficits or cadre ratios
                  </p>
                </div>

                <button
                  onClick={() => handleOpenQueryModal()}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Issue New Clarification</span>
                </button>
              </div>

              {/* Queries List */}
              <div className="space-y-4">
                {queriesList.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          {q.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{q.collegeName}</span>
                        <span className="text-[11px] font-mono text-slate-500">({q.applicationId})</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-slate-400">Issued: {q.dateIssued}</span>
                        <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {q.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#102D52] mb-1">
                        Category: {q.category} · {q.subject}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {q.description}
                      </p>
                    </div>

                    <div className="text-xs flex items-start space-x-2 pt-1 text-slate-700">
                      <span className="font-bold shrink-0 text-blue-900">Required Response:</span>
                      <span className="text-slate-600">{q.responseRequired}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REVIEW HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <h2 className="text-base font-bold text-[#102D52] flex items-center space-x-2">
                  <History className="w-5 h-5 text-blue-700" />
                  <span>Scrutiny Review History Log</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audit ledger of completed preliminary verifications and recommendations filed by this desk
                </p>
              </div>

              {/* History Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="px-4 py-3">Record ID</th>
                        <th className="px-4 py-3">Application & College</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Review Outcome</th>
                        <th className="px-4 py-3">Scrutiny Officer Remarks</th>
                        <th className="px-4 py-3 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {historyList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">
                            {item.id}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-blue-900">{item.applicationId}</div>
                            <div className="text-[11px] text-slate-500">{item.collegeName}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {item.applicationType}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {item.outcome}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 max-w-xs">
                            <p className="line-clamp-2">{item.officerRemarks}</p>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-400 font-mono text-[11px]">
                            {item.completedDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ESCALATIONS */}
          {activeTab === 'escalations' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#102D52] flex items-center space-x-2">
                    <AlertOctagon className="w-5 h-5 text-red-600" />
                    <span>Senior Authority Escalations</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Formal referrals to Regional Directors and Directorate Standing Hearing Committees
                  </p>
                </div>

                <button
                  onClick={() => handleOpenEscalationModal()}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Formal Escalation</span>
                </button>
              </div>

              {/* Escalations List */}
              <div className="space-y-4">
                {escalationsList.map((esc) => (
                  <div
                    key={esc.id}
                    className="bg-white rounded-xl border border-red-200 p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-red-100">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono text-xs font-bold text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                          {esc.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{esc.collegeName}</span>
                        <span className="text-[11px] font-mono text-slate-500">({esc.applicationId})</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-slate-400">{esc.timestamp}</span>
                        <span className="text-xs font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          {esc.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-red-950 mb-1">
                        Reason: {esc.reason}
                      </div>
                      <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                        <p>
                          <strong className="text-slate-900">Evidence Summary: </strong>
                          {esc.evidenceSummary}
                        </p>
                        <p>
                          <strong className="text-slate-900">Recommended Next Step: </strong>
                          {esc.recommendedNextStep}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs flex items-center justify-between pt-1 text-slate-600">
                      <span>
                        Referred to: <strong className="text-slate-800">{esc.seniorAuthority}</strong>
                      </span>
                      <span className="text-[10px] font-mono bg-red-100 text-red-900 px-2 py-0.5 rounded font-bold">
                        REGIONAL REFERRAL
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Clarification Query Modal */}
      <ClarificationQueryModal
        isOpen={queryModalOpen}
        onClose={() => setQueryModalOpen(false)}
        onSubmitQuery={handleSubmitQuery}
        applications={applications}
        initialApplication={modalTargetApp}
      />

      {/* Escalation Modal */}
      <EscalationModal
        isOpen={escalationModalOpen}
        onClose={() => setEscalationModalOpen(false)}
        onSubmitEscalation={handleSubmitEscalation}
        applications={applications}
        initialApplication={modalTargetApp}
      />
    </div>
  );
};

export default VerificationDashboard;
