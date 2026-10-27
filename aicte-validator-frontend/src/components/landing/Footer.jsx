import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  LogIn,
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Institutional Footer Component
 * Cleaned footer with project identity, SIH PS 26261 disclaimer,
 * and working navigation links.
 */
const Footer = () => {
  return (
    <footer id="contact" className="bg-[#0B1E36] text-slate-300 pt-12 pb-8 border-t-4 border-[#102D52] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Platform Identity */}
          <div className="md:col-span-7">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#1D4ED8] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Smart India Hackathon · Problem Statement 26261
                </div>
                <div className="text-base font-extrabold text-white leading-tight">
                  Application Validation &amp; Compliance Verification System
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-lg">
              A student demonstration prototype designed to assist scrutiny officers by identifying missing documents, inconsistent information, and preliminary compliance issues.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-950 text-blue-300 border border-blue-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Smart India Hackathon · Problem Statement 26261</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-5 md:pl-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Platform Navigation
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-[#E05A18]" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-[#E05A18]" />
                  <span>Features</span>
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3 h-3 text-[#E05A18]" />
                  <span>Workflow</span>
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
                  <LogIn className="w-3.5 h-3.5 text-[#E05A18]" />
                  <span>Login to Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clear Mandatory Disclaimer */}
        <div className="mt-8 pt-5 pb-5 border-b border-slate-800 text-xs text-slate-300 bg-slate-900/60 p-5 rounded-lg">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-slate-300">
              <strong className="text-amber-300">Student Prototype Disclaimer:</strong> This system is developed as a Smart India Hackathon prototype for Problem Statement 26261. It is not an official AICTE portal. Any automated results shown in the demonstration are preliminary and may be simulated. Final regulatory decisions remain with authorized authorities.
            </p>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {CURRENT_YEAR} AICTE Application Validation System (SIH 26261 Prototype).
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="hover:text-slate-300 cursor-pointer">Prototype Evaluation Model</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer">Educational Demonstration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
