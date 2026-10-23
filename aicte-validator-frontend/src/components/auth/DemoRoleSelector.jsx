import React from 'react';
import { DEMO_ROLES } from '../../services/mockAuth';
import { ShieldAlert, Check } from 'lucide-react';

/**
 * DemoRoleSelector Component
 * Explicitly labeled development-only role selector for UI testing.
 * Automatically populates sample credentials when a role is selected.
 */
const DemoRoleSelector = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3.5 mb-5 text-slate-800">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-amber-200/80">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>DEVELOPMENT ONLY · DEMO ROLE SELECTOR</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 font-semibold">
          SIMULATED
        </span>
      </div>

      <p className="text-[11px] text-amber-900/90 mb-2.5 leading-snug">
        Select a simulated institutional role below to test role-specific redirects and portal navigation:
      </p>

      {/* 4 Role Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DEMO_ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role)}
              className={`text-left p-2 rounded-md border text-xs transition-all flex items-start justify-between ${
                isSelected
                  ? 'bg-white border-[#102D52] shadow-xs ring-1 ring-[#102D52]'
                  : 'bg-white/80 border-amber-200 hover:bg-white hover:border-slate-400'
              }`}
            >
              <div className="pr-1">
                <div className="font-bold text-slate-900 leading-tight flex items-center gap-1">
                  <span>{role.roleName}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Route: {role.targetRoute}
                </div>
              </div>

              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-[#102D52] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DemoRoleSelector;
