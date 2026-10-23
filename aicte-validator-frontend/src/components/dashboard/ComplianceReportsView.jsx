import React, { useState, useMemo } from 'react';
import {
  Download,
  Filter,
  BarChart3,
} from 'lucide-react';
import { complianceReportsSummary } from '../../data/seniorOfficerDashboardData';

/**
 * ComplianceReportsView Component (Phase 9)
 * Executive compliance reporting with date & application type filters
 * and functional dynamic CSV export generated from active records.
 */
const ComplianceReportsView = ({ applications }) => {
  const [dateFilter, setDateFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Filtered applications based on dropdown selections
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesType = typeFilter === 'ALL' || app.applicationType === typeFilter;
      // In this demo, date ranges represent simulated windows
      const matchesDate =
        dateFilter === 'ALL' ||
        (dateFilter === '7DAYS' && (app.submissionDate.includes('20') || app.submissionDate.includes('19'))) ||
        (dateFilter === '30DAYS' && true);
      return matchesType && matchesDate;
    });
  }, [applications, typeFilter, dateFilter]);

  // Dynamically compute statuses from active filtered applications
  const statusCounts = useMemo(() => {
    const counts = {};
    filteredApps.forEach((app) => {
      counts[app.currentStatus] = (counts[app.currentStatus] || 0) + 1;
    });
    return counts;
  }, [filteredApps]);

  // Dynamically compute preliminary outcomes from active filtered applications
  const outcomeCounts = useMemo(() => {
    const counts = {};
    filteredApps.forEach((app) => {
      counts[app.preliminaryOutcome] = (counts[app.preliminaryOutcome] || 0) + 1;
    });
    return counts;
  }, [filteredApps]);

  // Functional CSV Export from actual active records
  const handleExportCSV = () => {
    const headers = [
      'Application ID',
      'Institution Name',
      'AISHE Code',
      'Region',
      'Application Type',
      'Stream',
      'Submission Date',
      'Verification Officer',
      'Preliminary Outcome',
      'Current Status',
      'Escalation Reason',
      'Urgency',
    ];

    const rows = filteredApps.map((app) => [
      `"${app.id}"`,
      `"${app.institutionName}"`,
      `"${app.aisheCode}"`,
      `"${app.region}"`,
      `"${app.applicationType}"`,
      `"${app.stream}"`,
      `"${app.submissionDate}"`,
      `"${app.verificationOfficer?.name || 'N/A'}"`,
      `"${app.preliminaryOutcome}"`,
      `"${app.currentStatus}"`,
      `"${app.escalationReason || 'None'}"`,
      `"${app.urgency || 'Normal'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aicte_senior_compliance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4 text-purple-700" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#102D52]">
                Regional Compliance &amp; Scrutiny Audit Reports
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Synthetic audit reports covering preliminary validation outcomes, statutory deficiencies, and escalation drivers.
            </p>
          </div>

          {/* CSV Export Action Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-white bg-[#102D52] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-xs self-start lg:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Export Active Report (CSV)</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-purple-700" />
            <span>Filters:</span>
          </div>

          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-purple-600"
            >
              <option value="ALL">Date Range: AY 2026-27 Entire Cycle</option>
              <option value="7DAYS">Date Range: Last 7 Days (Recent Submissions)</option>
              <option value="30DAYS">Date Range: Last 30 Days</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-purple-600"
            >
              <option value="ALL">Application Type: All Types</option>
              <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
              <option value="Increase in Intake">Increase in Intake</option>
              <option value="Addition of New Course">Addition of New Course</option>
              <option value="New Program Introduction">New Program Introduction</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 ml-auto">
            Showing <strong className="text-slate-800">{filteredApps.length}</strong> active demo records
          </span>
        </div>
      </div>

      {/* Grid: Application Status Summary & Preliminary Validation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Application Status Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-[#102D52]">
              Application Status Distribution
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
              Active Workflow
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => {
              const pct = Math.round((count / filteredApps.length) * 100) || 0;
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{status}</span>
                    <span className="text-slate-500 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full transition-all ${
                        status.includes('Escalated')
                          ? 'bg-red-500'
                          : status.includes('Passed') || status.includes('Approved')
                          ? 'bg-emerald-500'
                          : status.includes('Review') || status.includes('Pending')
                          ? 'bg-amber-500'
                          : 'bg-blue-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 2: Preliminary Validation Outcome Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-[#102D52]">
              Preliminary Automated Scrutiny Outcomes
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
              AI Rules Engine
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(outcomeCounts).map(([outcome, count]) => {
              const pct = Math.round((count / filteredApps.length) * 100) || 0;
              return (
                <div key={outcome} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{outcome}</span>
                    <span className="text-slate-500 font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full transition-all ${
                        outcome.includes('Inconsistency') || outcome.includes('Failed')
                          ? 'bg-red-500'
                          : outcome.includes('Passed')
                          ? 'bg-emerald-500'
                          : 'bg-amber-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statutory Category Check Table */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2.5">
              Category Validation Pass Rates (APH 2026-27 Norms)
            </h4>
            <div className="space-y-2 text-xs">
              {complianceReportsSummary.preliminaryValidation.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-700">{cat.category}</span>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="text-emerald-700 font-bold">{cat.passed} Pass</span>
                    <span className="text-amber-700 font-bold">{cat.reviewNeeded} Review</span>
                    <span className="font-bold text-[#102D52] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {cat.passRate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Pending Clarifications Summary & Escalations Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 3: Pending Clarification Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-[#102D52]">
              Pending Clarification Summary by Category
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              Institutional Queries
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {complianceReportsSummary.pendingClarificationByCategory.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="font-medium text-slate-800">{item.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{item.count} Cases</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      item.severity === 'High'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : item.severity === 'Medium'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {item.severity} Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 4: Escalation Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-[#102D52]">
              Escalation Root Cause Breakdown
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-900 border border-red-200">
              Statutory Anomalies
            </span>
          </div>

          <div className="space-y-3">
            {complianceReportsSummary.escalationReasonsSummary.map((esc, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate mr-2">{esc.reason}</span>
                  <span className="font-mono text-slate-600 font-bold shrink-0">
                    {esc.count} ({esc.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${esc.percentage}%` }}
                    className="h-full bg-red-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
            <strong>Directorate Notice:</strong> All escalation trends are consolidated across regional desks to identify systemic reporting deficiencies during annual Approval Process Handbook revisions.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReportsView;
