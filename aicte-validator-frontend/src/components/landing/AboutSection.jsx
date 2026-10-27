import React from 'react';
import { BookOpen, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AboutSection Component
 * Provides context on the SIH Problem Statement ID: 26261 and the regulatory scope.
 */
const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-[#102D52] text-xs font-bold uppercase tracking-wider mb-3.5 border border-blue-200">
              <BookOpen className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>Smart India Hackathon · Problem Statement 26261</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#102D52] tracking-tight leading-tight mb-5">
              Transforming Institutional Scrutiny with Transparent AI Assistance
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
              Every year, thousands of technical educational institutions across India submit extensive compliance dossiers for new approvals, annual extensions, and intake increases. Manual scrutiny of thousands of pages of land records, building blueprints, and faculty rosters creates significant delays and risks oversights.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
              The <strong>AICTE Application Validation, Document Authentication and Regulatory Compliance Verification System</strong> is a student-engineered prototype designed to assist official scrutiny committees with deterministic handbook evaluations, coordinate-level evidence citations, and discrepancy detection safeguards.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-700">
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#102D52] block">APH Framework Alignment</span>
                  <span>Evaluates norms strictly against official AICTE handbook specifications.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#102D52] block">Faculty Duplication Checks</span>
                  <span>Cross-application credential checks to identify potential duplicate staff listings.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Institutional Mandate Box */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl p-7 border border-slate-200 shadow-md">
              <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-lg bg-[#102D52] text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102D52]">Statutory Scrutiny Mandate</h3>
                  <span className="text-[11px] text-slate-500">AICTE Approval Process Handbook Framework</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed mb-6">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1">1. Land &amp; Title Verification</span>
                  <span>Validates contiguous land requirements, non-encumbrance certificates, and civic zoning permissions.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1">2. Built-Up Area &amp; Laboratories</span>
                  <span>Automated calculus checking FSI, carpet area per student, and specialized laboratory equipment rosters.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1">3. Cadre Ratio &amp; Staff Qualifications</span>
                  <span>Checks Cadre Ratio (Professor : Associate : Assistant) and AICTE pay scale statutory compliance.</span>
                </div>
              </div>

              <Link
                to="/login"
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[#102D52] text-white hover:bg-[#1D4ED8] text-xs font-bold transition-colors"
              >
                <span>Access Verification Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
