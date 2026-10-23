import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Institutional Footer Component
 * Conforms to formal Indian Government Education portal layouts.
 * Includes complete institutional attribution, SIH 26261 metadata,
 * statutory disclaimers, and nodal helpdesk contacts.
 */
const Footer = () => {
  return (
    <footer id="contact" className="bg-[#0B1E36] text-slate-300 pt-16 pb-8 border-t-4 border-[#102D52] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Helpdesk & Nodal Contact Strip */}
        <div className="bg-[#102D52] rounded-xl p-6 mb-12 border border-blue-900 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-blue-900 text-amber-400 rounded-lg shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-blue-200">
                  National Technical Helpline (Toll-Free)
                </div>
                <div className="text-base font-extrabold text-white mt-0.5">
                  1800-11-26261
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Mon – Sat: 09:30 AM – 05:30 PM IST
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-blue-900 text-amber-400 rounded-lg shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-blue-200">
                  Scrutiny &amp; Verification Inquiries
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  sih26261-scrutiny@aicte-prototype.in
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Institutional query turnaround: 24-48 working hours
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-blue-900 text-amber-400 rounded-lg shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-blue-200">
                  AICTE HQ Nodal Secretariat
                </div>
                <div className="text-xs font-semibold text-white mt-0.5">
                  Nelson Mandela Marg, Vasant Kunj
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  New Delhi - 110070, India
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Platform Identity */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#1D4ED8] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Government of India · Ministry of Education
                </div>
                <div className="text-sm font-extrabold text-white leading-tight">
                  Application Validation &amp; Regulatory Compliance
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              An automated, evidence-linked verification and document authentication engine designed to assist
              institutional scrutiny under the AICTE Approval Process Handbook (APH).
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-950 text-blue-300 border border-blue-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>SIH Problem Statement ID: 26261</span>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Platform Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-[#E05A18]" />
                  <span>Home Portal</span>
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-[#E05A18]" />
                  <span>About SIH 26261</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-[#E05A18]" />
                  <span>Core System Features</span>
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-[#E05A18]" />
                  <span>Verification Workflow</span>
                </a>
              </li>
              <li>
                <a href="#safeguards" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-[#E05A18]" />
                  <span>Trust &amp; Safeguards</span>
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-white flex items-center gap-1.5 font-bold text-blue-400 transition-colors">
                  <ChevronRight className="w-3 h-3 text-[#E05A18]" />
                  <span>Officer / College Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Regulatory Directives */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Regulatory References
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white cursor-pointer flex items-center justify-between">
                <span>AICTE Act 1987 (Statutory)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </li>
              <li className="hover:text-white cursor-pointer flex items-center justify-between">
                <span>Approval Process Handbook</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </li>
              <li className="hover:text-white cursor-pointer flex items-center justify-between">
                <span>National Education Policy 2020</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </li>
              <li className="hover:text-white cursor-pointer flex items-center justify-between">
                <span>CVC Audit Guidelines</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </li>
              <li className="hover:text-white cursor-pointer flex items-center justify-between">
                <span>NIRF Ranking Framework</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Verification Badges */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Security Standard
            </h3>
            <div className="space-y-2.5 text-[11px] text-slate-400">
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-white block mb-0.5">SHA-256 Checksum</span>
                <span>Document tampering hashes verified on ingestion.</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-white block mb-0.5">Zero Arbitrary Verdicts</span>
                <span>Every compliance flag maps to handbook clauses.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Statutory & Prototype Disclaimers */}
        <div className="mt-8 pt-6 pb-6 border-b border-slate-800 text-xs text-slate-400 space-y-2.5 bg-slate-900/60 p-4 rounded-lg">
          <div className="flex items-start space-x-2 text-amber-300 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>MANDATORY STUDENT PROTOTYPE &amp; STATUTORY DECISION DISCLAIMER</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            <strong>Student Prototype Notice:</strong> This software is an experimental prototype developed solely for the
            Smart India Hackathon (SIH Problem Statement ID: 26261). It is not an officially endorsed portal of the All India Council for Technical Education (AICTE)
            or the Ministry of Education, Government of India. It does not possess authority to grant, extend, or revoke institutional approvals.
          </p>
          <p className="text-[11px] leading-relaxed text-slate-300">
            <strong>Statutory Authority Mandate:</strong> All automated findings, optical character extractions, and anomaly alerts are strictly preliminary assistive indicators for scrutiny committees.
            Final regulatory decisions, deficiency notices, and approval orders remain solely with competent statutory authorities under the AICTE Act 1987.
          </p>
        </div>

        {/* Bottom Legal & Accessibility Strip */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {CURRENT_YEAR} AICTE Application Validation System (SIH 26261). All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Usage</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Hyperlinking Policy</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">W3C WAI-AA Compliant</span>
          </div>
        </div>
      </div>

      {/* Floating Helpline Quick Button (Directly matching the orange circular phone badge in the reference screenshots) */}
      <a
        href="#contact"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#E05A18] text-white flex items-center justify-center shadow-2xl hover:bg-[#C2410C] hover:scale-105 transition-all z-40 border-2 border-white focus:outline-none focus:ring-4 focus:ring-orange-300"
        title="Helpdesk & Regulatory Guidance"
        aria-label="Helpdesk & Regulatory Guidance"
      >
        <Phone className="w-5 h-5 animate-bounce" />
      </a>
    </footer>
  );
};

export default Footer;
