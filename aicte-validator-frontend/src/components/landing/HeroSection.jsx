import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  BadgeAlert,
  Hash,
  MapPin,
  Layers,
} from 'lucide-react';
import { sampleRegions, complianceStreams } from '../../data/landingPageData';

/**
 * HeroSection Component
 * Reproduces the institutional visual style from the reference portal.
 * Features the mandatory headline, description, primary actions,
 * interactive application lookup bar, and a CSS-crafted Document Validation Dossier.
 */
const HeroSection = () => {
  const [searchId, setSearchId] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleCheckStatus = (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setSearchResult({
        status: 'warning',
        message: 'Please enter a valid Application ID or AISHE Code (e.g., AICTE-2026-DEMO-101).',
      });
      return;
    }

    setSearchResult({
      status: 'demo',
      id: searchId.toUpperCase(),
      message: `[DEMO RECORD] Application ${searchId.toUpperCase()} is registered in the prototype queue. Automated scrutiny is complete; awaiting authorized officer sign-off.`,
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F7FB] via-white to-[#F8FAFC] pt-8 pb-16 border-b border-slate-200">
      {/* Decorative Government-Themed Subtle Tricolor Backdrop Accent */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-80" />

      {/* Subtle institutional watermarked geometric motif */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-50/50 pointer-events-none blur-3xl -z-10" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-amber-50/40 pointer-events-none blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow Badge & Prototype Disclaimer Label */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#102D52] text-xs font-bold tracking-wide shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
            <span className="uppercase text-[11px] font-black tracking-wider text-[#102D52]">
              SMART INDIA HACKATHON · PS 26261
            </span>
          </div>

          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
            <span className="text-[11px] font-semibold text-amber-900">
              Student Prototype · Not an Official AICTE Portal
            </span>
          </div>
        </div>

        {/* Hero Grid: Left Content, Right Document Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102D52] tracking-tight leading-[1.15] mb-5">
              AI-Powered Application Validation &amp;{' '}
              <span className="text-[#E05A18] block sm:inline">Document Verification</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 font-normal">
              Help streamline institutional application scrutiny by identifying missing documents, inconsistent information, and potential compliance issues for authorized officers to review.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-8">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-sm font-bold rounded-lg bg-[#102D52] text-white hover:bg-[#1D4ED8] shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#102D52]"
              >
                <span>Login to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-sm font-bold rounded-lg border-2 border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                <span>Explore Features</span>
              </a>
            </div>

            {/* Verification Framework Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left pt-4 border-t border-slate-200 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span className="font-medium">Document Checks</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span className="font-medium">Verifiable Audit Trail</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span className="font-medium">Officer Review Workflow</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic CSS Document-Validation Dossier Illustration */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white rounded-xl border border-slate-300 shadow-xl overflow-hidden">
              {/* Dossier Header */}
              <div className="bg-[#102D52] text-white px-5 py-3.5 flex items-center justify-between border-b border-blue-950">
                <div className="flex items-center space-x-2.5">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                      Sample Application Dossier
                    </div>
                    <div className="text-xs font-extrabold text-white">
                      APP-2026-ENG-4912 · DEMO CASE
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                  DEMO REVIEW
                </span>
              </div>

              {/* Dossier Subheader / Institution Meta */}
              <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 text-xs flex justify-between items-center text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">Institute:</span> Sample Technical Institute (Mock)
                </div>
                <div className="font-mono text-[10px] text-slate-500">
                  AISHE: C-48291
                </div>
              </div>

              {/* Document Validation Items Stack */}
              <div className="p-4 space-y-2.5">
                {/* Item 1: Land Title */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 bg-blue-100 text-blue-800 rounded">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Land Title &amp; Registry Deed</div>
                      <div className="text-[10px] text-slate-500">7.5 Acres · Encumbrance-Free Certificate</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Demo Result
                  </span>
                </div>

                {/* Item 2: Built-Up Space */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 bg-blue-100 text-blue-800 rounded">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Architectural Plan &amp; FSI Calculus</div>
                      <div className="text-[10px] text-slate-500">14,200 sq.m Built-up · APH Norm Matched</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Pending Verification
                  </span>
                </div>

                {/* Item 3: Faculty Roster (Flagged Discrepancy Example) */}
                <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 bg-amber-100 text-amber-800 rounded">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Faculty Cadre Ratio (SFR 1:15)</div>
                      <div className="text-[10px] text-amber-700 font-medium">Potential duplicate entry flagged for review</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Potential Mismatch
                  </span>
                </div>

                {/* Item 4: Statutory Affidavits */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 bg-blue-100 text-blue-800 rounded">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Anti-Ragging &amp; Non-Capitation Deed</div>
                      <div className="text-[10px] text-slate-500">Sample Upload · Awaiting Officer Verification</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    Review Required
                  </span>
                </div>
              </div>

              {/* Dossier Footer with Institutional Verification Seal */}
              <div className="bg-slate-100 p-3.5 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[11px] text-slate-600">
                  <BadgeAlert className="w-4 h-4 text-blue-800" />
                  <span>Preliminary Scrutiny Summary Prepared</span>
                </div>
                {/* Circular Formal Stamp */}
                <div className="border border-dashed border-[#102D52] rounded px-2 py-0.5 text-[9px] font-mono font-bold text-[#102D52] uppercase tracking-wider bg-white">
                  DEMO: PENDING VERIFICATION
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Quick Search / Status Tracker Card (Inspired directly by Reference Screenshot 1) */}
        <div id="check-status" className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6 transition-all">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-[#102D52]" />
              <h2 className="text-sm sm:text-base font-bold text-[#102D52]">
                Application Status &amp; Verification Tracking
              </h2>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Enter sample application credentials to view preliminary verification status in demo queue
            </span>
          </div>

          <form onSubmit={handleCheckStatus} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            {/* Input 1: Application ID */}
            <div className="sm:col-span-4">
              <label htmlFor="searchId" className="block text-xs font-semibold text-slate-700 mb-1">
                Application ID / AISHE Code
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="searchId"
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="e.g. AICTE-2026-APP-101"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#102D52] focus:border-[#102D52] bg-slate-50"
                />
              </div>
            </div>

            {/* Input 2: Regional Office */}
            <div className="sm:col-span-3">
              <label htmlFor="selectedRegion" className="block text-xs font-semibold text-slate-700 mb-1">
                Regional Jurisdiction
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  id="selectedRegion"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#102D52] focus:border-[#102D52] bg-slate-50 text-slate-700"
                >
                  <option value="">Select Region</option>
                  {sampleRegions.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input 3: Regulatory Stream */}
            <div className="sm:col-span-3">
              <label htmlFor="selectedStream" className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Stream
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select
                  id="selectedStream"
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#102D52] focus:border-[#102D52] bg-slate-50 text-slate-700 truncate"
                >
                  <option value="">Select Stream</option>
                  {complianceStreams.map((stream, idx) => (
                    <option key={idx} value={stream}>
                      {stream}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 text-xs sm:text-sm font-bold text-white rounded-lg bg-[#E05A18] hover:bg-[#C2410C] shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E05A18]"
              >
                <Search className="w-4 h-4" />
                <span>Track</span>
              </button>
            </div>
          </form>

          {/* Interactive Search Feedback Result */}
          {searchResult && (
            <div className="mt-4 p-3.5 rounded-lg border text-xs sm:text-sm flex items-start space-x-3 animate-fadeIn bg-blue-50/80 border-blue-200 text-blue-900">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">{searchResult.id}: </span>
                <span>{searchResult.message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
