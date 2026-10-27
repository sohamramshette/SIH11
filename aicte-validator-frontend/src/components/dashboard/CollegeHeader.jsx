import React, { useState } from 'react';
import {
  Bell,
  LogOut,
  Building2,
  ShieldCheck,
  LayoutDashboard,
  FileSpreadsheet,
  FilePlus2,
  UploadCloud,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { demoCollegeProfile, collegeSidebarNavItems } from '../../data/collegeDashboardData';

const iconMap = {
  LayoutDashboard,
  FileSpreadsheet,
  FilePlus2,
  UploadCloud,
  CheckCircle2,
  HelpCircle,
  Building2,
};

/**
 * CollegeHeader Component
 * Complete Horizontal Navigation Bar for the College Portal.
 * Tier 1: Institutional branding, notifications, and nodal officer profile with Sign Out.
 * Tier 2: Horizontal navigation bar displaying all 7 tabs side-by-side.
 */
const CollegeHeader = ({
  activeTab,
  onSelectTab,
  onLogout,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Scrutiny Clarification Issued', text: 'Query CQ-104 requires college response on Cadre Ratio.', time: '2h ago' },
    { id: 2, title: 'Document Validation Update', text: 'Automated OCR completed for 16 documents in APP-2026-ENG-1042.', time: '1d ago' },
    { id: 3, title: 'Phase 1 Scrutiny Window', text: 'Submit remaining approvals before 31 October 2026.', time: '2d ago' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      {/* Tier 1: Main Header (Branding, Nodal Profile, and Session Sign Out) */}
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 border-b border-slate-100">
        <div className="flex items-center justify-between gap-4">
          {/* Left: AICTE College Portal Institutional Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#102D52] text-white flex items-center justify-center font-bold shrink-0 shadow-2xs border border-blue-900">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                  AICTE College Portal · Institutional Console
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
                  AISHE: {demoCollegeProfile.aisheCode}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-[#102D52] leading-tight mt-0.5">
                {demoCollegeProfile.institutionName}
              </h1>
            </div>
          </div>

          {/* Right: Actions, Notifications & Profile */}
          <div className="flex items-center space-x-3">
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

            {/* Nodal Officer Profile Pill */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                AJ
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {demoCollegeProfile.nodalOfficer.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {demoCollegeProfile.shortName} · Principal
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0"
              title="Sign out of College Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Horizontal Navigation Tabs Bar */}
      <div className="px-4 sm:px-6 lg:px-8 bg-slate-50/60 overflow-x-auto no-scrollbar">
        <nav className="flex items-center space-x-1 sm:space-x-1.5 py-1.5 min-w-max" aria-label="College Horizontal Navigation">
          {collegeSidebarNavItems.map((item) => {
            const Icon = iconMap[item.iconName] || LayoutDashboard;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${
                  isActive
                    ? 'bg-[#102D52] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#102D52] hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{item.label}</span>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor
                        ? item.badgeColor
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default CollegeHeader;
