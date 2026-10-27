import React, { useContext, useMemo } from 'react';
import { DemoStateContext } from '../../context/DemoStateContext';
import { statistics as defaultStatistics } from '../../data/landingPageData';
import { BarChart3, AlertOctagon } from 'lucide-react';

/**
 * Statistics Strip Component
 * Displays clearly labeled illustrative metrics calculated directly from the mock
 * prototype application dataset, with a visible synthetic demo disclaimer.
 */
const StatisticsStrip = () => {
  const demoContext = useContext(DemoStateContext);
  const applications = demoContext?.applications;

  // Calculate actual counts from unified demo applications when available
  const displayStats = useMemo(() => {
    if (applications && applications.length > 0) {
      const total = applications.length;
      const completed = applications.filter(
        (a) => a.currentStatus === 'Completed' || a.currentStatus === 'Scrutiny Passed'
      ).length;
      const flagged = applications.filter(
        (a) => (a.flaggedCount || 0) > 0 || a.currentStatus === 'Review Required' || a.currentStatus === 'Escalated'
      ).length;
      const pending = applications.filter(
        (a) => a.currentStatus === 'Under Review' || a.currentStatus === 'Pending Senior Review'
      ).length;

      return [
        {
          id: 'stat-1',
          label: 'Applications in Demo Queue',
          value: total.toString(),
          subtext: 'Mock applications loaded in prototype state',
          metricType: 'Mock Dataset',
        },
        {
          id: 'stat-2',
          label: 'Scrutiny Reviews Completed',
          value: completed.toString(),
          subtext: 'Simulated applications with completed validations',
          metricType: 'Processed',
        },
        {
          id: 'stat-3',
          label: 'Documents Flagged for Review',
          value: flagged.toString(),
          subtext: 'Discrepancy anomalies identified for officer inspection',
          metricType: 'Exceptions',
        },
        {
          id: 'stat-4',
          label: 'Cases Awaiting Review',
          value: pending.toString(),
          subtext: 'Applications in queue for authorized scrutiny sign-off',
          metricType: 'Pending',
        },
      ];
    }
    return defaultStatistics;
  }, [applications]);

  return (
    <section className="bg-[#102D52] text-white py-10 px-4 sm:px-6 lg:px-8 border-y-4 border-[#E05A18]">
      <div className="max-w-7xl mx-auto">
        {/* Strip Header with Mandatory Prototype Demo Data Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-6 border-b border-blue-900/80 gap-3">
          <div className="flex items-center space-x-2.5">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-white">
              Institutional Verification &amp; Scrutiny Overview
            </h2>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-amber-400 text-slate-950 text-xs font-bold tracking-wide shadow-xs">
            <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-slate-950" />
            <span>Illustrative Demo Data — Not Official AICTE Statistics</span>
          </div>
        </div>

        {/* Four Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStats.map((stat, idx) => (
            <div
              key={stat.id}
              className="relative p-5 bg-[#0C2442] rounded-lg border border-blue-900/70 hover:border-blue-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Metric {idx + 1} · {stat.metricType}
                </span>
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-950 text-amber-300 border border-blue-800">
                  DEMO
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
                {stat.value}
              </div>

              <h3 className="text-sm font-bold text-blue-100 mb-1 leading-snug">
                {stat.label}
              </h3>

              <p className="text-xs text-blue-300/80 leading-relaxed font-normal">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>

        {/* Clear Institutional Disclaimer Note */}
        <div className="mt-6 text-center text-[11px] text-blue-200/80 bg-blue-950/60 py-2.5 px-4 rounded-lg border border-blue-900/80 max-w-3xl mx-auto">
          Illustrative Demo Data — Not Official AICTE Statistics. Figures reflect active application counts loaded in the prototype evaluation environment.
        </div>
      </div>
    </section>
  );
};

export default StatisticsStrip;
