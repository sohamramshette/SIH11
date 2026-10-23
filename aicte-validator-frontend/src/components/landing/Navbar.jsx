import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LogIn,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Radio,
  FileSearch,
} from 'lucide-react';
import { tickerAnnouncements } from '../../data/landingPageData';

/**
 * Main Navigation
 * Reproduces the institutional header hierarchy from the reference AICTE portal.
 * Features institutional branding, dual-language council identifier,
 * responsive mobile navigation, and live notification ticker.
 */
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTickerIndex] = useState(0);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Trust & Safeguards', href: '#safeguards' },
    { name: 'Contact', href: '#contact' },
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
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              to="/login"
              className="sm:hidden inline-flex items-center px-3 py-1.5 text-xs font-bold rounded bg-[#102D52] text-white hover:bg-[#1D4ED8]"
            >
              Login
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

      {/* Live Notification Strip (Directly reproducing the reference portal's LIVE announcements banner) */}
      <div className="bg-[#FFF9F5] border-t border-b border-orange-200/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E05A18] text-white tracking-wider uppercase shrink-0 shadow-xs">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>LIVE</span>
            </span>

            <div className="flex items-center space-x-2 text-slate-800 truncate">
              <span className="text-[10px] font-bold text-[#E05A18] uppercase tracking-wide">
                [{tickerAnnouncements[activeTickerIndex].tag}]
              </span>
              <a
                href={tickerAnnouncements[activeTickerIndex].link}
                className="truncate hover:text-[#1D4ED8] hover:underline font-medium flex items-center gap-1 text-slate-700"
              >
                <span>{tickerAnnouncements[activeTickerIndex].text}</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 inline text-[#E05A18]" />
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-[11px] text-slate-600">
            <a href="#workflow" className="hover:text-[#102D52] font-semibold flex items-center gap-1">
              <span>Scrutiny Workflow Matrix</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <span>|</span>
            <a href="#safeguards" className="hover:text-[#102D52] font-semibold flex items-center gap-1">
              <span>Verification Safeguards</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
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
              <span>Access Secure Portal</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
