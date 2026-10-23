import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

/**
 * Wide Promotional Banner Component
 * Features the mandatory headline and supporting text with navy/blue styling
 * inspired by the reference AICTE institutional portal.
 */
const PromoBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0E2646] via-[#102D52] to-[#1D4ED8] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
      {/* Decorative Geometry */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-blue-400/10 pointer-events-none blur-2xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text Block */}
          <div className="max-w-3xl text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3.5 backdrop-blur-xs border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Regulatory Assurance</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-3">
              Reliable Validation.{' '}
              <span className="text-[#FF9933]">Transparent Decisions.</span>
            </h2>

            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl font-normal">
              AI-assisted checks with evidence-linked findings and authorized human oversight.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6 text-xs text-blue-200">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Evidence-Linked PDF Coordinates</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deterministic Approval Process Rules</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Immutable Statutory Audit Trail</span>
              </div>
            </div>
          </div>

          {/* Right Action Block */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="#workflow"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 text-xs sm:text-sm font-bold rounded-lg bg-[#E05A18] text-white hover:bg-[#C2410C] shadow-md transition-all text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#102D52] focus:ring-[#E05A18]"
            >
              <span>Explore Scrutiny Workflow</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#safeguards"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 text-xs sm:text-sm font-bold rounded-lg bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all text-center"
            >
              <BookOpen className="w-4 h-4 text-blue-200" />
              <span>Read Compliance Safeguards</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
