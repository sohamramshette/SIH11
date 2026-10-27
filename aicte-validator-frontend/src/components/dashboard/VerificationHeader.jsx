import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Home,
  UserCheck,
  Search,
  LogOut,
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck2,
  CheckSquare,
  MessageSquare,
  History,
  AlertOctagon,
} from 'lucide-react';
import { verificationSidebarNavItems, demoOfficerProfile } from '../../data/verificationDashboardData';

const iconMap = {
  LayoutDashboard,
  FileSpreadsheet,
  FileCheck2,
  CheckSquare,
  MessageSquare,
  History,
  AlertOctagon,
};

/**
 * VerificationHeader Component
 * Complete Horizontal Navigation Bar for the Verification Officer Dashboard.
 * Tier 1: Institutional branding, desk identity, search, alerts, officer profile, and Sign Out.
 * Tier 2: Horizontal navigation bar displaying all 7 scrutiny tabs side-by-side.
 */
const VerificationHeader = ({
  activeTab,
  onSelectTab,
  onLogout,
  searchQuery,
  onSearchChange,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'New High Priority Review Assigned',
      text: 'APP-2026-ENG-5284 assigned to your queue for faculty credential scrutiny.',
      time: '1h ago',
    },
    {
      id: 2,
      title: 'Clarification Response Awaited',
      text: 'Query CQ-104 issued to Bhartiya Institute of Tech & Science for CSE Cadre.',
      time: '3h ago',
    },
    {
      id: 3,
      title: 'Regional Scrutiny Board Meeting',
      text: 'Phase 1 Scrutiny Review Meeting scheduled on 28 Oct 2026 at 11:00 AM.',
      time: '1d ago',
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      {/* Tier 1: Main Top Bar (Branding, Search, Desk Info, Alerts, Officer Profile & Logout) */}
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 border-b border-slate-100">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Verification Console Identity */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#102D52] text-white flex items-center justify-center font-bold shrink-0 shadow-2xs border border-blue-900">
              <UserCheck className="w-5 h-5 text-amber-300" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-200">
                  AICTE Verification · Scrutiny Console
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden xl:inline">
                  Desk: {demoOfficerProfile.officerId}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-[#102D52] leading-tight mt-0.5">
                {demoOfficerProfile.regionalOffice}
              </h1>
            </div>
          </div>

          {/* Center: Search Field */}
          {onSearchChange !== undefined && (
            <div className="hidden md:flex items-center flex-1 max-w-sm relative mx-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search application, college, or AISHE..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-colors"
              />
            </div>
          )}

          {/* Right: Actions, Notifications, Officer Profile & Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Back to Public Home Link */}
            <Link
              to="/"
              className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-[#102D52] hover:bg-slate-100 border border-slate-200 transition-colors"
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
                    <span className="text-xs font-bold text-slate-900">Scrutiny Desk Alerts</span>
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

            {/* Verification Officer Profile Pill */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                RS
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {demoOfficerProfile.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {demoOfficerProfile.designation}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0"
              title="Logout from Scrutiny Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Horizontal Navigation Tabs Bar */}
      <div className="px-4 sm:px-6 lg:px-8 bg-slate-50/70 overflow-x-auto no-scrollbar">
        <nav className="flex items-center space-x-1 sm:space-x-1.5 py-1.5 min-w-max" aria-label="Verification Officer Horizontal Navigation">
          {verificationSidebarNavItems.map((item) => {
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
                        ? 'bg-blue-800 text-blue-100'
                        : item.badgeColor || 'bg-slate-200 text-slate-700'
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

export default VerificationHeader;
