import React from 'react';
import {
  FileCheck2,
  ShieldAlert,
  Scale,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

/**
 * LoginSupportingPanel Component
 * Displayed on desktop screens beside the login card.
 * Details the 4 core pillars of the AICTE compliance framework.
 */
const LoginSupportingPanel = () => {
  const pillars = [
    {
      title: 'Intelligent Application Validation',
      desc: 'Automated multi-page application parsing, data normalization, and statutory format checks.',
      icon: FileCheck2,
    },
    {
      title: 'Document Authentication',
      desc: 'Cryptographic hash checks, seal tampering detection, and duplicate faculty cross-referencing.',
      icon: ShieldAlert,
    },
    {
      title: 'Regulatory Compliance Assistance',
      desc: 'Automated evaluation of land, built-up space, and cadre ratios against AICTE APH 2026-27 norms.',
      icon: Scale,
    },
    {
      title: 'Evidence-Linked Review',
      desc: 'Pinpoint page coordinate citations and an immutable audit trail for transparent scrutiny committee evaluation.',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#102D52] text-white p-8 rounded-2xl shadow-md border border-blue-900">
      <div>
        {/* Top Branding Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-5 border border-white/10">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Scrutiny Infrastructure</span>
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight leading-snug mb-3">
          AI-Assisted Institutional Compliance &amp; Verification
        </h2>

        <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed mb-6 font-normal">
          A secure verification environment built to assist educational institutions, scrutiny officers, and regional authorities in ensuring transparent, handbook-compliant regulatory evaluations.
        </p>

        {/* The 4 Core Capabilities */}
        <div className="space-y-4 pt-2">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start space-x-3.5 p-3 rounded-lg bg-[#0C2442] border border-blue-900/60">
                <div className="p-2 bg-blue-900/90 text-amber-300 rounded-md shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-blue-200/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Security Assurance Note */}
      <div className="mt-8 pt-5 border-t border-blue-900/80 text-[11px] text-blue-200/80 space-y-2">
        <div className="flex items-center space-x-2 text-white font-semibold">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Regulatory Protocol</span>
        </div>
        <p className="leading-relaxed">
          Access is strictly reserved for authorized institutional nodal officers and AICTE scrutiny committees. All inspection sessions are cryptographically signed.
        </p>
        <div className="flex items-center space-x-3 text-[10px] text-blue-300 pt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>APH 2026-27 Compliant</span>
          </span>
          <span>·</span>
          <span>SIH Problem ID: 26261</span>
        </div>
      </div>
    </div>
  );
};

export default LoginSupportingPanel;
