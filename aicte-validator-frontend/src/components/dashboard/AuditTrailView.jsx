import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Key,
} from 'lucide-react';

/**
 * AuditTrailView Component
 * Tamper-evident chronological audit trail of all institutional transitions,
 * verification handoffs, and senior determinations.
 */
const AuditTrailView = ({ auditEvents = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = auditEvents.filter((ev) => {
    return (
      ev.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#102D52]">
                Statutory Regulatory Audit Ledger
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tamper-evident chronological audit trail for all scrutiny actions, escalations, and senior determinations with cryptographic hashes.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 shrink-0 self-start sm:self-auto">
            {filteredEvents.length} Verified Ledger Events
          </span>
        </div>

        {/* Search */}
        <div className="pt-4 max-w-sm relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search event ID, dossier, or officer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Ledger Cards */}
      <div className="space-y-3">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {ev.id}
                </span>
                <span className="font-mono text-xs font-bold text-blue-900">
                  {ev.applicationId}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-bold text-slate-900">{ev.action}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{ev.timestamp}</span>
            </div>

            <div className="pt-2 text-xs text-slate-700">
              <p className="mb-2 leading-relaxed">{ev.details}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-50 text-[11px] text-slate-500">
                <div className="flex items-center space-x-2">
                  <span>Actor: <strong className="text-slate-700">{ev.actor}</strong></span>
                  <span>·</span>
                  <span>Desk: {ev.desk}</span>
                </div>

                <div className="flex items-center space-x-1.5 font-mono text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  <Key className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[200px] sm:max-w-[320px]">{ev.hash}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            No audit ledger events match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditTrailView;
