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
  FileText,
  Scale,
  Lock,
} from 'lucide-react';
import { DEMO_ROLES } from '../services/mockAuth';
import { useDemoState } from '../hooks/useDemoState';

/**
 * LoginPage Component
 * Streamlined, space-efficient 4-Role Demo Gateway for SIH 26261.
 * Features a balanced 2x2 role grid with instant 1-click access.
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

    loginDemoUser(userPayload);

    setTimeout(() => {
      navigate(role.targetRoute);
    }, 180);
  };

  // Role visual configuration map
  const roleVisuals = {
    admin: {
      icon: ShieldCheck,
      iconBg: 'bg-[#102D52] text-amber-300',
      borderHover: 'hover:border-[#102D52] hover:ring-1 hover:ring-[#102D52]/20',
      btnBg: 'bg-[#102D52] hover:bg-[#1D4ED8]',
      badgeColor: 'bg-blue-50 text-blue-900 border-blue-200',
    },
    college: {
      icon: Building2,
      iconBg: 'bg-emerald-700 text-white',
      borderHover: 'hover:border-emerald-600 hover:ring-1 hover:ring-emerald-600/20',
      btnBg: 'bg-emerald-700 hover:bg-emerald-800',
      badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
    verification: {
      icon: FileCheck2,
      iconBg: 'bg-indigo-700 text-white',
      borderHover: 'hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600/20',
      btnBg: 'bg-indigo-700 hover:bg-indigo-800',
      badgeColor: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    },
    'senior-officer': {
      icon: Award,
      iconBg: 'bg-purple-800 text-amber-300',
      borderHover: 'hover:border-purple-600 hover:ring-1 hover:ring-purple-600/20',
      btnBg: 'bg-purple-800 hover:bg-purple-900',
      badgeColor: 'bg-purple-50 text-purple-900 border-purple-200',
    },
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-80px)] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto w-full">
        {/* Top Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-4 text-xs">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 font-bold text-[#102D52] hover:text-[#1D4ED8] bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>

          <div className="flex items-center space-x-2 text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Demonstration Gateway Active</span>
          </div>
        </div>

        {/* Main Gateway Card */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-lg p-5 sm:p-8">
          {/* Header Row: Council Branding & Demo Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-200 gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#102D52] text-white flex items-center justify-center shadow-xs shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
                  All India Council for Technical Education
                </div>
                <h1 className="text-base sm:text-lg font-black text-[#102D52] tracking-tight leading-snug">
                  Application Validation &amp; Compliance System
                </h1>
              </div>
            </div>

            <div className="self-start sm:self-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-xs">
                1-CLICK DEMO ACCESS
              </span>
            </div>
          </div>

          {/* Section Instructions */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#102D52] tracking-tight mb-1">
              Select Your Portal Role
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Click any of the 4 institutional stakeholder roles below to immediately enter its dedicated workspace. No login credentials required.
            </p>
          </div>

          {/* 2x2 Balanced Role Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {DEMO_ROLES.map((role) => {
              const visuals = roleVisuals[role.id] || roleVisuals.admin;
              const Icon = visuals.icon;
              const isPending = loggingInRoleId === role.id;

              return (
                <div
                  key={role.id}
                  onClick={() => !loggingInRoleId && handleRoleLogin(role)}
                  className={`group relative rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer ${
                    visuals.borderHover
                  } ${isPending ? 'ring-2 ring-[#102D52] bg-slate-50' : ''}`}
                >
                  <div>
                    {/* Role Card Top Bar */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${visuals.iconBg}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#102D52] transition-colors leading-tight">
                            {role.roleName}
                          </h3>
                          <span className="font-mono text-[10px] text-slate-500">
                            {role.defaultUserId}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${visuals.badgeColor}`}
                      >
                        {role.badge}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {role.description}
                    </p>
                  </div>

                  {/* Card Action Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      Target: {role.targetRoute}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!loggingInRoleId) handleRoleLogin(role);
                      }}
                      disabled={loggingInRoleId !== null}
                      className={`inline-flex items-center space-x-1.5 py-1.5 px-3.5 text-xs font-bold text-white rounded-lg shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        visuals.btnBg
                      } ${
                        loggingInRoleId !== null && !isPending
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {isPending ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Entering...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Enter Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compact System Highlights Strip */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 sm:p-4 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
              <div className="flex items-center space-x-2 text-slate-700 justify-center sm:justify-start">
                <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="text-xs font-semibold">Application Parsing</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700 justify-center sm:justify-start">
                <FileCheck2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-semibold">Document Checks</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700 justify-center sm:justify-start">
                <Scale className="w-4 h-4 text-indigo-700 shrink-0" />
                <span className="text-xs font-semibold">Compliance Engine</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700 justify-center sm:justify-start">
                <Lock className="w-4 h-4 text-purple-700 shrink-0" />
                <span className="text-xs font-semibold">Auditable Trail</span>
              </div>
            </div>
          </div>

          {/* Bottom Student Prototype Notice */}
          <div className="text-center text-[11px] text-slate-500">
            Smart India Hackathon Prototype (PS 26261). Authentication is simulated for rapid committee evaluation.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
