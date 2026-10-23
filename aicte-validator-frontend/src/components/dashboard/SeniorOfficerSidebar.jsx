import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  AlertOctagon,
  UserCheck,
  BarChart3,
  History,
  ShieldCheck,
  LogOut,
  X,
  ShieldAlert,
  Building2,
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
};

/**
 * SeniorOfficerSidebar Component (Phase 6)
 * Navy-blue navigation sidebar for the AICTE Senior Officer & Regional Approval Directorate.
 */
const SeniorOfficerSidebar = ({
  activeTab,
  onSelectTab,
  onLogout,
  mobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#102D52] text-white flex flex-col justify-between border-r border-blue-950 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Senior Officer Directorate Sidebar"
      >
        {/* Top: Branding & Title */}
        <div>
          <div className="p-4 border-b border-blue-900/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-700 flex items-center justify-center font-bold text-white shadow-xs">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block">
                  AICTE Directorate
                </span>
                <span className="text-sm font-extrabold text-white leading-tight block">
                  Senior Officer Console
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-blue-200 hover:text-white hover:bg-blue-900"
              aria-label="Close sidebar navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Regional Jurisdiction Pill */}
          <div className="px-4 py-2.5 bg-blue-950/60 border-b border-blue-900/40 flex items-center justify-between text-[11px] text-blue-200">
            <div className="flex items-center space-x-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-purple-300 shrink-0" />
              <span className="truncate">{demoSeniorOfficerProfile.jurisdiction}</span>
            </div>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
          </div>

          {/* Navigation Items List */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-290px)]">
            {seniorSidebarNavItems.map((item) => {
              const Icon = iconMap[item.iconName] || LayoutDashboard;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-blue-900/60 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-purple-300'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-purple-800 text-purple-100'
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

        {/* Bottom Section: Profile, Persistent Simulation Notice & Logout */}
        <div className="p-3 border-t border-blue-900/80 bg-blue-950/40">
          {/* Officer Details Card */}
          <div className="p-2.5 rounded-lg bg-blue-900/40 border border-blue-800/60 mb-2">
            <div className="flex items-center space-x-2.5 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-purple-600 border border-purple-400/50 flex items-center justify-center text-xs font-bold text-white shrink-0">
                SR
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{demoSeniorOfficerProfile.name}</p>
                <p className="text-[10px] text-purple-200 truncate">{demoSeniorOfficerProfile.officerId}</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-300 flex items-center justify-between pt-1 border-t border-blue-800/40">
              <span className="truncate">{demoSeniorOfficerProfile.designation}</span>
            </div>
          </div>

          {/* Persistent Prototype Simulation Notice */}
          <div className="flex items-start space-x-1.5 px-2.5 py-2 mb-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200 leading-snug">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
            <span>SIH demonstration prototype — all records and decisions are simulated.</span>
          </div>

          {/* Logout Action */}
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-300" />
            <span>Logout from Console</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SeniorOfficerSidebar;
