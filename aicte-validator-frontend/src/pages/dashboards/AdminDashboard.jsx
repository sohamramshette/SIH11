import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import AdminHeader from '../../components/dashboard/AdminHeader';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ReviewAlertsPanel from '../../components/dashboard/ReviewAlertsPanel';
import RecentActivityFeed from '../../components/dashboard/RecentActivityFeed';
import ApplicationsTable from '../../components/dashboard/ApplicationsTable';
import ApplicationDetailsModal from '../../components/dashboard/ApplicationDetailsModal';

import { useDemoState } from '../../hooks/useDemoState';

import {
  sidebarNavItems,
  adminSummaryStats,
  collegesDirectoryData,
  auditLogsData,
} from '../../data/adminDashboardData';

import {
  FileCheck2,
  FileSearch,
  BarChart3,
  Settings,
  Download,
  CheckCircle2,
} from 'lucide-react';

/**
 * AdminDashboard Component (Phase 3)
 * Comprehensive Administrative Portal for AICTE Application Validation
 * and Regulatory Compliance Verification System.
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { applications, logoutDemoUser } = useDemoState();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Application Details Modal
  const [selectedApp, setSelectedApp] = useState(null);

  // Logout handler
  const handleLogout = () => {
    logoutDemoUser();
    navigate('/login');
  };

  // Inspect application from ID (used by review alerts panel)
  const handleInspectAppById = (appId) => {
    const found = applications.find((a) => a.id === appId);
    if (found) {
      setSelectedApp(found);
    }
  };

  // Current tab metadata
  const currentTabItem = sidebarNavItems.find((item) => item.id === activeTab) || sidebarNavItems[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800">
      {/* 1. Fixed Navy-Blue Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Dashboard Content Wrapper (offset by sidebar width on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          activeTabTitle={currentTabItem.label}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Sub-Header Notice Bar */}
        <div className="bg-amber-500/10 border-b border-amber-200/80 px-4 sm:px-6 lg:px-8 py-2 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 px-1.5 py-0.2 rounded text-amber-950">
              SIMULATED ADMIN CONSOLE
            </span>
            <span className="text-slate-700">
              Smart India Hackathon Prototype (ID: 26261) · All statistics and institutional applications are synthetic demo data.
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Handbook: APH 2026-27 Active
          </span>
        </div>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Summary Stats Grid (Requirement 3) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Application Scrutiny &amp; Verification Metrics
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">
                    Auto-refreshed: Just now
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {adminSummaryStats.map((stat) => (
                    <StatCard
                      key={stat.id}
                      title={stat.title}
                      value={stat.value}
                      change={stat.change}
                      subtext={stat.subtext}
                      iconName={stat.iconName}
                    />
                  ))}
                </div>
              </div>

              {/* Review Alerts Panel (Requirement 6) */}
              <ReviewAlertsPanel
                onSelectApplication={handleInspectAppById}
              />

              {/* Two Column Layout: Applications Table Preview + Recent Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-4">
                  <ApplicationsTable
                    applications={applications}
                    onSelectApplication={(app) => setSelectedApp(app)}
                  />
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <RecentActivityFeed />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATIONS (Dedicated Full Manager) */}
          {activeTab === 'applications' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#102D52]">
                    Comprehensive Applications Master Directory
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage institutional approval submissions, review status assignments, and scrutiny remarks.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => alert('[DEMO ACTION] Exporting application master spreadsheet...')}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <ApplicationsTable
                applications={applications}
                onSelectApplication={(app) => setSelectedApp(app)}
              />
            </div>
          )}

          {/* TAB 3: DOCUMENT VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#102D52] flex items-center justify-center font-bold">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#102D52]">
                      Document Authentication &amp; OCR Engine Console
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage optical extraction queues, civic authority cross-checks, and land title encumbrance validations.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">OCR Parser Status</span>
                    <span className="text-base font-black text-emerald-700 block">Operational (99.8%)</span>
                    <span className="text-[11px] text-slate-600 mt-1 block">Tesseract + LayoutLMv3 pipeline active</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Cryptographic Seal Check</span>
                    <span className="text-base font-black text-[#102D52] block">SHA-256 Verifier Active</span>
                    <span className="text-[11px] text-slate-600 mt-1 block">All uploads signed on receipt</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">GIS Coordinate Parser</span>
                    <span className="text-base font-black text-emerald-700 block">Bhuvan / Geo-Portal Sync</span>
                    <span className="text-[11px] text-slate-600 mt-1 block">Land survey polygon checks online</span>
                  </div>
                </div>
              </div>

              {/* Document Scrutiny Sample Records */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Recent Document Scrutiny Extractions
                </h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#102D52]">{app.id} · {app.collegeName}</div>
                        <div className="text-[11px] text-slate-500">
                          {app.documentsCount} Documents Ingested · Land: {app.landAreaAcres} Acres · Built-up: {app.builtUpAreaSqM} sq.m
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedApp(app)}
                        className="px-2.5 py-1 text-xs font-bold rounded bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-900 border border-slate-200"
                      >
                        Inspect Proof
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COLLEGE MANAGEMENT */}
          {activeTab === 'colleges' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#102D52]">
                    Technical Educational Institutions Directory
                  </h2>
                  <p className="text-xs text-slate-500">
                    Registered polytechnics, engineering colleges, pharmacy and management institutes.
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-600">
                  {collegesDirectoryData.length} Participating Colleges Listed
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase tracking-wider text-[10px] font-bold">
                        <th className="py-3 px-4">College Name</th>
                        <th className="py-3 px-4">AISHE Code</th>
                        <th className="py-3 px-4">State &amp; Region</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Approved Intake</th>
                        <th className="py-3 px-4">Accreditation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {collegesDirectoryData.map((col) => (
                        <tr key={col.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-[#102D52]">
                            {col.name}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-600">
                            {col.aishe}
                          </td>
                          <td className="py-3 px-4">
                            <div>{col.state}</div>
                            <div className="text-[10px] text-slate-400">{col.region}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {col.category}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">
                            {col.approvedIntake} Seats
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={col.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI REVIEW QUEUE */}
          {activeTab === 'ai-queue' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#102D52] flex items-center justify-center font-bold">
                    <FileSearch className="w-6 h-6 text-[#102D52]" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#102D52]">
                      AI Discrepancy &amp; Review Queue
                    </h2>
                    <p className="text-xs text-slate-500">
                      Automated anomaly screening queue with coordinate-level evidence citations for scrutiny committees.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-950 font-medium">
                  <strong>Regulatory Mandate:</strong> The AI Review Queue surfaces preliminary assistive flags only. Final statutory decisions remain solely with authorized scrutiny officers.
                </div>
              </div>

              <ReviewAlertsPanel
                onSelectApplication={handleInspectAppById}
              />
            </div>
          )}

          {/* TAB 6: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs text-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#102D52] flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#102D52]">
                Statutory Compliance Reports &amp; Executive Analytics
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Generate regional scrutiny distribution charts, deficiency trends, and executive summaries for AICTE approval council meetings.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => alert('[DEMO REPORT] Generating Regional Compliance Summary PDF...')}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#102D52] text-white hover:bg-[#1D4ED8]"
                >
                  Generate Regional Summary Report
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT LOGS */}
          {activeTab === 'audit-logs' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#102D52]">
                    Tamper-Evident Immutable Audit Logs
                  </h2>
                  <p className="text-xs text-slate-500">
                    Cryptographic signature trail for all document inspections, status changes, and officer evaluations.
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Log Hash Integrity Valid</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase tracking-wider text-[10px] font-bold">
                        <th className="py-3 px-4">Log ID</th>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Actor</th>
                        <th className="py-3 px-4">Action Event</th>
                        <th className="py-3 px-4">Target Application</th>
                        <th className="py-3 px-4">SHA-256 Checksum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                      {auditLogsData.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-[#102D52]">{log.id}</td>
                          <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                          <td className="py-3 px-4 font-sans text-xs font-semibold text-slate-900">{log.actor}</td>
                          <td className="py-3 px-4 font-bold text-blue-900">{log.action}</td>
                          <td className="py-3 px-4 text-[#102D52] font-bold">{log.target}</td>
                          <td className="py-3 px-4 text-[9px] text-slate-400 truncate max-w-xs">{log.hash}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6 animate-fadeIn">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-[#102D52] flex items-center justify-center font-bold">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#102D52]">
                    System Regulatory Matrix &amp; Officer Assignment Settings
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure Approval Process Handbook (APH) rule thresholds, scrutiny deadlines, and notification alerts.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">Active AICTE Approval Process Handbook (APH)</span>
                    <span className="text-slate-500">Currently enforcing regulatory matrices for Academic Session 2026-27.</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    APH 2026-27 ENFORCED
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">Automated Discrepancy Flagging Sensitivity</span>
                    <span className="text-slate-500">Threshold for triggering human scrutiny alerts on cadastral and faculty checks.</span>
                  </div>
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    STANDARD (95% MATCH)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-800 block">Prototype Demonstration Mode</span>
                    <span className="text-slate-500">Smart India Hackathon simulated environment.</span>
                  </div>
                  <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    DEMO SIMULATION ACTIVE
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Application Inspection Modal */}
      {selectedApp && (
        <ApplicationDetailsModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
