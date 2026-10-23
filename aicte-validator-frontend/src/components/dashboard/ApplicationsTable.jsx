import React, { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';

/**
 * ApplicationsTable Component
 * Implements full table of applications with search, status filtering,
 * application type filtering, pagination, and View Details inspection.
 */
const ApplicationsTable = ({ applications = [], onSelectApplication }) => {
  // Local filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter applications
  const filteredApplications = useMemo(() => {
    return (applications || []).filter((app) => {
      const id = (app.id || '').toLowerCase();
      const college = (app.collegeName || app.institutionName || '').toLowerCase();
      const aishe = (app.aisheCode || '').toLowerCase();
      const officer = (app.assignedOfficer || app.verificationOfficer?.name || '').toLowerCase();
      const query = (searchTerm || '').toLowerCase();

      const matchesSearch =
        query === '' ||
        id.includes(query) ||
        college.includes(query) ||
        aishe.includes(query) ||
        officer.includes(query);

      const status = (app.currentStatus || '').toLowerCase();
      const matchesStatus =
        statusFilter === 'ALL' ||
        status === statusFilter.toLowerCase();

      const appType = (app.applicationType || '').toLowerCase();
      const matchesType =
        typeFilter === 'ALL' ||
        appType === typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [applications, searchTerm, statusFilter, typeFilter]);

  // Pagination calculus
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header & Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#102D52]" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#102D52]">
                Institutional Applications Register
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Academic Session 2026-27 Submissions &amp; Scrutiny Queue
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0 self-start sm:self-auto">
            {filteredApplications.length} RECORDS FOUND
          </span>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, College Name, or Officer..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102D52]"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="sm:col-span-3">
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
                <option value="Scrutiny Passed">Scrutiny Passed</option>
                <option value="Review Required">Review Required</option>
                <option value="Missing Information">Missing Information</option>
                <option value="Possible Inconsistency">Possible Inconsistency</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Application Type Filter Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102D52] text-slate-700 truncate"
            >
              <option value="ALL">All Application Types</option>
              <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
              <option value="New Technical Institution">New Technical Institution</option>
              <option value="Increase in Intake">Increase in Intake</option>
              <option value="Addition of New Course">Addition of New Course</option>
              <option value="Closure / Merger">Closure / Merger</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase tracking-wider text-[10px] font-bold">
              <th className="py-3 px-4">Application ID</th>
              <th className="py-3 px-4">College Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Submission Date</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4">Assigned Officer</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {currentItems.length > 0 ? (
              currentItems.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#102D52] whitespace-nowrap">
                    {app.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-xs">
                    <div className="truncate font-semibold">{app.collegeName || app.institutionName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">AISHE: {app.aisheCode || 'C-00000'}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                    {app.applicationType}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                    {app.submissionDate}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={app.currentStatus} />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                    <div className="font-medium">{app.assignedOfficer || app.verificationOfficer?.name || 'Unassigned'}</div>
                    <div className="text-[10px] text-slate-400">{app.officerRole || app.verificationOfficer?.desk || 'Scrutiny Cell'}</div>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectApplication && onSelectApplication(app)}
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
                <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                  No applications match your search and filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Strip */}
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
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-bold px-2 text-slate-800">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsTable;
