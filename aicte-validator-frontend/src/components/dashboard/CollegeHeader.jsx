import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Home,
  Building2,
} from 'lucide-react';
import { demoCollegeProfile } from '../../data/collegeDashboardData';

/**
 * CollegeHeader Component
 * Top header for the College Dashboard with notifications,
 * college profile badge, and mobile drawer toggle.
 */
const CollegeHeader = ({
  activeTabTitle,
  onOpenMobileSidebar,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Scrutiny Clarification Issued', text: 'Query CQ-104 requires college response on Cadre Ratio.', time: '2h ago' },
    { id: 2, title: 'Document Validation Update', text: 'Automated OCR completed for 16 documents in APP-2026-ENG-1042.', time: '1d ago' },
    { id: 3, title: 'Phase 1 Scrutiny Window', text: 'Submit remaining approvals before 31 October 2026.', time: '2d ago' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 shadow-2xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-md text-slate-700 hover:text-[#102D52] hover:bg-slate-100"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-black text-[#102D52] leading-tight">
              {activeTabTitle || 'College Overview'}
            </h1>
            <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {demoCollegeProfile.institutionName} · AISHE: {demoCollegeProfile.aisheCode}
            </div>
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile */}
        <div className="flex items-center space-x-3">
          {/* Back to Public Home Link */}
          <Link
            to="/"
            className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md text-slate-700 hover:text-[#102D52] hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Return to Public Portal"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Portal Home</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-[#102D52] hover:bg-slate-100 relative focus:outline-none"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl border border-slate-200 shadow-xl p-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Institutional Alerts</span>
                  <span className="text-[10px] text-blue-700 font-semibold cursor-pointer hover:underline">
                    Mark all read
                  </span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-md hover:bg-slate-50 text-xs">
                      <div className="flex items-center justify-between font-bold text-[#102D52] text-[11px]">
                        <span>{n.title}</span>
                        <span className="text-[9px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Demo College Representative Profile Pill */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              <Building2 className="w-4 h-4 text-emerald-200" />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {demoCollegeProfile.nodalOfficer.name}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {demoCollegeProfile.shortName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CollegeHeader;
