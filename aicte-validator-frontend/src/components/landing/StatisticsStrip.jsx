import React from 'react';
import { statistics } from '../../data/landingPageData';
import { BarChart3, AlertOctagon } from 'lucide-react';

/**
 * Statistics Strip Component
 * Displays four clearly labeled illustrative metrics strictly flagged as DEMO DATA.
 * Styled with formal institutional contrast matching the reference portal.
 */
const StatisticsStrip = () => {
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

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-black tracking-wider uppercase shadow-xs">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>DEMO DATA · PROTOTYPE BENCHMARKS</span>
          </div>
        </div>

        {/* Four Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, idx) => (
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
        <div className="mt-6 text-center text-[11px] text-blue-200/70">
          Note: All values displayed above are synthetic test values utilized for Smart India Hackathon prototype validation.
          They do not reflect official AICTE annual statistical records.
        </div>
      </div>
    </section>
  );
};

export default StatisticsStrip;
