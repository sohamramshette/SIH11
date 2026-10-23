import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Home,
} from 'lucide-react';

/**
 * AdminHeader Component
 * Top header with dynamic title, global search, notifications counter,
 * administrator profile badge, and responsive drawer toggles.
 */
const AdminHeader = ({
  activeTabTitle,
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Preliminary Review Ready', text: 'Application APP-2026-ENG-1042 ready for scrutiny.', time: '10m ago' },
    { id: 2, title: 'Inconsistency Flag Raised', text: 'Possible faculty duplicate in APP-2026-ENG-5284.', time: '1h ago' },
    { id: 3, title: 'Approval Dispatched', text: 'Digital approval certificate sent to Deccan Inst.', time: '3h ago' },
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
              {activeTabTitle || 'System Overview'}
            </h1>
            <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
              AICTE Regulatory Compliance &amp; Application Verification
            </div>
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search applications, colleges, or AISHE codes..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102D52] focus:border-[#102D52]"
            />
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
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
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

          {/* Demo Administrator Profile Pill */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-[#102D52] text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              AD
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Demo Administrator
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                System Admin (SIH 26261)
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
