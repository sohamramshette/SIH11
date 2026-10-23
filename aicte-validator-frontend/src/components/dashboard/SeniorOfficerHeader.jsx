import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Home,
  ShieldCheck,
  Search,
  AlertOctagon,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { demoSeniorOfficerProfile } from '../../data/seniorOfficerDashboardData';

/**
 * SeniorOfficerHeader Component (Phase 6)
 * Top header for the AICTE Senior Officer & Regional Directorate Console.
 */
const SeniorOfficerHeader = ({
  activeTabTitle,
  onOpenMobileSidebar,
  searchQuery,
  onSearchChange,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'High-Risk Escalation Received',
      text: 'APP-2026-ENG-5284 (Vidyapeeth College) escalated by Dr. R. K. Sharma for duplicate faculty Aadhaar conflict.',
      time: '1h ago',
      icon: AlertOctagon,
      iconColor: 'text-red-500',
    },
    {
      id: 2,
      title: 'Urgent Review Approaching Deadline',
      text: 'APP-2026-ENG-3190 (Sahyadri Engg) structural safety review expires in 24 hours.',
      time: '3h ago',
      icon: Clock,
      iconColor: 'text-amber-500',
    },
    {
      id: 3,
      title: 'College Clarification Submitted',
      text: 'Bhartiya Institute submitted selection committee minutes for B.Tech CSE intake expansion.',
      time: '5h ago',
      icon: CheckCircle2,
      iconColor: 'text-blue-500',
    },
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
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-[#102D52] leading-tight">
                {activeTabTitle || 'Senior Directorate Overview'}
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
                APPROVAL AUTHORITY
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {demoSeniorOfficerProfile.office} · Regional Desk ID: {demoSeniorOfficerProfile.officerId}
            </div>
          </div>
        </div>

        {/* Center: Search Field */}
        {onSearchChange !== undefined && (
          <div className="hidden md:flex items-center flex-1 max-w-xs relative ml-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search application or institution..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white transition-colors"
            />
          </div>
        )}

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
              aria-label="View senior directorate alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-88 bg-white rounded-xl border border-slate-200 shadow-xl p-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span className="text-xs font-bold text-slate-900">Directorate Priority Alerts</span>
                  </div>
                  <span
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[10px] text-blue-700 font-semibold cursor-pointer hover:underline"
                  >
                    Dismiss
                  </span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div key={n.id} className="p-2 rounded-lg hover:bg-slate-50 text-xs border border-slate-100">
                        <div className="flex items-start space-x-2">
                          <Icon className={`w-4 h-4 ${n.iconColor} shrink-0 mt-0.5`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between font-bold text-[#102D52] text-[11px]">
                              <span className="truncate">{n.title}</span>
                              <span className="text-[9px] text-slate-400 font-normal shrink-0 ml-1">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.text}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Senior Officer Profile Pill */}
          <div className="flex items-center space-x-2.5 pl-2.5 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              SR
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {demoSeniorOfficerProfile.name}
              </div>
              <div className="text-[10px] text-purple-900 font-semibold">
                Senior Regional Director
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SeniorOfficerHeader;
