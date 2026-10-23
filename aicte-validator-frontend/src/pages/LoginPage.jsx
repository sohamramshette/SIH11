import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  FileCheck2,
  Award,
  ArrowRight,
  LogIn,
  Info,
} from 'lucide-react';
import LoginSupportingPanel from '../components/auth/LoginSupportingPanel';
import { DEMO_ROLES } from '../services/mockAuth';
import { useDemoState } from '../hooks/useDemoState';

/**
 * LoginPage Component
 * Direct 4-Role Demo Gateway for SIH 26261.
 * Provides instant 1-click access buttons for the 4 stakeholder roles
 * with no email ID or password input required.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { loginDemoUser } = useDemoState();
  const [loggingInRoleId, setLoggingInRoleId] = useState(null);

  // Direct 1-click role login handler
  const handleRoleLogin = (role) => {
    setLoggingInRoleId(role.id);

    const userPayload = {
      id: role.defaultUserId,
      email: role.email,
      role: role.id,
      roleName: role.roleName,
      badge: role.badge,
    };

    // Set demo user session in shared context
    loginDemoUser(userPayload);

    // Fast, responsive redirect to the role's dashboard
    setTimeout(() => {
      navigate(role.targetRoute);
    }, 180);
  };

  // Role visual configuration map
  const roleVisuals = {
    admin: {
      icon: ShieldCheck,
      iconBg: 'bg-[#102D52] text-amber-300',
      borderHover: 'hover:border-[#102D52]',
      btnBg: 'bg-[#102D52] hover:bg-[#1D4ED8]',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      tag: 'System Administration & Rules',
    },
    college: {
      icon: Building2,
      iconBg: 'bg-emerald-700 text-white',
      borderHover: 'hover:border-emerald-600',
      btnBg: 'bg-emerald-700 hover:bg-emerald-800',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      tag: 'Institutional Portal',
    },
    verification: {
      icon: FileCheck2,
      iconBg: 'bg-indigo-700 text-white',
      borderHover: 'hover:border-indigo-600',
      btnBg: 'bg-indigo-700 hover:bg-indigo-800',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      tag: 'Scrutiny Committee Desk',
    },
    'senior-officer': {
      icon: Award,
      iconBg: 'bg-purple-800 text-amber-300',
      borderHover: 'hover:border-purple-600',
      btnBg: 'bg-purple-800 hover:bg-purple-900',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
      tag: 'Regional Directorate',
    },
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header / Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg border border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2 text-xs">
            <Link
              to="/"
              className="inline-flex items-center space-x-1 font-bold text-[#102D52] hover:text-[#1D4ED8] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-medium">Portal Authentication</span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">AICTE Verification Gateway</span>
            <span>·</span>
            <span>SIH 26261 Prototype</span>
          </div>
        </div>
      </div>

      {/* Main View Container */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 Demo Login Buttons Card */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
              {/* Institutional Card Header */}
              <div className="flex items-start justify-between pb-5 mb-5 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-lg bg-[#102D52] text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      All India Council for Technical Education
                    </div>
                    <div className="text-sm font-extrabold text-[#102D52] leading-tight">
                      Application Validation &amp; Compliance System
                    </div>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300">
                  DEMO PORTAL
                </span>
              </div>

              {/* Title & Instructions */}
              <div className="mb-5">
                <h1 className="text-2xl font-black text-[#102D52] tracking-tight mb-1.5">
                  Select Your Portal Role
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Click any of the 4 institutional roles below for instant 1-click access. No email ID or password is required.
                </p>
              </div>

              {/* Notice Banner */}
              <div className="mb-6 p-3 rounded-lg bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-bold">Instant Demonstration Login: </span>
                  <span>
                    Direct access is enabled for all 4 stakeholder roles. Selecting any role will automatically initialize the session and open the role's workspace.
                  </span>
                </div>
              </div>

              {/* 4 Dedicated Demo Login Cards / Buttons */}
              <div className="space-y-3.5">
                {DEMO_ROLES.map((role) => {
                  const visuals = roleVisuals[role.id] || roleVisuals.admin;
                  const Icon = visuals.icon;
                  const isPending = loggingInRoleId === role.id;

                  return (
                    <div
                      key={role.id}
                      className={`group relative rounded-xl border-2 border-slate-200 bg-white p-4 transition-all duration-200 shadow-xs hover:shadow-md ${visuals.borderHover} ${
                        isPending ? 'ring-2 ring-[#102D52] bg-slate-50' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Role Details */}
                        <div className="flex items-start space-x-3.5">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${visuals.iconBg}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h2 className="text-sm font-bold text-slate-900 group-hover:text-[#102D52] transition-colors">
                                {role.roleName}
                              </h2>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${visuals.badgeColor}`}
                              >
                                {role.badge}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed mb-1.5 max-w-md">
                              {role.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                              <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                ID: {role.defaultUserId}
                              </span>
                              <span>·</span>
                              <span className="font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">
                                Target: {role.targetRoute}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Direct Login Action Button */}
                        <div className="sm:shrink-0 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => handleRoleLogin(role)}
                            disabled={loggingInRoleId !== null}
                            className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 py-2.5 px-4 text-xs font-bold text-white rounded-lg shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              visuals.btnBg
                            } ${
                              loggingInRoleId !== null && !isPending
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                          >
                            {isPending ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Opening Portal...</span>
                              </>
                            ) : (
                              <>
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Log In as {role.roleName}</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Prototype Notice */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  <strong>Notice:</strong> This is a Smart India Hackathon student prototype (Problem Statement ID: 26261). Authentication is simulated with pre-configured demo roles for immediate review and testing.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Desktop Supporting Information Panel */}
          <div className="lg:col-span-5">
            <LoginSupportingPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
