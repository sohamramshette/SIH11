import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Home,
  ShieldCheck,
  Search,
  AlertOctagon,
  Clock,
  CheckCircle2,
  LogOut,
  LayoutDashboard,
  ClipboardCheck,
  UserCheck,
  BarChart3,
  History,
  FileCheck2,
} from 'lucide-react';
import { seniorSidebarNavItems, demoSeniorOfficerProfile } from '../../data/seniorOfficerDashboardData';

const iconMap = {
  LayoutDashboard,
  ClipboardCheck,
  AlertOctagon,
  UserCheck,
  BarChart3,
  History,
  ShieldCheck,
  FileCheck2,
};

/**
 * SeniorOfficerHeader Component
 * Complete Horizontal Navigation Bar for the Senior Verification Officer & Directorate Console.
 * Tier 1: Directorate branding, regional jurisdiction, search, priority alerts, director profile, and Sign Out.
 * Tier 2: Horizontal navigation bar displaying all approval & directorate tabs side-by-side.
 */
const SeniorOfficerHeader = ({
  activeTab,
  onSelectTab,
  onLogout,
  searchQuery,
  onSearchChange,
  workspaceActive = false,
  caseId = null,
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
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      {/* Tier 1: Main Top Bar (Branding, Search, Office Info, Alerts, Officer Profile & Logout) */}
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 border-b border-slate-100">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Directorate Branding */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#102D52] text-white flex items-center justify-center font-bold shrink-0 shadow-2xs border border-purple-900">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.2 rounded border border-purple-200">
                  AICTE Directorate · Approval Authority
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden xl:inline">
                  Desk: {demoSeniorOfficerProfile.officerId}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-[#102D52] leading-tight mt-0.5">
                {demoSeniorOfficerProfile.office}
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
                placeholder="Search application, institution, or officer..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>
          )}

          {/* Right: Actions, Notifications, Senior Officer Profile & Logout */}
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
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
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

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shrink-0"
              title="Logout from Directorate Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Horizontal Navigation Tabs Bar */}
      <div className="px-4 sm:px-6 lg:px-8 bg-slate-50/70 overflow-x-auto no-scrollbar">
        <nav className="flex items-center space-x-1 sm:space-x-1.5 py-1.5 min-w-max" aria-label="Senior Officer Horizontal Navigation">
          {seniorSidebarNavItems.map((item) => {
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
                        ? 'bg-purple-900 text-purple-100'
                        : item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Active Case Review Workspace Tab (if open) */}
          {(workspaceActive || activeTab === 'workspace') && (
            <button
              type="button"
              onClick={() => onSelectTab('workspace')}
              className={`inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${
                activeTab === 'workspace'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-purple-700 hover:bg-purple-100'
              }`}
            >
              <FileCheck2 className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'workspace' ? 'text-amber-300' : 'text-purple-600'}`} />
              <span>Case Workspace {caseId ? `(${caseId})` : ''}</span>
              <span className="text-[9px] uppercase tracking-wider bg-purple-200/60 text-purple-950 px-1.5 py-0.2 rounded font-bold">
                Active
              </span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default SeniorOfficerHeader;
