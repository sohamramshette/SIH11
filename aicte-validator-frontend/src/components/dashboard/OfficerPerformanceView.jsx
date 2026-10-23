import React from 'react';
import {
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { officerPerformanceData } from '../../data/seniorOfficerDashboardData';

/**
 * OfficerPerformanceView Component (Phase 8)
 * Operational scrutiny metrics with strict demonstration warnings
 * and meaningful throughput indicators.
 */
const OfficerPerformanceView = () => {
  const totalAssigned = officerPerformanceData.reduce((acc, o) => acc + o.reviewsAssigned, 0);
  const totalCompleted = officerPerformanceData.reduce((acc, o) => acc + o.reviewsCompleted, 0);
  const totalPending = officerPerformanceData.reduce((acc, o) => acc + o.inProgress, 0);
  const totalEscalated = officerPerformanceData.reduce((acc, o) => acc + o.escalatedToSenior, 0);
  const avgDuration = (
    officerPerformanceData.reduce((acc, o) => acc + o.avgReviewDays, 0) /
    officerPerformanceData.length
  ).toFixed(1);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Prominent Demo Notice */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-xs text-amber-900 flex items-start space-x-3 shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider block mb-0.5">
            Synthetic Operational Demonstration Data
          </span>
          <span>
            The review metrics, queue durations, and clearance numbers below are strictly simulated for the SIH 26261 prototype. They evaluate the dashboard interface and supervisory workflows, and do not reflect real AICTE personnel records or actual institutional audit schedules.
          </span>
        </div>
      </div>

      {/* Top Directorate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Reviews Assigned
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#102D52] mb-1">
            {totalAssigned}
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>AY 2026-27 Regional Roster</span>
            <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-900">DEMO</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Scrutiny Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-900 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#102D52] mb-1">
            {totalCompleted}
            <span className="text-xs font-semibold text-emerald-700 ml-2">
              ({Math.round((totalCompleted / totalAssigned) * 100)}% clearance)
            </span>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Signed off by examiners</span>
            <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-900">DEMO</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Pending Workload
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-900 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#102D52] mb-1">
            {totalPending}
            <span className="text-xs font-semibold text-red-600 ml-2">
              ({totalEscalated} escalated)
            </span>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>In scrutiny queue</span>
            <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-900">DEMO</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Avg Review Duration
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-900 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-700" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#102D52] mb-1">
            {avgDuration} <span className="text-sm font-bold text-slate-600">days</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>SLA Target: 4.0 days</span>
            <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-900">DEMO</span>
          </div>
        </div>
      </div>

      {/* Meaningful Visual Progress & Workload Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-[#102D52]">
              Scrutiny Queue Clearance &amp; Workload Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Visual comparison of completed vs in-progress vs escalated cases by scrutiny desk
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            REGIONAL DESKS
          </span>
        </div>

        <div className="space-y-4">
          {officerPerformanceData.map((officer) => {
            const completedPct = Math.round((officer.reviewsCompleted / officer.reviewsAssigned) * 100);
            const pendingPct = Math.round((officer.inProgress / officer.reviewsAssigned) * 100);
            const escalatedPct = Math.round((officer.escalatedToSenior / officer.reviewsAssigned) * 100);

            return (
              <div key={officer.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{officer.name}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{officer.desk}</span>
                  </div>
                  <div className="text-slate-600 font-medium">
                    <strong className="text-emerald-700">{officer.reviewsCompleted}</strong> completed ·{' '}
                    <strong className="text-amber-700">{officer.inProgress}</strong> in review ·{' '}
                    <strong className="text-red-700">{officer.escalatedToSenior}</strong> escalated
                  </div>
                </div>

                {/* Multi-segmented Progress Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${completedPct}%` }}
                    className="bg-emerald-500 transition-all"
                    title={`Completed: ${completedPct}%`}
                  />
                  <div
                    style={{ width: `${pendingPct}%` }}
                    className="bg-amber-400 transition-all"
                    title={`Pending: ${pendingPct}%`}
                  />
                  <div
                    style={{ width: `${escalatedPct}%` }}
                    className="bg-red-500 transition-all"
                    title={`Escalated: ${escalatedPct}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 mt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span className="text-slate-600">Completed Scrutiny</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-400" />
            <span className="text-slate-600">In Review Desk</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500" />
            <span className="text-slate-600">Escalated to Senior</span>
          </div>
        </div>
      </div>

      {/* Detailed Officer Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs overflow-x-auto">
        <div className="pb-3 mb-4 border-b border-slate-100">
          <h3 className="text-sm font-black text-[#102D52]">
            Scrutiny Officer Workload &amp; SLA Compliance Ledger
          </h3>
          <p className="text-xs text-slate-500">
            Synthetic tracking of scrutiny throughput and clarification response rates
          </p>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700">
              <th className="py-2.5 px-3 font-bold">Officer &amp; Designation</th>
              <th className="py-2.5 px-3 font-bold">Regional Desk</th>
              <th className="py-2.5 px-3 font-bold text-center">Assigned</th>
              <th className="py-2.5 px-3 font-bold text-center">Completed</th>
              <th className="py-2.5 px-3 font-bold text-center">Pending</th>
              <th className="py-2.5 px-3 font-bold text-center">Escalated</th>
              <th className="py-2.5 px-3 font-bold text-center">Avg Days</th>
              <th className="py-2.5 px-3 font-bold text-center">SLA Compliance</th>
              <th className="py-2.5 px-3 font-bold text-center">Workload Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {officerPerformanceData.map((officer) => (
              <tr key={officer.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">{officer.name}</div>
                  <div className="text-[10px] text-slate-500">{officer.designation}</div>
                </td>
                <td className="py-3 px-3 font-mono text-slate-600">{officer.desk}</td>
                <td className="py-3 px-3 text-center font-bold text-slate-900">{officer.reviewsAssigned}</td>
                <td className="py-3 px-3 text-center font-bold text-emerald-700">{officer.reviewsCompleted}</td>
                <td className="py-3 px-3 text-center font-bold text-amber-700">{officer.inProgress}</td>
                <td className="py-3 px-3 text-center font-bold text-red-600">{officer.escalatedToSenior}</td>
                <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">{officer.avgReviewDays}d</td>
                <td className="py-3 px-3 text-center font-bold text-slate-800">{officer.slaComplianceRate}</td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${officer.statusColor}`}>
                    {officer.loadStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficerPerformanceView;
