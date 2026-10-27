import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LogIn,
  Menu,
  X,
  ShieldCheck,
  FileSearch,
} from 'lucide-react';

/**
 * Main Navigation
 * Reproduces the institutional header hierarchy from the reference AICTE portal.
 * Features institutional branding, dual-language council identifier,
 * and responsive mobile navigation.
 */
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Trust & Safeguards', href: '#safeguards' },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      {/* Institutional Branding Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between">
          {/* Left: AICTE Branding & System Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            {/* AICTE stylized emblem mark (geometric CSS representation) */}
            <div className="w-12 h-12 rounded-lg bg-[#102D52] text-white flex flex-col items-center justify-center p-1.5 shadow-sm border border-blue-900 group-hover:bg-[#1D4ED8] transition-colors">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <span className="text-[8px] font-bold tracking-tighter text-blue-100 uppercase">AICTE</span>
            </div>

            <div className="border-l-2 border-slate-200 pl-3">
              <div className="text-[11px] font-bold text-slate-800 tracking-wide leading-tight">
                अखिल भारतीय तकनीकी शिक्षा परिषद
              </div>
              <div className="text-[10px] font-semibold text-slate-600 tracking-wider uppercase leading-tight">
                All India Council for Technical Education
              </div>
              <div className="text-sm sm:text-base font-extrabold text-[#102D52] tracking-tight leading-snug mt-0.5">
                Application Validation & Compliance System
              </div>
            </div>
          </Link>

          {/* Center/Right Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#102D52] hover:bg-slate-100 rounded-md transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href="#check-status"
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
            >
              <FileSearch className="w-3.5 h-3.5 text-blue-700" />
              <span>Track Application</span>
            </a>

            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-md bg-[#102D52] text-white hover:bg-[#1D4ED8] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#102D52]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login to Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              to="/login"
              className="sm:hidden inline-flex items-center px-3 py-1.5 text-xs font-bold rounded bg-[#102D52] text-white hover:bg-[#1D4ED8]"
            >
              Login to Portal
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-[#102D52] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#102D52]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-100 hover:text-[#102D52] rounded-md transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col space-y-2">
            <a
              href="#check-status"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold rounded-md border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
            >
              <FileSearch className="w-4 h-4 text-blue-800" />
              <span>Track Application Status</span>
            </a>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-bold rounded-md bg-[#102D52] text-white hover:bg-[#1D4ED8]"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to Portal</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
