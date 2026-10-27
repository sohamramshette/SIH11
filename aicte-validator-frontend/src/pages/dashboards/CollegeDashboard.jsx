import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CollegeHeader from '../../components/dashboard/CollegeHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import CollegeDetailsModal from '../../components/dashboard/CollegeDetailsModal';
import MultiStepApplicationForm from '../../components/dashboard/MultiStepApplicationForm';
import DocumentUploadChecklist from '../../components/dashboard/DocumentUploadChecklist';
import ValidationResultsView from '../../components/dashboard/ValidationResultsView';
import QueriesClarificationsView from '../../components/dashboard/QueriesClarificationsView';

import { useDemoState } from '../../hooks/useDemoState';

import {
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
  FileText,
  Edit3,
  AlertTriangle,
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
      {/* Top Horizontal Navigation Bar */}
      <CollegeHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
      />

        {/* Compact Institutional Console Notice */}
        <div className="bg-amber-50/80 border-b border-amber-200/60 px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] text-amber-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold uppercase tracking-wider text-[9px] bg-amber-200 px-1.5 py-0.2 rounded text-amber-950">
              INSTITUTIONAL CONSOLE
            </span>
            <span className="text-slate-700">
              Active portal session for {demoCollegeProfile.institutionName} (AISHE: {demoCollegeProfile.aisheCode}).
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Signatory: {demoCollegeProfile.nodalOfficer.name} · AY 2026-27 Active Cycle
          </span>
        </div>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 space-y-5 max-w-7xl mx-auto w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fadeIn">
              {/* College Identity & Command Header */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-[#102D52] leading-tight">
                        {demoCollegeProfile.institutionName}
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        Affiliated to RGPV
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-1 font-medium">
                      <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded font-semibold">
                        AISHE: {demoCollegeProfile.aisheCode}
                      </span>
                      <span>·</span>
                      <span>Permanent ID: {demoCollegeProfile.permanentId}</span>
                      <span>·</span>
                      <span>{demoCollegeProfile.region}</span>
                      <span>·</span>
                      <span>Approved Intake: {demoCollegeProfile.totalApprovedIntake}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center space-x-2 shrink-0 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('submit-application')}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#102D52] hover:bg-[#1D4ED8] text-white shadow-xs transition-colors"
                  >
                    <FilePlus2 className="w-3.5 h-3.5" />
                    <span>+ New Application</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('document-uploads')}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-blue-700" />
                    <span>Upload Docs</span>
                  </button>
                </div>
              </div>

              {/* Compact 4-Segment Key Performance Metric Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {dynamicSummaryStats.map((stat, idx) => {
                  const isAttention = stat.id === 'stat-attention' && Number(stat.value) > 0;
                  return (
                    <div
                      key={stat.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isAttention
                          ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                          : 'bg-white border-slate-200 shadow-2xs'
                      }`}
                    >
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
                          {stat.title}
                        </span>
                        <span
                          className={`text-xl sm:text-2xl font-black tracking-tight block mt-0.5 ${
                            isAttention ? 'text-amber-900' : 'text-[#102D52]'
                          }`}
                        >
                          {stat.value}
                        </span>
                        <span
                          className={`text-[10px] font-medium block mt-0.5 ${
                            isAttention ? 'text-amber-800 font-bold' : 'text-slate-500'
                          }`}
                        >
                          {stat.trend}
                        </span>
                      </div>

                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isAttention
                            ? 'bg-amber-200 text-amber-900'
                            : idx === 0
                            ? 'bg-blue-50 text-blue-800'
                            : idx === 1
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-indigo-50 text-indigo-800'
                        }`}
                      >
                        {idx === 0 && <FileText className="w-4 h-4" />}
                        {idx === 1 && <Edit3 className="w-4 h-4" />}
                        {idx === 2 && <Clock className="w-4 h-4" />}
                        {idx === 3 && <AlertTriangle className="w-4 h-4" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Two Column Layout: College Tasks + Applications & Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Column (7 cols): College Tasks & Application Overview */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Card 1: Action Items & Clarification Queries */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <h3 className="text-sm font-bold text-[#102D52]">
                          Action Items &amp; Tasks
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        {pendingCollegeActions.length} Pending
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {pendingCollegeActions.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
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
                            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-md bg-white border border-slate-300 text-[#102D52] hover:bg-slate-100 shrink-0 self-start sm:self-auto shadow-2xs"
                          >
                            <span>
                              {task.id === 'act-1'
                                ? 'Respond Query'
                                : task.id === 'act-2'
                                ? 'Upload Doc'
                                : 'Resume Draft'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: My Applications Overview (Directly on Dashboard) */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-[#102D52]" />
                        <h3 className="text-sm font-bold text-[#102D52]">
                          My Submitted Applications
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('my-applications')}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1"
                      >
                        <span>View All ({collegeApps.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {collegeApps.slice(0, 3).map((app) => (
                        <div
                          key={app.id}
                          className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-[#102D52] truncate">
                                {app.id}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-slate-700 font-medium truncate">
                                {app.applicationType}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Submitted: {app.submissionDate} · AY {app.academicYear}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <StatusBadge status={app.currentStatus} />
                            <button
                              type="button"
                              onClick={() => setSelectedApp(app)}
                              className="p-1 rounded text-slate-500 hover:text-[#102D52] hover:bg-slate-100"
                              title="View Application Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (5 cols): Institutional Profile Snapshot & Timeline */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Card 1: College Institutional Compliance Profile */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-[#102D52]">
                        Institution Profile
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        Full Details →
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-500">Campus Land Area</span>
                        <span className="font-bold text-slate-800">
                          {demoCollegeProfile.landAreaAcres} Acres (Contiguous)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-500">Built-Up Floor Area</span>
                        <span className="font-bold text-slate-800">
                          {demoCollegeProfile.builtUpAreaSqM.toLocaleString()} sq.m (Valid FSI)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-500">Approved Total Intake</span>
                        <span className="font-bold text-slate-800">
                          {demoCollegeProfile.totalApprovedIntake} Seats (5 Programs)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-500">Nodal Signatory</span>
                        <span className="font-bold text-slate-800">
                          {demoCollegeProfile.nodalOfficer.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Recent Activity Timeline */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-[#102D52]">
                        Recent Activity Log
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                        TIMELINE
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {recentCollegeActivity.map((act) => (
                        <div key={act.id} className="flex items-start space-x-2.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-slate-800 text-xs truncate">
                                {act.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono shrink-0">
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
