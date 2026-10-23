import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CollegeSidebar from '../../components/dashboard/CollegeSidebar';
import CollegeHeader from '../../components/dashboard/CollegeHeader';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import CollegeDetailsModal from '../../components/dashboard/CollegeDetailsModal';
import MultiStepApplicationForm from '../../components/dashboard/MultiStepApplicationForm';
import DocumentUploadChecklist from '../../components/dashboard/DocumentUploadChecklist';
import ValidationResultsView from '../../components/dashboard/ValidationResultsView';
import QueriesClarificationsView from '../../components/dashboard/QueriesClarificationsView';

import { useDemoState } from '../../hooks/useDemoState';

import {
  collegeSidebarNavItems,
  demoCollegeProfile,
  pendingCollegeActions,
  recentCollegeActivity,
} from '../../data/collegeDashboardData';

import {
  FilePlus2,
  UploadCloud,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  Building2,
} from 'lucide-react';

/**
 * CollegeDashboard Component (Phase 4)
 * Institutional Portal for AICTE Application Validation & Compliance Verification.
 */
const CollegeDashboard = () => {
  const navigate = useNavigate();
  const { applications, createCollegeApplication, logoutDemoUser } = useDemoState();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Selected application for modal view
  const [selectedApp, setSelectedApp] = useState(null);

  // My Applications table filters & pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter applications for this specific college
  const collegeApps = useMemo(() => {
    return (applications || []).filter(
      (app) =>
        app.collegeName === demoCollegeProfile.institutionName ||
        app.institutionName === demoCollegeProfile.institutionName ||
        app.aisheCode === demoCollegeProfile.aisheCode ||
        (app.id && app.id.startsWith('APP-2026-ENG-104')) ||
        (app.id && app.id.startsWith('APP-2025-ENG')) ||
        app.id === 'APP-2026-ENG-DRAFT'
    );
  }, [applications]);

  // Dynamic summary stats
  const dynamicSummaryStats = useMemo(() => {
    const total = collegeApps.length;
    const drafts = collegeApps.filter((a) => a.currentStatus === 'Draft Mode').length;
    const underReview = collegeApps.filter((a) => a.currentStatus === 'Under Review').length;
    const attention = collegeApps.filter(
      (a) => a.currentStatus === 'Review Required' || a.currentStatus === 'Possible Inconsistency'
    ).length;

    return [
      {
        id: 'stat-total',
        title: 'Total Applications',
        value: String(total),
        subtext: 'Cumulative historical & active submissions',
        iconName: 'FileText',
        trend: 'AY 2026-27 Active',
      },
      {
        id: 'stat-draft',
        title: 'Draft Applications',
        value: String(drafts),
        subtext: 'Unsubmitted application in progress',
        iconName: 'Edit3',
        trend: 'Incomplete',
      },
      {
        id: 'stat-review',
        title: 'Applications Under Review',
        value: String(underReview),
        subtext: 'Scrutiny committee inspection active',
        iconName: 'Clock',
        trend: `${underReview} In Queue`,
      },
      {
        id: 'stat-attention',
        title: 'Requiring Attention',
        value: String(attention),
        subtext: 'Clarification query pending college reply',
        iconName: 'AlertTriangle',
        trend: attention > 0 ? 'Action Required' : 'Normal',
      },
    ];
  }, [collegeApps]);

  // Logout handler
  const handleLogout = () => {
    logoutDemoUser();
    navigate('/login');
  };

  // Add newly submitted application from multi-step form to shared store
  const handleApplicationCreated = (newApp) => {
    createCollegeApplication(newApp);
  };

  // Filter applications for "My Applications" tab
  const filteredApplications = useMemo(() => {
    return collegeApps.filter((app) => {
      const id = (app.id || '').toLowerCase();
      const appType = (app.applicationType || '').toLowerCase();
      const query = (searchTerm || '').toLowerCase();

      const matchesSearch =
        query === '' || id.includes(query) || appType.includes(query);

      const status = (app.currentStatus || '').toLowerCase();
      const matchesStatus =
        statusFilter === 'ALL' || status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [collegeApps, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage, itemsPerPage]);

  const currentTabItem = collegeSidebarNavItems.find((item) => item.id === activeTab) || collegeSidebarNavItems[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800">
      {/* 1. Fixed Navy-Blue Sidebar */}
      <CollegeSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Dashboard Content Wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <CollegeHeader
          activeTabTitle={currentTabItem.label}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Persistent Demonstration Prototype Notice (Section 2) */}
        <div className="bg-amber-500/10 border-b border-amber-200/80 px-4 sm:px-6 lg:px-8 py-2 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 px-1.5 py-0.2 rounded text-amber-950">
              DEMONSTRATION PROTOTYPE
            </span>
            <span className="text-slate-700">
              All records, application statuses, and validation results are simulated for SIH 26261 demonstration.
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            AISHE: {demoCollegeProfile.aisheCode} · BITS Bhopal
          </span>
        </div>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Summary Cards (Section 3) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Institutional Application Pipeline
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">
                    AY 2026-27 Active Cycle
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {dynamicSummaryStats.map((stat) => (
                    <StatCard
                      key={stat.id}
                      title={stat.title}
                      value={stat.value}
                      change={stat.trend}
                      subtext={stat.subtext}
                      iconName={stat.iconName}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#102D52]">
                      {demoCollegeProfile.institutionName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Central Regional Office · Regulatory Affiliation Active
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('submit-application')}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#102D52] hover:bg-[#1D4ED8] text-white shadow-xs transition-colors"
                  >
                    <FilePlus2 className="w-3.5 h-3.5" />
                    <span>Submit New Application</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('document-uploads')}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Documents</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Pending Actions + Recent Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Pending Actions requiring attention */}
                <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <h2 className="text-sm font-bold text-[#102D52]">
                        Pending Actions &amp; Compliance Tasks
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                      {pendingCollegeActions.length} PENDING
                    </span>
                  </div>

                  <div className="space-y-3">
                    {pendingCollegeActions.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-[#102D52]">{task.title}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-950">
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {task.description}
                          </p>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Ref: {task.targetApp} · Due: {task.deadline}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (task.id === 'act-1') setActiveTab('queries');
                            else if (task.id === 'act-2') setActiveTab('document-uploads');
                            else setActiveTab('submit-application');
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-md bg-white border border-slate-300 text-[#102D52] hover:bg-slate-100 shrink-0 self-start sm:self-auto"
                        >
                          <span>Take Action</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Recent Application Activity */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-sm font-bold text-[#102D52]">
                      Recent Application Timeline
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                      LOG
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {recentCollegeActivity.map((act) => (
                      <div key={act.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-800 mt-1.5 shrink-0" />
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-800 text-xs">
                              {act.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {act.time}
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                            {act.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY APPLICATIONS (Section 4) */}
          {activeTab === 'my-applications' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#102D52]">
                    My Institutional Applications
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track the progress of your statutory approvals, extensions, and course introduction requests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('submit-application')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#102D52] hover:bg-[#1D4ED8] text-white shadow-xs"
                >
                  <FilePlus2 className="w-3.5 h-3.5" />
                  <span>New Application</span>
                </button>
              </div>

              {/* Applications Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Search */}
                  <div className="sm:col-span-8 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search by Application ID or Type..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102D52]"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="sm:col-span-4">
                    <div className="relative">
                      <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                      <select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102D52] text-slate-700"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Review Required">Review Required</option>
                        <option value="Draft Mode">Draft Mode</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase tracking-wider text-[10px] font-bold">
                        <th className="py-3 px-4">Application ID</th>
                        <th className="py-3 px-4">Application Type</th>
                        <th className="py-3 px-4">Submission Date</th>
                        <th className="py-3 px-4">Current Status</th>
                        <th className="py-3 px-4">Last Updated</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {currentItems.length > 0 ? (
                        currentItems.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-[#102D52] whitespace-nowrap">
                              {app.id}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-900">
                              {app.applicationType}
                              <div className="text-[10px] text-slate-400 font-normal">
                                Session: {app.academicYear} · {app.requestedIntake} Seats
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                              {app.submissionDate}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <StatusBadge status={app.currentStatus} />
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                              {app.lastUpdated}
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedApp(app)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold rounded-md bg-blue-50 text-[#102D52] hover:bg-[#102D52] hover:text-white transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Details</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slate-400 text-xs">
                            No applications match your search filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                  <div>
                    Showing <span className="font-bold text-slate-900">{filteredApplications.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
                    <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredApplications.length)}</span> of{' '}
                    <span className="font-bold text-slate-900">{filteredApplications.length}</span> entries
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold px-2 text-slate-800">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMIT APPLICATION (Section 5 Multi-Step Form) */}
          {activeTab === 'submit-application' && (
            <div className="animate-fadeIn">
              <MultiStepApplicationForm
                onApplicationCreated={(newApp) => {
                  handleApplicationCreated(newApp);
                  setActiveTab('my-applications');
                }}
                onCancel={() => setActiveTab('my-applications')}
              />
            </div>
          )}

          {/* TAB 4: DOCUMENT UPLOADS (Section 6 Checklist) */}
          {activeTab === 'document-uploads' && (
            <div className="animate-fadeIn">
              <DocumentUploadChecklist />
            </div>
          )}

          {/* TAB 5: VALIDATION RESULTS (Section 7 Preliminary Assistive Checks) */}
          {activeTab === 'validation-results' && (
            <div className="animate-fadeIn">
              <ValidationResultsView
                onNavigateToUploads={() => setActiveTab('document-uploads')}
                onNavigateToQueries={() => setActiveTab('queries')}
              />
            </div>
          )}

          {/* TAB 6: QUERIES & CLARIFICATIONS (Section 8) */}
          {activeTab === 'queries' && (
            <div className="animate-fadeIn">
              <QueriesClarificationsView />
            </div>
          )}

          {/* TAB 7: COLLEGE PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
                      <Building2 className="w-7 h-7 text-amber-300" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#102D52]">
                        {demoCollegeProfile.institutionName}
                      </h2>
                      <p className="text-xs text-slate-500 font-mono">
                        AISHE: {demoCollegeProfile.aisheCode} · PID: {demoCollegeProfile.permanentId}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 self-start sm:self-auto">
                    Accredited Institution
                  </span>
                </div>

                {/* Profile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Institution Category</span>
                    <span className="font-semibold text-slate-800">{demoCollegeProfile.institutionType}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Affiliated University</span>
                    <span className="font-semibold text-slate-800">{demoCollegeProfile.affiliatedUniversity}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">AICTE Jurisdiction</span>
                    <span className="font-semibold text-slate-800">{demoCollegeProfile.region}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Total Approved Intake</span>
                    <span className="font-bold text-[#102D52]">{demoCollegeProfile.totalApprovedIntake} Seats across 5 Programs</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Campus Location</span>
                    <span className="font-semibold text-slate-800">{demoCollegeProfile.campusAddress}</span>
                  </div>
                </div>

                {/* Nodal Officer Contact Box */}
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-[#102D52] block uppercase tracking-wider text-[11px]">
                    Authorized Institutional Nodal Officer
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Name:</span>
                      <span className="font-bold text-slate-900">{demoCollegeProfile.nodalOfficer.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Official Email:</span>
                      <span className="font-mono text-slate-900">{demoCollegeProfile.nodalOfficer.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Contact Phone:</span>
                      <span className="font-mono text-slate-900">{demoCollegeProfile.nodalOfficer.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Approved Courses Table */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                    AICTE Approved Technical Programs
                  </h3>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase text-[10px] font-bold">
                        <tr>
                          <th className="py-2.5 px-3">Program Title</th>
                          <th className="py-2.5 px-3">Approved Intake</th>
                          <th className="py-2.5 px-3">Year Approved</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {demoCollegeProfile.approvedPrograms.map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-900">{p.program}</td>
                            <td className="py-2 px-3 font-mono font-bold text-[#102D52]">{p.intake} Seats</td>
                            <td className="py-2 px-3 font-mono text-slate-500">{p.approvedYear}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Details Inspection Modal */}
      {selectedApp && (
        <CollegeDetailsModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export default CollegeDashboard;
