import React, { useState } from 'react';
import { AlertCircle, Phone, Globe, Eye, X } from 'lucide-react';

/**
 * Government Identity Bar
 * Compact top strip representing Indian Government & Ministry of Education identity,
 * with mandatory student prototype disclaimer and institutional accessibility tools.
 */
const GovernmentBar = () => {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <header className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs font-medium">
      {/* Important Notice Modal / Banner dropdown */}
      {showNotice && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs flex items-center justify-between transition-all">
          <div className="max-w-7xl mx-auto flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">SIH 2024-25 Prototype Notice:</span>
            <span>
              This application is an educational prototype developed for Smart India Hackathon (Problem Statement ID: 26261). It is not an official government website.
            </span>
          </div>
          <button
            onClick={() => setShowNotice(false)}
            className="p-1 hover:bg-amber-600 rounded transition-colors text-slate-950"
            aria-label="Close Notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9">
          {/* Left: Government of India & Ministry Context */}
          <div className="flex items-center space-x-3">
            {/* CSS-rendered Indian Tricolor Emblem Strip */}
            <div className="flex flex-col w-3 h-3 rounded-sm overflow-hidden shrink-0 border border-slate-600" title="Government of India">
              <span className="h-1 bg-[#FF9933] w-full"></span>
              <span className="h-1 bg-white w-full"></span>
              <span className="h-1 bg-[#138808] w-full"></span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300">
              <span className="font-semibold text-white tracking-wide">भारत सरकार</span>
              <span className="text-slate-500">|</span>
              <span>Government of India</span>
              <span className="hidden md:inline text-slate-500">·</span>
              <span className="hidden md:inline text-slate-300">Ministry of Education</span>
            </div>
          </div>

          {/* Center: SIH Prototype Disclaimer */}
          <div className="hidden lg:flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800/80">
              SIH Problem Statement ID: 26261
            </span>
            <span className="text-slate-400 text-[11px]">
              Student Demonstration Prototype
            </span>
          </div>

          {/* Right: Quick Links, Helpline & Accessibility */}
          <div className="flex items-center space-x-3 text-[11px]">
            <button
              onClick={() => setShowNotice(!showNotice)}
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
            >
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Important Note</span>
            </button>

            <a
              href="#contact"
              className="hidden sm:inline-flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-blue-400" />
              <span>Helpline</span>
            </a>

            <div className="hidden sm:flex items-center space-x-1 text-slate-400">
              <Eye className="w-3 h-3" />
              <span className="hover:text-white cursor-pointer" title="Screen Reader Access">Screen Reader</span>
            </div>

            <div className="flex items-center space-x-1 border-l border-slate-700 pl-2 text-slate-300">
              <Globe className="w-3 h-3 text-slate-400" />
              <span className="font-bold text-white">EN</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GovernmentBar;
