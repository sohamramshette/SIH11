import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  FilePlus2,
  UploadCloud,
  CheckCircle2,
  HelpCircle,
  Building2,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';
import { collegeSidebarNavItems, demoCollegeProfile } from '../../data/collegeDashboardData';

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
 * CollegeSidebar Component
 * Navy-blue navigation sidebar for the College / Educational Institution portal.
 */
const CollegeSidebar = ({
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
        aria-label="College Navigation Sidebar"
      >
        {/* Top: Institutional Branding */}
        <div>
          <div className="p-4 border-b border-blue-900/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-white shadow-xs">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                  AICTE College Portal
                </span>
                <span className="text-sm font-extrabold text-white leading-tight block">
                  Institutional Console
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-blue-200 hover:text-white hover:bg-blue-900"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* College Identity Tag */}
          <div className="px-4 py-2 bg-[#0C2442] border-b border-blue-900/60 text-[11px] text-blue-200/90 flex items-center justify-between">
            <span className="font-semibold truncate max-w-[140px]">{demoCollegeProfile.shortName}</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold shrink-0">
              COLLEGE
            </span>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-3 space-y-1">
            {collegeSidebarNavItems.map((item) => {
              const Icon = iconMap[item.iconName] || LayoutDashboard;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    if (mobileOpen) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1D4ED8] text-white shadow-xs font-bold'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        item.badgeColor || 'bg-blue-900 text-blue-100'
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

        {/* Bottom Section: College Representative Profile & Logout */}
        <div className="p-3 border-t border-blue-900/80 bg-[#0C2442]">
          <div className="px-3 py-2 mb-2 rounded-lg bg-blue-950/60 border border-blue-900/60 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
              CL
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">
                {demoCollegeProfile.nodalOfficer.name}
              </div>
              <div className="text-[10px] text-blue-300 truncate">
                AISHE: {demoCollegeProfile.aisheCode}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold text-red-200 hover:bg-red-950/50 hover:text-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out (Exit Demo)</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default CollegeSidebar;
