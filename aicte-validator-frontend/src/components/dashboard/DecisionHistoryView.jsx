import React, { useState } from 'react';
import {
  History,
  Search,
  Eye,
  X,
  ShieldAlert,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * DecisionHistoryView Component
 * Tabular and expandable view of all simulated senior officer decisions.
 */
const DecisionHistoryView = ({ historyRecords = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredHistory = (historyRecords || []).filter((rec) => {
    const institution = (rec.institutionName || rec.collegeName || '').toLowerCase();
    const appId = (rec.applicationId || '').toLowerCase();
    const recordId = (rec.id || '').toLowerCase();
    const decisionType = (rec.decisionType || '').toLowerCase();
    const query = (searchTerm || '').toLowerCase();

    return (
      institution.includes(query) ||
      appId.includes(query) ||
      recordId.includes(query) ||
      decisionType.includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                <History className="w-4 h-4 text-purple-700" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#102D52]">
                Senior Officer Decision History
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Simulated statutory decisions, provisional approvals, and recommendations signed off during AY 2026-27.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200 shrink-0 self-start sm:self-auto">
            {filteredHistory.length} Recorded Determinations
          </span>
        </div>

        {/* Search */}
        <div className="pt-4 max-w-sm relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search decision ID, institution or application..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-700">
              <th className="py-2.5 px-4 font-bold">Decision ID</th>
              <th className="py-2.5 px-4 font-bold">Application &amp; Institution</th>
              <th className="py-2.5 px-4 font-bold">Application Type</th>
              <th className="py-2.5 px-4 font-bold">Decision Category</th>
              <th className="py-2.5 px-4 font-bold">Determination Outcome</th>
              <th className="py-2.5 px-4 font-bold">Date &amp; Senior Officer</th>
              <th className="py-2.5 px-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredHistory.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-blue-900">{rec.id}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{rec.institutionName}</div>
                  <div className="font-mono text-[10px] text-slate-500">{rec.applicationId}</div>
                </td>
                <td className="py-3 px-4 font-medium text-slate-700">{rec.applicationType}</td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-purple-950 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                    {rec.decisionType}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={rec.outcome} />
                </td>
                <td className="py-3 px-4">
                  <div className="text-slate-800 font-semibold">{rec.decisionDate}</div>
                  <div className="text-[10px] text-slate-500">{rec.seniorOfficer}</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(rec)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-[#102D52] hover:bg-slate-50 transition-colors"
                    title="View Full Decision Rationale"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredHistory.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No decision records match your search criteria.
          </div>
        )}
      </div>

      {/* Decision Detail Modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  Simulated Decision Record
                </span>
                <h3 className="text-base font-black text-[#102D52] mt-1">
                  {selectedRecord.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Institution</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedRecord.institutionName}</p>
                <p className="text-slate-600 font-mono mt-0.5">Dossier: {selectedRecord.applicationId} · {selectedRecord.applicationType}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Determination Outcome:</span>
                <StatusBadge status={selectedRecord.outcome} />
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-0.5">Decision Rationale:</span>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed italic">
                  "{selectedRecord.rationale}"
                </p>
              </div>

              {selectedRecord.notes && (
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">Conditions &amp; Compliance Notes:</span>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedRecord.notes}
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Sign-off: {selectedRecord.seniorOfficer}</span>
                <span>Date: {selectedRecord.decisionDate}</span>
              </div>

              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[10px] text-amber-900 flex items-start space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>Simulated determination record for SIH 26261 demonstration prototype.</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#102D52] text-white hover:bg-[#1D4ED8] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionHistoryView;
